import { createAdminClient } from "@/lib/supabase/admin";
import { OrderStatus } from "@/lib/domain/enums";
import { ServiceError } from "@/lib/domain/errors";
import { encryptField } from "@/lib/encryption/field";
import {
  generateGuestAccessToken,
  generateOrderNumber,
  hashGuestToken,
} from "@/lib/crypto/tokens";
import { resolveLocalizedLabel, type LocalizedLabel } from "@/lib/i18n/json-label";
import { getSession } from "@/server/services/auth.service";
import { quoteCoupon } from "@/server/services/coupon.service";
import { getCustomerDeliveryForItem } from "@/server/services/delivery-content.service";
import { getPaymentInstructions } from "@/server/services/site-settings.service";
import { getProductForCheckout } from "@/server/services/product.service";
import type { CheckoutField } from "@/types/order";
import type { SubmitCartOrderInput, SubmitOrderInput } from "@/validations/order.schema";
import type {
  CustomerOrder,
  OrderListItem,
  OrderSubmitSuccess,
} from "@/types/order";

export type OrderServiceErrorCode =
  | "NOT_FOUND"
  | "VALIDATION"
  | "OUT_OF_STOCK"
  | "COUPON_INVALID"
  | "COUPON_EXPIRED"
  | "COUPON_INACTIVE"
  | "COUPON_MIN_ORDER"
  | "COUPON_USAGE_LIMIT"
  | "FORBIDDEN"
  | "INTERNAL";

function mapCouponError(
  code: string,
): OrderServiceErrorCode {
  switch (code) {
    case "EXPIRED":
      return "COUPON_EXPIRED";
    case "INACTIVE":
      return "COUPON_INACTIVE";
    case "MIN_ORDER":
      return "COUPON_MIN_ORDER";
    case "USAGE_LIMIT":
      return "COUPON_USAGE_LIMIT";
    default:
      return "COUPON_INVALID";
  }
}

async function fetchProductNameSnapshot(
  admin: ReturnType<typeof createAdminClient>,
  productId: string,
): Promise<Record<string, string>> {
  const { data } = await admin
    .from("product_translations")
    .select("locale, name")
    .eq("product_id", productId);

  const snapshot: Record<string, string> = {};
  for (const row of (data ?? []) as Array<{ locale: string; name: string }>) {
    snapshot[row.locale] = row.name;
  }
  return snapshot;
}

function buildFieldInserts(params: {
  orderId: string;
  orderItemId: string;
  fields: CheckoutField[];
  fieldValues: Record<string, string>;
  locale: string;
}) {
  return params.fields
    .map((field) => {
      const raw = (params.fieldValues[field.fieldKey] ?? "").trim();
      if (!raw) return null;

      const labelSnapshot: LocalizedLabel = { [params.locale]: field.label };

      if (field.isSensitive) {
        return {
          order_id: params.orderId,
          order_item_id: params.orderItemId,
          product_field_id: field.id.startsWith("demo-") ? null : field.id,
          field_key: field.fieldKey,
          field_label_snapshot: labelSnapshot,
          value_encrypted: encryptField(raw),
          value_plain: null,
          is_sensitive: true,
        };
      }

      return {
        order_id: params.orderId,
        order_item_id: params.orderItemId,
        product_field_id: field.id.startsWith("demo-") ? null : field.id,
        field_key: field.fieldKey,
        field_label_snapshot: labelSnapshot,
        value_encrypted: null,
        value_plain: raw,
        is_sensitive: false,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);
}

async function assertAutoStock(
  admin: ReturnType<typeof createAdminClient>,
  productId: string,
  quantity: number,
): Promise<void> {
  const { count, error } = await admin
    .from("delivery_inventory")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId)
    .eq("status", "available");

  if (error) throw error;
  if ((count ?? 0) < quantity) {
    throw new ServiceError("CONFLICT", "Product is out of stock");
  }
}

/** Creates an order request (unpaid). See docs/PAYMENT_MODEL.md — payment confirmed by admin later. */
export async function submitOrder(
  input: SubmitOrderInput,
): Promise<OrderSubmitSuccess> {
  const user = await getSession();
  const product = await getProductForCheckout(
    input.locale,
    input.productSlug,
    input.variantId || undefined,
  );

  if (!product || product.id.startsWith("demo-")) {
    throw new ServiceError("NOT_FOUND", "Product not found");
  }

  const guestEmail = input.guestEmail?.trim() || undefined;
  if (!user && !guestEmail) {
    throw new ServiceError("VALIDATION", "Email is required for guest orders");
  }

  for (const field of product.fields) {
    const value = (input.fieldValues[field.fieldKey] ?? "").trim();
    if (field.required && !value) {
      throw new ServiceError("VALIDATION", `Missing required field: ${field.fieldKey}`);
    }
  }

  const admin = createAdminClient();
  const subtotalCents = product.priceCents * input.quantity;

  let discountCents = 0;
  let couponId: string | null = null;
  let couponCodeSnapshot: string | null = null;

  if (input.couponCode?.trim()) {
    const couponResult = await quoteCoupon(input.couponCode, subtotalCents);
    if (!couponResult.success) {
      throw new ServiceError("VALIDATION", mapCouponError(couponResult.code));
    }
    discountCents = couponResult.quote.discountCents;
    couponId = couponResult.quote.couponId;
    couponCodeSnapshot = couponResult.quote.code;
  }

  const totalCents = subtotalCents - discountCents;

  if (product.deliveryMode === "auto") {
    await assertAutoStock(admin, product.id, input.quantity);
  }

  const orderNumber = generateOrderNumber();
  const nameSnapshot = await fetchProductNameSnapshot(admin, product.id);

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user?.id ?? null,
      guest_email: guestEmail ?? null,
      status: OrderStatus.PENDING_REVIEW,
      subtotal_cents: subtotalCents,
      discount_cents: discountCents,
      total_cents: totalCents,
      currency: "USD",
      coupon_id: couponId,
      coupon_code_snapshot: couponCodeSnapshot,
      locale: input.locale,
      customer_note: input.customerNote?.trim() || null,
      terms_accepted_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new ServiceError("INTERNAL", "Failed to create order");
  }

  const { data: orderItem, error: itemError } = await admin
    .from("order_items")
    .insert({
      order_id: order.id,
      product_id: product.id,
      product_name_snapshot: nameSnapshot,
      unit_price_cents: product.priceCents,
      quantity: input.quantity,
      delivery_mode: product.deliveryMode,
      variant_id: product.variantId ?? null,
      variant_name_snapshot: product.variantName
        ? { [input.locale]: product.variantName }
        : null,
    })
    .select("id")
    .single();

  if (itemError || !orderItem) {
    throw new ServiceError("INTERNAL", "Failed to create order item");
  }

  const fieldInserts = buildFieldInserts({
    orderId: order.id,
    orderItemId: orderItem.id,
    fields: product.fields,
    fieldValues: input.fieldValues,
    locale: input.locale,
  });

  if (fieldInserts.length > 0) {
    const { error: fieldsError } = await admin
      .from("order_field_values")
      .insert(fieldInserts);

    if (fieldsError) {
      throw new ServiceError("INTERNAL", "Failed to save order fields");
    }
  }

  await admin.from("order_status_history").insert({
    order_id: order.id,
    from_status: null,
    to_status: OrderStatus.PENDING_REVIEW,
    note: "Order submitted",
  });

  let guestToken: string | undefined;
  if (!user) {
    guestToken = generateGuestAccessToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    await admin.from("guest_order_access").insert({
      order_id: order.id,
      token_hash: hashGuestToken(guestToken),
      expires_at: expiresAt.toISOString(),
    });
  }

  void import("@/server/services/notification.service").then((m) =>
    m.notifyOrderSubmitted(order.id).catch(() => undefined),
  );

  return {
    orderNumber,
    orderId: order.id,
    guestToken,
  };
}

/** Multi-line order request. See docs/PAYMENT_MODEL.md. */
export async function submitCartOrder(
  input: SubmitCartOrderInput,
): Promise<OrderSubmitSuccess> {
  const user = await getSession();
  const guestEmail = input.guestEmail?.trim() || undefined;
  if (!user && !guestEmail) {
    throw new ServiceError("VALIDATION", "Email is required for guest orders");
  }

  const resolved: Array<{
    product: Awaited<ReturnType<typeof getProductForCheckout>> & object;
    quantity: number;
    fieldValues: Record<string, string>;
  }> = [];

  for (const item of input.items) {
    const product = await getProductForCheckout(
      input.locale,
      item.productSlug,
      item.variantId || undefined,
    );

    if (!product || product.id.startsWith("demo-")) {
      throw new ServiceError("NOT_FOUND", `Product not found: ${item.productSlug}`);
    }

    for (const field of product.fields) {
      const value = (item.fieldValues[field.fieldKey] ?? "").trim();
      if (field.required && !value) {
        throw new ServiceError(
          "VALIDATION",
          `Missing required field: ${field.fieldKey}`,
        );
      }
    }

    resolved.push({
      product,
      quantity: item.quantity,
      fieldValues: item.fieldValues,
    });
  }

  const admin = createAdminClient();
  let subtotalCents = 0;

  for (const line of resolved) {
    subtotalCents += line.product.priceCents * line.quantity;
    if (line.product.deliveryMode === "auto") {
      await assertAutoStock(admin, line.product.id, line.quantity);
    }
  }

  let discountCents = 0;
  let couponId: string | null = null;
  let couponCodeSnapshot: string | null = null;

  if (input.couponCode?.trim()) {
    const couponResult = await quoteCoupon(input.couponCode, subtotalCents);
    if (!couponResult.success) {
      throw new ServiceError("VALIDATION", mapCouponError(couponResult.code));
    }
    discountCents = couponResult.quote.discountCents;
    couponId = couponResult.quote.couponId;
    couponCodeSnapshot = couponResult.quote.code;
  }

  const totalCents = subtotalCents - discountCents;
  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user?.id ?? null,
      guest_email: guestEmail ?? null,
      status: OrderStatus.PENDING_REVIEW,
      subtotal_cents: subtotalCents,
      discount_cents: discountCents,
      total_cents: totalCents,
      currency: "USD",
      coupon_id: couponId,
      coupon_code_snapshot: couponCodeSnapshot,
      locale: input.locale,
      customer_note: input.customerNote?.trim() || null,
      terms_accepted_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new ServiceError("INTERNAL", "Failed to create order");
  }

  const allFieldInserts: ReturnType<typeof buildFieldInserts> = [];

  for (const line of resolved) {
    const nameSnapshot = await fetchProductNameSnapshot(admin, line.product.id);

    const { data: orderItem, error: itemError } = await admin
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: line.product.id,
        product_name_snapshot: nameSnapshot,
        unit_price_cents: line.product.priceCents,
        quantity: line.quantity,
        delivery_mode: line.product.deliveryMode,
        variant_id: line.product.variantId ?? null,
        variant_name_snapshot: line.product.variantName
          ? { [input.locale]: line.product.variantName }
          : null,
      })
      .select("id")
      .single();

    if (itemError || !orderItem) {
      throw new ServiceError("INTERNAL", "Failed to create order item");
    }

    allFieldInserts.push(
      ...buildFieldInserts({
        orderId: order.id,
        orderItemId: orderItem.id,
        fields: line.product.fields,
        fieldValues: line.fieldValues,
        locale: input.locale,
      }),
    );
  }

  if (allFieldInserts.length > 0) {
    const { error: fieldsError } = await admin
      .from("order_field_values")
      .insert(allFieldInserts);

    if (fieldsError) {
      throw new ServiceError("INTERNAL", "Failed to save order fields");
    }
  }

  await admin.from("order_status_history").insert({
    order_id: order.id,
    from_status: null,
    to_status: OrderStatus.PENDING_REVIEW,
    note: "Cart order submitted",
  });

  let guestToken: string | undefined;
  if (!user) {
    guestToken = generateGuestAccessToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    await admin.from("guest_order_access").insert({
      order_id: order.id,
      token_hash: hashGuestToken(guestToken),
      expires_at: expiresAt.toISOString(),
    });
  }

  void import("@/server/services/notification.service").then((m) =>
    m.notifyOrderSubmitted(order.id).catch(() => undefined),
  );

  return {
    orderNumber,
    orderId: order.id,
    guestToken,
  };
}

function maskSensitiveValue(): string {
  return "••••••••";
}

function mapOrderFields(
  rows: Array<{
    field_key: string;
    field_label_snapshot: LocalizedLabel;
    value_plain: string | null;
    is_sensitive: boolean;
  }>,
  locale: string,
): CustomerOrder["fields"] {
  return rows.map((row) => ({
    fieldKey: row.field_key,
    label: resolveLocalizedLabel(row.field_label_snapshot, locale, row.field_key),
    displayValue: row.is_sensitive
      ? maskSensitiveValue()
      : (row.value_plain ?? ""),
    isSensitive: row.is_sensitive,
  }));
}

export async function getOrderForCustomer(params: {
  orderNumber: string;
  locale: string;
  userId?: string;
  guestToken?: string;
}): Promise<CustomerOrder | null> {
  const admin = createAdminClient();
  const { data: order, error } = await admin
    .from("orders")
    .select(
      `
      id,
      order_number,
      user_id,
      status,
      subtotal_cents,
      discount_cents,
      total_cents,
      currency,
      locale,
      submitted_at,
      order_items (
        id,
        product_name_snapshot,
        unit_price_cents,
        quantity,
        delivery_mode,
        fulfillment_status
      ),
      order_field_values (
        field_key,
        field_label_snapshot,
        value_plain,
        is_sensitive
      ),
      order_status_history (
        to_status,
        note,
        created_at
      )
    `,
    )
    .eq("order_number", params.orderNumber)
    .maybeSingle();

  if (error || !order) return null;

  type OrderRow = {
    id: string;
    order_number: string;
    user_id: string | null;
    status: string;
    subtotal_cents: number;
    discount_cents: number;
    total_cents: number;
    currency: string;
    locale: string;
    submitted_at: string;
    order_items: Array<{
      id: string;
      product_name_snapshot: Record<string, string>;
      unit_price_cents: number;
      quantity: number;
      delivery_mode: "auto" | "manual";
      fulfillment_status: string;
    }>;
    order_field_values: Array<{
      field_key: string;
      field_label_snapshot: LocalizedLabel;
      value_plain: string | null;
      is_sensitive: boolean;
    }>;
    order_status_history: Array<{
      to_status: string;
      note: string | null;
      created_at: string;
    }>;
  };

  const row = order as OrderRow;

  if (params.userId) {
    if (row.user_id !== params.userId) return null;
  } else if (params.guestToken) {
    const { data: access } = await admin
      .from("guest_order_access")
      .select("expires_at")
      .eq("order_id", row.id)
      .eq("token_hash", hashGuestToken(params.guestToken))
      .maybeSingle();

    if (!access || new Date((access as { expires_at: string }).expires_at) < new Date()) {
      return null;
    }
  } else {
    return null;
  }

  const items = await Promise.all(
    (row.order_items ?? []).map(async (item) => {
      const names = item.product_name_snapshot as Record<string, string>;
      let deliveryContent: string | null = null;
      if (item.fulfillment_status === "delivered") {
        deliveryContent = await getCustomerDeliveryForItem(item.id);
      }
      return {
        id: item.id,
        productName:
          names[params.locale] ?? names.en ?? names.ar ?? "Product",
        unitPriceCents: item.unit_price_cents,
        quantity: item.quantity,
        deliveryMode: item.delivery_mode,
        fulfillmentStatus: item.fulfillment_status,
        deliveryContent,
      };
    }),
  );

  const timeline = [...(row.order_status_history ?? [])]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
    .map((event) => ({
      toStatus: event.to_status as CustomerOrder["status"],
      note: event.note,
      createdAt: event.created_at,
    }));

  const paymentInstructions = await getPaymentInstructions(params.locale);

  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status as CustomerOrder["status"],
    subtotalCents: row.subtotal_cents,
    discountCents: row.discount_cents,
    totalCents: row.total_cents,
    currency: row.currency,
    locale: row.locale,
    submittedAt: row.submitted_at,
    items,
    fields: mapOrderFields(row.order_field_values ?? [], params.locale),
    paymentInstructions,
    timeline,
  };
}

export async function listCustomerOrders(
  userId: string,
  locale: string,
): Promise<OrderListItem[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select(
      `
      id,
      order_number,
      status,
      total_cents,
      currency,
      submitted_at,
      order_items (
        product_name_snapshot,
        quantity
      )
    `,
    )
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false });

  if (error) throw error;

  type ListRow = {
    id: string;
    order_number: string;
    status: string;
    total_cents: number;
    currency: string;
    submitted_at: string;
    order_items: Array<{ product_name_snapshot: Record<string, string> }>;
  };

  return ((data ?? []) as ListRow[]).map((order) => {
    const firstItem = order.order_items?.[0];
    const names = firstItem?.product_name_snapshot;
    const productName = names?.[locale] ?? names?.en ?? "Order";

    return {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status as OrderListItem["status"],
      totalCents: order.total_cents,
      currency: order.currency,
      submittedAt: order.submitted_at,
      productSummary:
        order.order_items && order.order_items.length > 1
          ? `${productName} +${order.order_items.length - 1}`
          : productName,
    };
  });
}

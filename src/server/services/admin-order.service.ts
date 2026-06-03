import { createAdminClient } from "@/lib/supabase/admin";
import { OrderStatus } from "@/lib/domain/enums";
import { ServiceError } from "@/lib/domain/errors";
import { decryptField } from "@/lib/encryption/field";
import { resolveLocalizedLabel, type LocalizedLabel } from "@/lib/i18n/json-label";
import { getCustomerDeliveryForItem } from "@/server/services/delivery-content.service";
import { writeAuditLog } from "@/server/services/audit.service";
import type { AdminOrderDetail, AdminOrderListItem } from "@/types/admin";
import type { OrderStatus as OrderStatusType } from "@/lib/domain/enums";

export function getAllowedNextStatuses(
  fromStatus: OrderStatusType,
): OrderStatusType[] {
  return VALID_TRANSITIONS[fromStatus] ?? [];
}

const VALID_TRANSITIONS: Record<string, OrderStatusType[]> = {
  [OrderStatus.PENDING_REVIEW]: [OrderStatus.AWAITING_PAYMENT, OrderStatus.CANCELLED],
  [OrderStatus.AWAITING_PAYMENT]: [
    OrderStatus.PAYMENT_RECEIVED,
    OrderStatus.CANCELLED,
    OrderStatus.ON_HOLD,
  ],
  [OrderStatus.PAYMENT_RECEIVED]: [OrderStatus.PROCESSING, OrderStatus.ON_HOLD],
  [OrderStatus.PROCESSING]: [
    OrderStatus.DELIVERED,
    OrderStatus.NEEDS_CUSTOMER_RESPONSE,
    OrderStatus.ON_HOLD,
  ],
  [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
  [OrderStatus.NEEDS_CUSTOMER_RESPONSE]: [
    OrderStatus.PROCESSING,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.ON_HOLD]: [
    OrderStatus.AWAITING_PAYMENT,
    OrderStatus.PROCESSING,
    OrderStatus.CANCELLED,
  ],
};

export async function transitionOrderStatus(params: {
  orderId: string;
  toStatus: OrderStatusType;
  adminUserId: string;
  note?: string;
}): Promise<void> {
  const admin = createAdminClient();
  const { data: order, error } = await admin
    .from("orders")
    .select("id, status, coupon_id")
    .eq("id", params.orderId)
    .single();

  if (error || !order) {
    throw new ServiceError("NOT_FOUND", "Order not found");
  }

  const fromStatus = (order as { status: string }).status as OrderStatusType;
  const allowed = VALID_TRANSITIONS[fromStatus] ?? [];
  if (!allowed.includes(params.toStatus)) {
    throw new ServiceError(
      "VALIDATION",
      `Cannot transition from ${fromStatus} to ${params.toStatus}`,
    );
  }

  const updates: Record<string, unknown> = {
    status: params.toStatus,
    updated_at: new Date().toISOString(),
  };

  if (params.toStatus === OrderStatus.PAYMENT_RECEIVED) {
    updates.payment_received_at = new Date().toISOString();
  }
  if (params.toStatus === OrderStatus.PROCESSING) {
    updates.processing_started_at = new Date().toISOString();
  }
  if (params.toStatus === OrderStatus.DELIVERED) {
    updates.delivered_at = new Date().toISOString();
  }
  if (params.toStatus === OrderStatus.COMPLETED) {
    updates.completed_at = new Date().toISOString();
  }
  if (params.toStatus === OrderStatus.CANCELLED) {
    updates.cancelled_at = new Date().toISOString();
  }

  const { error: updateError } = await admin
    .from("orders")
    .update(updates)
    .eq("id", params.orderId);

  if (updateError) throw updateError;

  await admin.from("order_status_history").insert({
    order_id: params.orderId,
    from_status: fromStatus,
    to_status: params.toStatus,
    changed_by_user_id: params.adminUserId,
    note: params.note ?? null,
  });

  void import("@/server/services/notification.service").then((m) =>
    m.notifyOrderStatusChanged(params.orderId, params.toStatus).catch(() => undefined),
  );

  void writeAuditLog({
    actorUserId: params.adminUserId,
    action: "order.status_changed",
    entityType: "order",
    entityId: params.orderId,
    metadata: { fromStatus, toStatus: params.toStatus, note: params.note ?? null },
  });

  if (params.toStatus === OrderStatus.PROCESSING) {
    void import("@/server/services/support.service").then((m) =>
      m.ensureFulfillmentTicketsForOrder(params.orderId).catch(() => undefined),
    );
  }

  if (
    params.toStatus === OrderStatus.PAYMENT_RECEIVED &&
    (order as { coupon_id: string | null }).coupon_id
  ) {
    const couponId = (order as { coupon_id: string }).coupon_id;
    const { data: coupon } = await admin
      .from("coupons")
      .select("usage_count")
      .eq("id", couponId)
      .single();

    if (coupon) {
      await admin
        .from("coupons")
        .update({
          usage_count: ((coupon as { usage_count: number }).usage_count ?? 0) + 1,
        })
        .eq("id", couponId);
    }
  }
}

export async function listAdminOrders(
  status?: OrderStatusType,
  options?: { limit?: number; search?: string },
): Promise<AdminOrderListItem[]> {
  const limit = options?.limit ?? 50;
  const search = options?.search?.trim();
  const admin = createAdminClient();
  let query = admin
    .from("orders")
    .select(
      `
      id,
      order_number,
      status,
      total_cents,
      currency,
      submitted_at,
      guest_email,
      user_id,
      profiles (display_name),
      order_items (product_name_snapshot)
    `,
    )
    .order("submitted_at", { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.ilike("order_number", `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => {
    const r = row as {
      id: string;
      order_number: string;
      status: OrderStatusType;
      total_cents: number;
      currency: string;
      submitted_at: string;
      guest_email: string | null;
      user_id: string | null;
      profiles:
        | { display_name: string | null }
        | { display_name: string | null }[]
        | null;
      order_items: Array<{ product_name_snapshot: Record<string, string> }>;
    };

    const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    const first = r.order_items?.[0]?.product_name_snapshot;
    const productName = first?.en ?? first?.ar ?? "Product";

    return {
      id: r.id,
      orderNumber: r.order_number,
      status: r.status,
      totalCents: r.total_cents,
      currency: r.currency,
      submittedAt: r.submitted_at,
      customerLabel:
        profile?.display_name ?? r.guest_email ?? r.user_id ?? "Guest",
      productSummary:
        r.order_items.length > 1
          ? `${productName} +${r.order_items.length - 1}`
          : productName,
    };
  });
}

export async function getAdminOrderDetail(
  orderId: string,
): Promise<AdminOrderDetail | null> {
  const admin = createAdminClient();
  const { data: order, error } = await admin
    .from("orders")
    .select(
      `
      id,
      order_number,
      status,
      subtotal_cents,
      discount_cents,
      total_cents,
      currency,
      locale,
      customer_note,
      admin_note,
      guest_email,
      user_id,
      submitted_at,
      order_items (
        id,
        product_id,
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
        value_encrypted,
        is_sensitive
      ),
      order_status_history (
        to_status,
        note,
        created_at
      )
    `,
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order) return null;

  const row = order as {
    id: string;
    order_number: string;
    status: OrderStatusType;
    subtotal_cents: number;
    discount_cents: number;
    total_cents: number;
    currency: string;
    locale: string;
    customer_note: string | null;
    admin_note: string | null;
    guest_email: string | null;
    user_id: string | null;
    submitted_at: string;
    order_items: Array<{
      id: string;
      product_id: string;
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
      value_encrypted: string | null;
      is_sensitive: boolean;
    }>;
    order_status_history: Array<{
      to_status: string;
      note: string | null;
      created_at: string;
    }>;
  };

  const items = await Promise.all(
    row.order_items.map(async (item) => {
      const names = item.product_name_snapshot;
      let deliveryContent: string | null = null;
      if (item.fulfillment_status === "delivered") {
        deliveryContent = await getCustomerDeliveryForItem(item.id);
      }
      return {
        id: item.id,
        productId: item.product_id,
        productName: names.en ?? names.ar ?? "Product",
        unitPriceCents: item.unit_price_cents,
        quantity: item.quantity,
        deliveryMode: item.delivery_mode,
        fulfillmentStatus: item.fulfillment_status,
        deliveryContent,
      };
    }),
  );

  const fields = row.order_field_values.map((f) => {
    let value = f.value_plain ?? "";
    if (f.is_sensitive && f.value_encrypted) {
      try {
        value = decryptField(f.value_encrypted);
      } catch {
        value = "[decrypt error]";
      }
    }
    return {
      fieldKey: f.field_key,
      label: resolveLocalizedLabel(f.field_label_snapshot, row.locale, f.field_key),
      value,
      isSensitive: f.is_sensitive,
    };
  });

  const timeline = [...row.order_status_history]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((e) => ({
      toStatus: e.to_status as OrderStatusType,
      note: e.note,
      createdAt: e.created_at,
    }));

  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    subtotalCents: row.subtotal_cents,
    discountCents: row.discount_cents,
    totalCents: row.total_cents,
    currency: row.currency,
    locale: row.locale,
    customerNote: row.customer_note,
    adminNote: row.admin_note,
    guestEmail: row.guest_email,
    userId: row.user_id,
    submittedAt: row.submitted_at,
    items,
    fields,
    timeline,
  };
}

export type AdminOrderExportRow = {
  orderNumber: string;
  status: string;
  customer: string;
  guestEmail: string;
  product: string;
  subtotal: string;
  discount: string;
  total: string;
  currency: string;
  coupon: string;
  submittedAt: string;
  paymentReceivedAt: string;
};

export async function listOrdersForExport(
  status?: OrderStatusType,
  limit = 500,
): Promise<AdminOrderExportRow[]> {
  const admin = createAdminClient();
  let query = admin
    .from("orders")
    .select(
      `
      order_number,
      status,
      subtotal_cents,
      discount_cents,
      total_cents,
      currency,
      coupon_code_snapshot,
      submitted_at,
      payment_received_at,
      guest_email,
      user_id,
      profiles (display_name),
      order_items (product_name_snapshot)
    `,
    )
    .order("submitted_at", { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((raw) => {
    const row = raw as {
      order_number: string;
      status: string;
      subtotal_cents: number;
      discount_cents: number;
      total_cents: number;
      currency: string;
      coupon_code_snapshot: string | null;
      submitted_at: string;
      payment_received_at: string | null;
      guest_email: string | null;
      user_id: string | null;
      profiles:
        | { display_name: string | null }
        | { display_name: string | null }[]
        | null;
      order_items: Array<{ product_name_snapshot: Record<string, string> }>;
    };

    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const first = row.order_items?.[0]?.product_name_snapshot;
    const productName = first?.en ?? first?.ar ?? "Product";
    const fmt = (cents: number) => (cents / 100).toFixed(2);

    return {
      orderNumber: row.order_number,
      status: row.status,
      customer: profile?.display_name ?? row.user_id ?? "Guest",
      guestEmail: row.guest_email ?? "",
      product:
        row.order_items.length > 1
          ? `${productName} +${row.order_items.length - 1}`
          : productName,
      subtotal: fmt(row.subtotal_cents),
      discount: fmt(row.discount_cents),
      total: fmt(row.total_cents),
      currency: row.currency,
      coupon: row.coupon_code_snapshot ?? "",
      submittedAt: row.submitted_at,
      paymentReceivedAt: row.payment_received_at ?? "",
    };
  });
}

export function ordersToCsv(rows: AdminOrderExportRow[]): string {
  const headers = [
    "order_number",
    "status",
    "customer",
    "guest_email",
    "product",
    "subtotal",
    "discount",
    "total",
    "currency",
    "coupon",
    "submitted_at",
    "payment_received_at",
  ];

  const escape = (value: string) => {
    const safe = value.replace(/"/g, '""');
    return `"${safe}"`;
  };

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.orderNumber,
        row.status,
        row.customer,
        row.guestEmail,
        row.product,
        row.subtotal,
        row.discount,
        row.total,
        row.currency,
        row.coupon,
        row.submittedAt,
        row.paymentReceivedAt,
      ]
        .map(escape)
        .join(","),
    ),
  ];

  return lines.join("\r\n");
}

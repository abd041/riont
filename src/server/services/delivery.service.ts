import { createAdminClient } from "@/lib/supabase/admin";
import { OrderStatus } from "@/lib/domain/enums";
import { ServiceError } from "@/lib/domain/errors";
import { encryptInventory } from "@/lib/encryption/inventory";
import { getAllocatedPayloads } from "@/server/services/inventory.service";
import { transitionOrderStatus } from "@/server/services/admin-order.service";

type AllocateResult = {
  success: boolean;
  allocated_count?: number;
  error?: string;
};

export async function fulfillAutoOrderItem(
  orderItemId: string,
  adminUserId: string,
): Promise<{ deliveryText: string }> {
  const admin = createAdminClient();

  const { data: rpcResult, error: rpcError } = await admin.rpc(
    "allocate_inventory",
    { p_order_item_id: orderItemId, p_qty: 1 },
  );

  if (rpcError) {
    throw new ServiceError("INTERNAL", rpcError.message);
  }

  const result = rpcResult as AllocateResult;
  if (!result?.success) {
    throw new ServiceError(
      "CONFLICT",
      result?.error ?? "Could not allocate inventory",
    );
  }

  const payloads = await getAllocatedPayloads(orderItemId);
  const deliveryText = payloads.join("\n---\n");

  const idempotencyKey = `auto:${orderItemId}:${Date.now()}`;
  const { error: logError } = await admin.from("delivery_logs").insert({
    order_item_id: orderItemId,
    log_type: "auto_delivered",
    channel: "platform",
    idempotency_key: idempotencyKey,
    delivered_payload_encrypted: encryptInventory(deliveryText),
    admin_user_id: adminUserId,
  });

  if (logError) throw logError;

  await admin
    .from("delivery_inventory")
    .update({ status: "delivered", delivered_at: new Date().toISOString() })
    .eq("order_item_id", orderItemId);

  await admin
    .from("order_items")
    .update({
      fulfillment_status: "delivered",
      delivered_at: new Date().toISOString(),
    })
    .eq("id", orderItemId);

  const { data: item } = await admin
    .from("order_items")
    .select("order_id")
    .eq("id", orderItemId)
    .single();

  if (item) {
    await maybeCompleteOrder((item as { order_id: string }).order_id, adminUserId);
  }

  void import("@/server/services/notification.service").then((m) =>
    m.notifyDeliveryReady(orderItemId).catch(() => undefined),
  );

  void import("@/server/services/audit.service").then(({ writeAuditLog }) =>
    writeAuditLog({
      actorUserId: adminUserId,
      action: "order.auto_delivered",
      entityType: "order_item",
      entityId: orderItemId,
      metadata: item ? { orderId: (item as { order_id: string }).order_id } : undefined,
    }),
  );

  return { deliveryText };
}

export async function manualDeliverOrderItem(
  orderItemId: string,
  deliveryText: string,
  adminUserId: string,
): Promise<void> {
  const trimmed = deliveryText.trim();
  if (!trimmed) {
    throw new ServiceError("VALIDATION", "Delivery content is required");
  }

  const admin = createAdminClient();
  const idempotencyKey = `manual:${orderItemId}:${Date.now()}`;

  const { error: logError } = await admin.from("delivery_logs").insert({
    order_item_id: orderItemId,
    log_type: "manual_delivered",
    channel: "platform",
    idempotency_key: idempotencyKey,
    delivered_payload_encrypted: encryptInventory(trimmed),
    admin_user_id: adminUserId,
  });

  if (logError) throw logError;

  await admin
    .from("order_items")
    .update({
      fulfillment_status: "delivered",
      delivered_at: new Date().toISOString(),
    })
    .eq("id", orderItemId);

  const { data: item } = await admin
    .from("order_items")
    .select("order_id")
    .eq("id", orderItemId)
    .single();

  if (item) {
    await maybeCompleteOrder((item as { order_id: string }).order_id, adminUserId);
  }

  void import("@/server/services/notification.service").then((m) =>
    m.notifyDeliveryReady(orderItemId).catch(() => undefined),
  );

  void import("@/server/services/audit.service").then(({ writeAuditLog }) =>
    writeAuditLog({
      actorUserId: adminUserId,
      action: "order.manual_delivered",
      entityType: "order_item",
      entityId: orderItemId,
      metadata: item ? { orderId: (item as { order_id: string }).order_id } : undefined,
    }),
  );
}

async function maybeCompleteOrder(
  orderId: string,
  adminUserId: string,
): Promise<void> {
  const admin = createAdminClient();
  const { data: items } = await admin
    .from("order_items")
    .select("fulfillment_status")
    .eq("order_id", orderId);

  const allDelivered =
    (items ?? []).length > 0 &&
    (items ?? []).every(
      (i) => (i as { fulfillment_status: string }).fulfillment_status === "delivered",
    );

  if (!allDelivered) return;

  const { data: order } = await admin
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (!order) return;

  const status = (order as { status: string }).status;
  if (status === OrderStatus.DELIVERED || status === OrderStatus.COMPLETED) {
    return;
  }

  await transitionOrderStatus({
    orderId,
    toStatus: OrderStatus.DELIVERED,
    adminUserId,
    note: "All items delivered",
  });
}

export async function processAutoFulfillmentForOrder(
  orderId: string,
  adminUserId: string,
): Promise<{ fulfilled: number; errors: string[] }> {
  const admin = createAdminClient();
  const { data: items, error } = await admin
    .from("order_items")
    .select("id, delivery_mode, fulfillment_status")
    .eq("order_id", orderId);

  if (error) throw error;

  let fulfilled = 0;
  const errors: string[] = [];

  for (const raw of items ?? []) {
    const item = raw as {
      id: string;
      delivery_mode: string;
      fulfillment_status: string;
    };
    if (item.delivery_mode !== "auto") continue;
    if (item.fulfillment_status === "delivered") continue;

    try {
      await fulfillAutoOrderItem(item.id, adminUserId);
      fulfilled += 1;
    } catch (err) {
      const message =
        err instanceof ServiceError ? err.message : "Auto delivery failed";
      errors.push(message);
    }
  }

  return { fulfilled, errors };
}


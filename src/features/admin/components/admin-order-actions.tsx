"use client";

import { getDeliveryModeLabel } from "@/lib/admin/labels";
import { AdminActionForm } from "./admin-action-form";
import {
  fulfillAutoItemAction,
  manualDeliverAction,
  updateAdminNoteAction,
} from "@/server/actions/admin-order.actions";
import type { AdminOrderDetail, AdminOrderItem } from "@/types/admin";

export { AdminOrderWorkflowCallout, AdminStatusActions } from "./admin-order-workflow";

export function AdminNoteForm({ order }: { order: AdminOrderDetail }) {
  return (
    <div className="admin-panel admin-panel--flat">
      <h2 className="font-semibold">Admin note (internal)</h2>
      <AdminActionForm
        action={updateAdminNoteAction}
        submitLabel="Save note"
        className="mt-4"
      >
        <input type="hidden" name="orderId" value={order.id} />
        <textarea
          name="adminNote"
          defaultValue={order.adminNote ?? ""}
          rows={4}
          className="flex w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-glow)] focus:outline-none"
          placeholder="Internal notes for staff…"
        />
      </AdminActionForm>
    </div>
  );
}

function ItemFulfillmentPanel({
  orderId,
  item,
}: {
  orderId: string;
  item: AdminOrderItem;
}) {
  if (item.fulfillmentStatus === "delivered") {
    return (
      <div className="mt-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3">
        <p className="text-xs font-medium text-emerald-300">Delivered</p>
        {item.deliveryContent && (
          <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-[var(--text-primary)]" dir="ltr">
            {item.deliveryContent}
          </pre>
        )}
      </div>
    );
  }

  if (item.deliveryMode === "auto") {
    return (
      <AdminActionForm
        action={fulfillAutoItemAction}
        submitLabel="Run auto delivery"
        pendingLabel="Allocating…"
        className="mt-3"
      >
        <input type="hidden" name="orderItemId" value={item.id} />
        <input type="hidden" name="orderId" value={orderId} />
      </AdminActionForm>
    );
  }

  return (
    <AdminActionForm
      action={manualDeliverAction}
      submitLabel="Mark as delivered"
      className="mt-3"
    >
      <input type="hidden" name="orderItemId" value={item.id} />
      <input type="hidden" name="orderId" value={orderId} />
      <textarea
        name="deliveryText"
        rows={4}
        required
        placeholder="Paste credentials, license key, or delivery message…"
        className="flex w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-glow)] focus:outline-none"
        dir="ltr"
      />
    </AdminActionForm>
  );
}

export function AdminOrderItemsPanel({
  order,
}: {
  order: AdminOrderDetail;
}) {
  return (
    <div className="admin-panel admin-panel--flat">
      <h2 className="font-semibold">Line items & fulfillment</h2>
      <ul className="mt-4 space-y-6">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="border-b border-[var(--border-subtle)] pb-6 last:border-0 last:pb-0"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {getDeliveryModeLabel(item.deliveryMode)} · {item.fulfillmentStatus} · qty{" "}
                  {item.quantity}
                </p>
              </div>
              <span className="text-sm text-accent-400" dir="ltr">
                ${(item.unitPriceCents / 100).toFixed(2)}
              </span>
            </div>
            <ItemFulfillmentPanel orderId={order.id} item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

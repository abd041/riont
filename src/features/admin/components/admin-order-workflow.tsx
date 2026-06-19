"use client";

import { OrderStatus } from "@/lib/domain/enums";
import type { OrderStatus as OrderStatusType } from "@/lib/domain/enums";
import {
  getOrderWorkflowHint,
  getOrderStatusActionLabel,
  isPrimaryOrderAction,
} from "@/lib/admin/labels";
import type { AdminOrderDetail } from "@/types/admin";
import { AdminActionForm } from "./admin-action-form";
import { transitionOrderAction } from "@/server/actions/admin-order.actions";

export function AdminOrderWorkflowCallout({
  status,
}: {
  status: OrderStatusType;
}) {
  const hint = getOrderWorkflowHint(status);

  return (
    <div className={`admin-workflow-callout admin-workflow-callout--${hint.tone}`}>
      <p className="admin-workflow-callout__title">{hint.title}</p>
      <p className="admin-workflow-callout__body">{hint.body}</p>
    </div>
  );
}

function sortActions(
  fromStatus: OrderStatusType,
  actions: OrderStatusType[],
): OrderStatusType[] {
  void fromStatus;
  const priority: Partial<Record<OrderStatusType, number>> = {
    [OrderStatus.AWAITING_PAYMENT]: 1,
    [OrderStatus.PAYMENT_RECEIVED]: 2,
    [OrderStatus.PROCESSING]: 3,
    [OrderStatus.DELIVERED]: 4,
    [OrderStatus.COMPLETED]: 5,
    [OrderStatus.ON_HOLD]: 8,
    [OrderStatus.CANCELLED]: 9,
  };

  return [...actions].sort(
    (a, b) => (priority[a] ?? 6) - (priority[b] ?? 6),
  );
}

export function AdminStatusActions({
  order,
  allowedNext,
}: {
  order: AdminOrderDetail;
  allowedNext: OrderStatusType[];
}) {
  if (allowedNext.length === 0) {
    return (
      <div className="admin-panel admin-panel--flat">
        <h2 className="font-semibold">Workflow</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          No status changes available for this order.
        </p>
      </div>
    );
  }

  const sorted = sortActions(order.status, allowedNext);
  const showPaymentNote =
    order.status === OrderStatus.AWAITING_PAYMENT &&
    sorted.includes(OrderStatus.PAYMENT_RECEIVED);

  return (
    <div className="admin-panel admin-panel--flat">
      <h2 className="font-semibold">Manual payment workflow</h2>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        Payments are confirmed by you — not automatic. Use the actions below after
        you verify the transfer.
      </p>

      <div className="mt-4 space-y-3">
        {sorted.map((status) => {
          const primary = isPrimaryOrderAction(order.status, status);
          const isCancel = status === OrderStatus.CANCELLED;

          return (
            <AdminActionForm
              key={status}
              action={transitionOrderAction}
              submitLabel={getOrderStatusActionLabel(status)}
              pendingLabel="Updating…"
              variant={isCancel ? "outline" : primary ? "primary" : "secondary"}
              className={primary ? "admin-workflow-action--primary" : undefined}
            >
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="toStatus" value={status} />
              {showPaymentNote && status === OrderStatus.PAYMENT_RECEIVED && (
                <textarea
                  name="note"
                  rows={2}
                  placeholder="Optional: payment reference, bank receipt ID, or amount received…"
                  className="flex w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-glow)] focus:outline-none"
                />
              )}
            </AdminActionForm>
          );
        })}
      </div>

      {order.status === OrderStatus.PROCESSING && (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Starting processing may auto-deliver in-stock items. You can also
          fulfill each line manually below.
        </p>
      )}
    </div>
  );
}

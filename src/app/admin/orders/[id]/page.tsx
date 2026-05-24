import { notFound } from "next/navigation";
import {
  getAdminOrderDetail,
  getAllowedNextStatuses,
} from "@/server/services/admin-order.service";
import { getAvailableStock } from "@/server/services/inventory.service";
import { OrderStatus } from "@/lib/domain/enums";
import type { OrderStatus as OrderStatusType } from "@/lib/domain/enums";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import {
  AdminNoteForm,
  AdminOrderItemsPanel,
  AdminStatusActions,
} from "@/features/admin/components/admin-order-actions";
import { AdminInventoryPanel } from "@/features/admin/components/admin-inventory-panel";

const STATUS_LABELS: Record<OrderStatusType, string> = {
  [OrderStatus.PENDING_REVIEW]: "Pending review",
  [OrderStatus.AWAITING_PAYMENT]: "Awaiting payment",
  [OrderStatus.PAYMENT_RECEIVED]: "Payment received",
  [OrderStatus.PROCESSING]: "Processing",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.CANCELLED]: "Cancelled",
  [OrderStatus.NEEDS_CUSTOMER_RESPONSE]: "Needs customer response",
  [OrderStatus.ON_HOLD]: "On hold",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrderDetail(id);
  if (!order) notFound();

  const allowedNext = getAllowedNextStatuses(order.status);
  const autoProductIds = [
    ...new Set(
      order.items
        .filter((i) => i.deliveryMode === "auto")
        .map((i) => i.productId),
    ),
  ];

  const stockByProduct = await Promise.all(
    autoProductIds.map(async (productId) => {
      const item = order.items.find((i) => i.productId === productId);
      return {
        productId,
        productName: item?.productName ?? "Product",
        stock: await getAvailableStock(productId),
      };
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--text-muted)]">Order</p>
          <h1 className="text-2xl font-bold" dir="ltr">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {order.guestEmail ?? order.userId ?? "Guest"} ·{" "}
            {new Date(order.submittedAt).toLocaleString("en")}
          </p>
        </div>
        <OrderStatusBadge
          status={order.status}
          label={STATUS_LABELS[order.status]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminOrderItemsPanel order={order} />

          {order.fields.length > 0 && (
            <div className="glass-card rounded-[var(--radius-lg)] p-6">
              <h2 className="font-semibold">Customer fields</h2>
              <dl className="mt-4 space-y-3">
                {order.fields.map((field) => (
                  <div key={field.fieldKey}>
                    <dt className="text-xs text-[var(--text-muted)]">
                      {field.label}
                      {field.isSensitive && (
                        <span className="ms-2 text-amber-400">sensitive</span>
                      )}
                    </dt>
                    <dd
                      className="text-sm"
                      dir={field.isSensitive ? "ltr" : undefined}
                    >
                      {field.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="glass-card rounded-[var(--radius-lg)] p-6">
            <h2 className="font-semibold">Timeline</h2>
            <ol className="mt-4 space-y-3">
              {order.timeline.map((event, i) => (
                <li key={`${event.createdAt}-${i}`} className="text-sm">
                  <span className="font-medium">
                    {STATUS_LABELS[event.toStatus]}
                  </span>
                  {event.note && (
                    <span className="text-[var(--text-muted)]"> — {event.note}</span>
                  )}
                  <p className="text-xs text-[var(--text-muted)]">
                    {new Date(event.createdAt).toLocaleString("en")}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-[var(--radius-lg)] p-6">
            <h2 className="font-semibold">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--text-muted)]">Subtotal</dt>
                <dd dir="ltr">${(order.subtotalCents / 100).toFixed(2)}</dd>
              </div>
              {order.discountCents > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[var(--text-muted)]">Discount</dt>
                  <dd dir="ltr" className="text-emerald-400">
                    -${(order.discountCents / 100).toFixed(2)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between border-t border-[var(--border-subtle)] pt-2 font-semibold">
                <dt>Total</dt>
                <dd className="text-accent-400" dir="ltr">
                  ${(order.totalCents / 100).toFixed(2)} {order.currency}
                </dd>
              </div>
            </dl>
          </div>

          {order.customerNote && (
            <div className="glass-card rounded-[var(--radius-lg)] p-6">
              <h2 className="font-semibold">Customer note</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {order.customerNote}
              </p>
            </div>
          )}

          <AdminStatusActions order={order} allowedNext={allowedNext} />
          <AdminNoteForm order={order} />

          {stockByProduct.map((p) => (
            <AdminInventoryPanel
              key={p.productId}
              productId={p.productId}
              productName={p.productName}
              availableStock={p.stock}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

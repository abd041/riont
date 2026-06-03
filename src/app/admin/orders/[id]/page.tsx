import Link from "next/link";
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
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";
import { AdminPanel } from "@/features/admin/components/admin-panel";
import { PAYMENT_STATUS_LABELS } from "@/lib/order/payment-status";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Bank transfer",
  whatsapp: "WhatsApp",
  cash: "Cash",
  other: "Other",
};

function formatPaymentMethod(value: string | null): string {
  if (!value) return "—";
  return PAYMENT_METHOD_LABELS[value] ?? value;
}

const STATUS_LABELS: Record<OrderStatusType, string> = {
  [OrderStatus.PENDING_REVIEW]: "Pending review",
  [OrderStatus.AWAITING_PAYMENT]: "Awaiting payment",
  [OrderStatus.PAYMENT_RECEIVED]: "Payment received",
  [OrderStatus.PROCESSING]: "Processing",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.REFUNDED]: "Refunded",
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
    <AdminPageShell>
      <Link href="/admin/orders" className="admin-back">
        ← Orders
      </Link>

      <AdminPageHeader
        title={order.orderNumber}
        description={`${order.guestEmail ?? order.userId ?? "Guest"} · ${new Date(order.submittedAt).toLocaleString("en")}`}
        actions={
          <OrderStatusBadge
            status={order.status}
            label={STATUS_LABELS[order.status]}
          />
        }
      />

      <div className="admin-layout-grid">
        <div className="space-y-5">
          <AdminOrderItemsPanel order={order} />

          {order.fields.length > 0 && (
            <AdminPanel title="Customer fields">
              <dl className="space-y-3">
                {order.fields.map((field) => (
                  <div key={field.fieldKey}>
                    <dt className="text-xs text-[var(--text-muted)]">
                      {field.label}
                      {field.isSensitive && (
                        <span className="ms-2 text-amber-400">sensitive</span>
                      )}
                    </dt>
                    <dd className="text-sm" dir={field.isSensitive ? "ltr" : undefined}>
                      {field.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </AdminPanel>
          )}

          <AdminPanel title="Timeline">
            <ol className="admin-timeline">
              {order.timeline.map((event, i) => (
                <li key={`${event.createdAt}-${i}`} className="admin-timeline__item">
                  <p className="admin-timeline__label">
                    {STATUS_LABELS[event.toStatus]}
                  </p>
                  {event.note && (
                    <p className="admin-timeline__note">{event.note}</p>
                  )}
                  <p className="admin-timeline__time">
                    {new Date(event.createdAt).toLocaleString("en")}
                  </p>
                </li>
              ))}
            </ol>
          </AdminPanel>
        </div>

        <aside className="space-y-5">
          <AdminPanel title="Summary">
            <div className="admin-summary-row">
              <span className="admin-summary-row__label">Payment</span>
              <span
                className={`admin-payment-badge admin-payment-badge--${order.paymentStatus}`}
              >
                {PAYMENT_STATUS_LABELS[order.paymentStatus]}
              </span>
            </div>
            <div className="admin-summary-row">
              <span className="admin-summary-row__label">Payment method</span>
              <span className="text-sm text-[var(--text-muted)]">
                {formatPaymentMethod(order.paymentMethod)}
              </span>
            </div>
            {order.paymentReceivedAt && (
              <div className="admin-summary-row">
                <span className="admin-summary-row__label">Paid at</span>
                <span className="text-sm text-[var(--text-muted)]">
                  {new Date(order.paymentReceivedAt).toLocaleString("en")}
                </span>
              </div>
            )}
            <div className="admin-summary-row">
              <span className="admin-summary-row__label">Subtotal</span>
              <span dir="ltr">${(order.subtotalCents / 100).toFixed(2)}</span>
            </div>
            {order.discountCents > 0 && (
              <div className="admin-summary-row">
                <span className="admin-summary-row__label">Discount</span>
                <span dir="ltr" className="text-emerald-400">
                  -${(order.discountCents / 100).toFixed(2)}
                </span>
              </div>
            )}
            <div className="admin-summary-row admin-summary-row--total">
              <span>Total</span>
              <span className="admin-summary-row__value" dir="ltr">
                ${(order.totalCents / 100).toFixed(2)} {order.currency}
              </span>
            </div>
          </AdminPanel>

          {order.customerNote && (
            <AdminPanel title="Customer note">
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                {order.customerNote}
              </p>
            </AdminPanel>
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
        </aside>
      </div>
    </AdminPageShell>
  );
}

import Link from "next/link";
import { OrderStatus } from "@/lib/domain/enums";
import type { OrderStatus as OrderStatusType } from "@/lib/domain/enums";
import { listAdminOrders } from "@/server/services/admin-order.service";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";

const STATUS_LABELS: Record<OrderStatusType, string> = {
  [OrderStatus.PENDING_REVIEW]: "Pending review",
  [OrderStatus.AWAITING_PAYMENT]: "Awaiting payment",
  [OrderStatus.PAYMENT_RECEIVED]: "Payment received",
  [OrderStatus.PROCESSING]: "Processing",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.CANCELLED]: "Cancelled",
  [OrderStatus.NEEDS_CUSTOMER_RESPONSE]: "Needs response",
  [OrderStatus.ON_HOLD]: "On hold",
};

const FILTERS: Array<{ label: string; status?: OrderStatusType }> = [
  { label: "All" },
  { label: "Pending review", status: OrderStatus.PENDING_REVIEW },
  { label: "Awaiting payment", status: OrderStatus.AWAITING_PAYMENT },
  { label: "Payment received", status: OrderStatus.PAYMENT_RECEIVED },
  { label: "Processing", status: OrderStatus.PROCESSING },
  { label: "Delivered", status: OrderStatus.DELIVERED },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const statusFilter = FILTERS.find((f) => f.status === statusParam)?.status;
  const orders = await listAdminOrders(statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Review, approve, fulfill, and complete customer orders.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const href = filter.status
            ? `/admin/orders?status=${filter.status}`
            : "/admin/orders";
          const active =
            (filter.status ?? undefined) === (statusFilter ?? undefined);
          return (
            <Link
              key={filter.label}
              href={href}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "bg-accent-500/20 text-accent-300"
                  : "border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="glass-card overflow-hidden rounded-[var(--radius-lg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-[var(--text-muted)]"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-accent-400 hover:underline"
                      dir="ltr"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {order.customerLabel}
                  </td>
                  <td className="px-4 py-3">{order.productSummary}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge
                      status={order.status}
                      label={STATUS_LABELS[order.status]}
                    />
                  </td>
                  <td className="px-4 py-3" dir="ltr">
                    {(order.totalCents / 100).toFixed(2)} {order.currency}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">
                    {new Date(order.submittedAt).toLocaleString("en")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

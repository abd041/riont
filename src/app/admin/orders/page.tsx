import Link from "next/link";
import { OrderStatus } from "@/lib/domain/enums";
import type { OrderStatus as OrderStatusType } from "@/lib/domain/enums";
import {
  getOrderStatusLabel,
  ORDER_QUEUE_FILTER_LABELS,
  ORDER_STATUS_FILTER_LABELS,
  type OrderQueueFilter,
} from "@/lib/admin/labels";
import { PAYMENT_STATUS_LABELS } from "@/lib/order/payment-status";
import { listAdminOrders } from "@/server/services/admin-order.service";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import {
  AdminDataTable,
  AdminTableEmpty,
} from "@/features/admin/components/admin-data-table";
import { AdminFilterPills } from "@/features/admin/components/admin-filter-pills";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";
import {
  AdminExportOrdersLink,
  AdminPageActions,
  AdminSearchForm,
} from "@/features/admin/components/admin-page-actions";

const QUEUE_FILTERS: Array<{ label: string; value?: OrderQueueFilter }> = [
  { label: ORDER_QUEUE_FILTER_LABELS.unpaid, value: "unpaid" },
  { label: ORDER_QUEUE_FILTER_LABELS.fulfill, value: "fulfill" },
];

const STATUS_FILTERS: Array<{ label: string; value?: OrderStatusType }> = [
  { label: "All" },
  { label: ORDER_STATUS_FILTER_LABELS[OrderStatus.PENDING_REVIEW], value: OrderStatus.PENDING_REVIEW },
  { label: ORDER_STATUS_FILTER_LABELS[OrderStatus.AWAITING_PAYMENT], value: OrderStatus.AWAITING_PAYMENT },
  { label: ORDER_STATUS_FILTER_LABELS[OrderStatus.PAYMENT_RECEIVED], value: OrderStatus.PAYMENT_RECEIVED },
  { label: ORDER_STATUS_FILTER_LABELS[OrderStatus.PROCESSING], value: OrderStatus.PROCESSING },
  { label: ORDER_STATUS_FILTER_LABELS[OrderStatus.DELIVERED], value: OrderStatus.DELIVERED },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; queue?: string }>;
}) {
  const { status: statusParam, q, queue: queueParam } = await searchParams;
  const queueFilter = QUEUE_FILTERS.find((f) => f.value === queueParam)?.value;
  const statusFilter = queueFilter
    ? undefined
    : STATUS_FILTERS.find((f) => f.value === statusParam)?.value;
  const orders = await listAdminOrders(statusFilter, {
    search: q,
    limit: 100,
    queue: queueFilter,
  });

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Orders"
        description="Manual payment workflow: review new orders, confirm payment after you verify the transfer, then deliver items."
      />

      <AdminPageActions>
        <AdminSearchForm
          basePath="/admin/orders"
          placeholder="Search order number…"
          defaultValue={q}
          hiddenParams={{ status: statusFilter, queue: queueFilter }}
        />
        <AdminExportOrdersLink status={statusFilter} />
      </AdminPageActions>

      <div className="admin-filter-section">
        <p className="admin-filter-section__label">Queues</p>
        <AdminFilterPills
          filters={QUEUE_FILTERS}
          activeValue={queueFilter}
          basePath="/admin/orders"
          paramName="queue"
        />
      </div>

      <div className="admin-filter-section">
        <p className="admin-filter-section__label">Status</p>
        <AdminFilterPills
          filters={STATUS_FILTERS}
          activeValue={statusFilter}
          basePath="/admin/orders"
          paramName="status"
        />
      </div>

      <AdminDataTable
        columns={["Order", "Customer", "Product", "Payment", "Status", "Total", "Submitted"]}
      >
        {orders.length === 0 ? (
          <AdminTableEmpty colSpan={7} message="No orders found." />
        ) : (
          orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="admin-table__link"
                  dir="ltr"
                >
                  {order.orderNumber}
                </Link>
              </td>
              <td>{order.customerLabel}</td>
              <td>{order.productSummary}</td>
              <td>
                <span
                  className={`admin-payment-badge admin-payment-badge--${order.paymentStatus}`}
                >
                  {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                </span>
              </td>
              <td>
                <OrderStatusBadge
                  status={order.status}
                  label={getOrderStatusLabel(order.status)}
                />
              </td>
              <td dir="ltr">
                {(order.totalCents / 100).toFixed(2)} {order.currency}
              </td>
              <td className="text-[var(--text-muted)]">
                {new Date(order.submittedAt).toLocaleString("en")}
              </td>
            </tr>
          ))
        )}
      </AdminDataTable>
    </AdminPageShell>
  );
}

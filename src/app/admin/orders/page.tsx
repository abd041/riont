import Link from "next/link";
import { OrderStatus } from "@/lib/domain/enums";
import type { OrderStatus as OrderStatusType } from "@/lib/domain/enums";
import {
  getOrderStatusLabel,
  ORDER_STATUS_FILTER_LABELS,
} from "@/lib/admin/labels";
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

const FILTERS: Array<{ label: string; value?: OrderStatusType }> = [
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
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status: statusParam, q } = await searchParams;
  const statusFilter = FILTERS.find((f) => f.value === statusParam)?.value;
  const orders = await listAdminOrders(statusFilter, { search: q, limit: 100 });

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Orders"
        description="External payment model: new rows are order requests (unpaid). Mark Payment received only after you verify the transfer."
      />

      <AdminPageActions>
        <AdminSearchForm
          basePath="/admin/orders"
          placeholder="Search order number…"
          defaultValue={q}
          hiddenParams={{ status: statusFilter }}
        />
        <AdminExportOrdersLink status={statusFilter} />
      </AdminPageActions>

      <AdminFilterPills
        filters={FILTERS}
        activeValue={statusFilter}
        basePath="/admin/orders"
      />

      <AdminDataTable
        columns={["Order", "Customer", "Product", "Status", "Total", "Submitted"]}
      >
        {orders.length === 0 ? (
          <AdminTableEmpty colSpan={6} message="No orders found." />
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

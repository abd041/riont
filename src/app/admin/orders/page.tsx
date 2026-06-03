import Link from "next/link";
import { OrderStatus } from "@/lib/domain/enums";
import type { OrderStatus as OrderStatusType } from "@/lib/domain/enums";
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

const FILTERS: Array<{ label: string; value?: OrderStatusType }> = [
  { label: "All" },
  { label: "Pending review", value: OrderStatus.PENDING_REVIEW },
  { label: "Awaiting payment", value: OrderStatus.AWAITING_PAYMENT },
  { label: "Payment received", value: OrderStatus.PAYMENT_RECEIVED },
  { label: "Processing", value: OrderStatus.PROCESSING },
  { label: "Delivered", value: OrderStatus.DELIVERED },
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
                  label={STATUS_LABELS[order.status]}
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

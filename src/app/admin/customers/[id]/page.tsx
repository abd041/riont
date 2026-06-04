import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderStatusLabel } from "@/lib/admin/labels";
import { getAdminCustomerDetail } from "@/server/services/admin-customer.service";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import {
  AdminDataTable,
  AdminTableEmpty,
} from "@/features/admin/components/admin-data-table";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getAdminCustomerDetail(id);
  if (!customer) notFound();

  return (
    <AdminPageShell>
      <Link href="/admin/customers" className="admin-back">
        ← Customers
      </Link>

      <AdminPageHeader
        title={customer.displayName ?? customer.email}
        description="Customer profile and purchase history."
      />

      <div className="admin-stats">
        <div className="admin-stat">
          <p className="admin-stat__label">Email</p>
          <p className="admin-stat__value" dir="ltr">
            {customer.email}
          </p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Orders</p>
          <p className="admin-stat__value">{customer.orderCount}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Total spent</p>
          <p className="admin-stat__value" dir="ltr">
            {(customer.totalSpentCents / 100).toFixed(2)} USD
          </p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Joined</p>
          <p className="admin-stat__value">
            {new Date(customer.createdAt).toLocaleDateString("en")}
          </p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Locale</p>
          <p className="admin-stat__value uppercase">{customer.locale}</p>
        </div>
      </div>

      <AdminDataTable
        columns={["Order", "Product", "Status", "Total", "Submitted"]}
        scrollable
      >
        {customer.orders.length === 0 ? (
          <AdminTableEmpty colSpan={5} message="No orders for this customer." />
        ) : (
          customer.orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link href={`/admin/orders/${order.id}`} className="admin-table__link" dir="ltr">
                  {order.orderNumber}
                </Link>
              </td>
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

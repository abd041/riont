import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderStatusLabel } from "@/lib/admin/labels";
import { getAdminGuestCustomerDetail } from "@/server/services/admin-customer.service";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import {
  AdminDataTable,
  AdminTableEmpty,
} from "@/features/admin/components/admin-data-table";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminGuestCustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  if (!email?.trim()) notFound();

  const guest = await getAdminGuestCustomerDetail(email);
  if (!guest) notFound();

  return (
    <AdminPageShell>
      <Link href="/admin/customers" className="admin-back">
        ← Customers
      </Link>

      <AdminPageHeader
        title={guest.email}
        description="Guest checkout — no registered account. Orders are tied to this email."
      />

      <div className="admin-stats">
        <div className="admin-stat">
          <p className="admin-stat__label">Email</p>
          <p className="admin-stat__value text-base" dir="ltr">
            {guest.email}
          </p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Orders</p>
          <p className="admin-stat__value">{guest.orderCount}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Total spent</p>
          <p className="admin-stat__value" dir="ltr">
            {(guest.totalSpentCents / 100).toFixed(2)} USD
          </p>
        </div>
      </div>

      <AdminDataTable
        columns={["Order", "Product", "Status", "Total", "Date"]}
        scrollable
      >
        {guest.orders.length === 0 ? (
          <AdminTableEmpty colSpan={5} message="No orders." />
        ) : (
          guest.orders.map((order) => (
            <tr key={order.id}>
              <td dir="ltr">
                <Link href={`/admin/orders/${order.id}`} className="admin-table__link">
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

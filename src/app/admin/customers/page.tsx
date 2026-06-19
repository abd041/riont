import Link from "next/link";
import {
  listAdminCustomers,
  listAdminGuestCustomers,
} from "@/server/services/admin-customer.service";
import {
  AdminDataTable,
  AdminTableEmpty,
} from "@/features/admin/components/admin-data-table";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";
import {
  AdminExportCustomersLink,
  AdminPageActions,
  AdminSearchForm,
} from "@/features/admin/components/admin-page-actions";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [customers, guests] = await Promise.all([
    listAdminCustomers(200, q),
    listAdminGuestCustomers(100, q),
  ]);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Customers"
        description="Registered accounts and guest buyers who checked out without signing in."
      />

      <AdminPageActions>
        <AdminSearchForm
          basePath="/admin/customers"
          placeholder="Search by email or name…"
          defaultValue={q}
        />
        <AdminExportCustomersLink />
      </AdminPageActions>

      <section className="admin-customer-section">
        <h2 className="admin-dashboard-section__title">Registered accounts</h2>
        <AdminDataTable
          columns={["Email", "Name", "Locale", "Orders", "Spent", "Joined"]}
          scrollable
        >
          {customers.length === 0 ? (
            <AdminTableEmpty colSpan={6} message="No registered customers found." />
          ) : (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td dir="ltr">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="admin-table__link"
                  >
                    {customer.email}
                  </Link>
                </td>
                <td>{customer.displayName ?? "—"}</td>
                <td className="uppercase">{customer.locale}</td>
                <td>{customer.orderCount}</td>
                <td dir="ltr">{(customer.totalSpentCents / 100).toFixed(2)} USD</td>
                <td className="text-[var(--text-muted)]">
                  {new Date(customer.createdAt).toLocaleDateString("en")}
                </td>
              </tr>
            ))
          )}
        </AdminDataTable>
      </section>

      <section className="admin-customer-section">
        <h2 className="admin-dashboard-section__title">Guest buyers</h2>
        <p className="mb-3 text-sm text-[var(--text-muted)]">
          Checkout without an account — view order history by email.
        </p>
        <AdminDataTable
          columns={["Email", "Orders", "Spent", "Last order", ""]}
          scrollable
        >
          {guests.length === 0 ? (
            <AdminTableEmpty colSpan={5} message="No guest buyers found." />
          ) : (
            guests.map((guest) => (
              <tr key={guest.email}>
                <td dir="ltr">
                  <Link
                    href={`/admin/customers/guest?email=${encodeURIComponent(guest.email)}`}
                    className="admin-table__link"
                  >
                    {guest.email}
                  </Link>
                </td>
                <td>{guest.orderCount}</td>
                <td dir="ltr">{(guest.totalSpentCents / 100).toFixed(2)} USD</td>
                <td className="text-[var(--text-muted)]">
                  {new Date(guest.lastOrderAt).toLocaleDateString("en")}
                </td>
                <td className="text-end">
                  <Link
                    href={`/admin/orders/${guest.latestOrderId}`}
                    className="admin-table__action"
                  >
                    Latest order
                  </Link>
                </td>
              </tr>
            ))
          )}
        </AdminDataTable>
      </section>
    </AdminPageShell>
  );
}

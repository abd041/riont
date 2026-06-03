import Link from "next/link";
import { listAdminCustomers } from "@/server/services/admin-customer.service";
import {
  AdminDataTable,
  AdminTableEmpty,
} from "@/features/admin/components/admin-data-table";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";
import {
  AdminPageActions,
  AdminSearchForm,
} from "@/features/admin/components/admin-page-actions";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const customers = await listAdminCustomers(200, q);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Customers"
        description="Registered accounts with order activity and lifetime value."
      />

      <AdminPageActions>
        <AdminSearchForm
          basePath="/admin/customers"
          placeholder="Search by email or name…"
          defaultValue={q}
        />
      </AdminPageActions>

      <AdminDataTable
        columns={["Email", "Name", "Locale", "Orders", "Spent", "Joined"]}
        scrollable
      >
        {customers.length === 0 ? (
          <AdminTableEmpty colSpan={6} message="No customers found." />
        ) : (
          customers.map((customer) => (
            <tr key={customer.id}>
              <td dir="ltr">
                <Link href={`/admin/customers/${customer.id}`} className="admin-table__link">
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
    </AdminPageShell>
  );
}

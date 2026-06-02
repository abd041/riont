import { listAdminCustomers } from "@/server/services/admin-customer.service";
import {
  AdminDataTable,
  AdminTableEmpty,
} from "@/features/admin/components/admin-data-table";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminCustomersPage() {
  const customers = await listAdminCustomers();

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Customers"
        description="Registered accounts with order activity."
      />

      <AdminDataTable
        columns={["Email", "Name", "Locale", "Orders", "Joined"]}
        scrollable
      >
        {customers.length === 0 ? (
          <AdminTableEmpty colSpan={5} message="No customers yet." />
        ) : (
          customers.map((customer) => (
            <tr key={customer.id}>
              <td dir="ltr">{customer.email}</td>
              <td>{customer.displayName ?? "—"}</td>
              <td className="uppercase">{customer.locale}</td>
              <td>{customer.orderCount}</td>
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

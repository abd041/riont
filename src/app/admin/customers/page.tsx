import { listAdminCustomers } from "@/server/services/admin-customer.service";

export default async function AdminCustomersPage() {
  const customers = await listAdminCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Registered accounts with order activity.
        </p>
      </div>

      <div className="glass-card overflow-x-auto rounded-[var(--radius-lg)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Locale</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-muted)]">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-[var(--border-subtle)] last:border-0"
                >
                  <td className="px-4 py-3" dir="ltr">
                    {customer.email}
                  </td>
                  <td className="px-4 py-3">
                    {customer.displayName ?? "—"}
                  </td>
                  <td className="px-4 py-3 uppercase">{customer.locale}</td>
                  <td className="px-4 py-3">{customer.orderCount}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">
                    {new Date(customer.createdAt).toLocaleDateString("en")}
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

import Link from "next/link";
import {
  getTicketStatusLabel,
  getTicketTypeLabel,
} from "@/lib/admin/labels";
import { listAdminTickets } from "@/server/services/support.service";
import type { SupportTicketStatus } from "@/types/support";
import { Badge } from "@/components/ui/badge";
import {
  AdminDataTable,
  AdminTableEmpty,
} from "@/features/admin/components/admin-data-table";
import { AdminFilterPills } from "@/features/admin/components/admin-filter-pills";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

const FILTERS: Array<{ label: string; value?: SupportTicketStatus }> = [
  { label: "All" },
  { label: "Needs your reply", value: "waiting_admin" },
  { label: "Open", value: "open" },
  { label: "Waiting on customer", value: "waiting_customer" },
  { label: "Resolved", value: "resolved" },
];

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const statusFilter = FILTERS.find((f) => f.value === statusParam)?.value;
  const tickets = await listAdminTickets(statusFilter);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Support tickets"
        description="Customer messages and fulfillment threads."
      />

      <AdminFilterPills
        filters={FILTERS}
        activeValue={statusFilter}
        basePath="/admin/tickets"
      />

      <AdminDataTable
        columns={["Ticket", "Subject", "Type", "Status", "Order", "Updated"]}
      >
        {tickets.length === 0 ? (
          <AdminTableEmpty colSpan={6} message="No tickets." />
        ) : (
          tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>
                <Link
                  href={`/admin/tickets/${ticket.id}`}
                  className="admin-table__link"
                  dir="ltr"
                >
                  {ticket.ticketNumber}
                </Link>
              </td>
              <td>{ticket.subject}</td>
              <td className="text-[var(--text-muted)]">
                {getTicketTypeLabel(ticket.ticketType)}
              </td>
              <td>
                <Badge variant="accent">{getTicketStatusLabel(ticket.status)}</Badge>
              </td>
              <td dir="ltr">{ticket.orderNumber ?? "—"}</td>
              <td className="text-[var(--text-muted)]">
                {new Date(ticket.updatedAt).toLocaleString("en")}
              </td>
            </tr>
          ))
        )}
      </AdminDataTable>
    </AdminPageShell>
  );
}

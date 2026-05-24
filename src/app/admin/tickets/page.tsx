import Link from "next/link";
import { listAdminTickets } from "@/server/services/support.service";
import type { SupportTicketStatus } from "@/types/support";
import { Badge } from "@/components/ui/badge";

const FILTERS: Array<{ label: string; status?: SupportTicketStatus }> = [
  { label: "All" },
  { label: "Waiting admin", status: "waiting_admin" },
  { label: "Open", status: "open" },
  { label: "Waiting customer", status: "waiting_customer" },
  { label: "Resolved", status: "resolved" },
];

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const statusFilter = FILTERS.find((f) => f.status === statusParam)?.status;
  const tickets = await listAdminTickets(statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Support tickets</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Customer messages and fulfillment threads.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const href = filter.status
            ? `/admin/tickets?status=${filter.status}`
            : "/admin/tickets";
          const active =
            (filter.status ?? undefined) === (statusFilter ?? undefined);
          return (
            <Link
              key={filter.label}
              href={href}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                active
                  ? "bg-accent-500/20 text-accent-300"
                  : "border border-[var(--border-default)] text-[var(--text-muted)]"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="glass-card overflow-hidden rounded-[var(--radius-lg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <tr>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-muted)]">
                  No tickets.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-[var(--border-subtle)] hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/tickets/${ticket.id}`}
                      className="font-medium text-accent-400 hover:underline"
                      dir="ltr"
                    >
                      {ticket.ticketNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{ticket.subject}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">
                    {ticket.ticketType}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="accent">{ticket.status}</Badge>
                  </td>
                  <td className="px-4 py-3" dir="ltr">
                    {ticket.orderNumber ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">
                    {new Date(ticket.updatedAt).toLocaleString("en")}
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

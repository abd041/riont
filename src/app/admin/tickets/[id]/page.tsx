import { notFound } from "next/navigation";
import Link from "next/link";
import { getTicketById } from "@/server/services/support.service";
import { Badge } from "@/components/ui/badge";
import {
  AdminTicketReplyForm,
  AdminTicketStatusForm,
} from "@/features/admin/components/admin-ticket-actions";
import { MessageAttachments } from "@/features/support/components/message-attachments";

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicketById(id);
  if (!ticket) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/tickets" className="text-sm text-accent-400 hover:underline">
          ← Tickets
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--text-muted)]" dir="ltr">
              {ticket.ticketNumber}
            </p>
            <h1 className="text-2xl font-bold">{ticket.subject}</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {ticket.ticketType}
              {ticket.orderNumber && (
                <>
                  {" "}
                  · Order{" "}
                  <span dir="ltr">{ticket.orderNumber}</span>
                </>
              )}
            </p>
          </div>
          <Badge variant="accent">{ticket.status}</Badge>
        </div>
      </div>

      <div className="glass-card rounded-[var(--radius-lg)] p-6">
        <h2 className="font-semibold">Thread</h2>
        <div className="mt-4 space-y-4">
          {ticket.messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-md p-4 ${
                msg.senderType === "admin"
                  ? "bg-accent-500/10"
                  : "bg-[var(--bg-surface)]"
              }`}
            >
              <p className="text-xs text-[var(--text-muted)]">
                {msg.senderLabel} · {msg.senderType} ·{" "}
                {new Date(msg.createdAt).toLocaleString("en")}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm">{msg.body}</p>
              <MessageAttachments attachments={msg.attachments} />
            </div>
          ))}
        </div>
        <AdminTicketReplyForm ticketId={ticket.id} locale="en" />
      </div>

      <div className="glass-card rounded-[var(--radius-lg)] p-6">
        <h2 className="mb-4 font-semibold">Status</h2>
        <AdminTicketStatusForm ticketId={ticket.id} />
      </div>
    </div>
  );
}

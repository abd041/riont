import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getMessageSenderLabel,
  getTicketStatusLabel,
  getTicketTypeLabel,
} from "@/lib/admin/labels";
import { getTicketById } from "@/server/services/support.service";
import { Badge } from "@/components/ui/badge";
import {
  AdminTicketReplyForm,
  AdminTicketStatusForm,
} from "@/features/admin/components/admin-ticket-actions";
import { MessageAttachments } from "@/features/support/components/message-attachments";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";
import { AdminPanel } from "@/features/admin/components/admin-panel";

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicketById(id);
  if (!ticket) notFound();

  return (
    <AdminPageShell>
      <Link href="/admin/tickets" className="admin-back">
        ← Tickets
      </Link>

      <AdminPageHeader
        title={ticket.subject}
        description={`${getTicketTypeLabel(ticket.ticketType)}${ticket.orderNumber ? ` · Order ${ticket.orderNumber}` : ""}`}
        actions={
          <Badge variant="accent">{getTicketStatusLabel(ticket.status)}</Badge>
        }
      />

      <AdminPanel title="Thread">
        <div className="admin-thread">
          {ticket.messages.map((msg) => (
            <div
              key={msg.id}
              className={`admin-message ${
                msg.senderType === "admin" ? "admin-message--staff" : "admin-message--customer"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.body}</p>
              <MessageAttachments attachments={msg.attachments} />
              <p className="admin-message__meta">
                {msg.senderLabel} · {getMessageSenderLabel(msg.senderType)} ·{" "}
                {new Date(msg.createdAt).toLocaleString("en")}
              </p>
            </div>
          ))}
        </div>
        <AdminTicketReplyForm ticketId={ticket.id} locale="en" />
      </AdminPanel>

      <AdminPanel title="Status">
        <AdminTicketStatusForm ticketId={ticket.id} />
      </AdminPanel>
    </AdminPageShell>
  );
}

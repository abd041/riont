"use client";

import { AdminActionForm } from "./admin-action-form";
import {
  adminReplyTicketAction,
  adminUpdateTicketStatusAction,
} from "@/server/actions/support.actions";
import type { SupportTicketStatus } from "@/types/support";

const STATUS_OPTIONS: SupportTicketStatus[] = [
  "open",
  "waiting_customer",
  "waiting_admin",
  "resolved",
  "closed",
];

export function AdminTicketReplyForm({
  ticketId,
  locale,
}: {
  ticketId: string;
  locale: string;
}) {
  return (
    <AdminActionForm
      action={adminReplyTicketAction}
      submitLabel="Send reply"
      className="mt-4 space-y-4"
      multipart
    >
      <input type="hidden" name="ticketId" value={ticketId} />
      <input type="hidden" name="locale" value={locale} />
      <textarea
        name="body"
        required
        rows={4}
        placeholder="Reply to customer…"
        className="flex w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-glow)] focus:outline-none"
      />
      <div>
        <label className="text-sm text-[var(--text-muted)]">Attachment (optional)</label>
        <input
          type="file"
          name="attachment"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="mt-1 block w-full text-sm text-[var(--text-muted)] file:me-3 file:rounded-md file:border-0 file:bg-accent-500/15 file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent-300"
        />
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          JPG, PNG, WebP, or PDF — max 5MB
        </p>
      </div>
    </AdminActionForm>
  );
}

export function AdminTicketStatusForm({ ticketId }: { ticketId: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((status) => (
        <AdminActionForm
          key={status}
          action={adminUpdateTicketStatusAction}
          submitLabel={status.replace(/_/g, " ")}
          variant="outline"
        >
          <input type="hidden" name="ticketId" value={ticketId} />
          <input type="hidden" name="status" value={status} />
        </AdminActionForm>
      ))}
    </div>
  );
}

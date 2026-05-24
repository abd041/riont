"use client";

import { SupportActionForm } from "./support-action-form";
import { replyTicketAction } from "@/server/actions/support.actions";

export function TicketReplyForm({
  locale,
  ticketNumber,
  placeholder,
  submitLabel,
  attachmentLabel,
  attachmentHint,
}: {
  locale: string;
  ticketNumber: string;
  placeholder: string;
  submitLabel: string;
  attachmentLabel: string;
  attachmentHint: string;
}) {
  return (
    <SupportActionForm action={replyTicketAction} submitLabel={submitLabel}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="ticketNumber" value={ticketNumber} />
      <textarea
        name="body"
        required
        rows={4}
        placeholder={placeholder}
        className="flex w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-glow)] focus:outline-none"
      />
      <div>
        <label className="text-sm text-[var(--text-muted)]">{attachmentLabel}</label>
        <input
          type="file"
          name="attachment"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="mt-1 block w-full text-sm text-[var(--text-muted)] file:me-3 file:rounded-md file:border-0 file:bg-accent-500/15 file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent-300"
        />
        <p className="mt-1 text-xs text-[var(--text-muted)]">{attachmentHint}</p>
      </div>
    </SupportActionForm>
  );
}

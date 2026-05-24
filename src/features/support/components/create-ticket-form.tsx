"use client";

import { Input } from "@/components/ui/input";
import { SupportActionForm } from "./support-action-form";
import { createTicketAction } from "@/server/actions/support.actions";

export function CreateTicketForm({
  locale,
  orderId,
  defaultSubject,
  labels,
}: {
  locale: string;
  orderId?: string;
  defaultSubject?: string;
  labels: {
    subject: string;
    message: string;
    submit: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    attachment: string;
    attachmentHint: string;
  };
}) {
  return (
    <SupportActionForm action={createTicketAction} submitLabel={labels.submit}>
      <input type="hidden" name="locale" value={locale} />
      {orderId && <input type="hidden" name="orderId" value={orderId} />}
      <input type="hidden" name="ticketType" value={orderId ? "order_issue" : "general"} />
      <div>
        <label className="text-sm text-[var(--text-muted)]">{labels.subject}</label>
        <Input
          name="subject"
          required
          minLength={3}
          defaultValue={defaultSubject}
          placeholder={labels.subjectPlaceholder}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm text-[var(--text-muted)]">{labels.message}</label>
        <textarea
          name="body"
          required
          rows={5}
          placeholder={labels.messagePlaceholder}
          className="mt-1 flex w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-glow)] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-sm text-[var(--text-muted)]">{labels.attachment}</label>
        <input
          type="file"
          name="attachment"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="mt-1 block w-full text-sm text-[var(--text-muted)] file:me-3 file:rounded-md file:border-0 file:bg-accent-500/15 file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent-300"
        />
        <p className="mt-1 text-xs text-[var(--text-muted)]">{labels.attachmentHint}</p>
      </div>
    </SupportActionForm>
  );
}

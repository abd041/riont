import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSession } from "@/server/services/auth.service";
import { getTicketByNumber } from "@/server/services/support.service";
import { TicketReplyForm } from "@/features/support/components/ticket-reply-form";
import { MessageAttachments } from "@/features/support/components/message-attachments";
import { Badge } from "@/components/ui/badge";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ locale: string; ticketNumber: string }>;
}) {
  const { locale, ticketNumber } = await params;
  const user = await getSession();
  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/support/tickets/${ticketNumber}`);
  }

  const ticket = await getTicketByNumber({
    ticketNumber,
    userId: user.id,
  });

  if (!ticket) notFound();

  const t = await getTranslations("support");

  return (
    <div className="mx-auto max-w-content space-y-6">
      <div>
        <Link
          href="/support"
          className="text-sm text-accent-400 hover:underline"
        >
          {t("backToSupport")}
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--text-muted)]" dir="ltr">
              {ticket.ticketNumber}
            </p>
            <h1 className="text-2xl font-bold">{ticket.subject}</h1>
            {ticket.orderNumber && (
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {t("linkedOrder")}:{" "}
                <span dir="ltr">{ticket.orderNumber}</span>
              </p>
            )}
          </div>
          <Badge variant="accent">{t(`status.${ticket.status}`)}</Badge>
        </div>
      </div>

      <div className="glass-card space-y-4 rounded-[var(--radius-lg)] p-6">
        {ticket.messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-md p-4 ${
              msg.senderType === "customer"
                ? "bg-accent-500/10 ms-8"
                : "bg-[var(--bg-surface)] me-8"
            }`}
          >
            <p className="text-xs font-medium text-[var(--text-muted)]">
              {msg.senderLabel} ·{" "}
              {new Date(msg.createdAt).toLocaleString(locale)}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{msg.body}</p>
            <MessageAttachments attachments={msg.attachments} />
          </div>
        ))}
      </div>

      {ticket.status !== "closed" && (
        <div className="glass-card rounded-[var(--radius-lg)] p-6">
          <h2 className="font-semibold">{t("reply")}</h2>
          <TicketReplyForm
            locale={locale}
            ticketNumber={ticket.ticketNumber}
            placeholder={t("replyPlaceholder")}
            submitLabel={t("sendReply")}
            attachmentLabel={t("attachment")}
            attachmentHint={t("attachmentHint")}
          />
        </div>
      )}
    </div>
  );
}

import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/server/services/auth.service";
import { getTicketByNumber } from "@/server/services/support.service";
import { TicketReplyForm } from "@/features/support/components/ticket-reply-form";
import { MessageAttachments } from "@/features/support/components/message-attachments";
import { Badge } from "@/components/ui/badge";
import {
  PremiumPanel,
  StorefrontPageHeader,
  StorefrontPageShell,
} from "@/components/shared";

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
    <StorefrontPageShell>
      <StorefrontPageHeader
        title={ticket.subject}
        subtitle={ticket.ticketNumber}
        backHref="/support"
        backLabel={t("backToSupport")}
        actions={<Badge variant="accent">{t(`status.${ticket.status}`)}</Badge>}
      />

      {ticket.orderNumber && (
        <p className="text-sm text-[var(--text-muted)]">
          {t("linkedOrder")}: <span dir="ltr">{ticket.orderNumber}</span>
        </p>
      )}

      <PremiumPanel>
        <div className="sf-thread">
          {ticket.messages.map((msg) => (
            <div
              key={msg.id}
              className={`sf-message ${
                msg.senderType === "customer" ? "sf-message--user" : "sf-message--staff"
              }`}
            >
              <p>{msg.body}</p>
              <MessageAttachments attachments={msg.attachments} />
              <p className="sf-message__meta">
                {msg.senderLabel} · {new Date(msg.createdAt).toLocaleString(locale)}
              </p>
            </div>
          ))}
        </div>
      </PremiumPanel>

      {ticket.status !== "closed" && (
        <PremiumPanel title={t("reply")}>
          <TicketReplyForm
            locale={locale}
            ticketNumber={ticket.ticketNumber}
            placeholder={t("replyPlaceholder")}
            submitLabel={t("sendReply")}
            attachmentLabel={t("attachment")}
            attachmentHint={t("attachmentHint")}
          />
        </PremiumPanel>
      )}
    </StorefrontPageShell>
  );
}

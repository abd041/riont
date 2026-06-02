import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Headphones } from "lucide-react";
import { getSession } from "@/server/services/auth.service";
import { listCustomerTickets } from "@/server/services/support.service";
import { CreateTicketForm } from "@/features/support/components/create-ticket-form";
import { Badge } from "@/components/ui/badge";
import {
  PremiumPanel,
  StorefrontPageHeader,
  StorefrontPageShell,
} from "@/components/shared";

export default async function SupportPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale } = await params;
  const { order: orderNumberQuery } = await searchParams;
  const t = await getTranslations("support");
  const tNav = await getTranslations("nav");
  const user = await getSession();
  const tickets = user ? await listCustomerTickets(user.id) : [];

  let linkedOrderId: string | undefined;
  if (user && orderNumberQuery) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    const { data } = await admin
      .from("orders")
      .select("id")
      .eq("order_number", orderNumberQuery)
      .eq("user_id", user.id)
      .maybeSingle();
    linkedOrderId = (data as { id: string } | null)?.id;
  }

  return (
    <StorefrontPageShell>
      <StorefrontPageHeader
        title={t("title")}
        subtitle={t("description")}
        backHref="/products"
        backLabel={tNav("browse")}
      />

      {!user ? (
        <PremiumPanel>
          <div className="sf-empty">
            <div className="sf-empty__icon">
              <Headphones strokeWidth={1.5} />
            </div>
            <p className="sf-empty__desc">{t("signInRequired")}</p>
            <div className="sf-empty__action">
              <Link href={`/login?next=/${locale}/support`} className="sf-btn-primary">
                {t("signIn")}
              </Link>
            </div>
          </div>
        </PremiumPanel>
      ) : (
        <>
          <PremiumPanel title={t("newTicket")}>
            <CreateTicketForm
              locale={locale}
              orderId={linkedOrderId}
              defaultSubject={
                orderNumberQuery ? `Order ${orderNumberQuery}` : undefined
              }
              labels={{
                subject: t("subject"),
                message: t("message"),
                submit: t("submitTicket"),
                subjectPlaceholder: t("subjectPlaceholder"),
                messagePlaceholder: t("messagePlaceholder"),
                attachment: t("attachment"),
                attachmentHint: t("attachmentHint"),
              }}
            />
          </PremiumPanel>

          <PremiumPanel title={t("yourTickets")}>
            {tickets.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">{t("noTickets")}</p>
            ) : (
              <ul className="sf-ticket-list">
                {tickets.map((ticket) => (
                  <li key={ticket.id} className="sf-ticket-card">
                    <div>
                      <Link
                        href={`/support/tickets/${ticket.ticketNumber}`}
                        className="sf-ticket-card__link"
                        dir="ltr"
                      >
                        {ticket.ticketNumber}
                      </Link>
                      <p className="mt-1 text-sm text-[var(--text-primary)]">{ticket.subject}</p>
                      {ticket.lastMessagePreview && (
                        <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-1">
                          {ticket.lastMessagePreview}
                        </p>
                      )}
                    </div>
                    <Badge variant="accent">{t(`status.${ticket.status}`)}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </PremiumPanel>
        </>
      )}
    </StorefrontPageShell>
  );
}

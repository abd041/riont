import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSession } from "@/server/services/auth.service";
import { listCustomerTickets } from "@/server/services/support.service";
import { CreateTicketForm } from "@/features/support/components/create-ticket-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div className="mx-auto max-w-content space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-[var(--text-secondary)]">{t("description")}</p>
      </div>

      {!user ? (
        <div className="glass-card rounded-[var(--radius-lg)] p-8">
          <p className="text-[var(--text-secondary)]">{t("signInRequired")}</p>
          <Button className="mt-4" asChild>
            <Link href={`/login?next=/${locale}/support`}>{t("signIn")}</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="glass-card rounded-[var(--radius-lg)] p-6">
            <h2 className="font-semibold">{t("newTicket")}</h2>
            <div className="mt-4">
              <CreateTicketForm
                locale={locale}
                orderId={linkedOrderId}
                defaultSubject={
                  orderNumberQuery
                    ? `Order ${orderNumberQuery}`
                    : undefined
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
            </div>
          </div>

          <div className="glass-card rounded-[var(--radius-lg)] p-6">
            <h2 className="font-semibold">{t("yourTickets")}</h2>
            {tickets.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--text-muted)]">{t("noTickets")}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {tickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <Link
                        href={`/support/tickets/${ticket.ticketNumber}`}
                        className="font-medium text-accent-400 hover:underline"
                        dir="ltr"
                      >
                        {ticket.ticketNumber}
                      </Link>
                      <p className="text-sm">{ticket.subject}</p>
                      {ticket.lastMessagePreview && (
                        <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                          {ticket.lastMessagePreview}
                        </p>
                      )}
                    </div>
                    <Badge variant="accent">{t(`status.${ticket.status}`)}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

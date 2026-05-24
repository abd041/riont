import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderAmount, OrderSummaryPricing } from "./order-amount";
import type { CustomerOrder } from "@/types/order";
import type { OrderStatus } from "@/lib/domain/enums";

export async function OrderDetailView({
  order,
  locale,
  showGuestTokenHint,
  showSupportLink,
}: {
  order: CustomerOrder;
  locale: string;
  showGuestTokenHint?: boolean;
  showSupportLink?: boolean;
}) {
  const t = await getTranslations("orders");
  const tSupport = await getTranslations("support");
  const statusLabel = t(`status.${order.status as OrderStatus}`);

  return (
    <div className="mx-auto max-w-content space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--text-muted)]">{t("orderNumber")}</p>
          <h1 className="text-2xl font-bold" dir="ltr">
            {order.orderNumber}
          </h1>
        </div>
        <OrderStatusBadge status={order.status} label={statusLabel} />
      </div>

      {showGuestTokenHint && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {t("guestTokenHint")}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="glass-card rounded-[var(--radius-lg)] p-6">
            <h2 className="font-semibold">{t("items")}</h2>
            <ul className="mt-4 space-y-3">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="space-y-3 border-b border-[var(--border-subtle)] pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {t("qty", { count: item.quantity })} · {item.deliveryMode}
                      </p>
                    </div>
                    <OrderAmount
                      cents={item.unitPriceCents * item.quantity}
                      className="text-accent-400"
                    />
                  </div>
                  {item.deliveryContent && (
                    <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3">
                      <p className="text-xs font-medium text-emerald-300">
                        {t("delivery")}
                      </p>
                      <pre
                        className="mt-2 whitespace-pre-wrap break-all text-xs text-[var(--text-primary)]"
                        dir="ltr"
                      >
                        {item.deliveryContent}
                      </pre>
                      <p className="mt-2 text-xs text-[var(--text-muted)]">
                        {t("deliveryHint")}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {order.fields.length > 0 && (
            <div className="glass-card rounded-[var(--radius-lg)] p-6">
              <h2 className="font-semibold">{t("yourFields")}</h2>
              <dl className="mt-4 space-y-3">
                {order.fields.map((field) => (
                  <div key={field.fieldKey}>
                    <dt className="text-xs text-[var(--text-muted)]">{field.label}</dt>
                    <dd className="text-sm" dir={field.isSensitive ? "ltr" : undefined}>
                      {field.displayValue}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="glass-card rounded-[var(--radius-lg)] p-6">
            <h2 className="font-semibold">{t("timeline")}</h2>
            <ol className="mt-4 space-y-4">
              {order.timeline.map((event, i) => (
                <li key={`${event.createdAt}-${i}`} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-500" />
                  <div>
                    <p className="text-sm font-medium">
                      {t(`status.${event.toStatus as OrderStatus}`)}
                    </p>
                    {event.note && (
                      <p className="text-xs text-[var(--text-muted)]">{event.note}</p>
                    )}
                    <p className="text-xs text-[var(--text-muted)]">
                      {new Date(event.createdAt).toLocaleString(locale)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-[var(--radius-lg)] p-6">
            <h2 className="font-semibold">{t("summary")}</h2>
            <OrderSummaryPricing
              subtotalCents={order.subtotalCents}
              discountCents={order.discountCents}
              totalCents={order.totalCents}
              labels={{
                subtotal: t("subtotal"),
                discount: t("discount"),
                total: t("total"),
              }}
            />
          </div>

          {order.paymentInstructions && (
            <div className="glass-card rounded-[var(--radius-lg)] p-6">
              <h2 className="font-semibold">{t("paymentInstructions")}</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {order.paymentInstructions}
              </p>
            </div>
          )}

          {showSupportLink && (
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/support?order=${encodeURIComponent(order.orderNumber)}`}>
                {tSupport("reportIssue")}
              </Link>
            </Button>
          )}

          <Button variant="secondary" className="w-full" asChild>
            <Link href="/products">{t("continueShopping")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

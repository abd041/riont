import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderAmount, OrderSummaryPricing } from "./order-amount";
import {
  PremiumPanel,
  StorefrontPageHeader,
  StorefrontPageShell,
} from "@/components/shared";
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
    <StorefrontPageShell>
      <StorefrontPageHeader
        title={order.orderNumber}
        subtitle={t("orderNumber")}
        backHref="/account/orders"
        backLabel={t("myOrders")}
        actions={<OrderStatusBadge status={order.status} label={statusLabel} />}
      />

      {showGuestTokenHint && (
        <div className="sf-alert sf-alert--warning">{t("guestTokenHint")}</div>
      )}

      <div className="sf-order-layout">
        <div className="space-y-5">
          <PremiumPanel title={t("items")}>
            <ul className="space-y-4">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="space-y-3 border-b border-[var(--border-subtle)] pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{item.productName}</p>
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
                    <div className="sf-delivery-box">
                      <p className="sf-delivery-box__label">{t("delivery")}</p>
                      <pre className="sf-delivery-box__content" dir="ltr">
                        {item.deliveryContent}
                      </pre>
                      <p className="mt-2 text-xs text-[var(--text-muted)]">{t("deliveryHint")}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </PremiumPanel>

          {order.fields.length > 0 && (
            <PremiumPanel title={t("yourFields")}>
              <dl className="space-y-3">
                {order.fields.map((field) => (
                  <div key={field.fieldKey}>
                    <dt className="text-xs text-[var(--text-muted)]">{field.label}</dt>
                    <dd className="text-sm" dir={field.isSensitive ? "ltr" : undefined}>
                      {field.displayValue}
                    </dd>
                  </div>
                ))}
              </dl>
            </PremiumPanel>
          )}

          <PremiumPanel title={t("timeline")}>
            <ol className="sf-timeline">
              {order.timeline.map((event, i) => (
                <li key={`${event.createdAt}-${i}`} className="sf-timeline__item">
                  <span
                    className={`sf-timeline__dot ${
                      i === order.timeline.length - 1 ? "sf-timeline__dot--done" : ""
                    }`}
                    aria-hidden
                  />
                  <div>
                    <p className="sf-timeline__label">
                      {t(`status.${event.toStatus as OrderStatus}`)}
                    </p>
                    {event.note && (
                      <p className="text-xs text-[var(--text-muted)]">{event.note}</p>
                    )}
                    <p className="sf-timeline__time">
                      {new Date(event.createdAt).toLocaleString(locale)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </PremiumPanel>
        </div>

        <aside className="space-y-4">
          <PremiumPanel title={t("summary")}>
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
          </PremiumPanel>

          {order.paymentInstructions && (
            <PremiumPanel title={t("paymentInstructions")}>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                {order.paymentInstructions}
              </p>
            </PremiumPanel>
          )}

          {showSupportLink && (
            <Link
              href={`/support?order=${encodeURIComponent(order.orderNumber)}`}
              className="sf-btn-outline w-full"
            >
              {tSupport("reportIssue")}
            </Link>
          )}

          <Link href="/products" className="sf-btn-primary w-full">
            {t("continueShopping")}
          </Link>
        </aside>
      </div>
    </StorefrontPageShell>
  );
}

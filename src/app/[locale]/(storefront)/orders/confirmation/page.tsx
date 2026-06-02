import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OrderStatus } from "@/lib/domain/enums";
import { CheckoutTrustBadges } from "@/features/checkout/components/checkout-trust-badges";
import {
  OrderStatusHero,
} from "@/features/orders/components/order-status-hero";
import { PremiumPanel, StorefrontPageShell } from "@/components/shared";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string; token?: string }>;
}) {
  await params;
  const { order: orderNumber, token } = await searchParams;
  const t = await getTranslations("orders.confirmation");
  const tOrders = await getTranslations("orders");
  const status = OrderStatus.PENDING_REVIEW;

  if (!orderNumber) {
    return (
      <StorefrontPageShell variant="narrow">
        <PremiumPanel>
          <div className="sf-empty">
            <p className="sf-empty__desc">{t("missing")}</p>
            <div className="sf-empty__action">
              <Link href="/products" className="sf-btn-primary">
                {t("browse")}
              </Link>
            </div>
          </div>
        </PremiumPanel>
      </StorefrontPageShell>
    );
  }

  const orderHref = token
    ? `/orders/${orderNumber}?token=${encodeURIComponent(token)}`
    : `/orders/${orderNumber}`;

  return (
    <StorefrontPageShell variant="narrow">
      <OrderStatusHero
        status={status}
        statusLabel={tOrders(`status.${status}`)}
        headline={t("title")}
        description={t("subtitle")}
        stepsLabel={t("stepsLabel")}
        steps={{
          submitted: t("stepSubmitted"),
          payment: t("stepPayment"),
          delivery: t("stepDelivery"),
        }}
      />

      <PremiumPanel>
        <div className="sf-success sf-success--compact">
          <p className="sf-success__meta">{t("orderLabel")}</p>
          <p className="sf-success__value" dir="ltr">
            {orderNumber}
          </p>

          {token && (
            <p className="sf-alert sf-alert--warning sf-success__hint">{t("saveLink")}</p>
          )}

          <p className="sf-success__next">{t("whatNext")}</p>

          <div className="sf-success__actions">
            <Link href={orderHref} className="sf-btn-primary">
              {t("viewOrder")}
            </Link>
            <Link href="/products" className="sf-btn-outline">
              {t("continueShopping")}
            </Link>
          </div>

          <div className="sf-confirmation-trust">
            <CheckoutTrustBadges />
          </div>
        </div>
      </PremiumPanel>
    </StorefrontPageShell>
  );
}

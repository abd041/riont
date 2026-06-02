import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckCircle2 } from "lucide-react";
import {
  PremiumPanel,
  StorefrontPageShell,
} from "@/components/shared";

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
      <PremiumPanel>
        <div className="sf-success">
          <div className="sf-success__icon">
            <CheckCircle2 strokeWidth={1.5} />
          </div>
          <h1 className="sf-success__title">{t("title")}</h1>
          <p className="sf-success__subtitle">{t("subtitle")}</p>
          <p className="sf-success__meta">{t("orderLabel")}</p>
          <p className="sf-success__value" dir="ltr">
            {orderNumber}
          </p>
          {token && (
            <p className="sf-alert sf-alert--warning" style={{ marginTop: 8, width: "100%" }}>
              {t("saveLink")}
            </p>
          )}
          <div className="sf-success__actions">
            <Link href={orderHref} className="sf-btn-primary">
              {t("viewOrder")}
            </Link>
            <Link href="/products" className="sf-btn-outline">
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      </PremiumPanel>
    </StorefrontPageShell>
  );
}

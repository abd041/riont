import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

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
      <div className="mx-auto max-w-content py-12 text-center">
        <p className="text-[var(--text-muted)]">{t("missing")}</p>
        <Button className="mt-6" asChild>
          <Link href="/products">{t("browse")}</Link>
        </Button>
      </div>
    );
  }

  const orderHref = token
    ? `/orders/${orderNumber}?token=${encodeURIComponent(token)}`
    : `/orders/${orderNumber}`;

  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <div className="glass-card rounded-[var(--radius-lg)] p-10">
        <h1 className="text-2xl font-bold text-emerald-400">{t("title")}</h1>
        <p className="mt-3 text-[var(--text-secondary)]">{t("subtitle")}</p>
        <p className="mt-4 text-sm text-[var(--text-muted)]">{t("orderLabel")}</p>
        <p className="text-xl font-semibold" dir="ltr">
          {orderNumber}
        </p>
        {token && (
          <p className="mt-4 text-sm text-amber-200/90">{t("saveLink")}</p>
        )}
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild size="lg">
            <Link href={orderHref}>{t("viewOrder")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">{t("continueShopping")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

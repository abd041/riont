import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CartCheckoutPageClient } from "@/features/cart/components/cart-checkout-page";
import { getPaymentInstructions } from "@/server/services/site-settings.service";
import { getSession } from "@/server/services/auth.service";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    locale,
    path: "/cart/checkout",
    title: `${t("checkoutTitle")} | ${tCommon("brand")}`,
    description: t("checkoutSubtitle"),
  });
}

export default async function CartCheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getSession();
  const paymentInstructions = await getPaymentInstructions(locale);

  return (
    <CartCheckoutPageClient
      locale={locale}
      paymentInstructions={paymentInstructions}
      isLoggedIn={Boolean(user)}
      userEmail={user?.email}
    />
  );
}

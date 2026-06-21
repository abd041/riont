import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { getProductForCheckout } from "@/server/services/product.service";
import { getPaymentInstructions } from "@/server/services/site-settings.service";
import { getSession } from "@/server/services/auth.service";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    locale,
    path: `/products/${slug}/checkout`,
    title: `${t("title")} | ${tCommon("brand")}`,
    description: t("secureSubtitle"),
  });
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const { slug, locale } = await params;
  const { variant: variantId } = await searchParams;
  const product = await getProductForCheckout(locale, slug, variantId);
  const user = await getSession();

  if (!product) notFound();

  const paymentInstructions = await getPaymentInstructions(locale);

  return (
    <CheckoutForm
      product={product}
      locale={locale}
      paymentInstructions={paymentInstructions}
      isLoggedIn={Boolean(user)}
      userEmail={user?.email}
    />
  );
}

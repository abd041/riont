import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CartPage } from "@/features/cart/components/cart-page";
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
    path: "/cart",
    title: `${t("title")} | ${tCommon("brand")}`,
    description: t("metaDescription"),
  });
}

export default function CartRoutePage() {
  return <CartPage />;
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WishlistPage } from "@/features/wishlist/components/wishlist-page";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wishlist" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    locale,
    path: "/wishlist",
    title: `${t("title")} | ${tCommon("brand")}`,
    description: t("metaDescription"),
  });
}

export default function WishlistRoutePage() {
  return <WishlistPage />;
}

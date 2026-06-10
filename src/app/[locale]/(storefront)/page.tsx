import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { HeroSection, HomeMarketplace } from "@/features/homepage";
import { HomePromoBanner } from "@/features/homepage/components/home-promo-banner";
import { MarketplacePageShell } from "@/features/homepage/components/marketplace/marketplace-page-shell";
import { listHomepageProducts } from "@/server/services/product.service";
import { listCategories } from "@/server/services/category.service";
import { listFeaturedReviews } from "@/server/services/review.service";
import { getHomePageContent } from "@/server/services/content-block.service";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    locale,
    path: "/",
    title: t("brand"),
    description:
      locale === "ar"
        ? "سوق رقمي مميز — منتجات رقمية، تسليم سريع، دعم موثوق."
        : "Premium digital marketplace — instant delivery, trusted support, best quality.",
  });
}

export default async function HomePage() {
  const locale = await getLocale();
  const [products, categories, homeContent, featuredReviews] = await Promise.all([
    listHomepageProducts(locale),
    listCategories(locale),
    getHomePageContent(locale),
    listFeaturedReviews(locale, 6),
  ]);

  return (
    <MarketplacePageShell>
      <HomePromoBanner />
      <HeroSection content={homeContent.hero} compact />
      <HomeMarketplace
        products={products}
        categories={categories}
        featuredReviews={featuredReviews}
      />
    </MarketplacePageShell>
  );
}

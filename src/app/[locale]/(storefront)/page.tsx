import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroSection } from "@/features/home/components/hero-section";
import { HomeCategoryRow } from "@/features/home/components/home-category-row";
import { HomeProductCard } from "@/features/home/components/home-product-card";
import { HomeRightSidebar } from "@/features/home/components/home-right-sidebar";
import { HomeMotionSection } from "@/features/home/motion/home-motion-section";
import { HomeMotionStagger } from "@/features/home/motion/home-motion-stagger";
import { listFeaturedProducts } from "@/server/services/product.service";
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
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const [products, homeContent] = await Promise.all([
    listFeaturedProducts(locale),
    getHomePageContent(locale),
  ]);

  return (
    <div className="nex-home-layout mx-auto flex w-full max-w-[1440px]">
      <div className="nex-home-main min-w-0 flex-1">
        <HeroSection content={homeContent.hero} />
        <HomeCategoryRow />

        <HomeMotionSection className="nex-featured-section" delay={0.06}>
          <div className="nex-featured-header">
            <h2 className="nex-featured-title">{t("featuredProducts")}</h2>
            <Link href="/products" className="nex-featured-view-all">
              {tCommon("viewAll")}
            </Link>
          </div>
          <HomeMotionStagger className="nex-featured-grid">
            {products.slice(0, 5).map((product) => (
              <HomeProductCard key={product.slug} {...product} />
            ))}
          </HomeMotionStagger>
        </HomeMotionSection>
      </div>

      <HomeRightSidebar />
    </div>
  );
}

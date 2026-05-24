import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroSection } from "@/features/home/components/hero-section";
import { TrustBar } from "@/features/home/components/trust-bar";
import { PopularCategories } from "@/features/home/components/popular-categories";
import { ProductCard } from "@/features/catalog/components/product-card";
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
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <HeroSection content={homeContent.hero} />
      <TrustBar content={homeContent.trust} />
      <PopularCategories />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("featuredProducts")}</h2>
          <Link
            href="/products"
            className="text-sm text-accent-400 hover:text-accent-500"
          >
            {tCommon("viewAll")} →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
      </section>
    </div>
  );
}

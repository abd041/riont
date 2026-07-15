"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Zap } from "lucide-react";
import type { CatalogCategory, CatalogProduct } from "@/types/catalog";
import type { ProductReview } from "@/server/services/review.service";
import type { TrustBlockContent } from "@/server/services/content-block.service";
import type { HomepageExtras } from "@/lib/site/homepage-extras";
import {
  localizedPathCards,
  localizedStatsItems,
  localizedStatusItems,
} from "@/lib/site/homepage-extras";
import {
  buildHomeProductRows,
  isInstantDeliveryProduct,
  resolveRiyontPicks,
} from "@/features/homepage/lib/home-product-rows";
import { useHomeCategoryFilter } from "@/hooks/use-ui-store";
import { CategorySlider } from "@/features/categories/components/category-slider";
import { StickyCategoryBar } from "@/features/categories/components/sticky-category-bar";
import { ProductRowSection } from "./sections/product-row-section";
import { FilteredProductsSection } from "./sections/filtered-products-section";
import { MarketplaceTrustSection } from "./sections/marketplace-trust-section";
import { MarketplaceReviewsSection } from "./sections/marketplace-reviews-section";
import { MarketplaceFooter } from "./marketplace/marketplace-footer";
import { LiveStoreStatus } from "./live-store-status";
import { HomeTrustStrip } from "./home-trust-strip";
import { HomeStatsStrip } from "./home-stats-strip";
import { PickYourPath } from "./pick-your-path";
import { RiyontPicks } from "./riyont-picks";
import { HomeSupportCue } from "./home-support-cue";
import { cn } from "@/utils/cn";

type HomeMarketplaceProps = {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  featuredReviews?: ProductReview[];
  locale: string;
  isLoggedIn: boolean;
  userEmail?: string | null;
  userDisplayName?: string | null;
  trustContent?: TrustBlockContent | null;
  homepageExtras: HomepageExtras;
};

export function HomeMarketplace({
  products,
  categories,
  featuredReviews = [],
  locale,
  isLoggedIn,
  userEmail,
  userDisplayName,
  trustContent,
  homepageExtras,
}: HomeMarketplaceProps) {
  const t = useTranslations("home");
  const searchParams = useSearchParams();
  const { activeSlug, setActiveSlug } = useHomeCategoryFilter();
  const [instantOnly, setInstantOnly] = useState(
    searchParams.get("filter") === "instant",
  );

  useEffect(() => {
    setInstantOnly(searchParams.get("filter") === "instant");
  }, [searchParams]);

  const rows = useMemo(
    () =>
      buildHomeProductRows(products, {
        mostRequestedIds: homepageExtras.mostRequestedIds,
      }),
    [products, homepageExtras.mostRequestedIds],
  );

  const mostRequestedIds = useMemo(
    () =>
      rows.mostRequested
        .map((p) => p.id)
        .filter((id): id is string => Boolean(id)),
    [rows.mostRequested],
  );

  const riyontPicks = useMemo(
    () =>
      resolveRiyontPicks(
        products,
        homepageExtras.riyontPicks,
        locale,
        mostRequestedIds,
      ),
    [products, homepageExtras.riyontPicks, locale, mostRequestedIds],
  );

  const filteredProducts = useMemo(() => {
    let list = products;
    if (activeSlug) {
      list = list.filter(
        (p) => p.categorySlug?.toLowerCase() === activeSlug.toLowerCase(),
      );
    }
    if (instantOnly) {
      list = list.filter(isInstantDeliveryProduct);
    }
    return list;
  }, [products, activeSlug, instantOnly]);

  const categoryTitle = activeSlug
    ? categories.find((c) => c.slug === activeSlug)?.name
    : undefined;

  const categorySentinelRef = useRef<HTMLDivElement>(null);
  const [stickyCategories, setStickyCategories] = useState(false);

  useEffect(() => {
    const sentinel = categorySentinelRef.current;
    if (!sentinel) return;

    const topbarOffset =
      Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--mp-topbar-h"),
        10,
      ) || 52;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStickyCategories(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `-${topbarOffset}px 0px 0px 0px`,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [categories.length]);

  const statusItems = localizedStatusItems(homepageExtras, locale);
  const statsItems = localizedStatsItems(homepageExtras, locale);
  const pathCards = localizedPathCards(homepageExtras, locale);

  return (
    <div className="mp-sections mp-sections--storefront-home">
      {homepageExtras.liveStatusEnabled ? (
        <LiveStoreStatus items={statusItems} ariaLabel={t("liveStatusLabel")} />
      ) : null}

      {homepageExtras.trustStripEnabled ? (
        <HomeTrustStrip content={trustContent} />
      ) : null}

      {homepageExtras.statsEnabled ? (
        <HomeStatsStrip items={statsItems} ariaLabel={t("statsStripLabel")} />
      ) : null}

      <PickYourPath cards={pathCards} />
      <HomeSupportCue />

      <ProductRowSection
        products={rows.mostRequested}
        titleKey="mostRequested"
        variant="featured"
        delay={0}
      />

      <RiyontPicks picks={riyontPicks} />

      <HomeSupportCue />

      {homepageExtras.showInstantFilter ? (
        <div className="mp-instant-filter" role="group" aria-label={t("instantFilterLabel")}>
          <button
            type="button"
            className={cn(
              "mp-instant-filter__chip",
              !instantOnly && "mp-instant-filter__chip--active",
            )}
            onClick={() => setInstantOnly(false)}
          >
            {t("filterAll")}
          </button>
          <button
            type="button"
            className={cn(
              "mp-instant-filter__chip",
              instantOnly && "mp-instant-filter__chip--active",
            )}
            onClick={() => setInstantOnly(true)}
          >
            <Zap strokeWidth={1.5} aria-hidden width={14} height={14} />
            {t("filterInstant")}
          </button>
        </div>
      ) : null}

      <CategorySlider
        categories={categories}
        activeSlug={activeSlug}
        onSelect={setActiveSlug}
        variant="primary"
      />

      <div ref={categorySentinelRef} className="mp-cat-sentinel" aria-hidden />

      <StickyCategoryBar
        mode="home"
        categories={categories}
        activeSlug={activeSlug}
        onSelect={setActiveSlug}
        visible={stickyCategories}
      />

      <FilteredProductsSection
        products={filteredProducts}
        activeCategorySlug={activeSlug}
        categoryTitle={
          instantOnly
            ? categoryTitle
              ? `${categoryTitle} · ${t("filterInstant")}`
              : t("filterInstant")
            : categoryTitle
        }
        variant="primary"
      />

      <MarketplaceTrustSection />
      <MarketplaceReviewsSection
        reviews={featuredReviews}
        locale={locale}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        userDisplayName={userDisplayName}
      />
      <MarketplaceFooter />
    </div>
  );
}

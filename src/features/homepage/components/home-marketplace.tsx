"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CatalogCategory, CatalogProduct } from "@/types/catalog";
import type { ProductReview } from "@/server/services/review.service";
import { buildHomeProductRows } from "@/features/homepage/lib/home-product-rows";
import { useHomeCategoryFilter } from "@/hooks/use-ui-store";
import { CategorySlider } from "@/features/categories/components/category-slider";
import { StickyCategoryBar } from "@/features/categories/components/sticky-category-bar";
import { ProductRowSection } from "./sections/product-row-section";
import { FilteredProductsSection } from "./sections/filtered-products-section";
import { MarketplaceTrustSection } from "./sections/marketplace-trust-section";
import { MarketplaceReviewsSection } from "./sections/marketplace-reviews-section";
import { MarketplaceFooter } from "./marketplace/marketplace-footer";

type HomeMarketplaceProps = {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  featuredReviews?: ProductReview[];
};

export function HomeMarketplace({
  products,
  categories,
  featuredReviews = [],
}: HomeMarketplaceProps) {
  const { activeSlug, setActiveSlug } = useHomeCategoryFilter();

  const rows = useMemo(() => buildHomeProductRows(products), [products]);

  const filteredProducts = useMemo(() => {
    if (!activeSlug) return products;
    return products.filter(
      (p) => p.categorySlug?.toLowerCase() === activeSlug.toLowerCase(),
    );
  }, [products, activeSlug]);

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

  return (
    <div className="mp-sections mp-sections--storefront-home">
      <ProductRowSection
        products={rows.mostRequested}
        titleKey="mostRequested"
        variant="featured"
        delay={0}
      />

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
        categoryTitle={categoryTitle}
        variant="primary"
      />

      <MarketplaceTrustSection />
      <MarketplaceReviewsSection reviews={featuredReviews} />
      <MarketplaceFooter />
    </div>
  );
}

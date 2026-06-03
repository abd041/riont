"use client";

import { useMemo } from "react";
import type { CatalogCategory, CatalogProduct } from "@/types/catalog";
import { buildHomeProductRows } from "@/features/homepage/lib/home-product-rows";
import { useHomeCategoryFilter } from "@/hooks/use-ui-store";
import { CategorySlider } from "@/features/categories/components/category-slider";
import { ProductRowSection } from "./sections/product-row-section";
import { FilteredProductsSection } from "./sections/filtered-products-section";
import { MarketplaceFooter } from "./marketplace/marketplace-footer";

type HomeMarketplaceProps = {
  products: CatalogProduct[];
  categories: CatalogCategory[];
};

export function HomeMarketplace({ products, categories }: HomeMarketplaceProps) {
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

      <FilteredProductsSection
        products={filteredProducts}
        activeCategorySlug={activeSlug}
        categoryTitle={categoryTitle}
        variant="primary"
      />

      <MarketplaceFooter />
    </div>
  );
}

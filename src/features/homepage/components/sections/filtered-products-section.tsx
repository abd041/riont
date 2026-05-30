"use client";

import { useTranslations } from "next-intl";
import type { CatalogProduct } from "@/types/catalog";
import { cn } from "@/utils/cn";
import {
  MarketplaceSectionReveal,
  MarketplaceSectionRevealChild,
} from "../marketplace/marketplace-section-reveal";
import { MarketplaceSectionHeader } from "../marketplace/marketplace-section-header";
import { MarketplaceProductGrid } from "@/features/products/components/marketplace-product-grid";

type FilteredProductsSectionProps = {
  products: CatalogProduct[];
  activeCategorySlug: string | null;
  categoryTitle?: string;
  variant?: "default" | "primary";
};

export function FilteredProductsSection({
  products,
  activeCategorySlug,
  categoryTitle,
  variant = "default",
}: FilteredProductsSectionProps) {
  const t = useTranslations("home");

  const title = activeCategorySlug
    ? categoryTitle ?? t("featuredProducts")
    : t("featuredProducts");

  return (
    <MarketplaceSectionReveal
      aria-label={title}
      delay={0.04}
      className={cn(variant === "primary" && "mp-browse-section--primary")}
    >
      <MarketplaceSectionRevealChild>
        <MarketplaceSectionHeader
          title={title}
          meta={`${products.length} ${t("itemsLabel")}`}
        />
      </MarketplaceSectionRevealChild>

      <MarketplaceProductGrid
        products={products}
        filterKey={activeCategorySlug ?? "all"}
        emptyMessage={t("noProductsInCategory")}
      />
    </MarketplaceSectionReveal>
  );
}

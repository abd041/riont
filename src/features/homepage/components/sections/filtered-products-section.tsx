"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { CatalogProduct } from "@/types/catalog";
import { cn } from "@/utils/cn";
import {
  HOME_FEATURED_GRID_ROWS,
  useHomeGridColumns,
} from "@/hooks/use-home-grid-columns";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  MarketplaceSectionReveal,
  MarketplaceSectionRevealChild,
} from "../marketplace/marketplace-section-reveal";
import { MarketplaceSectionHeader } from "../marketplace/marketplace-section-header";
import { MarketplaceProductGrid } from "@/features/products/components/marketplace-product-grid";
import { MarketplaceMiniCard } from "@/features/products/components/marketplace-mini-card";
import { MarketplaceGridPagination } from "./marketplace-grid-pagination";

const MOBILE_HOME_FEATURED_ROWS = 2;

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
  const columns = useHomeGridColumns();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isMobileHomeFeatured = variant === "primary" && isMobile;
  const [page, setPage] = useState(1);

  const pageSize =
    isMobileHomeFeatured
      ? columns * MOBILE_HOME_FEATURED_ROWS
      : columns * HOME_FEATURED_GRID_ROWS;
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));

  const filterKey = activeCategorySlug ?? "all";

  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const currentPage = Math.min(page, totalPages);

  const pagedProducts = useMemo(() => {
    return products.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [products, currentPage, pageSize]);

  const title = activeCategorySlug
    ? categoryTitle ?? t("featuredProducts")
    : t("featuredProducts");

  return (
    <MarketplaceSectionReveal
      aria-label={title}
      delay={0}
      className={cn(variant === "primary" && "mp-browse-section--primary")}
    >
      <MarketplaceSectionRevealChild>
        <MarketplaceSectionHeader
          title={title}
          meta={`${products.length} ${t("itemsLabel")}`}
        />
      </MarketplaceSectionRevealChild>

      {pagedProducts.length === 0 ? (
        <p className="mp-empty">{t("noProductsInCategory")}</p>
      ) : isMobileHomeFeatured ? (
        <div className="mp-featured-showcase-grid" role="list">
          {pagedProducts.map((product) => (
            <div
              key={product.slug}
              className="mp-featured-showcase-grid__cell"
              role="listitem"
            >
              <MarketplaceMiniCard product={product} showcase />
            </div>
          ))}
        </div>
      ) : (
        <MarketplaceProductGrid
          products={pagedProducts}
          filterKey={`${filterKey}-${currentPage}-${columns}`}
          emptyMessage={t("noProductsInCategory")}
        />
      )}

      {totalPages > 1 ? (
        <MarketplaceGridPagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          ariaLabel={t("featuredPagination")}
        />
      ) : null}
    </MarketplaceSectionReveal>
  );
}

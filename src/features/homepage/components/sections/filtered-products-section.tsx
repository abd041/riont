"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { CatalogProduct } from "@/types/catalog";
import { cn } from "@/utils/cn";
import {
  HOME_FEATURED_GRID_ROWS,
  useHomeGridColumns,
} from "@/hooks/use-home-grid-columns";
import {
  MarketplaceSectionReveal,
  MarketplaceSectionRevealChild,
} from "../marketplace/marketplace-section-reveal";
import { MarketplaceSectionHeader } from "../marketplace/marketplace-section-header";
import { MarketplaceProductGrid } from "@/features/products/components/marketplace-product-grid";
import { MarketplaceGridPagination } from "./marketplace-grid-pagination";

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
  const [page, setPage] = useState(1);

  const pageSize = columns * HOME_FEATURED_GRID_ROWS;
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));

  const filterKey = activeCategorySlug ?? "all";

  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const currentPage = Math.min(page, totalPages);

  const pagedProducts = useMemo(
    () => products.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [products, currentPage, pageSize],
  );

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
        products={pagedProducts}
        filterKey={`${filterKey}-${currentPage}-${columns}`}
        emptyMessage={t("noProductsInCategory")}
      />

      <MarketplaceGridPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        ariaLabel={t("featuredPagination")}
      />
    </MarketplaceSectionReveal>
  );
}

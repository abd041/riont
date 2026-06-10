"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { StickyCategoryBar } from "@/features/categories/components/sticky-category-bar";
import { motion, useReducedMotion } from "framer-motion";
import {
  mpStaggerContainer,
  mpStaggerItem,
} from "@/features/homepage/motion/marketplace-motion";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { MarketplaceProductCard } from "./marketplace-product-card";
import type { CatalogCategory, CatalogProduct } from "@/types/catalog";
import { BrowseProductSearch } from "./browse-product-search";
import {
  ProductsFilterSidebar,
  filterProductsByPlatform,
  MAX_PRICE_CENTS,
} from "./products-filter-sidebar";
import { BrowseMobileFilterStrip } from "./browse-mobile-filter-strip";

export type SortOption = "popular" | "price-asc" | "price-desc" | "name";

function sortProducts(products: CatalogProduct[], sort: SortOption): CatalogProduct[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.priceCents - b.priceCents);
    case "price-desc":
      return list.sort((a, b) => b.priceCents - a.priceCents);
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "popular":
    default:
      return list.sort((a, b) => {
        const aScore = (a.badge === "bestSeller" ? 2 : 0) + (a.badge === "instant" ? 1 : 0);
        const bScore = (b.badge === "bestSeller" ? 2 : 0) + (b.badge === "instant" ? 1 : 0);
        return bScore - aScore || b.priceCents - a.priceCents;
      });
  }
}

type ProductsBrowseShellProps = {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  activeCategorySlug?: string | null;
  searchQuery?: string;
  pageTitle: string;
  showBrowseTitle?: boolean;
  error?: boolean;
};

export function ProductsBrowseShell({
  products,
  categories,
  activeCategorySlug,
  searchQuery = "",
  pageTitle,
  showBrowseTitle = false,
  error,
}: ProductsBrowseShellProps) {
  const t = useTranslations("catalog");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [stickyCategories, setStickyCategories] = useState(false);
  const browseSentinelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sentinel = browseSentinelRef.current;
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
  }, []);

  const sort = (searchParams.get("sort") as SortOption) || "popular";
  const maxPrice = Number(searchParams.get("maxPrice")) || MAX_PRICE_CENTS;
  const platforms = searchParams.getAll("platform");

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.priceCents <= maxPrice);
    list = filterProductsByPlatform(list, platforms);
    return sortProducts(list, sort);
  }, [products, maxPrice, platforms, sort]);

  function onSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "popular") params.delete("sort");
    else params.set("sort", value);
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  }

  const heading = showBrowseTitle ? t("browseTitle") : pageTitle;
  const gridAnimationKey = `${activeCategorySlug ?? "all"}-${sort}-${maxPrice}-${platforms.join(",")}`;

  if (error) {
    return (
      <div className="nex-browse-page">
        <div className="nex-browse-top">
          <h1 className="nex-browse-title">{heading}</h1>
        </div>
        <ErrorState
          title={t("loadErrorTitle")}
          description={t("loadErrorDescription")}
        />
      </div>
    );
  }

  return (
    <div className="sf-browse-wrap">
      <div className="nex-browse-page">
      <header className="nex-browse-page-header">
        <div className="nex-browse-top">
          <Link href="/" className="nex-browse-back" aria-label={t("breadcrumbHome")}>
            <ArrowLeft strokeWidth={1.5} />
          </Link>
          <h1 className="nex-browse-title">{heading}</h1>
        </div>
        <div className="nex-browse-toolbar">
          <BrowseProductSearch defaultQuery={searchQuery} />
          <div className="nex-browse-sort">
            <span className="nex-browse-sort-label">{t("sortBy")}:</span>
            <select
              className="nex-browse-sort-select"
              value={sort}
              aria-label={t("sortBy")}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="popular">{t("sortPopular")}</option>
              <option value="price-asc">{t("sortPriceAsc")}</option>
              <option value="price-desc">{t("sortPriceDesc")}</option>
              <option value="name">{t("sortName")}</option>
            </select>
          </div>
        </div>
      </header>

      <div ref={browseSentinelRef} className="mp-cat-sentinel" aria-hidden />

      <StickyCategoryBar
        mode="browse"
        categories={categories}
        activeSlug={activeCategorySlug ?? null}
        visible={stickyCategories}
      />

      <BrowseMobileFilterStrip onOpenFullFilters={() => setFiltersOpen(true)} />

      <div className="nex-browse-body">
        {filtersOpen && (
          <button
            type="button"
            className="nex-browse-filters-backdrop"
            aria-label={t("hideFilters")}
            onClick={() => setFiltersOpen(false)}
          />
        )}
        <button
          type="button"
          className="nex-browse-filters-toggle"
          aria-expanded={filtersOpen}
          aria-controls="browse-filters-panel"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          {filtersOpen ? t("hideFilters") : t("showFilters")}
        </button>
        <div
          id="browse-filters-panel"
          className={cn(
            "nex-browse-filters-wrap",
            filtersOpen && "nex-browse-filters-wrap--open",
          )}
        >
          <ProductsFilterSidebar
            categories={categories}
            activeCategorySlug={activeCategorySlug}
            onNavigate={() => setFiltersOpen(false)}
          />
        </div>

        <div className="nex-browse-main">
          {filtered.length === 0 ? (
            <EmptyState
              title={t("emptyTitle")}
              description={t("emptyDescription")}
              action={
                <Button asChild>
                  <Link href="/products">{t("clearFilters")}</Link>
                </Button>
              }
            />
          ) : (
            <div className="mp-grid mp-browse-section--primary">
              {reduceMotion ? (
                <div className="mp-grid__inner">
                  {filtered.map((product) => (
                    <div key={product.slug} className="mp-grid__cell">
                      <MarketplaceProductCard {...product} />
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  key={gridAnimationKey}
                  className="mp-grid__inner"
                  variants={mpStaggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {filtered.map((product) => (
                    <motion.div
                      key={product.slug}
                      className="mp-grid__cell"
                      variants={mpStaggerItem}
                    >
                      <MarketplaceProductCard {...product} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

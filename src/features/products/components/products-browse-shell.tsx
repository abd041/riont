"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { BrowseProductCard } from "./browse-product-card";
import type { CatalogCategory, CatalogProduct } from "@/types/catalog";
import { BrowseProductSearch } from "./browse-product-search";
import {
  ProductsFilterSidebar,
  filterProductsByPlatform,
  MAX_PRICE_CENTS,
} from "./products-filter-sidebar";

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

      <div className="nex-browse-body">
        <ProductsFilterSidebar
          categories={categories}
          activeCategorySlug={activeCategorySlug}
        />

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
            <div className="nex-browse-grid">
              {filtered.map((product) => (
                <BrowseProductCard key={product.slug} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

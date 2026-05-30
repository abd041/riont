"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { BrowseCategoryCard } from "./browse-category-card";
import type { CatalogCategory } from "@/types/catalog";

type CategoriesBrowseShellProps = {
  categories: CatalogCategory[];
};

export function CategoriesBrowseShell({ categories }: CategoriesBrowseShellProps) {
  const t = useTranslations("categories");
  const tCatalog = useTranslations("catalog");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description?.toLowerCase().includes(q) ?? false) ||
        c.slug.toLowerCase().includes(q),
    );
  }, [categories, query]);

  return (
    <div className="nex-browse-page nex-categories-page">
      <header className="nex-browse-page-header">
        <div className="nex-browse-top">
          <Link href="/" className="nex-browse-back" aria-label={tCatalog("breadcrumbHome")}>
            <ArrowLeft strokeWidth={1.5} />
          </Link>
          <h1 className="nex-browse-title">{t("browseTitle")}</h1>
        </div>
        <p className="nex-categories-subtitle">{t("browseSubtitle")}</p>
        <div className="nex-categories-toolbar">
          <div className="nex-categories-search">
            <Search className="nex-categories-search-icon" strokeWidth={1.5} aria-hidden />
            <input
              type="search"
              className="nex-categories-search-input"
              placeholder={t("searchCategories")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t("searchCategories")}
            />
          </div>
        </div>
      </header>

      {filtered.length === 0 ? (
        <EmptyState
          title={query.trim() ? t("emptySearchTitle") : t("emptyTitle")}
          description={
            query.trim() ? t("emptySearchDescription") : t("emptyDescription")
          }
          action={
            query.trim() ? (
              <button
                type="button"
                className="nex-categories-clear"
                onClick={() => setQuery("")}
              >
                {t("clearSearch")}
              </button>
            ) : (
              <Link href="/products" className="nex-categories-clear">
                {t("viewAllProducts")}
              </Link>
            )
          }
        />
      ) : (
        <div className="nex-categories-grid">
          {filtered.map((category, index) => (
            <BrowseCategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

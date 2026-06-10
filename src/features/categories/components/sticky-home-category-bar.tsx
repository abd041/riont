"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import {
  iconForCategory,
  themeForCategorySlug,
} from "@/features/categories/lib/category-theme";
import type { CatalogCategory } from "@/types/catalog";

type StickyHomeCategoryBarProps = {
  categories: CatalogCategory[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
  visible: boolean;
};

export function StickyHomeCategoryBar({
  categories,
  activeSlug,
  onSelect,
  visible,
}: StickyHomeCategoryBarProps) {
  const t = useTranslations("home");

  if (categories.length === 0) return null;

  return (
    <nav
      className={cn("mp-sticky-cats", visible && "mp-sticky-cats--active")}
      aria-label={t("browseCategories")}
      aria-hidden={!visible}
    >
      <div className="mp-sticky-cats__scroll" role="list">
        <button
          type="button"
          className={cn("mp-cat mp-cat--compact", activeSlug === null && "mp-cat--active")}
          onClick={() => onSelect(null)}
          role="listitem"
        >
          <span className="mp-cat__icon mp-cat__icon--all" aria-hidden>
            ★
          </span>
          <span className="mp-cat__label">{t("allCategories")}</span>
        </button>

        {categories.map((category, index) => {
          const theme = themeForCategorySlug(category.slug, index);
          const Icon = iconForCategory(category.slug, theme);
          const isActive = activeSlug === category.slug;

          return (
            <button
              key={category.id}
              type="button"
              className={cn(
                "mp-cat mp-cat--compact",
                `mp-cat--${theme}`,
                isActive && "mp-cat--active",
              )}
              onClick={() => onSelect(category.slug)}
              role="listitem"
            >
              <span className="mp-cat__icon" aria-hidden>
                <Icon strokeWidth={1.5} className="h-4 w-4" />
              </span>
              <span className="mp-cat__label">{category.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import type { ComponentProps, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import {
  iconForCategory,
  themeForCategorySlug,
} from "@/features/categories/lib/category-theme";
import type { CatalogCategory } from "@/types/catalog";

type StickyCategoryBarProps = {
  categories: CatalogCategory[];
  activeSlug: string | null;
  visible: boolean;
  mode: "home" | "browse";
  onSelect?: (slug: string | null) => void;
};

function CategoryChip({
  className,
  children,
  ...props
}: ComponentProps<"button"> & { className?: string }) {
  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
}

function CategoryLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} role="listitem">
      {children}
    </Link>
  );
}

export function StickyCategoryBar({
  categories,
  activeSlug,
  visible,
  mode,
  onSelect,
}: StickyCategoryBarProps) {
  const tHome = useTranslations("home");
  const tCatalog = useTranslations("catalog");
  const label = mode === "home" ? tHome("browseCategories") : tCatalog("categories");
  const allLabel = mode === "home" ? tHome("allCategories") : tCatalog("allCategories");

  if (categories.length === 0) return null;

  const chipClass = (isActive: boolean, theme?: string) =>
    cn(
      "mp-cat mp-cat--compact",
      theme && `mp-cat--${theme}`,
      isActive && "mp-cat--active",
    );

  return (
    <nav
      className={cn("mp-sticky-cats", visible && "mp-sticky-cats--active")}
      aria-label={label}
      aria-hidden={!visible}
    >
      <div className="mp-sticky-cats__scroll" role="list">
        {mode === "home" ? (
          <CategoryChip
            className={chipClass(activeSlug === null)}
            onClick={() => onSelect?.(null)}
            role="listitem"
          >
            <span className="mp-cat__icon mp-cat__icon--all" aria-hidden>
              ★
            </span>
            <span className="mp-cat__label">{allLabel}</span>
          </CategoryChip>
        ) : (
          <CategoryLink href="/products" className={chipClass(activeSlug === null)}>
            <span className="mp-cat__icon mp-cat__icon--all" aria-hidden>
              ★
            </span>
            <span className="mp-cat__label">{allLabel}</span>
          </CategoryLink>
        )}

        {categories.map((category, index) => {
          const theme = themeForCategorySlug(category.slug, index);
          const Icon = iconForCategory(category.slug, theme);
          const isActive = activeSlug === category.slug;
          const className = chipClass(isActive, theme);

          if (mode === "home") {
            return (
              <CategoryChip
                key={category.id}
                className={className}
                onClick={() => onSelect?.(category.slug)}
                role="listitem"
              >
                <span className="mp-cat__icon" aria-hidden>
                  <Icon strokeWidth={1.5} className="h-4 w-4" />
                </span>
                <span className="mp-cat__label">{category.name}</span>
              </CategoryChip>
            );
          }

          return (
            <CategoryLink
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={className}
            >
              <span className="mp-cat__icon" aria-hidden>
                <Icon strokeWidth={1.5} className="h-4 w-4" />
              </span>
              <span className="mp-cat__label">{category.name}</span>
            </CategoryLink>
          );
        })}
      </div>
    </nav>
  );
}

/** @deprecated Use StickyCategoryBar with mode="home" */
export function StickyHomeCategoryBar(
  props: Omit<StickyCategoryBarProps, "mode"> & {
    onSelect: (slug: string | null) => void;
  },
) {
  return <StickyCategoryBar {...props} mode="home" />;
}

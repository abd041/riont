"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  iconForCategory,
  themeForCategorySlug,
} from "@/features/categories/lib/category-theme";
import type { CatalogCategory } from "@/types/catalog";

export function BrowseCategoryCard({
  category,
  index,
}: {
  category: CatalogCategory;
  index: number;
}) {
  const t = useTranslations("categories");
  const theme = themeForCategorySlug(category.slug, index);
  const Icon = iconForCategory(category.slug, theme);
  const href = `/products?category=${category.slug}`;

  return (
    <article className={cn("nex-cg-card group", `nex-cg-card--${theme}`)}>
      <Link href={href} className="nex-cg-media">
        <div className="nex-cg-glow-bloom" aria-hidden />
        <div className="nex-cg-glow" aria-hidden />
        <div className="nex-cg-visual">
          {category.iconUrl ? (
            <Image
              src={category.iconUrl}
              alt=""
              width={320}
              height={320}
              className="nex-cg-image"
              sizes="(max-width: 640px) 50vw, (max-width: 1200px) 25vw, 280px"
            />
          ) : (
            <Icon className="nex-cg-icon" strokeWidth={1.35} aria-hidden />
          )}
        </div>
      </Link>

      <div className="nex-cg-body">
        <Link href={href} className="nex-cg-info">
          <h2 className="nex-cg-name">{category.name}</h2>
          {category.description ? (
            <p className="nex-cg-desc">{category.description}</p>
          ) : null}
        </Link>
        <div className="nex-cg-footer">
          <span className="nex-cg-count">
            {t("productCount", { count: category.productCount })}
          </span>
          <Link href={href} className="nex-cg-cta" aria-label={t("viewProducts")}>
            <span className="nex-cg-cta-label">{t("viewProducts")}</span>
            <ArrowRight className="nex-cg-cta-icon" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </article>
  );
}

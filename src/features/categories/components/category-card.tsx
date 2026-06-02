import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import {
  iconForCategory,
  themeForCategorySlug,
} from "@/features/categories/lib/category-theme";
import type { CatalogCategory } from "@/types/catalog";

export function CategoryCard({
  category,
  productCountLabel,
  index = 0,
}: {
  category: CatalogCategory;
  productCountLabel: string;
  index?: number;
}) {
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
          {category.description ? <p className="nex-cg-desc">{category.description}</p> : null}
        </Link>
        <div className="nex-cg-footer">
          <span className="nex-cg-count">{productCountLabel}</span>
        </div>
      </div>
    </article>
  );
}

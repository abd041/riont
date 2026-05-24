import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { CatalogCategory } from "@/features/catalog/types";

export function CategoryCard({
  category,
  productCountLabel,
}: {
  category: CatalogCategory;
  productCountLabel: string;
}) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="glass-card group flex flex-col overflow-hidden rounded-[var(--radius-lg)] transition hover:border-[var(--border-glow)]"
    >
      <div className="relative h-32 bg-surface-2">
        {category.iconUrl ? (
          <Image
            src={category.iconUrl}
            alt=""
            fill
            className="object-cover opacity-90 transition group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)]/90 to-transparent" />
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-[var(--text-primary)] group-hover:text-accent-400">
          {category.name}
        </h2>
        {category.description && (
          <p className="mt-1 line-clamp-2 text-sm text-[var(--text-muted)]">
            {category.description}
          </p>
        )}
        <p className="mt-2 text-xs text-accent-400">{productCountLabel}</p>
      </div>
    </Link>
  );
}

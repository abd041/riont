"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCurrency } from "@/features/currency/components/currency-provider";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { ProductThumbnail } from "./product-thumbnail";
import type { CatalogProduct } from "@/features/catalog/types";

export type ProductCardProps = Pick<
  CatalogProduct,
  | "id"
  | "slug"
  | "name"
  | "category"
  | "categorySlug"
  | "priceCents"
  | "compareAtCents"
  | "badge"
  | "imageUrl"
>;

export function ProductCard({
  id,
  slug,
  name,
  category,
  priceCents,
  compareAtCents,
  badge,
  imageUrl,
}: ProductCardProps) {
  const locale = useLocale();
  const { formatPrice } = useCurrency();
  const t = useTranslations("product");

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "glass-card group flex flex-col rounded-[var(--radius-lg)] p-4 transition-shadow duration-200 hover:border-[var(--border-glow)] hover:shadow-[0_0_24px_var(--accent-glow-sm)]",
      )}
    >
      <Link href={`/products/${slug}`} className="flex flex-1 flex-col">
        <div className="relative mb-4 h-28 overflow-hidden rounded-[var(--radius-md)]">
          {badge === "bestSeller" && (
            <Badge variant="accent" className="absolute start-2 top-2 z-10">
              {t("bestSeller")}
            </Badge>
          )}
          <ProductThumbnail src={imageUrl} alt={name} className="h-28" />
        </div>
        {category && (
          <p className="text-xs text-[var(--text-muted)]">{category}</p>
        )}
        <h3 className="mt-1 font-semibold text-[var(--text-primary)] group-hover:text-accent-400">
          {name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-accent-400" dir="ltr">
            {formatPrice(priceCents, locale)}
          </span>
          {compareAtCents && compareAtCents > priceCents && (
            <span
              className="text-sm text-[var(--text-muted)] line-through"
              dir="ltr"
            >
              {formatPrice(compareAtCents, locale)}
            </span>
          )}
        </div>
        {badge === "instant" && (
          <Badge variant="success" className="mt-2 w-fit">
            {t("instantDelivery")}
          </Badge>
        )}
      </Link>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <AddToCartButton
          productId={id ?? slug}
          slug={slug}
          name={name}
          imageUrl={imageUrl ?? null}
          priceCents={priceCents}
          className="flex-1"
        />
        <Button variant="primary" className="flex-1" asChild>
          <Link href={`/products/${slug}/checkout`}>{t("buyNow")}</Link>
        </Button>
      </div>
    </motion.article>
  );
}

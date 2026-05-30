"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Package, Star } from "lucide-react";
import { useCurrency } from "@/features/shared/currency/currency-provider";
import { cn } from "@/lib/utils/cn";
import type { CatalogProduct } from "@/types/catalog";

export type BrowseCardTheme = "blue" | "orange" | "purple" | "green" | "violet";

const SLUG_THEME: Record<string, BrowseCardTheme> = {
  "windows-11-pro": "blue",
  "steam-premium-account": "green",
  "spotify-premium-1year": "green",
  "instagram-verified-badge": "purple",
};

const CATEGORY_THEME: Record<string, BrowseCardTheme> = {
  software: "blue",
  gaming: "green",
  games: "green",
  subscriptions: "purple",
  instagram: "purple",
};

function themeForProduct(slug: string, categorySlug?: string): BrowseCardTheme {
  return (
    SLUG_THEME[slug] ??
    (categorySlug ? CATEGORY_THEME[categorySlug.toLowerCase()] : undefined) ??
    "violet"
  );
}

function discountPercent(price: number, compare?: number | null) {
  if (!compare || compare <= price) return null;
  return Math.round(((compare - price) / compare) * 100);
}

function hashSlug(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash += slug.charCodeAt(i);
  return hash;
}

function reviewCount(slug: string) {
  return 80 + (hashSlug(slug) % 420);
}

function ratingValue(slug: string) {
  const variants = [4.7, 4.8, 4.9];
  return variants[hashSlug(slug) % variants.length];
}

export function BrowseProductCard({
  slug,
  name,
  category,
  categorySlug,
  priceCents,
  compareAtCents,
  imageUrl,
}: CatalogProduct) {
  const locale = useLocale();
  const t = useTranslations("home");
  const { formatPrice } = useCurrency();

  const theme = themeForProduct(slug, categorySlug);
  const discount = discountPercent(priceCents, compareAtCents);
  const reviews = reviewCount(slug);
  const rating = ratingValue(slug);
  const subtitleBySlug: Record<string, string> = {
    "windows-11-pro": t("lifetimeLicense"),
    "spotify-premium-1year": t("oneYear"),
  };
  const subtitle =
    subtitleBySlug[slug] ?? (category?.trim() || t("lifetimeLicense"));

  return (
    <article className={cn("nex-bp-card group", `nex-bp-card--${theme}`)}>
      <Link href={`/products/${slug}`} className="nex-bp-media">
        {discount != null && discount > 0 && (
          <span className="nex-bp-badge-discount">-{discount}%</span>
        )}
        <div className="nex-bp-glow-bloom" aria-hidden />
        <div className="nex-bp-glow" aria-hidden />
        <div className="nex-bp-image-wrap">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              width={400}
              height={400}
              className="nex-bp-image"
              sizes="(max-width: 640px) 45vw, (max-width: 1200px) 20vw, 220px"
            />
          ) : (
            <div className="nex-bp-image-placeholder">
              <Package className="h-10 w-10" strokeWidth={1.25} />
            </div>
          )}
        </div>
      </Link>

      <div className="nex-bp-body">
        <Link href={`/products/${slug}`} className="nex-bp-info">
          <h3 className="nex-bp-name">{name}</h3>
          <p className="nex-bp-subtitle">{subtitle}</p>
        </Link>
        <div className="nex-bp-footer">
          <div className="nex-bp-price-block">
            <span className="nex-bp-price" dir="ltr">
              {formatPrice(priceCents, locale)}
            </span>
            {compareAtCents != null && compareAtCents > priceCents && (
              <span className="nex-bp-price-compare" dir="ltr">
                {formatPrice(compareAtCents, locale)}
              </span>
            )}
          </div>
          <div className="nex-bp-rating" aria-label={`${rating}, ${reviews} reviews`}>
            <Star className="nex-bp-rating-star" strokeWidth={1.5} />
            <span className="nex-bp-rating-value">{rating}</span>
            <span className="nex-bp-rating-count">
              {t("reviewsShort", { count: reviews })}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Package, Star } from "lucide-react";
import { useCurrency } from "@/features/shared/currency/currency-provider";
import { cn } from "@/lib/utils/cn";
import type { CatalogProduct } from "@/types/catalog";
import {
  discountPercent,
  productRating,
  productReviewCount,
} from "@/features/products/utils/product-display";

export type BrowseCardTheme = "blue" | "orange" | "purple" | "green" | "violet";

/** Visual modifier classes — all render with unified bronze glow in CSS. */
const SLUG_THEME: Record<string, BrowseCardTheme> = {
  "windows-11-pro": "violet",
  "steam-premium-account": "violet",
  "spotify-premium-1year": "violet",
  "instagram-verified-badge": "violet",
};

const CATEGORY_THEME: Record<string, BrowseCardTheme> = {
  software: "violet",
  gaming: "violet",
  games: "violet",
  subscriptions: "violet",
  instagram: "violet",
};

function themeForProduct(slug: string, categorySlug?: string): BrowseCardTheme {
  return (
    SLUG_THEME[slug] ??
    (categorySlug ? CATEGORY_THEME[categorySlug.toLowerCase()] : undefined) ??
    "violet"
  );
}

export function BrowseProductCard(product: CatalogProduct) {
  const {
    slug,
    name,
    category,
    categorySlug,
    priceCents,
    compareAtCents,
    imageUrl,
    averageRating,
    reviewCount,
  } = product;

  const locale = useLocale();
  const t = useTranslations("home");
  const { formatPrice } = useCurrency();

  const theme = themeForProduct(slug, categorySlug);
  const discount = discountPercent(priceCents, compareAtCents);
  const reviews = productReviewCount({ reviewCount });
  const rating = productRating({ averageRating, reviewCount });
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
              fill
              className="nex-bp-image object-cover"
              sizes="(max-width: 640px) 50vw, 240px"
            />
          ) : (
            <div className="nex-bp-placeholder">
              <Package strokeWidth={1.25} />
            </div>
          )}
        </div>
      </Link>

      <div className="nex-bp-body">
        <Link href={`/products/${slug}`} className="nex-bp-title">
          {name}
        </Link>
        <p className="nex-bp-sub">{subtitle}</p>
        {rating != null ? (
          <div className="nex-bp-rating">
            <Star className="nex-bp-star" strokeWidth={1.5} />
            <span>{rating.toFixed(1)}</span>
            <span className="nex-bp-reviews">{t("reviewsShort", { count: reviews })}</span>
          </div>
        ) : null}
        <div className="nex-bp-price-row">
          <span className="nex-bp-price" dir="ltr">
            {formatPrice(priceCents, locale)}
          </span>
          {compareAtCents != null && compareAtCents > priceCents && (
            <span className="nex-bp-price-old" dir="ltr">
              {formatPrice(compareAtCents, locale)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

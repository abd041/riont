"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Package, ShoppingCart, Star } from "lucide-react";
import { useCurrency } from "@/features/currency/components/currency-provider";
import { useCart } from "@/features/cart/cart-context";
import { toast } from "sonner";
import type { CatalogProduct } from "@/features/catalog/types";

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

export function HomeProductCard({
  id,
  slug,
  name,
  category,
  priceCents,
  compareAtCents,
  badge,
  imageUrl,
}: CatalogProduct) {
  const locale = useLocale();
  const t = useTranslations("home");
  const tProduct = useTranslations("product");
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  const discount = discountPercent(priceCents, compareAtCents);
  const reviews = reviewCount(slug);
  const rating = ratingValue(slug);
  const subtitle = category?.trim() || t("lifetimeLicense");

  return (
    <article className="nex-fp-card group">
      <Link href={`/products/${slug}`} className="nex-fp-media">
        {discount != null && discount > 0 && (
          <span className="nex-fp-badge">-{discount}%</span>
        )}
        {badge === "bestSeller" && (
          <span className="nex-fp-badge-bestseller">{tProduct("bestSellerBadge")}</span>
        )}
        <div className="nex-fp-image-wrap">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="nex-fp-image"
              sizes="(max-width: 640px) 45vw, (max-width: 1280px) 22vw, 200px"
            />
          ) : (
            <div className="nex-fp-image-placeholder">
              <Package className="h-12 w-12" strokeWidth={1.25} />
            </div>
          )}
        </div>
      </Link>

      <div className="nex-fp-body">
        <Link href={`/products/${slug}`} className="nex-fp-info">
          <h3 className="nex-fp-name line-clamp-1">{name}</h3>
          <p className="nex-fp-subtitle line-clamp-1">{subtitle}</p>
          <div className="nex-fp-rating">
            <Star className="nex-fp-rating-star" strokeWidth={1.5} />
            <span className="nex-fp-rating-value">{rating}</span>
            <span className="nex-fp-rating-count">
              {t("reviewsShort", { count: reviews })}
            </span>
          </div>
        </Link>

        <div className="nex-fp-footer">
          <div className="nex-fp-prices">
            <span className="nex-fp-price" dir="ltr">
              {formatPrice(priceCents, locale)}
            </span>
            {compareAtCents != null && compareAtCents > priceCents && (
              <span className="nex-fp-price-compare" dir="ltr">
                {formatPrice(compareAtCents, locale)}
              </span>
            )}
          </div>
          <button
            type="button"
            className="nex-fp-cart"
            aria-label={tProduct("addToCart")}
            onClick={() => {
              addItem({
                productId: id ?? slug,
                slug,
                name,
                imageUrl: imageUrl ?? null,
                priceCents,
              });
              toast.success(tProduct("addedToCart"));
            }}
          >
            <ShoppingCart strokeWidth={2} />
          </button>
        </div>
      </div>
    </article>
  );
}

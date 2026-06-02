"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, Package, ShoppingCart, Star } from "lucide-react";
import { useCurrency } from "@/features/shared/currency/currency-provider";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import {
  discountPercent,
  productCategoryLabel,
  productRating,
  productReviewCount,
} from "@/features/products/utils/product-display";
import { toast } from "sonner";
import type { CatalogProduct } from "@/types/catalog";
import { cn } from "@/utils/cn";
import { mpCardHover } from "@/features/homepage/motion/marketplace-motion";

const MotionArticle = motion.article;

type MarketplaceProductCardProps = CatalogProduct & {
  className?: string;
};

/** Grid product card — premium marketplace tile. */
export function MarketplaceProductCard({
  id,
  slug,
  name,
  category,
  priceCents,
  compareAtCents,
  badge,
  imageUrl,
  className,
}: MarketplaceProductCardProps) {
  const locale = useLocale();
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();

  const discount = discountPercent(priceCents, compareAtCents);
  const rating = productRating(slug);
  const reviews = productReviewCount(slug);
  const subtitle = productCategoryLabel(
    { slug, name, category, priceCents },
    t("lifetimeLicense"),
  );
  const wished = hasItem(id ?? slug);
  const reduceMotion = useReducedMotion();

  return (
    <MotionArticle
      className={cn("mp-card mp-card--grid mp-card--premium group", className)}
      whileHover={reduceMotion ? undefined : mpCardHover}
    >
      <span className="mp-card__ambient" aria-hidden />
      <span className="mp-card__surface" aria-hidden />
      <Link href={`/products/${slug}`} className="mp-card__media mp-card__media--grid">
        <span className="mp-card__media-vignette" aria-hidden />
        <span className="mp-card__media-shine" aria-hidden />
        {discount != null && discount > 0 && (
          <span className="mp-badge mp-badge--sale">-{discount}%</span>
        )}
        {badge === "bestSeller" && (
          <span className="mp-badge mp-badge--hot">{tProduct("bestSellerBadge")}</span>
        )}
        {badge === "instant" && (
          <span className="mp-badge mp-badge--instant">{tProduct("instantDelivery")}</span>
        )}
        {badge === "hot" && <span className="mp-badge mp-badge--hot">{tProduct("badgeHot")}</span>}
        {badge === "trending" && (
          <span className="mp-badge mp-badge--hot">{tProduct("badgeTrending")}</span>
        )}
        {badge === "limited" && (
          <span className="mp-badge mp-badge--sale">{tProduct("badgeLimited")}</span>
        )}
        {badge === "offer" && (
          <span className="mp-badge mp-badge--sale">{tProduct("badgeOffer")}</span>
        )}
        <div className="mp-card__img-wrap">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="mp-card__img mp-card__img--cover"
              sizes="(max-width: 640px) 46vw, (max-width: 1280px) 22vw, 200px"
            />
          ) : (
            <div className="mp-card__placeholder">
              <Package className="h-10 w-10" strokeWidth={1.25} />
            </div>
          )}
        </div>
        <button
          type="button"
          className={cn("mp-card__wish", wished && "mp-card__wish--active")}
          aria-label={tCommon("wishlist")}
          aria-pressed={wished}
          onClick={(e) => {
            e.preventDefault();
            toggleItem({
              productId: id ?? slug,
              slug,
              name,
              imageUrl: imageUrl ?? null,
              priceCents,
            });
            toast.message(tProduct("addToWishlist"));
          }}
        >
          <Heart strokeWidth={2} className={cn(wished && "fill-current")} />
        </button>
      </Link>

      <div className="mp-card__body">
        <Link href={`/products/${slug}`} className="mp-card__info">
          <h3 className="mp-card__name">{name}</h3>
          <p className="mp-card__cat">{subtitle}</p>
          <div className="mp-card__rating-row">
            <Star className="mp-card__star" strokeWidth={1.5} />
            <span>{rating}</span>
            <span className="mp-card__reviews">{t("reviewsShort", { count: reviews })}</span>
          </div>
        </Link>

        <div className="mp-card__actions">
          <div className="mp-card__prices">
            <span className="mp-card__price mp-card__price--lg" dir="ltr">
              {formatPrice(priceCents, locale)}
            </span>
            {compareAtCents != null && compareAtCents > priceCents && (
              <span className="mp-card__price-old" dir="ltr">
                {formatPrice(compareAtCents, locale)}
              </span>
            )}
          </div>
          <button
            type="button"
            className="mp-btn-icon mp-btn-icon--cart"
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
    </MotionArticle>
  );
}

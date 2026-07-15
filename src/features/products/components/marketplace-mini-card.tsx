"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, Package, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/features/shared/currency/currency-provider";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import {
  discountPercent,
  productCategoryLabel,
  productRating,
} from "@/features/products/utils/product-display";
import {
  homepageBadgeClass,
  homepageBadgeLabelKey,
} from "@/features/products/lib/homepage-badges";
import type { CatalogProduct } from "@/types/catalog";
import { cn } from "@/utils/cn";
import { mpCardHoverMini } from "@/features/homepage/motion/marketplace-motion";

const MotionArticle = motion.article;

type MarketplaceMiniCardProps = {
  product: CatalogProduct;
  className?: string;
  /** Polished carousel card — used on homepage Most Requested. */
  showcase?: boolean;
};

/** Compact horizontal-scroll product card. */
export function MarketplaceMiniCard({
  product,
  className,
  showcase = false,
}: MarketplaceMiniCardProps) {
  const locale = useLocale();
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();

  const { id, slug, name, priceCents, compareAtCents, imageUrl, badge } = product;
  const discount = discountPercent(priceCents, compareAtCents);
  const rating = productRating(product);
  const category = productCategoryLabel(product, t("lifetimeLicense"));
  const wished = hasItem(id ?? slug);
  const reduceMotion = useReducedMotion();
  const CardRoot = showcase || reduceMotion ? "article" : MotionArticle;

  return (
    <CardRoot
      className={cn(
        "mp-card mp-card--mini mp-card--premium group",
        showcase && "mp-card--showcase",
        className,
      )}
      role="listitem"
      {...(!showcase && !reduceMotion
        ? { whileHover: mpCardHoverMini as typeof mpCardHoverMini }
        : {})}
    >
      <span className="mp-card__ambient" aria-hidden />
      <span className="mp-card__surface" aria-hidden />
      <Link href={`/products/${slug}`} className="mp-card__media">
        <span className="mp-card__media-vignette" aria-hidden />
        <span className="mp-card__media-shine" aria-hidden />
        {(discount != null && discount > 0) || homepageBadgeLabelKey(badge) ? (
          <div className="mp-card__badges">
            {discount != null && discount > 0 && (
              <span className="mp-badge mp-badge--sale">-{discount}%</span>
            )}
            {(() => {
              const key = homepageBadgeLabelKey(badge);
              if (!key) return null;
              return (
                <span className={homepageBadgeClass(badge)}>{tProduct(key)}</span>
              );
            })()}
          </div>
        ) : null}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={256}
            height={192}
            className="mp-card__img"
            sizes={showcase ? "(max-width: 767px) 46vw, 11vw" : "128px"}
            draggable={false}
          />
        ) : (
          <div className="mp-card__placeholder">
            <Package className="h-7 w-7" strokeWidth={1.25} />
          </div>
        )}
      </Link>

      <div className="mp-card__body mp-card__body--mini">
        <Link href={`/products/${slug}`} className="mp-card__info">
          <h3 className="mp-card__name">{name}</h3>
          {showcase ? (
            <p className="mp-card__meta-line">
              <span className="mp-card__cat">{category}</span>
              {rating != null ? (
                <span className="mp-card__meta-rating" dir="ltr">
                  <Star className="mp-card__star" strokeWidth={1.5} aria-hidden />
                  {rating.toFixed(1)}
                </span>
              ) : null}
            </p>
          ) : (
            <>
              <p className="mp-card__cat">{category}</p>
              {rating != null ? (
                <p className="mp-card__rating">
                  <Star className="mp-card__star" strokeWidth={1.5} />
                  {rating.toFixed(1)}
                </p>
              ) : null}
            </>
          )}
        </Link>

        <div className="mp-card__actions mp-card__actions--mini">
          <span className="mp-card__price" dir="ltr">
            {formatPrice(priceCents, locale)}
          </span>
          <div className="mp-card__btns">
            <button
              type="button"
              className={cn("mp-btn-icon", wished && "mp-btn-icon--active")}
              aria-label={tCommon("wishlist")}
              aria-pressed={wished}
              onClick={() => {
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
      </div>
    </CardRoot>
  );
}

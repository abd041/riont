"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import { useCurrency } from "@/features/shared/currency/currency-provider";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

function discountPercent(price: number, compare?: number | null) {
  if (!compare || compare <= price) return null;
  return Math.round(((compare - price) / compare) * 100);
}

export function ProductDetailPurchase({
  productId,
  slug,
  name,
  imageUrl,
  priceCents,
  compareAtCents,
  isInstant,
}: {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  priceCents: number;
  compareAtCents?: number | null;
  isInstant?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("product");
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const [qty, setQty] = useState(1);

  const discount = discountPercent(priceCents, compareAtCents);
  const wished = hasItem(productId);

  function addToCart() {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId,
        slug,
        name,
        imageUrl,
        priceCents,
      });
    }
    toast.success(t("addedToCart"));
  }

  function toggleWishlist() {
    const added = toggleItem({
      productId,
      slug,
      name,
      imageUrl,
      priceCents,
    });
    toast.success(added ? t("addedToWishlist") : t("removedFromWishlist"));
  }

  async function shareProduct() {
    const url = `${window.location.origin}/${locale}/products/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success(t("linkCopied"));
    } catch {
      /* user cancelled share */
    }
  }

  return (
    <>
      <div className="nex-pdp-meta-row">
        <span
          className={cn(
            "nex-pdp-availability",
            isInstant ? "nex-pdp-availability--instant" : "nex-pdp-availability--manual",
          )}
        >
          {isInstant ? t("instantDelivery") : t("manualDelivery")}
        </span>
      </div>

      <div className="nex-pdp-pricing">
        <span className="nex-pdp-price" dir="ltr">
          {formatPrice(priceCents, locale)}
        </span>
        {compareAtCents != null && compareAtCents > priceCents && (
          <span className="nex-pdp-compare" dir="ltr">
            {formatPrice(compareAtCents, locale)}
          </span>
        )}
        {discount != null && discount > 0 && (
          <span className="nex-pdp-discount">-{discount}%</span>
        )}
      </div>

      <div className="nex-pdp-actions">
        <div className="nex-pdp-qty-row">
          <span className="nex-pdp-qty-label">{t("quantity")}</span>
          <div className="nex-pdp-qty">
            <button
              type="button"
              aria-label={t("quantity")}
              onClick={() => setQty((n) => Math.max(1, n - 1))}
            >
              −
            </button>
            <span>{qty}</span>
            <button
              type="button"
              aria-label={t("quantity")}
              onClick={() => setQty((n) => Math.min(99, n + 1))}
            >
              +
            </button>
          </div>
        </div>

        <button type="button" className="nex-pdp-add-cart" onClick={addToCart}>
          <ShoppingCart strokeWidth={2} className="h-5 w-5" />
          {t("addToCart")}
        </button>

        <Link href={`/products/${slug}/checkout`} className="nex-pdp-buy-now">
          {t("buyNowButton")}
        </Link>

        <div className="nex-pdp-secondary-actions">
          <button
            type="button"
            className={cn("nex-pdp-wishlist", wished && "nex-pdp-wishlist--active")}
            onClick={toggleWishlist}
          >
            <Heart strokeWidth={1.5} className={cn(wished && "fill-current")} />
            {wished ? t("inWishlist") : t("addToWishlist")}
          </button>

          <button type="button" className="nex-pdp-share" onClick={shareProduct}>
            <Share2 strokeWidth={1.5} />
            {t("shareProduct")}
          </button>
        </div>
      </div>
    </>
  );
}

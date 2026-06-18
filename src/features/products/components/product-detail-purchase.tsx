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

type PurchaseProps = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  priceCents: number;
  compareAtCents?: number | null;
  checkoutHref?: string;
  variantId?: string | null;
  variantLabel?: string | null;
  inStock?: boolean;
};

export function ProductDetailPricing({
  priceCents,
  compareAtCents,
}: Pick<PurchaseProps, "priceCents" | "compareAtCents">) {
  const locale = useLocale();
  const { formatPrice } = useCurrency();
  const discount = discountPercent(priceCents, compareAtCents);

  return (
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
  );
}

export function ProductDetailPurchaseActions({
  productId,
  slug,
  name,
  imageUrl,
  priceCents,
  checkoutHref,
  variantId,
  variantLabel,
  inStock = true,
}: PurchaseProps) {
  const locale = useLocale();
  const t = useTranslations("product");
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const [qty, setQty] = useState(1);

  const wished = hasItem(productId);
  const cartDisplayName = variantLabel ? `${name} — ${variantLabel}` : name;

  function addToCart() {
    addItem(
      {
        productId,
        slug,
        name: cartDisplayName,
        imageUrl,
        priceCents,
        variantId: variantId ?? null,
        variantLabel: variantLabel ?? null,
      },
      qty,
    );
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
    const variantQuery = variantId
      ? `?variant=${encodeURIComponent(variantId)}`
      : "";
    const url = `${window.location.origin}/${locale}/products/${slug}${variantQuery}`;
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

      <div className="nex-pdp-actions__primary">
        <button
          type="button"
          className="nex-pdp-add-cart"
          onClick={addToCart}
          disabled={!inStock}
        >
          <ShoppingCart strokeWidth={2} className="h-4 w-4" />
          {t("addToCart")}
        </button>

        {inStock ? (
          <Link href={checkoutHref ?? `/products/${slug}/checkout`} className="nex-pdp-buy-now">
            {t("buyNowButton")}
          </Link>
        ) : (
          <span className="nex-pdp-buy-now nex-pdp-buy-now--disabled" aria-disabled>
            {t("soldOut")}
          </span>
        )}
      </div>

      <div className="nex-pdp-secondary-actions">
        <button
          type="button"
          className={cn("nex-pdp-wishlist", wished && "nex-pdp-wishlist--active")}
          onClick={toggleWishlist}
        >
          <Heart strokeWidth={1.5} className={cn("h-4 w-4", wished && "fill-current")} />
          {wished ? t("inWishlist") : t("addToWishlist")}
        </button>

        <button type="button" className="nex-pdp-share" onClick={shareProduct}>
          <Share2 strokeWidth={1.5} className="h-4 w-4" />
          {t("shareProduct")}
        </button>
      </div>
    </div>
  );
}

export function ProductDetailPurchase(props: PurchaseProps & { isInstant?: boolean }) {
  return (
    <>
      <ProductDetailPricing
        priceCents={props.priceCents}
        compareAtCents={props.compareAtCents}
      />
      <ProductDetailPurchaseActions {...props} />
    </>
  );
}

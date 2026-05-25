"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { useCurrency } from "@/features/currency/components/currency-provider";
import { useCart } from "@/features/cart/cart-context";
import { toast } from "sonner";

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
}: {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  priceCents: number;
  compareAtCents?: number | null;
}) {
  const locale = useLocale();
  const t = useTranslations("product");
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const discount = discountPercent(priceCents, compareAtCents);

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

  return (
    <>
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

        <button
          type="button"
          className="nex-pdp-wishlist"
          onClick={() => toast.message(t("addToWishlist"))}
        >
          <Heart strokeWidth={1.5} />
          {t("addToWishlist")}
        </button>
      </div>
    </>
  );
}

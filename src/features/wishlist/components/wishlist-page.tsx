"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { PremiumPanel } from "@/components/shared/premium-panel";
import { StorefrontPageHeader } from "@/components/shared/storefront-page-header";
import { StorefrontPageShell } from "@/components/shared/storefront-page-shell";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCurrency } from "@/features/shared/currency/currency-provider";

export function WishlistPage() {
  const t = useTranslations("wishlist");
  const locale = useLocale();
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  function handleAddToCart(item: (typeof items)[number]) {
    addItem({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      imageUrl: item.imageUrl,
      priceCents: item.priceCents,
    });
    toast.success(t("addedToCart"));
  }

  if (items.length === 0) {
    return (
      <StorefrontPageShell variant="narrow">
        <StorefrontPageHeader
          title={t("title")}
          backHref="/products"
          backLabel={t("browse")}
        />
        <EmptyState
          icon={<Heart strokeWidth={1.5} />}
          title={t("empty")}
          action={
            <Link href="/products" className="sf-btn-primary">
              {t("browse")}
            </Link>
          }
        />
      </StorefrontPageShell>
    );
  }

  return (
    <StorefrontPageShell>
      <StorefrontPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        backHref="/products"
        backLabel={t("browse")}
        meta={t("itemCount", { count: items.length })}
      />

      <PremiumPanel>
        <ul className="sf-cart-list">
          {items.map((item) => (
            <li key={item.productId} className="sf-cart-item">
              <div className="sf-cart-item__media">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="88px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--text-muted)]">
                    —
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <Link href={`/products/${item.slug}`} className="sf-cart-item__name">
                  {item.name}
                </Link>
                <p className="sf-cart-item__price" dir="ltr">
                  {formatPrice(item.priceCents, locale)}
                </p>
                <div className="sf-cart-item__actions">
                  <button type="button" className="sf-btn-ghost" onClick={() => removeItem(item.productId)}>
                    <Trash2 className="h-4 w-4" />
                    {t("remove")}
                  </button>
                </div>
              </div>

              <div className="sf-cart-item__total">
                <button type="button" className="sf-btn-primary" onClick={() => handleAddToCart(item)}>
                  <ShoppingCart className="h-4 w-4" />
                  {t("addToCart")}
                </button>
                <Link
                  href={`/products/${item.slug}/checkout`}
                  className="sf-btn-outline"
                  style={{ minHeight: 38, paddingInline: 16, fontSize: 13 }}
                >
                  {t("buyNow")}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </PremiumPanel>
    </StorefrontPageShell>
  );
}

"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Minus, Plus, ShoppingBag, Shield, Trash2, Zap } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PremiumPanel } from "@/components/shared/premium-panel";
import { StorefrontPageHeader } from "@/components/shared/storefront-page-header";
import { StorefrontPageShell } from "@/components/shared/storefront-page-shell";
import { cartLineKey } from "@/features/cart/cart-line-key";
import { useCart } from "@/hooks/use-cart";
import { useCurrency } from "@/features/shared/currency/currency-provider";

export function CartPage() {
  const t = useTranslations("cart");
  const tHome = useTranslations("home");
  const locale = useLocale();
  const { items, removeItem, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();

  const subtotalCents = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <StorefrontPageShell variant="narrow">
        <StorefrontPageHeader
          title={t("title")}
          backHref="/products"
          backLabel={t("browse")}
        />
        <EmptyState
          icon={<ShoppingBag strokeWidth={1.5} />}
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
        subtitle={t("checkoutNote")}
        backHref="/products"
        backLabel={t("browse")}
        meta={t("itemCount", { count: items.length })}
      />

      <div className="sf-cart-layout">
        <PremiumPanel className="sf-panel--flat">
          <ul className="sf-cart-list">
            {items.map((item) => {
              const lineKey = cartLineKey(item);
              const itemCheckoutHref = item.variantId
                ? `/products/${item.slug}/checkout?variant=${encodeURIComponent(item.variantId)}`
                : `/products/${item.slug}/checkout`;

              return (
              <li key={lineKey} className="sf-cart-item">
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
                  {item.variantLabel ? (
                    <p className="text-xs text-[var(--text-muted)]">
                      {item.variantLabel}
                    </p>
                  ) : null}
                  <p className="sf-cart-item__price" dir="ltr">
                    {formatPrice(item.priceCents, locale)}
                  </p>
                  <div className="sf-cart-item__actions">
                    <div className="sf-qty">
                      <button
                        type="button"
                        className="sf-qty__btn"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity - 1,
                            item.variantId,
                          )
                        }
                        aria-label={t("decrease")}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="sf-qty__value">{item.quantity}</span>
                      <button
                        type="button"
                        className="sf-qty__btn"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1,
                            item.variantId,
                          )
                        }
                        aria-label={t("increase")}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="sf-btn-ghost"
                      onClick={() => removeItem(item.productId, item.variantId)}
                    >
                      <Trash2 className="h-4 w-4" />
                      {t("remove")}
                    </button>
                  </div>
                </div>

                <div className="sf-cart-item__total">
                  <p className="sf-cart-item__total-value" dir="ltr">
                    {formatPrice(item.priceCents * item.quantity, locale)}
                  </p>
                  <Link
                    href={itemCheckoutHref}
                    className="sf-btn-primary sf-cart-item__checkout-btn"
                  >
                    {t("checkoutItem")}
                  </Link>
                </div>
              </li>
            );
            })}
          </ul>
        </PremiumPanel>

        <aside>
          <PremiumPanel title={t("summaryTitle")}>
            <div className="sf-cart-summary__row">
              <span>{t("subtotal")}</span>
              <span dir="ltr">{formatPrice(subtotalCents, locale)}</span>
            </div>
            <div className="sf-cart-summary__row sf-cart-summary__total">
              <span>{t("total")}</span>
              <span className="sf-cart-summary__total-value" dir="ltr">
                {formatPrice(subtotalCents, locale)}
              </span>
            </div>

            <Link href="/cart/checkout" className="sf-btn-primary w-full">
              {t("proceedCheckout")}
            </Link>
            <p className="sf-cart-note">{t("checkoutNote")}</p>
          </PremiumPanel>

          <div className="sf-trust-strip sf-trust-strip--cart">
            <div className="sf-trust-strip__item">
              <Shield className="sf-trust-strip__icon" strokeWidth={1.5} />
              {tHome("footerTrustSecure")}
            </div>
            <div className="sf-trust-strip__item">
              <Zap className="sf-trust-strip__icon" strokeWidth={1.5} />
              {tHome("footerTrustInstant")}
            </div>
          </div>
        </aside>
      </div>
    </StorefrontPageShell>
  );
}

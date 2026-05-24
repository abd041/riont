"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { useCurrency } from "@/features/currency/components/currency-provider";

export function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, removeItem, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();

  if (items.length === 0) {
    return (
      <div className="glass-card rounded-[var(--radius-lg)] p-10 text-center">
        <p className="text-[var(--text-muted)]">{t("empty")}</p>
        <Button className="mt-6" asChild>
          <Link href="/products">{t("browse")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.productId}
            className="glass-card flex flex-wrap gap-4 rounded-[var(--radius-lg)] p-4 sm:flex-nowrap"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-surface">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-[var(--text-muted)]">
                  —
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.slug}`}
                className="font-medium hover:text-accent-400"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-accent-400" dir="ltr">
                {formatPrice(item.priceCents, locale)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--border-default)]">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center hover:bg-surface"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    aria-label={t("decrease")}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[2rem] text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center hover:bg-surface"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    aria-label={t("increase")}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="h-4 w-4" />
                  {t("remove")}
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col justify-end sm:w-auto sm:text-end">
              <p className="text-sm font-semibold text-accent-400" dir="ltr">
                {formatPrice(item.priceCents * item.quantity, locale)}
              </p>
              <Button className="mt-2" size="sm" asChild>
                <Link href={`/products/${item.slug}/checkout`}>
                  {t("checkoutItem")}
                </Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-[var(--text-muted)]">{t("checkoutNote")}</p>
    </div>
  );
}

"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/features/currency/components/currency-provider";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";

export function ProductPurchaseActions({
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

  return (
    <>
      <div className="mt-4 flex flex-wrap items-baseline gap-2">
        <p className="text-3xl font-semibold text-accent-400" dir="ltr">
          {formatPrice(priceCents, locale)}
        </p>
        {compareAtCents && compareAtCents > priceCents && (
          <p className="text-lg text-[var(--text-muted)] line-through" dir="ltr">
            {formatPrice(compareAtCents, locale)}
          </p>
        )}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" asChild>
          <Link href={`/products/${slug}/checkout`}>{t("buyNow")}</Link>
        </Button>
        <AddToCartButton
          productId={productId}
          slug={slug}
          name={name}
          imageUrl={imageUrl}
          priceCents={priceCents}
          variant="outline"
          className="h-12 px-6"
        />
      </div>
    </>
  );
}

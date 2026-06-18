"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { ProductVariant } from "@/types/catalog";
import { cn } from "@/utils/cn";
import {
  ProductDetailPricing,
  ProductDetailPurchaseActions,
} from "./product-detail-purchase";

export function ProductDetailInteractive({
  productId,
  slug,
  name,
  imageUrl,
  basePriceCents,
  baseCompareAtCents,
  inStock = true,
  variants,
  betweenPricingAndActions,
}: {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  basePriceCents: number;
  baseCompareAtCents?: number | null;
  isInstant?: boolean;
  inStock?: boolean;
  variants: ProductVariant[];
  betweenPricingAndActions?: ReactNode;
}) {
  const defaultVariant = useMemo(
    () => variants.find((v) => v.isDefault) ?? variants[0] ?? null,
    [variants],
  );
  const [selectedId, setSelectedId] = useState(defaultVariant?.id ?? "");

  const selected =
    variants.find((v) => v.id === selectedId) ?? defaultVariant ?? null;

  const priceCents = selected?.priceCents ?? basePriceCents;
  const compareAtCents = selected?.compareAtCents ?? baseCompareAtCents ?? null;
  const checkoutHref = selected
    ? `/products/${slug}/checkout?variant=${encodeURIComponent(selected.id)}`
    : `/products/${slug}/checkout`;

  const purchaseProps = {
    productId,
    slug,
    name,
    imageUrl,
    priceCents,
    compareAtCents,
    inStock,
    checkoutHref,
    variantId: selected?.id ?? null,
    variantLabel: selected?.name ?? null,
  };

  return (
    <div className="nex-pdp-purchase-block">
      {variants.length > 0 && (
        <div className="nex-pdp-variants">
          {variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              className={cn(
                "nex-pdp-variant",
                selectedId === variant.id && "nex-pdp-variant--active",
              )}
              onClick={() => setSelectedId(variant.id)}
            >
              <span className="nex-pdp-variant__name">{variant.name}</span>
              {variant.offerLabel ? (
                <span className="nex-pdp-variant__offer">{variant.offerLabel}</span>
              ) : null}
            </button>
          ))}
        </div>
      )}

      <ProductDetailPricing
        priceCents={priceCents}
        compareAtCents={compareAtCents}
      />

      {betweenPricingAndActions}

      <ProductDetailPurchaseActions {...purchaseProps} />
    </div>
  );
}

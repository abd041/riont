"use client";

import { useMemo, useState } from "react";
import type { ProductVariant } from "@/types/catalog";
import { cn } from "@/utils/cn";
import { ProductDetailPurchase } from "./product-detail-purchase";

export function ProductDetailInteractive({
  productId,
  slug,
  name,
  imageUrl,
  basePriceCents,
  baseCompareAtCents,
  isInstant,
  inStock = true,
  variants,
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

  return (
    <>
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

      <ProductDetailPurchase
        productId={productId}
        slug={slug}
        name={name}
        imageUrl={imageUrl}
        priceCents={priceCents}
        compareAtCents={compareAtCents}
        isInstant={isInstant}
        inStock={inStock}
        checkoutHref={checkoutHref}
        variantId={selected?.id ?? null}
        variantLabel={selected?.name ?? null}
      />
    </>
  );
}

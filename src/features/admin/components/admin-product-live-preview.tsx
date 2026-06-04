"use client";

import Image from "next/image";
import { PRODUCT_BADGE_LABELS } from "@/lib/admin/labels";
import {
  calcDiscountPercent,
  parsePriceDollars,
} from "@/lib/admin/product-form-validation";
type AdminProductLivePreviewProps = {
  enName: string;
  enShortDescription: string;
  priceDollars: string;
  compareAtDollars: string;
  badge: string;
  imagePreviewUrl: string | null;
  enSlug: string;
  status: string;
};

export function AdminProductLivePreview({
  enName,
  enShortDescription,
  priceDollars,
  compareAtDollars,
  badge,
  imagePreviewUrl,
  enSlug,
  status,
}: AdminProductLivePreviewProps) {
  const price = parsePriceDollars(priceDollars);
  const compare = parsePriceDollars(compareAtDollars);
  const discount =
    price !== null ? calcDiscountPercent(price, compare) : null;
  const badgeLabel =
    badge !== "none"
      ? PRODUCT_BADGE_LABELS[badge as keyof typeof PRODUCT_BADGE_LABELS]
      : null;

  const displayName = enName.trim() || "Product name";
  const summary =
    enShortDescription.trim() || "Short description appears on the card.";

  return (
    <aside className="admin-product-preview" aria-label="Storefront preview">
      <p className="admin-product-preview__label">Storefront preview</p>
      <div className="admin-product-preview__card">
        <div className="admin-product-preview__media">
          {imagePreviewUrl ? (
            <Image
              src={imagePreviewUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="admin-product-preview__placeholder">Photo</span>
          )}
          {badgeLabel && (
            <span className="admin-product-preview__badge">{badgeLabel}</span>
          )}
          {discount != null && discount > 0 && (
            <span className="admin-product-preview__discount">-{discount}%</span>
          )}
        </div>
        <div className="admin-product-preview__body">
          <p className="admin-product-preview__name">{displayName}</p>
          <p className="admin-product-preview__summary">{summary}</p>
          <p className="admin-product-preview__price" dir="ltr">
            {price !== null ? (
              <>
                <span className="admin-product-preview__price-current">
                  ${price.toFixed(2)}
                </span>
                {compare !== null && compare > price && (
                  <span className="admin-product-preview__price-compare">
                    ${compare.toFixed(2)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-[var(--text-muted)]">$0.00</span>
            )}
          </p>
        </div>
      </div>
      <dl className="admin-product-preview__meta">
        <div>
          <dt>Status</dt>
          <dd>{status === "active" ? "Live" : status === "draft" ? "Draft" : status}</dd>
        </div>
        <div>
          <dt>English URL</dt>
          <dd dir="ltr">
            {enSlug.trim()
              ? `/en/products/${enSlug.trim()}`
              : "/en/products/…"}
          </dd>
        </div>
      </dl>
    </aside>
  );
}

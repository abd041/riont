"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Star } from "lucide-react";
import { useCurrency } from "@/features/shared/currency/currency-provider";
import type { CatalogProduct } from "@/types/catalog";

export function HomeBestSellerRow({ product }: { product: CatalogProduct }) {
  const locale = useLocale();
  const { formatPrice } = useCurrency();

  return (
    <Link href={`/products/${product.slug}`} className="nex-rs-product-row">
      <div className="nex-rs-product-thumb">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-[rgba(255,255,255,0.35)]">
            —
          </div>
        )}
      </div>
      <div className="nex-rs-product-body">
        <p className="nex-rs-product-name truncate">{product.name}</p>
        {product.category && (
          <p className="nex-rs-product-meta truncate">{product.category}</p>
        )}
      </div>
      <div className="nex-rs-product-aside">
        <p className="nex-rs-product-price" dir="ltr">
          {formatPrice(product.priceCents, locale)}
        </p>
        <p className="nex-rs-product-rating">
          <Star strokeWidth={1.5} />
          <span>4.9</span>
        </p>
      </div>
    </Link>
  );
}

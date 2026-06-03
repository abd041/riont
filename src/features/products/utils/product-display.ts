import type { CatalogProduct } from "@/types/catalog";

export function discountPercent(price: number, compare?: number | null): number | null {
  if (!compare || compare <= price) return null;
  return Math.round(((compare - price) / compare) * 100);
}

export function productRating(
  product: Pick<CatalogProduct, "averageRating" | "reviewCount">,
): number | null {
  if ((product.reviewCount ?? 0) > 0 && product.averageRating != null) {
    return product.averageRating;
  }
  return null;
}

export function productReviewCount(
  product: Pick<CatalogProduct, "reviewCount">,
): number {
  return product.reviewCount ?? 0;
}

export function hasRealReviews(product: Pick<CatalogProduct, "reviewCount">): boolean {
  return (product.reviewCount ?? 0) > 0;
}

export function productCategoryLabel(product: CatalogProduct, fallback: string): string {
  return product.category?.trim() || fallback;
}

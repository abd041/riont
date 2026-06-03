import type { CatalogProduct } from "@/types/catalog";

export function discountPercent(price: number, compare?: number | null): number | null {
  if (!compare || compare <= price) return null;
  return Math.round(((compare - price) / compare) * 100);
}

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash += slug.charCodeAt(i);
  return hash;
}

function fallbackRating(slug: string): number {
  return [4.7, 4.8, 4.9][hashSlug(slug) % 3];
}

function fallbackReviewCount(slug: string): number {
  return 80 + (hashSlug(slug) % 420);
}

export function productRating(product: Pick<CatalogProduct, "slug" | "averageRating">): number {
  if (product.averageRating != null && product.averageRating > 0) {
    return product.averageRating;
  }
  return fallbackRating(product.slug);
}

export function productReviewCount(
  product: Pick<CatalogProduct, "slug" | "reviewCount">,
): number {
  if (product.reviewCount != null && product.reviewCount > 0) {
    return product.reviewCount;
  }
  return fallbackReviewCount(product.slug);
}

export function hasRealReviews(product: Pick<CatalogProduct, "reviewCount">): boolean {
  return (product.reviewCount ?? 0) > 0;
}

export function productCategoryLabel(product: CatalogProduct, fallback: string): string {
  return product.category?.trim() || fallback;
}

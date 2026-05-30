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

export function productRating(slug: string): number {
  return [4.7, 4.8, 4.9][hashSlug(slug) % 3];
}

export function productReviewCount(slug: string): number {
  return 80 + (hashSlug(slug) % 420);
}

export function productCategoryLabel(product: CatalogProduct, fallback: string): string {
  return product.category?.trim() || fallback;
}

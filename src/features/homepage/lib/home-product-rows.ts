import type { CatalogProduct } from "@/types/catalog";

const SERVICE_SLUGS = new Set([
  "subscriptions",
  "instagram",
  "gift-cards",
  "software",
]);

function discountRatio(p: CatalogProduct): number {
  if (!p.compareAtCents || p.compareAtCents <= p.priceCents) return 0;
  return (p.compareAtCents - p.priceCents) / p.compareAtCents;
}

/** Preserve order, drop duplicate slugs (best sellers appear first in merged rows). */
function uniqueBySlug(products: CatalogProduct[], limit?: number): CatalogProduct[] {
  const seen = new Set<string>();
  const result: CatalogProduct[] = [];

  for (const product of products) {
    if (seen.has(product.slug)) continue;
    seen.add(product.slug);
    result.push(product);
    if (limit != null && result.length >= limit) break;
  }

  return result;
}

/** Build compact homepage rows from one product pool — no duplicate architecture. */
export function buildHomeProductRows(products: CatalogProduct[]) {
  const pool = products.length > 0 ? products : [];

  const withDeals = pool
    .filter((p) => discountRatio(p) > 0)
    .sort((a, b) => discountRatio(b) - discountRatio(a));

  const bestSellers = pool.filter((p) => p.badge === "bestSeller");
  const services = pool.filter((p) =>
    p.categorySlug ? SERVICE_SLUGS.has(p.categorySlug) : false,
  );

  return {
    mostRequested: uniqueBySlug([...bestSellers, ...pool], 8),
    trending: uniqueBySlug(
      [...pool].sort((a, b) => discountRatio(b) - discountRatio(a)),
      6,
    ),
    recentlyAdded: uniqueBySlug([...pool].slice(-6).reverse(), 6),
    bestSellers: uniqueBySlug([...bestSellers, ...pool], 6),
    recommended: uniqueBySlug(
      pool.filter((_, i) => i % 2 === 0),
      6,
    ),
    limitedDeals: uniqueBySlug(withDeals, 6),
    popularServices: uniqueBySlug([...services, ...pool], 6),
  };
}

export type HomeProductRows = ReturnType<typeof buildHomeProductRows>;

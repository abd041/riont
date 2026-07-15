import type { CatalogProduct } from "@/types/catalog";

const SERVICE_SLUGS = new Set([
  "subscriptions",
  "instagram",
  "instagram-verification",
  "gift-cards",
  "software",
  "python-tools",
  "steam-private",
  "steam-shared",
  "gaming",
]);

const MOST_REQUESTED_LIMIT = 8;

function discountRatio(p: CatalogProduct): number {
  if (!p.compareAtCents || p.compareAtCents <= p.priceCents) return 0;
  return (p.compareAtCents - p.priceCents) / p.compareAtCents;
}

/** Preserve order, drop duplicate slugs. */
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

function sortBySales(products: CatalogProduct[]): CatalogProduct[] {
  return [...products].sort(
    (a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0),
  );
}

function pickByIds(
  products: CatalogProduct[],
  ids: string[],
  limit: number,
): CatalogProduct[] {
  if (!ids.length) return [];
  const byId = new Map(
    products.filter((p) => p.id).map((p) => [p.id as string, p]),
  );
  const out: CatalogProduct[] = [];
  for (const id of ids) {
    const product = byId.get(id);
    if (product) out.push(product);
    if (out.length >= limit) break;
  }
  return out;
}

/** Build compact homepage rows from one product pool — no duplicate architecture. */
export function buildHomeProductRows(
  products: CatalogProduct[],
  options?: { mostRequestedIds?: string[] },
) {
  const pool = products.length > 0 ? products : [];
  const bySales = sortBySales(pool);

  const withDeals = pool
    .filter((p) => discountRatio(p) > 0)
    .sort((a, b) => discountRatio(b) - discountRatio(a));

  const featured = pool.filter((p) => p.isFeatured);
  const bestSellers = pool.filter((p) => p.badge === "bestSeller");
  const services = pool.filter((p) =>
    p.categorySlug ? SERVICE_SLUGS.has(p.categorySlug) : false,
  );

  const curated = pickByIds(
    pool,
    options?.mostRequestedIds ?? [],
    MOST_REQUESTED_LIMIT,
  );

  const mostRequestedPool =
    curated.length > 0
      ? curated
      : uniqueBySlug([...featured, ...bestSellers, ...bySales, ...pool]);

  return {
    mostRequested: mostRequestedPool.slice(0, MOST_REQUESTED_LIMIT),
    trending: uniqueBySlug(
      [...pool].sort((a, b) => discountRatio(b) - discountRatio(a)),
      6,
    ),
    recentlyAdded: uniqueBySlug([...pool].slice(-6).reverse(), 6),
    bestSellers: uniqueBySlug([...bestSellers, ...bySales], 6),
    recommended: uniqueBySlug(
      pool.filter((_, i) => i % 2 === 0),
      6,
    ),
    limitedDeals: uniqueBySlug(withDeals, 6),
    popularServices: uniqueBySlug([...services, ...pool], 6),
  };
}

export type HomeProductRows = ReturnType<typeof buildHomeProductRows>;

export function isInstantDeliveryProduct(product: CatalogProduct): boolean {
  return (
    product.deliveryMode === "auto" ||
    product.deliveryMode === "hybrid" ||
    product.badge === "instant"
  );
}

export function resolveRiyontPicks(
  products: CatalogProduct[],
  picks: Array<{ productId: string; reasonEn: string; reasonAr: string }>,
  locale: string,
  excludeIds: string[] = [],
): Array<{ product: CatalogProduct; reason: string }> {
  const excluded = new Set(excludeIds.filter(Boolean));
  const byId = new Map(
    products.filter((p) => p.id).map((p) => [p.id as string, p]),
  );
  const ar = locale === "ar";
  return picks
    .map((pick) => {
      if (excluded.has(pick.productId)) return null;
      const product = byId.get(pick.productId);
      if (!product) return null;
      return {
        product,
        reason: ar ? pick.reasonAr || pick.reasonEn : pick.reasonEn,
      };
    })
    .filter((x): x is { product: CatalogProduct; reason: string } => x !== null)
    .slice(0, 3);
}

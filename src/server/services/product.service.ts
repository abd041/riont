import { createClient } from "@/lib/supabase/server";
import { demoProducts } from "@/features/products/data/demo-products";
import { productThumbnailUrl } from "@/features/products/lib/product-thumbnails";
import type {
  CatalogProduct,
  CatalogProductDetail,
  ProductBadge,
  ProductMediaItem,
  ProductVariant,
} from "@/types/catalog";
import type { CartCheckoutLine, CheckoutField, CheckoutProduct } from "@/types/order";
import { resolveLocalizedLabel, type LocalizedLabel } from "@/lib/i18n/json-label";
import { resolveFallbackLabel } from "@/lib/i18n/fallback-labels";
import { isSupabaseConfigured } from "@/lib/env/public";
import { resolveMediaUrl } from "@/lib/storage/media-url";
import { ServiceError } from "@/lib/domain/errors";
import { getAvailableStockCounts } from "@/server/services/inventory.service";
import { getReviewSummariesForProducts } from "@/server/services/review.service";

type ProductQueryRow = {
  id: string;
  price_cents: number;
  compare_at_cents: number | null;
  is_featured: boolean;
  delivery_mode: "auto" | "manual";
  sales_count: number;
  badge?: string | null;
  product_translations: Array<{
    name: string;
    slug: string;
    short_description: string | null;
    description?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    og_image_url?: string | null;
  }>;
  product_media?: Array<{
    media_type: "image" | "video";
    storage_path: string;
    alt: string | null;
    sort_order: number;
  }>;
  categories:
    | {
        category_translations: Array<{
          name: string;
          slug: string;
        }>;
      }
    | Array<{
        category_translations: Array<{
          name: string;
          slug: string;
        }>;
      }>;
};

const PRODUCT_SELECT = `
  id,
  price_cents,
  compare_at_cents,
  is_featured,
  delivery_mode,
  sales_count,
  badge,
  product_translations!inner (
    name,
    slug,
    short_description
  ),
  product_media (
    media_type,
    storage_path,
    alt,
    sort_order
  ),
  categories!inner (
    category_translations!inner (
      name,
      slug
    )
  )
`;

const PRODUCT_DETAIL_SELECT = `
  id,
  price_cents,
  compare_at_cents,
  is_featured,
  delivery_mode,
  sales_count,
  badge,
  product_translations!inner (
    name,
    slug,
    short_description,
    description,
    meta_title,
    meta_description,
    og_image_url
  ),
  product_media (
    media_type,
    storage_path,
    alt,
    sort_order
  ),
  categories!inner (
    category_translations!inner (
      name,
      slug
    )
  )
`;

/** Dev/staging: demo on errors and missing Supabase. Sparse fill: see mergeCatalogWithDemo. */
const allowDemoFallback =
  process.env.CATALOG_DEMO_FALLBACK === "true" ||
  (process.env.CATALOG_DEMO_FALLBACK !== "false" &&
    process.env.NODE_ENV !== "production");

/** Fill homepage/browse when the live catalog is still sparse (dev + production). */
const allowSparseCatalogFill = process.env.CATALOG_DEMO_FALLBACK !== "false";

function getCategoryTranslations(row: ProductQueryRow) {
  const categories = Array.isArray(row.categories)
    ? row.categories[0]
    : row.categories;
  return categories?.category_translations;
}

function resolveBadge(row: ProductQueryRow): ProductBadge | undefined {
  const manual = row.badge;
  if (manual && manual !== "none") return manual as ProductBadge;
  if (row.sales_count >= 10) return "bestSeller";
  if (row.delivery_mode === "auto") return "instant";
  return undefined;
}

type VariantRow = {
  id: string;
  name: LocalizedLabel;
  price_cents: number;
  compare_at_cents: number | null;
  offer_label: LocalizedLabel | null;
  sort_order: number;
  is_active: boolean;
  is_default: boolean;
};

function mapVariant(row: VariantRow, locale: string): ProductVariant {
  return {
    id: row.id,
    name: resolveLocalizedLabel(row.name, locale, resolveFallbackLabel(locale, "defaultOption")),
    priceCents: row.price_cents,
    compareAtCents: row.compare_at_cents,
    offerLabel: row.offer_label
      ? resolveLocalizedLabel(row.offer_label, locale)
      : null,
    isDefault: row.is_default,
  };
}

async function fetchProductVariants(
  productId: string,
  locale: string,
): Promise<ProductVariant[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select(
      "id, name, price_cents, compare_at_cents, offer_label, sort_order, is_active, is_default",
    )
    .eq("product_id", productId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) return [];
  return ((data ?? []) as VariantRow[]).map((row) => mapVariant(row, locale));
}

function pickVariant(
  variants: ProductVariant[],
  variantId?: string | null,
): ProductVariant | null {
  if (variants.length === 0) return null;
  if (variantId) {
    return variants.find((v) => v.id === variantId) ?? null;
  }
  return variants.find((v) => v.isDefault) ?? variants[0] ?? null;
}

function mapMedia(row: ProductQueryRow): ProductMediaItem[] {
  const items = [...(row.product_media ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return items.map((item) => ({
    type: item.media_type,
    url: resolveMediaUrl(item.storage_path),
    alt: item.alt,
  }));
}

function resolveOgImage(og: string | null | undefined): string | null {
  if (!og) return null;
  if (og.startsWith("http://") || og.startsWith("https://")) return og;
  const path = og.startsWith("/") ? og.slice(1) : og;
  return resolveMediaUrl(path);
}

function primaryImageUrl(
  row: ProductQueryRow,
  translation?: ProductQueryRow["product_translations"][0],
): string | null {
  const firstImage = mapMedia(row).find((m) => m.type === "image");
  if (firstImage) return firstImage.url;
  return resolveOgImage(translation?.og_image_url);
}

function mapRow(row: ProductQueryRow): CatalogProduct | null {
  const translation = row.product_translations[0];
  if (!translation) return null;

  const categoryTranslation = getCategoryTranslations(row)?.[0];
  return {
    id: row.id,
    slug: translation.slug,
    name: translation.name,
    category: categoryTranslation?.name ?? "",
    categorySlug: categoryTranslation?.slug,
    priceCents: row.price_cents,
    compareAtCents: row.compare_at_cents,
    shortDescription: translation.short_description,
    badge: resolveBadge(row),
    imageUrl:
      primaryImageUrl(row, translation) ??
      productThumbnailUrl(translation.slug, categoryTranslation?.slug),
    deliveryMode: row.delivery_mode,
    isFeatured: row.is_featured,
    salesCount: row.sales_count,
  };
}

async function enrichCatalogProducts(
  products: CatalogProduct[],
  locale: string,
): Promise<CatalogProduct[]> {
  const ids = products.map((p) => p.id).filter((id): id is string => Boolean(id));
  if (ids.length === 0) return products;

  const [stockMap, reviewMap] = await Promise.all([
    getAvailableStockCounts(ids),
    getReviewSummariesForProducts(ids, locale),
  ]);

  return products.map((product) => {
    if (!product.id) return product;

    const inStock =
      product.deliveryMode === "manual"
        ? true
        : (stockMap.get(product.id) ?? 0) > 0;

    const review = reviewMap.get(product.id);

    return {
      ...product,
      inStock,
      averageRating: review?.averageRating,
      reviewCount: review?.count,
    };
  });
}

function filterInStockProducts(products: CatalogProduct[]): CatalogProduct[] {
  return products.filter((p) => p.inStock !== false);
}

function mapDetailRow(row: ProductQueryRow): CatalogProductDetail | null {
  const base = mapRow(row);
  const translation = row.product_translations[0];
  if (!base || !translation) return null;

  return {
    ...base,
    description: translation.description ?? null,
    metaTitle: translation.meta_title,
    metaDescription: translation.meta_description,
    ogImageUrl: resolveOgImage(translation.og_image_url) ?? base.imageUrl,
    media: mapMedia(row),
    variants: [],
  };
}

function getDemoProducts(options?: {
  featured?: boolean;
  limit?: number;
  categorySlug?: string;
  sortBy?: "sort_order" | "sales_count";
}) {
  let items = options?.featured
    ? demoProducts.filter((p) => p.badge).slice(0, 8)
    : [...demoProducts];

  if (options?.categorySlug) {
    items = items.filter((p) => p.categorySlug === options.categorySlug);
  }

  if (options?.sortBy === "sales_count") {
    items = [...items].reverse();
  }

  return options?.limit ? items.slice(0, options.limit) : items;
}

async function listFromDatabase(
  locale: string,
  options?: {
    featured?: boolean;
    limit?: number;
    categorySlug?: string;
    sortBy?: "sort_order" | "sales_count";
  },
): Promise<CatalogProduct[]> {
  const supabase = await createClient();

  const sortBySales = options?.sortBy === "sales_count";

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("product_translations.locale", locale)
    .eq("categories.category_translations.locale", locale)
    .order(sortBySales ? "sales_count" : "sort_order", {
      ascending: !sortBySales,
    });

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.categorySlug) {
    query = query.eq("categories.category_translations.slug", options.categorySlug);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) throw error;

  const mapped = (data as unknown as ProductQueryRow[])
    .map(mapRow)
    .filter((p): p is CatalogProduct => p !== null);

  const enriched = await enrichCatalogProducts(mapped, locale);
  return filterInStockProducts(enriched);
}

export async function listProducts(
  locale: string,
  options?: {
    featured?: boolean;
    limit?: number;
    categorySlug?: string;
    sortBy?: "sort_order" | "sales_count";
  },
): Promise<CatalogProduct[]> {
  if (!isSupabaseConfigured()) {
    if (!allowDemoFallback) {
      throw new ServiceError("INTERNAL", "Catalog is not configured");
    }
    return getDemoProducts(options);
  }

  try {
    return await listFromDatabase(locale, options);
  } catch (error) {
    if (!allowDemoFallback) throw error;
    return getDemoProducts(options);
  }
}

export async function listFeaturedProducts(locale: string): Promise<CatalogProduct[]> {
  return listProducts(locale, { featured: true, limit: 8 });
}

const HOMEPAGE_MIN_PRODUCTS = 10;
const CATEGORY_MIN_PRODUCTS = 4;
const HOMEPAGE_PRODUCT_LIMIT = 48;

function mergeCatalogWithDemo(
  live: CatalogProduct[],
  options?: { categorySlug?: string; limit?: number },
): CatalogProduct[] {
  if (!allowSparseCatalogFill) {
    return options?.limit ? live.slice(0, options.limit) : live;
  }

  const minProducts = options?.categorySlug ? CATEGORY_MIN_PRODUCTS : HOMEPAGE_MIN_PRODUCTS;
  if (live.length >= minProducts) {
    return options?.limit ? live.slice(0, options.limit) : live;
  }

  const demo = getDemoProducts({
    categorySlug: options?.categorySlug,
    limit: options?.limit ?? HOMEPAGE_PRODUCT_LIMIT,
  });

  const seen = new Set(live.map((product) => product.slug));
  const merged = [...live];

  for (const product of demo) {
    if (seen.has(product.slug)) continue;
    merged.push({
      ...product,
      id: product.id ?? `demo-${product.slug}`,
      inStock: true,
    });
    seen.add(product.slug);
  }

  const cap = options?.limit ?? HOMEPAGE_PRODUCT_LIMIT;
  return merged.slice(0, cap);
}

/** Homepage pool: live catalog plus demo fill when the store is still sparse. */
export async function listHomepageProducts(locale: string): Promise<CatalogProduct[]> {
  const live = await listProducts(locale, {
    limit: HOMEPAGE_PRODUCT_LIMIT,
    sortBy: "sales_count",
  });

  return mergeCatalogWithDemo(live);
}

/** Browse / category pages — fills sparse categories from demo catalog in dev. */
export async function listBrowseProducts(
  locale: string,
  options?: {
    categorySlug?: string;
    limit?: number;
    sortBy?: "sort_order" | "sales_count";
  },
): Promise<CatalogProduct[]> {
  const live = await listProducts(locale, options);
  return mergeCatalogWithDemo(live, options);
}

export async function listBestSellingProducts(
  locale: string,
  limit = 5,
): Promise<CatalogProduct[]> {
  return listProducts(locale, { limit, sortBy: "sales_count" });
}

export async function searchProducts(
  locale: string,
  query: string,
  options?: { categorySlug?: string; limit?: number },
): Promise<CatalogProduct[]> {
  const term = query.trim();
  if (!term) {
    return listProducts(locale, options);
  }

  const lower = term.toLowerCase();

  if (!isSupabaseConfigured()) {
    if (!allowDemoFallback) {
      throw new ServiceError("INTERNAL", "Catalog is not configured");
    }
    let items = getDemoProducts(options).filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.slug.toLowerCase().includes(lower) ||
        (p.category?.toLowerCase().includes(lower) ?? false),
    );
    if (options?.limit) items = items.slice(0, options.limit);
    return items;
  }

  try {
    const supabase = await createClient();
    const pattern = `%${term}%`;
    const { data: matches, error: matchError } = await supabase
      .from("product_translations")
      .select("product_id")
      .eq("locale", locale)
      .or(`name.ilike.${pattern},short_description.ilike.${pattern},slug.ilike.${pattern}`);

    if (matchError) throw matchError;

    const productIds = [
      ...new Set((matches ?? []).map((m) => (m as { product_id: string }).product_id)),
    ];

    if (productIds.length === 0) return [];

    let dbQuery = supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "active")
      .in("id", productIds)
      .eq("product_translations.locale", locale)
      .eq("categories.category_translations.locale", locale)
      .order("sort_order", { ascending: true });

    if (options?.categorySlug) {
      dbQuery = dbQuery.eq(
        "categories.category_translations.slug",
        options.categorySlug,
      );
    }

    if (options?.limit) {
      dbQuery = dbQuery.limit(options.limit);
    }

    const { data, error } = await dbQuery;
    if (error) throw error;

    return (data as unknown as ProductQueryRow[])
      .map(mapRow)
      .filter((p): p is CatalogProduct => p !== null);
  } catch (error) {
    if (!allowDemoFallback) throw error;
    let items = getDemoProducts(options).filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.slug.toLowerCase().includes(lower),
    );
    if (options?.limit) items = items.slice(0, options.limit);
    return items;
  }
}

export async function getProductBySlug(
  locale: string,
  slug: string,
): Promise<CatalogProductDetail | null> {
  if (!isSupabaseConfigured()) {
    if (!allowDemoFallback) return null;
    const demo = demoProducts.find((p) => p.slug === slug);
    if (!demo) return null;
    return {
      ...demo,
      description: demo.shortDescription,
      media: demo.imageUrl
        ? [{ type: "image", url: demo.imageUrl, alt: demo.name }]
        : [],
      variants: [],
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_DETAIL_SELECT)
      .eq("status", "active")
      .eq("product_translations.locale", locale)
      .eq("product_translations.slug", slug)
      .eq("categories.category_translations.locale", locale)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      if (!allowDemoFallback) return null;
      const demo = demoProducts.find((p) => p.slug === slug);
      if (!demo) return null;
      return {
        ...demo,
        description: demo.shortDescription,
        media: demo.imageUrl
          ? [{ type: "image", url: demo.imageUrl, alt: demo.name }]
          : [],
        variants: [],
      };
    }

    const detail = mapDetailRow(data as unknown as ProductQueryRow);
    if (!detail?.id) return detail;
    const [variants, enriched] = await Promise.all([
      fetchProductVariants(detail.id, locale),
      enrichCatalogProducts([detail], locale),
    ]);
    const stockMeta = enriched[0];
    return { ...detail, ...stockMeta, variants };
  } catch (error) {
    if (!allowDemoFallback) throw error;
    const demo = demoProducts.find((p) => p.slug === slug);
    if (!demo) return null;
    return {
      ...demo,
      description: demo.shortDescription,
      media: demo.imageUrl
        ? [{ type: "image", url: demo.imageUrl, alt: demo.name }]
        : [],
      variants: [],
    };
  }
}

export async function listRelatedProducts(
  locale: string,
  productId: string,
  limit = 4,
): Promise<CatalogProduct[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data: links, error: linkError } = await supabase
    .from("product_related")
    .select("related_product_id, sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (linkError || !links?.length) {
    const { data: fallback } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "active")
      .neq("id", productId)
      .eq("product_translations.locale", locale)
      .eq("categories.category_translations.locale", locale)
      .order("sales_count", { ascending: false })
      .limit(limit);

    const fallbackMapped = ((fallback ?? []) as unknown as ProductQueryRow[])
      .map(mapRow)
      .filter((p): p is CatalogProduct => p !== null);
    const enrichedFallback = await enrichCatalogProducts(fallbackMapped, locale);
    return filterInStockProducts(enrichedFallback);
  }

  const ids = (links as Array<{ related_product_id: string }>).map(
    (l) => l.related_product_id,
  );

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .in("id", ids)
    .eq("status", "active")
    .eq("product_translations.locale", locale)
    .eq("categories.category_translations.locale", locale);

  if (error) return [];

  const byId = new Map(
    ((data ?? []) as unknown as ProductQueryRow[])
      .map(mapRow)
      .filter((p): p is CatalogProduct => p !== null)
      .map((p) => [p.id!, p]),
  );

  const ordered = ids
    .map((id) => byId.get(id))
    .filter((p): p is CatalogProduct => Boolean(p));
  const enriched = await enrichCatalogProducts(ordered, locale);
  return filterInStockProducts(enriched);
}

type ProductFieldRow = {
  id: string;
  field_key: string;
  field_type: string;
  label: LocalizedLabel;
  help_text: LocalizedLabel | null;
  required: boolean;
  sort_order: number;
  options: { values?: string[] } | string[] | null;
  is_sensitive: boolean;
};

const DEMO_CHECKOUT_FIELDS: Record<string, CheckoutField[]> = {
  "instagram-verified-badge": [
    {
      id: "demo-ig-user",
      fieldKey: "instagram_username",
      fieldType: "text",
      label: "Instagram username",
      helpText: "@handle without spaces",
      required: true,
      options: null,
      isSensitive: false,
    },
  ],
  "steam-premium-account": [
    {
      id: "demo-steam-email",
      fieldKey: "account_email",
      fieldType: "email",
      label: "Account email",
      helpText: null,
      required: true,
      options: null,
      isSensitive: false,
    },
  ],
};

function mapProductFields(
  rows: ProductFieldRow[],
  locale: string,
): CheckoutField[] {
  return [...rows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => {
      let options: string[] | null = null;
      if (Array.isArray(row.options)) {
        options = row.options;
      } else if (row.options && typeof row.options === "object") {
        const values = (row.options as { values?: string[] }).values;
        options = values ?? null;
      }

      return {
        id: row.id,
        fieldKey: row.field_key,
        fieldType: row.field_type,
        label: resolveLocalizedLabel(row.label, locale, row.field_key),
        helpText: row.help_text
          ? resolveLocalizedLabel(row.help_text, locale)
          : null,
        required: row.required,
        options,
        isSensitive: row.is_sensitive,
      };
    });
}

export async function getProductForCheckout(
  locale: string,
  slug: string,
  variantId?: string | null,
): Promise<CheckoutProduct | null> {
  const detail = await getProductBySlug(locale, slug);
  if (!detail?.id) {
    const demo = demoProducts.find((p) => p.slug === slug);
    if (!demo) return null;
    return {
      id: `demo-${slug}`,
      slug: demo.slug,
      name: demo.name,
      categoryName: demo.category ?? null,
      shortDescription: demo.shortDescription ?? null,
      priceCents: demo.priceCents,
      compareAtCents: demo.compareAtCents ?? null,
      deliveryMode: demo.badge === "instant" ? "auto" : "manual",
      imageUrl: demo.imageUrl ?? null,
      fields: DEMO_CHECKOUT_FIELDS[slug] ?? [],
      variants: [],
    };
  }

  const supabase = await createClient();
  const [fieldsResult, productResult] = await Promise.all([
    supabase
      .from("product_fields")
      .select(
        "id, field_key, field_type, label, help_text, required, sort_order, options, is_sensitive",
      )
      .eq("product_id", detail.id)
      .order("sort_order", { ascending: true }),
    supabase.from("products").select("delivery_mode").eq("id", detail.id).single(),
  ]);

  if (fieldsResult.error) throw fieldsResult.error;
  if (productResult.error) throw productResult.error;

  const variants = detail.variants ?? [];
  const selected = pickVariant(variants, variantId);
  if (variants.length > 0 && variantId && !selected) {
    throw new ServiceError("VALIDATION", "Invalid product option selected");
  }

  return mapDetailToCheckoutProduct(detail, {
    fields: mapProductFields((fieldsResult.data ?? []) as ProductFieldRow[], locale),
    deliveryMode: productResult.data.delivery_mode as "auto" | "manual",
    selected,
  });
}

function mapDetailToCheckoutProduct(
  detail: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>,
  opts: {
    fields: CheckoutField[];
    deliveryMode: "auto" | "manual";
    selected: ReturnType<typeof pickVariant>;
  },
): CheckoutProduct {
  const { fields, deliveryMode, selected } = opts;
  const priceCents = selected?.priceCents ?? detail.priceCents;
  const compareAtCents = selected?.compareAtCents ?? detail.compareAtCents ?? null;
  const variantName = selected?.name ?? null;
  const variants = detail.variants ?? [];

  return {
    id: detail.id!,
    slug: detail.slug,
    name: variantName ? `${detail.name} — ${variantName}` : detail.name,
    categoryName: detail.category ?? null,
    shortDescription: detail.shortDescription ?? null,
    priceCents,
    compareAtCents,
    deliveryMode,
    imageUrl: detail.imageUrl ?? null,
    fields,
    variantId: selected?.id ?? null,
    variantName,
    variants,
  };
}

export async function getCartCheckoutLines(
  locale: string,
  items: Array<{ slug: string; quantity: number; variantId?: string }>,
): Promise<CartCheckoutLine[]> {
  const lines: CartCheckoutLine[] = [];

  for (const item of items) {
    const product = await getProductForCheckout(
      locale,
      item.slug,
      item.variantId || undefined,
    );
    if (!product || product.id.startsWith("demo-")) {
      throw new ServiceError("NOT_FOUND", `Product not found: ${item.slug}`);
    }
    lines.push({ ...product, quantity: item.quantity });
  }

  return lines;
}

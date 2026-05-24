import { createClient } from "@/lib/supabase/server";
import { resolveMediaUrl } from "@/lib/storage/media-url";
import { isSupabaseConfigured } from "@/lib/env/public";
import type { CatalogCategory } from "@/features/catalog/types";

type CategoryRow = {
  id: string;
  icon_url: string | null;
  sort_order: number;
  category_translations: Array<{
    name: string;
    slug: string;
    description: string | null;
    meta_title: string | null;
    meta_description: string | null;
  }>;
};

const demoCategories: CatalogCategory[] = [
  {
    id: "demo-instagram",
    slug: "instagram",
    name: "Instagram Services",
    description: "Growth and verification services.",
    iconUrl: "/catalog/categories/instagram.jpg",
    productCount: 1,
  },
  {
    id: "demo-gaming",
    slug: "gaming",
    name: "Gaming",
    description: "Accounts and digital goods.",
    iconUrl: "/catalog/categories/gaming.jpg",
    productCount: 1,
  },
  {
    id: "demo-software",
    slug: "software",
    name: "Software",
    description: "License keys and downloads.",
    iconUrl: "/catalog/categories/software.jpg",
    productCount: 1,
  },
  {
    id: "demo-subscriptions",
    slug: "subscriptions",
    name: "Subscriptions",
    description: "Streaming and app plans.",
    iconUrl: "/catalog/categories/subscriptions.jpg",
    productCount: 1,
  },
];

async function countProductsByCategory(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("category_id")
    .eq("status", "active");

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
  }
  return counts;
}

function mapCategory(row: CategoryRow, counts: Record<string, number>): CatalogCategory | null {
  const translation = row.category_translations[0];
  if (!translation) return null;

  const iconUrl = row.icon_url ? resolveMediaUrl(row.icon_url) : null;

  return {
    id: row.id,
    slug: translation.slug,
    name: translation.name,
    description: translation.description,
    iconUrl,
    productCount: counts[row.id] ?? 0,
    metaTitle: translation.meta_title,
    metaDescription: translation.meta_description,
  };
}

export async function listCategories(locale: string): Promise<CatalogCategory[]> {
  if (!isSupabaseConfigured()) {
    return demoCategories;
  }

  try {
    const supabase = await createClient();
    const [counts, categoriesResult] = await Promise.all([
      countProductsByCategory(),
      supabase
        .from("categories")
        .select(
          `
          id,
          icon_url,
          sort_order,
          category_translations!inner (
            name,
            slug,
            description,
            meta_title,
            meta_description
          )
        `,
        )
        .eq("is_active", true)
        .eq("category_translations.locale", locale)
        .order("sort_order", { ascending: true }),
    ]);

    if (categoriesResult.error) throw categoriesResult.error;

    const items = (categoriesResult.data as unknown as CategoryRow[])
      .map((row) => mapCategory(row, counts))
      .filter((c): c is CatalogCategory => c !== null);

    return items.length > 0 ? items : demoCategories;
  } catch {
    if (process.env.NODE_ENV === "production") throw new Error("Failed to load categories");
    return demoCategories;
  }
}

export async function getCategoryBySlug(
  locale: string,
  slug: string,
): Promise<CatalogCategory | null> {
  const categories = await listCategories(locale);
  return categories.find((c) => c.slug === slug) ?? null;
}

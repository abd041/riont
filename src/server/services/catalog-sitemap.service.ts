import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env/public";
import { routing } from "@/i18n/routing";

export type SitemapEntry = {
  locale: string;
  path: string;
  lastModified?: Date;
};

const STATIC_PATHS = ["", "/products", "/categories", "/support"];

export async function getStorefrontSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  const now = new Date();

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({ locale, path, lastModified: now });
    }
  }

  if (!isSupabaseConfigured()) {
    return entries;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        updated_at,
        product_translations!inner (
          locale,
          slug
        )
      `,
      )
      .eq("status", "active");

    if (error) throw error;

    for (const product of data ?? []) {
      const translations = Array.isArray(product.product_translations)
        ? product.product_translations
        : [product.product_translations];

      for (const tr of translations) {
        if (!tr || typeof tr !== "object") continue;
        const row = tr as { locale: string; slug: string };
        entries.push({
          locale: row.locale,
          path: `/products/${row.slug}`,
          lastModified: product.updated_at
            ? new Date(product.updated_at as string)
            : now,
        });
      }
    }
  } catch {
    // Static entries only if catalog query fails
  }

  return entries;
}

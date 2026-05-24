import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env/public";

export type HeroBlockContent = {
  title: string;
  highlight: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export type TrustBlockContent = {
  items: Array<{ label: string }>;
};

export type HomePageContent = {
  hero: HeroBlockContent | null;
  trust: TrustBlockContent | null;
};

export type AdminContentBlock = {
  blockKey: string;
  locale: string;
  content: Record<string, unknown>;
  isActive: boolean;
  sortOrder: number;
};

const HERO_KEY = "home_hero";
const TRUST_KEY = "home_trust";

function parseHero(content: Record<string, unknown>): HeroBlockContent | null {
  const title = content.title;
  if (typeof title !== "string" || !title.trim()) return null;
  return {
    title,
    highlight: typeof content.highlight === "string" ? content.highlight : "",
    subtitle: typeof content.subtitle === "string" ? content.subtitle : "",
    primaryLabel:
      typeof content.primaryLabel === "string" ? content.primaryLabel : "",
    primaryHref:
      typeof content.primaryHref === "string" ? content.primaryHref : "/products",
    secondaryLabel:
      typeof content.secondaryLabel === "string" ? content.secondaryLabel : "",
    secondaryHref:
      typeof content.secondaryHref === "string"
        ? content.secondaryHref
        : "/categories",
  };
}

function parseTrust(content: Record<string, unknown>): TrustBlockContent | null {
  const raw = content.items;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const items = raw
    .map((item) => {
      if (typeof item === "object" && item && "label" in item) {
        const label = (item as { label: unknown }).label;
        if (typeof label === "string" && label.trim()) {
          return { label: label.trim() };
        }
      }
      return null;
    })
    .filter((item): item is { label: string } => item !== null);

  return items.length > 0 ? { items } : null;
}

async function fetchBlocksForLocale(locale: string): Promise<HomePageContent> {
  if (!isSupabaseConfigured()) {
    return { hero: null, trust: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_blocks")
    .select("block_key, content")
    .eq("locale", locale)
    .eq("is_active", true)
    .in("block_key", [HERO_KEY, TRUST_KEY]);

  if (error) throw error;

  let hero: HeroBlockContent | null = null;
  let trust: TrustBlockContent | null = null;

  for (const row of data ?? []) {
    const r = row as { block_key: string; content: Record<string, unknown> };
    if (r.block_key === HERO_KEY) hero = parseHero(r.content);
    if (r.block_key === TRUST_KEY) trust = parseTrust(r.content);
  }

  return { hero, trust };
}

export async function getHomePageContent(locale: string): Promise<HomePageContent> {
  return fetchBlocksForLocale(locale);
}

export async function listAdminHomepageBlocks(): Promise<AdminContentBlock[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("content_blocks")
    .select("block_key, locale, content, is_active, sort_order")
    .in("block_key", [HERO_KEY, TRUST_KEY])
    .order("block_key")
    .order("locale");

  if (error) throw error;

  return (data ?? []).map((row) => {
    const r = row as {
      block_key: string;
      locale: string;
      content: Record<string, unknown>;
      is_active: boolean;
      sort_order: number;
    };
    return {
      blockKey: r.block_key,
      locale: r.locale,
      content: r.content,
      isActive: r.is_active,
      sortOrder: r.sort_order,
    };
  });
}

export async function saveHomepageBlock(params: {
  blockKey: typeof HERO_KEY | typeof TRUST_KEY;
  locale: string;
  content: Record<string, unknown>;
  isActive?: boolean;
}): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("content_blocks").upsert(
    {
      block_key: params.blockKey,
      locale: params.locale,
      content: params.content,
      is_active: params.isActive ?? true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "block_key,locale" },
  );

  if (error) throw error;
}

export { HERO_KEY, TRUST_KEY };

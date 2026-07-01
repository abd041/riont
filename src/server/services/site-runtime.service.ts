import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env/public";
import { cache } from "react";
import { themeTokensToCssBlock } from "@/lib/theme/apply-theme";
import { resolveTheme } from "@/lib/theme/resolve-theme";
import type { ThemeGradients } from "@/lib/theme/gradients";
import {
  DEFAULT_THEME_PRESET,
  type ThemePresetId,
  type ThemeTokens,
} from "@/lib/theme/tokens";
import { resolveMediaUrl } from "@/lib/storage/media-url";
import {
  type SocialLinks,
  type StoreFeatures,
  type StoreRuntimeConfig,
  parseSocialLinks,
  parseStoreFeatures,
} from "@/lib/site/store-config";
import { HERO_SLIDE_IDS } from "@/lib/site/hero-slides";

const DEFAULT_HERO = "/hero/hero-marketplace-bg.png";

export type HeroSlideImages = Record<string, string>;

export type SiteRuntimeSettings = {
  preset: ThemePresetId;
  tokens: ThemeTokens;
  gradients: ThemeGradients;
  themeCss: string;
  heroBackgroundUrl: string | null;
  heroSlideImages: HeroSlideImages;
  logoUrl: string | null;
  features: StoreFeatures;
  socialLinks: SocialLinks;
  supportWhatsapp: string | null;
};

type SiteSettingsRow = {
  theme_preset: string | null;
  theme_config: unknown;
  hero_background_path: string | null;
  hero_slides: unknown;
  logo_path: string | null;
  store_features: unknown;
  social_links: unknown;
  support_whatsapp: string | null;
};

const SITE_SETTINGS_SELECT =
  "theme_preset, theme_config, hero_background_path, hero_slides, logo_path, store_features, social_links, support_whatsapp";

function normalizePreset(raw: string | null | undefined): ThemePresetId {
  if (raw === "bronze" || raw === "geist-dark") return raw;
  return DEFAULT_THEME_PRESET;
}

export function parseHeroSlideImages(raw: unknown): HeroSlideImages {
  const result: HeroSlideImages = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return result;
  }

  for (const slideId of HERO_SLIDE_IDS) {
    const path = (raw as Record<string, unknown>)[slideId];
    if (typeof path === "string" && path.trim()) {
      result[slideId] = resolveMediaUrl(path.trim());
    }
  }

  return result;
}

function buildSettings(row: SiteSettingsRow | null): SiteRuntimeSettings {
  const preset = normalizePreset(row?.theme_preset);
  const resolved = resolveTheme(preset, row?.theme_config);

  return {
    preset: resolved.preset,
    tokens: resolved.tokens,
    gradients: resolved.gradients,
    themeCss: themeTokensToCssBlock(resolved.tokens, resolved.gradients),
    heroBackgroundUrl: row?.hero_background_path
      ? resolveMediaUrl(row.hero_background_path)
      : null,
    heroSlideImages: parseHeroSlideImages(row?.hero_slides),
    logoUrl: row?.logo_path ? resolveMediaUrl(row.logo_path) : null,
    features: parseStoreFeatures(row?.store_features),
    socialLinks: parseSocialLinks(row?.social_links),
    supportWhatsapp: row?.support_whatsapp?.trim() || null,
  };
}

export const getSiteRuntimeSettings = cache(
  async function getSiteRuntimeSettings(): Promise<SiteRuntimeSettings> {
    if (!isSupabaseConfigured()) {
      return buildSettings(null);
    }

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select(SITE_SETTINGS_SELECT)
        .eq("id", "default")
        .maybeSingle();

      if (error) throw error;
      return buildSettings(data as SiteSettingsRow | null);
    } catch {
      return buildSettings(null);
    }
  },
);

export async function getAdminSiteRuntimeSettings(): Promise<SiteRuntimeSettings> {
  if (!isSupabaseConfigured()) {
    return buildSettings(null);
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("site_settings")
      .select(SITE_SETTINGS_SELECT)
      .eq("id", "default")
      .maybeSingle();

    if (error) throw error;
    return buildSettings(data as SiteSettingsRow | null);
  } catch {
    return buildSettings(null);
  }
}

export function getDefaultHeroBackground(): string {
  return DEFAULT_HERO;
}

/** @deprecated Use getSiteRuntimeSettings from site-runtime.service */
export async function getSiteAppearance() {
  const s = await getSiteRuntimeSettings();
  return {
    preset: s.preset,
    tokens: s.tokens,
    themeCss: s.themeCss,
    heroBackgroundUrl: s.heroBackgroundUrl,
    logoUrl: s.logoUrl,
  };
}

/** @deprecated Use getAdminSiteRuntimeSettings */
export async function getAdminSiteAppearance() {
  const s = await getAdminSiteRuntimeSettings();
  return {
    preset: s.preset,
    tokens: s.tokens,
    themeCss: s.themeCss,
    heroBackgroundUrl: s.heroBackgroundUrl,
    logoUrl: s.logoUrl,
  };
}

/** @deprecated Use getSiteRuntimeSettings */
export async function getStoreRuntimeConfig(): Promise<StoreRuntimeConfig> {
  const s = await getSiteRuntimeSettings();
  return {
    features: s.features,
    socialLinks: s.socialLinks,
    supportWhatsapp: s.supportWhatsapp,
  };
}

/** @deprecated Use getAdminSiteRuntimeSettings */
export async function getAdminStoreRuntimeConfig(): Promise<StoreRuntimeConfig> {
  const s = await getAdminSiteRuntimeSettings();
  return {
    features: s.features,
    socialLinks: s.socialLinks,
    supportWhatsapp: s.supportWhatsapp,
  };
}

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env/public";
import { themeTokensToCssBlock } from "@/lib/theme/apply-theme";
import {
  parseThemeOverrides,
  resolveThemeTokens,
} from "@/lib/theme/resolve-theme";
import {
  DEFAULT_THEME_PRESET,
  type ThemePresetId,
  type ThemeTokens,
} from "@/lib/theme/tokens";
import { resolveMediaUrl } from "@/lib/storage/media-url";
import { ServiceError } from "@/lib/domain/errors";

export type SiteAppearance = {
  preset: ThemePresetId;
  tokens: ThemeTokens;
  themeCss: string;
  heroBackgroundUrl: string | null;
  logoUrl: string | null;
};

const DEFAULT_HERO = "/hero/hero-marketplace-bg.png";

type SiteSettingsThemeRow = {
  theme_preset: string | null;
  theme_config: unknown;
  hero_background_path: string | null;
  logo_path: string | null;
};

function normalizePreset(raw: string | null | undefined): ThemePresetId {
  if (raw === "bronze" || raw === "geist-dark") return raw;
  return DEFAULT_THEME_PRESET;
}

function buildAppearance(row: SiteSettingsThemeRow | null): SiteAppearance {
  const preset = normalizePreset(row?.theme_preset);
  const overrides = parseThemeOverrides(row?.theme_config);
  const tokens = resolveThemeTokens(preset, overrides);

  return {
    preset,
    tokens,
    themeCss: themeTokensToCssBlock(tokens),
    heroBackgroundUrl: row?.hero_background_path
      ? resolveMediaUrl(row.hero_background_path)
      : null,
    logoUrl: row?.logo_path ? resolveMediaUrl(row.logo_path) : null,
  };
}

const THEME_SELECT =
  "theme_preset, theme_config, hero_background_path, logo_path";

export async function getSiteAppearance(): Promise<SiteAppearance> {
  if (!isSupabaseConfigured()) {
    return buildAppearance(null);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select(THEME_SELECT)
      .eq("id", "default")
      .maybeSingle();

    if (error) throw error;
    return buildAppearance(data as SiteSettingsThemeRow | null);
  } catch {
    return buildAppearance(null);
  }
}

export async function getAdminSiteAppearance(): Promise<SiteAppearance> {
  if (!isSupabaseConfigured()) {
    return buildAppearance(null);
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("site_settings")
      .select(THEME_SELECT)
      .eq("id", "default")
      .maybeSingle();

    if (error) throw error;
    return buildAppearance(data as SiteSettingsThemeRow | null);
  } catch {
    return buildAppearance(null);
  }
}

export async function updateThemeSettings(input: {
  preset: ThemePresetId;
  themeConfig: Partial<ThemeTokens>;
}): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .update({
      theme_preset: input.preset,
      theme_config: input.themeConfig,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (error) throw error;
}

export async function resetThemeSettings(): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .update({
      theme_preset: DEFAULT_THEME_PRESET,
      theme_config: {},
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (error) throw error;
}

const MAX_SITE_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function uploadSiteImage(
  file: File,
  folder: "theme/hero" | "theme/logo",
): Promise<string> {
  if (file.size > MAX_SITE_IMAGE_BYTES) {
    throw new ServiceError("VALIDATION", "Image must be 5 MB or smaller.");
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new ServiceError("VALIDATION", "Image must be JPG, PNG, or WebP.");
  }

  const admin = createAdminClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("product-images")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) {
    throw new ServiceError("INTERNAL", uploadError.message);
  }

  return path;
}

export async function uploadHeroBackground(file: File): Promise<string> {
  const path = await uploadSiteImage(file, "theme/hero");
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .update({
      hero_background_path: path,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (error) throw error;
  return path;
}

export async function clearHeroBackground(): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .update({
      hero_background_path: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (error) throw error;
}

export async function uploadSiteLogo(file: File): Promise<string> {
  const path = await uploadSiteImage(file, "theme/logo");
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .update({
      logo_path: path,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (error) throw error;
  return path;
}

export async function clearSiteLogo(): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .update({
      logo_path: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (error) throw error;
}

export function getDefaultHeroBackground(): string {
  return DEFAULT_HERO;
}

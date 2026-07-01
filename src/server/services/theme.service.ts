import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_THEME_PRESET,
  type ThemePresetId,
  type ThemeTokens,
} from "@/lib/theme/tokens";
import { ServiceError } from "@/lib/domain/errors";
import type { HeroSlideId } from "@/lib/site/hero-slides";
import {
  getAdminSiteRuntimeSettings,
  getSiteRuntimeSettings,
} from "@/server/services/site-runtime.service";

export type SiteAppearance = {
  preset: ThemePresetId;
  tokens: ThemeTokens;
  themeCss: string;
  heroBackgroundUrl: string | null;
  logoUrl: string | null;
};

const DEFAULT_HERO = "/hero/hero-marketplace-bg.png";

export async function getSiteAppearance(): Promise<SiteAppearance> {
  const s = await getSiteRuntimeSettings();
  return {
    preset: s.preset,
    tokens: s.tokens,
    themeCss: s.themeCss,
    heroBackgroundUrl: s.heroBackgroundUrl,
    logoUrl: s.logoUrl,
  };
}

export async function getAdminSiteAppearance(): Promise<SiteAppearance> {
  const s = await getAdminSiteRuntimeSettings();
  return {
    preset: s.preset,
    tokens: s.tokens,
    themeCss: s.themeCss,
    heroBackgroundUrl: s.heroBackgroundUrl,
    logoUrl: s.logoUrl,
  };
}

export async function updateThemeSettings(input: {
  preset: ThemePresetId;
  themeConfig: Record<string, unknown>;
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

async function readHeroSlidesMap(): Promise<Record<string, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("site_settings")
    .select("hero_slides")
    .eq("id", "default")
    .maybeSingle();

  if (error) throw error;
  const raw = data?.hero_slides;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  return { ...(raw as Record<string, string>) };
}

async function writeHeroSlidesMap(slides: Record<string, string>): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .update({
      hero_slides: slides,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (error) throw error;
}

export async function uploadHeroSlideImage(
  slideId: HeroSlideId,
  file: File,
): Promise<string> {
  const path = await uploadSiteImage(file, "theme/hero");
  const slides = await readHeroSlidesMap();
  slides[slideId] = path;
  await writeHeroSlidesMap(slides);
  return path;
}

export async function clearHeroSlideImage(slideId: HeroSlideId): Promise<void> {
  const slides = await readHeroSlidesMap();
  delete slides[slideId];
  await writeHeroSlidesMap(slides);
}

export async function updateHeroSlideContent(
  content: Record<string, unknown>,
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .update({
      hero_slide_content: content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (error) throw error;
}

export function getDefaultHeroBackground(): string {
  return DEFAULT_HERO;
}

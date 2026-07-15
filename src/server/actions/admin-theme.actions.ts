"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { HeroSlideId } from "@/lib/site/hero-slides";
import { writeAuditLog } from "@/server/services/audit.service";
import {
  clearHeroBackground,
  clearHeroSlideImage,
  clearSiteLogo,
  resetThemeSettings,
  updateThemeSettings,
  uploadHeroBackground,
  uploadHeroSlideImage,
  uploadSiteLogo,
  updateHeroSlideContent,
} from "@/server/services/theme.service";
import { saveThemeSettingsSchema } from "@/validations/theme.schema";
import { saveHeroSlideContentSchema } from "@/validations/hero-slide-content.schema";
import type { HeroSlideContentMap } from "@/lib/site/hero-slide-content";

export type ThemeActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

function revalidateThemePaths(): void {
  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");
  revalidatePath("/ar", "layout");
  revalidatePath("/admin/appearance");
}

export async function saveThemeSettingsAction(
  _prev: ThemeActionResult | null,
  formData: FormData,
): Promise<ThemeActionResult> {
  let themeConfigRaw: unknown = {};
  const configJson = formData.get("themeConfig");
  if (typeof configJson === "string" && configJson.trim()) {
    try {
      themeConfigRaw = JSON.parse(configJson);
    } catch {
      return { success: false, error: "Invalid theme data" };
    }
  }

  const parsed = saveThemeSettingsSchema.safeParse({
    preset: formData.get("preset"),
    themeConfig: themeConfigRaw,
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid theme settings" };
  }

  try {
    const { user } = await requireAdmin();
    const { preset } = parsed.data;

    await updateThemeSettings({
      preset,
      themeConfig: parsed.data.themeConfig as Record<string, unknown>,
    });

    await writeAuditLog({
      actorUserId: user.id,
      action: "theme.updated",
      entityType: "site_settings",
      entityId: "default",
    });

    revalidateThemePaths();
    return { success: true, message: "Theme saved — storefront updated." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save theme" };
  }
}

export async function resetThemeSettingsAction(): Promise<ThemeActionResult> {
  try {
    const { user } = await requireAdmin();
    await resetThemeSettings();
    await writeAuditLog({
      actorUserId: user.id,
      action: "theme.reset",
      entityType: "site_settings",
      entityId: "default",
    });
    revalidateThemePaths();
    return { success: true, message: "Theme reset to default." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not reset theme" };
  }
}

export async function uploadHeroBackgroundAction(
  _prev: ThemeActionResult | null,
  formData: FormData,
): Promise<ThemeActionResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Choose an image file" };
  }

  try {
    const { user } = await requireAdmin();
    await uploadHeroBackground(file);
    await writeAuditLog({
      actorUserId: user.id,
      action: "theme.hero_updated",
      entityType: "site_settings",
      entityId: "default",
    });
    revalidateThemePaths();
    revalidatePath("/admin/homepage");
    return { success: true, message: "Hero cover image updated." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = error instanceof Error ? error.message : "Upload failed";
    return { success: false, error: msg };
  }
}

export async function clearHeroBackgroundAction(): Promise<ThemeActionResult> {
  try {
    const { user } = await requireAdmin();
    await clearHeroBackground();
    await writeAuditLog({
      actorUserId: user.id,
      action: "theme.hero_cleared",
      entityType: "site_settings",
      entityId: "default",
    });
    revalidateThemePaths();
    return { success: true, message: "Hero cover reset to default." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not clear hero image" };
  }
}

export async function uploadSiteLogoAction(
  _prev: ThemeActionResult | null,
  formData: FormData,
): Promise<ThemeActionResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Choose an image file" };
  }

  try {
    const { user } = await requireAdmin();
    await uploadSiteLogo(file);
    await writeAuditLog({
      actorUserId: user.id,
      action: "theme.logo_updated",
      entityType: "site_settings",
      entityId: "default",
    });
    revalidateThemePaths();
    return { success: true, message: "Logo updated." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = error instanceof Error ? error.message : "Upload failed";
    return { success: false, error: msg };
  }
}

export async function clearSiteLogoAction(): Promise<ThemeActionResult> {
  try {
    const { user } = await requireAdmin();
    await clearSiteLogo();
    await writeAuditLog({
      actorUserId: user.id,
      action: "theme.logo_cleared",
      entityType: "site_settings",
      entityId: "default",
    });
    revalidateThemePaths();
    return { success: true, message: "Logo reset to default." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not clear logo" };
  }
}

export async function uploadHeroSlideImageAction(
  _prev: ThemeActionResult | null,
  formData: FormData,
): Promise<ThemeActionResult> {
  const slideId = formData.get("slideId");
  const file = formData.get("file");
  if (typeof slideId !== "string" || !slideId.trim()) {
    return { success: false, error: "Invalid slide" };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Choose an image file" };
  }

  try {
    const { user } = await requireAdmin();
    await uploadHeroSlideImage(slideId as HeroSlideId, file);
    await writeAuditLog({
      actorUserId: user.id,
      action: "theme.hero_slide_updated",
      entityType: "site_settings",
      entityId: slideId,
    });
    revalidateThemePaths();
    return { success: true, message: "Slide image updated." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const msg = error instanceof Error ? error.message : "Upload failed";
    return { success: false, error: msg };
  }
}

export async function clearHeroSlideImageAction(
  slideId: string,
): Promise<ThemeActionResult> {
  if (!slideId.trim()) {
    return { success: false, error: "Invalid slide" };
  }

  try {
    const { user } = await requireAdmin();
    await clearHeroSlideImage(slideId as HeroSlideId);
    await writeAuditLog({
      actorUserId: user.id,
      action: "theme.hero_slide_cleared",
      entityType: "site_settings",
      entityId: slideId,
    });
    revalidateThemePaths();
    return { success: true, message: "Slide image reset." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not clear slide image" };
  }
}

function parseHeroSlideContentForm(formData: FormData): HeroSlideContentMap {
  const slides: HeroSlideContentMap = {};
  const slideIds = ["promo-deals", "promo-gaming", "promo-instant"] as const;
  const locales = ["en", "ar"] as const;
  const fields = ["title", "highlight", "subtitle", "tag"] as const;

  for (const slideId of slideIds) {
    const en: Record<string, string> = {};
    const ar: Record<string, string> = {};

    for (const locale of locales) {
      const target = locale === "en" ? en : ar;
      for (const field of fields) {
        const key = `${slideId}_${locale}_${field}`;
        const raw = formData.get(key);
        if (typeof raw === "string" && raw.trim()) {
          target[field] = raw.trim();
        }
      }
    }

    const entry: HeroSlideContentMap[typeof slideId] = {};
    if (Object.keys(en).length > 0) {
      entry.en = {
        title: en.title ?? "",
        highlight: en.highlight ?? "",
        subtitle: en.subtitle ?? "",
        tag: en.tag ?? "",
      };
    }
    if (Object.keys(ar).length > 0) {
      entry.ar = {
        title: ar.title ?? "",
        highlight: ar.highlight ?? "",
        subtitle: ar.subtitle ?? "",
        tag: ar.tag ?? "",
      };
    }
    if (entry.en || entry.ar) {
      slides[slideId] = entry;
    }
  }

  return slides;
}

export async function saveHeroSlideContentAction(
  _prev: ThemeActionResult | null,
  formData: FormData,
): Promise<ThemeActionResult> {
  const content = parseHeroSlideContentForm(formData);
  const parsed = saveHeroSlideContentSchema.safeParse({ slides: content });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      success: false,
      error: first?.message ?? "Invalid hero slide content",
    };
  }

  try {
    const { user } = await requireAdmin();
    await updateHeroSlideContent(parsed.data.slides as Record<string, unknown>);
    await writeAuditLog({
      actorUserId: user.id,
      action: "theme.hero_slide_content_updated",
      entityType: "site_settings",
      entityId: "default",
    });
    revalidateThemePaths();
    return { success: true, message: "Hero slide text saved." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save hero slide text" };
  }
}

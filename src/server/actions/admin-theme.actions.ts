"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { requireAdmin } from "@/lib/auth/require-admin";
import { deriveAccentScale } from "@/lib/theme/derive-tokens";
import { writeAuditLog } from "@/server/services/audit.service";
import {
  clearHeroBackground,
  clearSiteLogo,
  resetThemeSettings,
  updateThemeSettings,
  uploadHeroBackground,
  uploadSiteLogo,
} from "@/server/services/theme.service";
import { saveThemeSettingsSchema } from "@/validations/theme.schema";

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
    const { preset, themeConfig } = parsed.data;

    let overrides = { ...themeConfig };

  const accentOnly = formData.get("accentOnly");
  if (accentOnly === "true" && themeConfig.accent500) {
    overrides = {
      ...overrides,
      ...deriveAccentScale(themeConfig.accent500),
    };
  }

    await updateThemeSettings({
      preset,
      themeConfig: overrides,
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

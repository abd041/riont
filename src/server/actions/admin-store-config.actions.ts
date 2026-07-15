"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { requireAdmin } from "@/lib/auth/require-admin";
import { writeAuditLog } from "@/server/services/audit.service";
import { updateStoreConfig } from "@/server/services/store-config.service";
import { saveStoreFeaturesSchema } from "@/validations/store-config.schema";
import { getAdminStoreRuntimeConfig } from "@/server/services/store-config.service";

export type StoreConfigActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

function revalidateStorePaths(): void {
  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");
  revalidatePath("/ar", "layout");
  revalidatePath("/admin/appearance");
}

export async function saveStoreConfigAction(
  _prev: StoreConfigActionResult | null,
  formData: FormData,
): Promise<StoreConfigActionResult> {
  const parsed = saveStoreFeaturesSchema.safeParse({
    heroAutoplay: formData.get("heroAutoplay") === "on",
    floatingWhatsappEnabled: formData.get("floatingWhatsappEnabled") === "on",
    maintenanceMode: formData.get("maintenanceMode") === "on",
    maintenanceMessageEn: formData.get("maintenanceMessageEn") ?? "",
    maintenanceMessageAr: formData.get("maintenanceMessageAr") ?? "",
    showFooterSocial: formData.get("showFooterSocial") === "on",
    showFooterNewsletter: formData.get("showFooterNewsletter") === "on",
    promoBannerEnabled: formData.get("promoBannerEnabled") === "on",
    promoBannerTextEn: formData.get("promoBannerTextEn") ?? "",
    promoBannerTextAr: formData.get("promoBannerTextAr") ?? "",
    promoBannerHref: formData.get("promoBannerHref") ?? "",
    twitter: formData.get("twitter") ?? "",
    discord: formData.get("discord") ?? "",
    instagram: formData.get("instagram") ?? "",
    email: formData.get("email") ?? "",
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      success: false,
      error: first?.message ?? "Invalid store settings",
    };
  }

  const d = parsed.data;

  try {
    const { user } = await requireAdmin();
    const current = await getAdminStoreRuntimeConfig();
    await updateStoreConfig({
      features: {
        ...current.features,
        heroAutoplay: d.heroAutoplay,
        floatingWhatsappEnabled: d.floatingWhatsappEnabled,
        maintenanceMode: d.maintenanceMode,
        maintenanceMessageEn: d.maintenanceMessageEn?.trim() ?? "",
        maintenanceMessageAr: d.maintenanceMessageAr?.trim() ?? "",
        showFooterSocial: d.showFooterSocial,
        showFooterNewsletter: d.showFooterNewsletter,
        promoBannerEnabled: d.promoBannerEnabled,
        promoBannerTextEn: d.promoBannerTextEn?.trim() ?? "",
        promoBannerTextAr: d.promoBannerTextAr?.trim() ?? "",
        promoBannerHref: d.promoBannerHref?.trim() ?? "",
      },
      socialLinks: {
        twitter: d.twitter?.trim() ?? "",
        discord: d.discord?.trim() ?? "",
        instagram: d.instagram?.trim() ?? "",
        email: d.email?.trim() ?? "",
      },
    });

    await writeAuditLog({
      actorUserId: user.id,
      action: "store_config.updated",
      entityType: "site_settings",
      entityId: "default",
    });

    revalidateStorePaths();
    return { success: true, message: "Store controls saved." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save store controls" };
  }
}

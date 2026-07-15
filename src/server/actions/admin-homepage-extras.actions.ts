"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { requireAdmin } from "@/lib/auth/require-admin";
import { writeAuditLog } from "@/server/services/audit.service";
import {
  getAdminStoreRuntimeConfig,
  updateStoreConfig,
} from "@/server/services/store-config.service";
import {
  DEFAULT_HOMEPAGE_EXTRAS,
  type HomepageExtras,
  type LiveStatusItem,
  type PathCard,
  type RiyontPick,
  type StatItem,
} from "@/lib/site/homepage-extras";
import type { StoreConfigActionResult } from "@/server/actions/admin-store-config.actions";

function linesToArray(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseStatusItems(formData: FormData): LiveStatusItem[] {
  const items: LiveStatusItem[] = [];
  for (let i = 1; i <= 3; i++) {
    items.push({
      labelEn: String(formData.get(`status${i}LabelEn`) ?? ""),
      labelAr: String(formData.get(`status${i}LabelAr`) ?? ""),
      valueEn: String(formData.get(`status${i}ValueEn`) ?? ""),
      valueAr: String(formData.get(`status${i}ValueAr`) ?? ""),
    });
  }
  return items.some((i) => i.labelEn || i.valueEn)
    ? items
    : DEFAULT_HOMEPAGE_EXTRAS.liveStatusItems;
}

function parseStatsItems(formData: FormData): StatItem[] {
  const items: StatItem[] = [];
  for (let i = 1; i <= 3; i++) {
    items.push({
      valueEn: String(formData.get(`stat${i}ValueEn`) ?? ""),
      valueAr: String(formData.get(`stat${i}ValueAr`) ?? ""),
      labelEn: String(formData.get(`stat${i}LabelEn`) ?? ""),
      labelAr: String(formData.get(`stat${i}LabelAr`) ?? ""),
    });
  }
  return items.some((i) => i.valueEn || i.labelEn)
    ? items
    : DEFAULT_HOMEPAGE_EXTRAS.statsItems;
}

function parsePathCards(formData: FormData): PathCard[] {
  const items: PathCard[] = [];
  for (let i = 1; i <= 3; i++) {
    items.push({
      titleEn: String(formData.get(`path${i}TitleEn`) ?? ""),
      titleAr: String(formData.get(`path${i}TitleAr`) ?? ""),
      descriptionEn: String(formData.get(`path${i}DescEn`) ?? ""),
      descriptionAr: String(formData.get(`path${i}DescAr`) ?? ""),
      href: String(formData.get(`path${i}Href`) ?? "") || "/",
    });
  }
  return items.some((i) => i.titleEn)
    ? items
    : DEFAULT_HOMEPAGE_EXTRAS.pathCards;
}

function parseRiyontPicks(formData: FormData): RiyontPick[] {
  const items: RiyontPick[] = [];
  for (let i = 1; i <= 3; i++) {
    const productId = String(formData.get(`pick${i}ProductId`) ?? "").trim();
    if (!productId) continue;
    items.push({
      productId,
      reasonEn: String(formData.get(`pick${i}ReasonEn`) ?? ""),
      reasonAr: String(formData.get(`pick${i}ReasonAr`) ?? ""),
    });
  }
  return items;
}

export async function saveHomepageExtrasAction(
  _prev: StoreConfigActionResult | null,
  formData: FormData,
): Promise<StoreConfigActionResult> {
  const extras: HomepageExtras = {
    liveStatusEnabled: formData.get("liveStatusEnabled") === "on",
    liveStatusItems: parseStatusItems(formData),
    statsEnabled: formData.get("statsEnabled") === "on",
    statsItems: parseStatsItems(formData),
    trustStripEnabled: formData.get("trustStripEnabled") === "on",
    heroCoverMode:
      formData.get("heroCoverMode") === "static" ? "static" : "animated",
    heroPhrasesEn: linesToArray(formData.get("heroPhrasesEn")),
    heroPhrasesAr: linesToArray(formData.get("heroPhrasesAr")),
    showInstantFilter: formData.get("showInstantFilter") === "on",
    mostRequestedIds: linesToArray(formData.get("mostRequestedIds")),
    pathCards: parsePathCards(formData),
    riyontPicks: parseRiyontPicks(formData),
  };

  try {
    const { user } = await requireAdmin();
    const current = await getAdminStoreRuntimeConfig();
    await updateStoreConfig({
      features: {
        ...current.features,
        homepageExtras: extras,
      },
      socialLinks: current.socialLinks,
    });

    await writeAuditLog({
      actorUserId: user.id,
      action: "homepage_extras.updated",
      entityType: "site_settings",
      entityId: "default",
    });

    revalidatePath("/", "layout");
    revalidatePath("/en", "layout");
    revalidatePath("/ar", "layout");
    revalidatePath("/admin/homepage");

    return { success: true, message: "Homepage extras saved." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save homepage extras" };
  }
}

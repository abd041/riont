"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  HERO_KEY,
  TRUST_KEY,
  saveHomepageBlock,
} from "@/server/services/content-block.service";
import {
  saveHeroBlockSchema,
  saveTrustBlockSchema,
} from "@/validations/admin-content.schema";

export type ContentActionResult =
  | { success: true }
  | { success: false; error: string };

export async function saveHeroBlockAction(
  _prev: ContentActionResult | null,
  formData: FormData,
): Promise<ContentActionResult> {
  await requireAdmin();

  const parsed = saveHeroBlockSchema.safeParse({
    locale: formData.get("locale"),
    title: formData.get("title"),
    highlight: formData.get("highlight") || undefined,
    subtitle: formData.get("subtitle") || undefined,
    primaryLabel: formData.get("primaryLabel") || undefined,
    primaryHref: formData.get("primaryHref") || undefined,
    secondaryLabel: formData.get("secondaryLabel") || undefined,
    secondaryHref: formData.get("secondaryHref") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid hero content" };
  }

  const d = parsed.data;
  await saveHomepageBlock({
    blockKey: HERO_KEY,
    locale: d.locale,
    content: {
      title: d.title,
      highlight: d.highlight ?? "",
      subtitle: d.subtitle ?? "",
      primaryLabel: d.primaryLabel ?? "",
      primaryHref: d.primaryHref ?? "/products",
      secondaryLabel: d.secondaryLabel ?? "",
      secondaryHref: d.secondaryHref ?? "/categories",
    },
  });

  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/ar");
  revalidatePath("/admin/homepage");
  return { success: true };
}

export async function saveTrustBlockAction(
  _prev: ContentActionResult | null,
  formData: FormData,
): Promise<ContentActionResult> {
  await requireAdmin();

  const parsed = saveTrustBlockSchema.safeParse({
    locale: formData.get("locale"),
    item1: formData.get("item1"),
    item2: formData.get("item2"),
    item3: formData.get("item3"),
    item4: formData.get("item4"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid trust bar content" };
  }

  const d = parsed.data;
  await saveHomepageBlock({
    blockKey: TRUST_KEY,
    locale: d.locale,
    content: {
      items: [
        { label: d.item1 },
        { label: d.item2 },
        { label: d.item3 },
        { label: d.item4 },
      ],
    },
  });

  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/ar");
  revalidatePath("/admin/homepage");
  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  archiveProduct,
  saveCategory,
  saveCoupon,
  saveProduct,
  updateSiteSettings,
  uploadProductImage,
} from "@/server/services/admin-catalog.service";
import {
  saveCategorySchema,
  saveCouponSchema,
  saveProductSchema,
  siteSettingsSchema,
} from "@/validations/admin-catalog.schema";

export type CatalogActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

function parseProductForm(formData: FormData) {
  return saveProductSchema.safeParse({
    productId: formData.get("productId") || undefined,
    categoryId: formData.get("categoryId"),
    status: formData.get("status"),
    deliveryMode: formData.get("deliveryMode"),
    priceCents: formData.get("priceCents"),
    compareAtCents: formData.get("compareAtCents") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: formData.get("sortOrder") || 0,
    en: {
      name: formData.get("enName"),
      slug: formData.get("enSlug"),
      shortDescription: formData.get("enShortDescription") || undefined,
      description: formData.get("enDescription") || undefined,
    },
    ar: {
      name: formData.get("arName"),
      slug: formData.get("arSlug"),
      shortDescription: formData.get("arShortDescription") || undefined,
      description: formData.get("arDescription") || undefined,
    },
  });
}

export async function saveProductAction(
  _prev: CatalogActionResult | null,
  formData: FormData,
): Promise<CatalogActionResult> {
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { success: false, error: "Invalid product data" };
  }

  try {
    await requireAdmin();
    const { productId } = await saveProduct(parsed.data);

    const image = formData.get("image");
    if (image instanceof File && image.size > 0) {
      await uploadProductImage(productId, image);
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/en/products");
    revalidatePath("/ar/products");
    redirect(`/admin/products/${productId}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save product" };
  }
}

export async function archiveProductAction(
  _prev: CatalogActionResult | null,
  formData: FormData,
): Promise<CatalogActionResult> {
  const productId = formData.get("productId");
  if (typeof productId !== "string") {
    return { success: false, error: "Invalid product" };
  }

  try {
    await requireAdmin();
    await archiveProduct(productId);
    revalidatePath("/admin/products");
    return { success: true, message: "Product archived" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not archive product" };
  }
}

export async function saveCategoryAction(
  _prev: CatalogActionResult | null,
  formData: FormData,
): Promise<CatalogActionResult> {
  const parsed = saveCategorySchema.safeParse({
    categoryId: formData.get("categoryId") || undefined,
    sortOrder: formData.get("sortOrder") ?? 0,
    iconUrl: formData.get("iconUrl") || undefined,
    en: {
      name: formData.get("enName"),
      slug: formData.get("enSlug"),
      description: formData.get("enDescription") || undefined,
    },
    ar: {
      name: formData.get("arName"),
      slug: formData.get("arSlug"),
      description: formData.get("arDescription") || undefined,
    },
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid category data" };
  }

  try {
    await requireAdmin();
    await saveCategory(parsed.data);
    revalidatePath("/admin/categories");
    revalidatePath("/en/categories");
    return { success: true, message: "Category saved" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save category" };
  }
}

export async function saveCouponAction(
  _prev: CatalogActionResult | null,
  formData: FormData,
): Promise<CatalogActionResult> {
  const parsed = saveCouponSchema.safeParse({
    couponId: formData.get("couponId") || undefined,
    code: formData.get("code"),
    couponType: formData.get("couponType"),
    value: formData.get("value"),
    minOrderCents: formData.get("minOrderCents") || undefined,
    maxDiscountCents: formData.get("maxDiscountCents") || undefined,
    usageLimit: formData.get("usageLimit") || undefined,
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid coupon data" };
  }

  try {
    await requireAdmin();
    await saveCoupon(parsed.data);
    revalidatePath("/admin/coupons");
    return { success: true, message: "Coupon saved" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save coupon" };
  }
}

export async function deleteCouponAction(
  _prev: CatalogActionResult | null,
  formData: FormData,
): Promise<CatalogActionResult> {
  const couponId = formData.get("couponId");
  if (typeof couponId !== "string") {
    return { success: false, error: "Invalid coupon" };
  }

  try {
    await requireAdmin();
    const { deleteCoupon } = await import(
      "@/server/services/admin-catalog.service"
    );
    await deleteCoupon(couponId);
    revalidatePath("/admin/coupons");
    return { success: true, message: "Coupon deleted" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not delete coupon" };
  }
}

export async function saveSiteSettingsAction(
  _prev: CatalogActionResult | null,
  formData: FormData,
): Promise<CatalogActionResult> {
  const parsed = siteSettingsSchema.safeParse({
    paymentInstructionsEn: formData.get("paymentInstructionsEn"),
    paymentInstructionsAr: formData.get("paymentInstructionsAr"),
    supportEmail: formData.get("supportEmail") || "",
    supportWhatsapp: formData.get("supportWhatsapp") || "",
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid settings" };
  }

  try {
    await requireAdmin();
    await updateSiteSettings(parsed.data);
    revalidatePath("/admin/settings");
    return { success: true, message: "Settings saved" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save settings" };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { requireAdmin } from "@/lib/auth/require-admin";
import { writeAuditLog } from "@/server/services/audit.service";
import {
  archiveProduct,
  archiveCategory,
  saveCategory,
  saveCoupon,
  saveProduct,
  saveAdminProductFields,
  saveAdminProductRelated,
  saveAdminProductVariants,
  updateSiteSettings,
  uploadProductImage,
} from "@/server/services/admin-catalog.service";
import { ServiceError } from "@/lib/domain/errors";
import { parseDollarsInput } from "@/lib/admin/money";
import {
  saveCategorySchema,
  saveCouponSchema,
  saveProductSchema,
  siteSettingsSchema,
} from "@/validations/admin-catalog.schema";

export type CatalogActionResult =
  | { success: true; message?: string; categoryId?: string }
  | { success: false; error: string };

function formatProductValidationError(
  issues: Array<{ path: PropertyKey[]; message: string }>,
): string {
  const first = issues[0];
  if (!first) return "Please check the form and try again.";
  const field = first.path.map(String).join(" · ");
  const friendly: Record<string, string> = {
    priceCents: "Sale price",
    compareAtCents: "Original price",
    categoryId: "Category",
    "en.name": "English product name",
    "en.slug": "English link name",
    "ar.name": "Arabic product name",
    "ar.slug": "Arabic link name",
  };
  const label = friendly[field] ?? field;
  return `${label}: ${first.message}`;
}

function parseProductForm(formData: FormData) {
  const priceCents = parseDollarsInput(formData.get("priceDollars"));
  const compareAtCents = parseDollarsInput(formData.get("compareAtDollars"));
  const trustBadges = formData
    .getAll("trustBadges")
    .filter((v): v is string => typeof v === "string");

  const extraFeeDollars = parseDollarsInput(formData.get("extraFeeDollars"));
  const extraFeeType = String(formData.get("extraFeeType") || "none");
  const extraFeePercent = Number(formData.get("extraFeePercent") || 0);
  const extraFeeValue =
    extraFeeType === "fixed"
      ? (extraFeeDollars ?? 0)
      : extraFeeType === "percent"
        ? Math.max(0, Math.floor(extraFeePercent))
        : 0;

  return saveProductSchema.safeParse({
    productId: formData.get("productId") || undefined,
    categoryId: formData.get("categoryId"),
    status: formData.get("status"),
    deliveryMode: formData.get("deliveryMode"),
    availabilityStatus: formData.get("availabilityStatus") || "available_now",
    extraFeeType,
    extraFeeValue,
    trustBadges,
    manualDailySlotLimit: formData.get("manualDailySlotLimit") || null,
    manualSlotsRemaining: formData.get("manualSlotsRemaining") || null,
    priceCents: priceCents ?? formData.get("priceCents"),
    compareAtCents:
      compareAtCents !== undefined
        ? compareAtCents
        : formData.get("compareAtCents") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: formData.get("sortOrder") || 0,
    badge: formData.get("badge") || "none",
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
    return {
      success: false,
      error: formatProductValidationError(parsed.error.issues),
    };
  }

  try {
    const { user } = await requireAdmin();
    const { productId } = await saveProduct(parsed.data);

    const image = formData.get("image");
    if (image instanceof File && image.size > 0) {
      await uploadProductImage(productId, image);
    }

    await writeAuditLog({
      actorUserId: user.id,
      action: parsed.data.productId ? "product.updated" : "product.created",
      entityType: "product",
      entityId: productId,
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/en/products");
    revalidatePath("/ar/products");

    const isCreate = !parsed.data.productId;
    redirect(
      isCreate
        ? `/admin/products/${productId}?welcome=1`
        : `/admin/products/${productId}?saved=1`,
    );
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof ServiceError) {
      return { success: false, error: error.message };
    }
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: string }).code)
        : "";
    if (code === "23505") {
      return {
        success: false,
        error:
          "That link name is already used. Change the English or Arabic link name and try again.",
      };
    }
    return { success: false, error: "Could not save product. Please try again." };
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
    const { user } = await requireAdmin();
    await archiveProduct(productId);
    await writeAuditLog({
      actorUserId: user.id,
      action: "product.archived",
      entityType: "product",
      entityId: productId,
    });
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
    const first = parsed.error.issues[0];
    const field = first?.path.map(String).join(" · ") ?? "form";
    return {
      success: false,
      error: first ? `${field}: ${first.message}` : "Invalid category data",
    };
  }

  try {
    await requireAdmin();
    const { categoryId } = await saveCategory(parsed.data);
    revalidatePath("/admin/categories");
    revalidatePath("/en/categories");
    revalidatePath("/ar/categories");
    const isCreate = !parsed.data.categoryId;
    return {
      success: true,
      message: isCreate ? "Category created" : "Category updated",
      categoryId,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof ServiceError) {
      return { success: false, error: error.message };
    }
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: string }).code)
        : "";
    if (code === "23505") {
      return {
        success: false,
        error:
          "That link name is already used. Change the English or Arabic link name.",
      };
    }
    return { success: false, error: "Could not save category. Please try again." };
  }
}

export async function archiveCategoryAction(
  _prev: CatalogActionResult | null,
  formData: FormData,
): Promise<CatalogActionResult> {
  const categoryId = formData.get("categoryId");
  if (typeof categoryId !== "string" || !categoryId) {
    return { success: false, error: "Invalid category" };
  }

  try {
    const { user } = await requireAdmin();
    await archiveCategory(categoryId);
    await writeAuditLog({
      actorUserId: user.id,
      action: "category.archived",
      entityType: "category",
      entityId: categoryId,
    });
    revalidatePath("/admin/categories");
    revalidatePath("/en/categories");
    revalidatePath("/ar/categories");
    return { success: true, message: "Category hidden from storefront" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof ServiceError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not archive category" };
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
    const { user } = await requireAdmin();
    await updateSiteSettings(parsed.data);
    await writeAuditLog({
      actorUserId: user.id,
      action: "settings.updated",
      entityType: "site_settings",
      entityId: "default",
    });
    revalidatePath("/admin/settings");
    return { success: true, message: "Settings saved" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save settings" };
  }
}

function parseJsonArray<T>(raw: FormDataEntryValue | null): T[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveProductVariantsAction(
  _prev: CatalogActionResult | null,
  formData: FormData,
): Promise<CatalogActionResult> {
  const productId = formData.get("productId");
  if (typeof productId !== "string") {
    return { success: false, error: "Invalid product" };
  }

  try {
    const { user } = await requireAdmin();
    const variants = parseJsonArray<{
      nameEn: string;
      nameAr: string;
      priceCents: number;
      compareAtCents?: number | null;
      offerLabelEn?: string;
      offerLabelAr?: string;
      isDefault?: boolean;
      sortOrder?: number;
    }>(formData.get("variantsJson"));

    await saveAdminProductVariants(
      productId,
      variants.map((variant, index) => ({
        ...variant,
        isDefault: variant.isDefault ?? index === 0,
        sortOrder: variant.sortOrder ?? index,
      })),
    );
    await writeAuditLog({
      actorUserId: user.id,
      action: "product.options_saved",
      entityType: "product",
      entityId: productId,
      metadata: { count: variants.length },
    });
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/en/products");
    revalidatePath("/ar/products");
    return { success: true, message: "Options saved" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save options" };
  }
}

export async function saveProductFieldsAction(
  _prev: CatalogActionResult | null,
  formData: FormData,
): Promise<CatalogActionResult> {
  const productId = formData.get("productId");
  if (typeof productId !== "string") {
    return { success: false, error: "Invalid product" };
  }

  try {
    const { user } = await requireAdmin();
    const fields = parseJsonArray<{
      fieldKey: string;
      fieldType: string;
      labelEn: string;
      labelAr: string;
      helpEn?: string;
      helpAr?: string;
      required?: boolean;
      isSensitive?: boolean;
      sortOrder?: number;
    }>(formData.get("fieldsJson"));

    await saveAdminProductFields(
      productId,
      fields.map((field, index) => ({
        ...field,
        required: field.required ?? false,
        isSensitive: field.isSensitive ?? false,
        sortOrder: field.sortOrder ?? index,
      })),
    );
    await writeAuditLog({
      actorUserId: user.id,
      action: "product.fields_saved",
      entityType: "product",
      entityId: productId,
      metadata: { count: fields.length },
    });
    revalidatePath(`/admin/products/${productId}`);
    return { success: true, message: "Fields saved" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save fields" };
  }
}

export async function saveProductRelatedAction(
  _prev: CatalogActionResult | null,
  formData: FormData,
): Promise<CatalogActionResult> {
  const productId = formData.get("productId");
  if (typeof productId !== "string") {
    return { success: false, error: "Invalid product" };
  }

  try {
    const { user } = await requireAdmin();
    const relatedIds = parseJsonArray<string>(formData.get("relatedIdsJson"));
    await saveAdminProductRelated(productId, relatedIds);
    await writeAuditLog({
      actorUserId: user.id,
      action: "product.related_saved",
      entityType: "product",
      entityId: productId,
      metadata: { count: relatedIds.length },
    });
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/en/products");
    revalidatePath("/ar/products");
    return { success: true, message: "Related products saved" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save related products" };
  }
}

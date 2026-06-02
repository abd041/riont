import { createAdminClient } from "@/lib/supabase/admin";
import { ServiceError } from "@/lib/domain/errors";
import { slugify } from "@/lib/utils/slugify";
import type { z } from "zod";
import type {
  saveCategorySchema,
  saveCouponSchema,
  saveProductSchema,
  siteSettingsSchema,
} from "@/validations/admin-catalog.schema";
import type {
  AdminProductField,
  AdminProductVariant,
  ProductBadge,
} from "@/types/catalog";

export type AdminProductListItem = {
  id: string;
  name: string;
  slug: string;
  status: string;
  priceCents: number;
  deliveryMode: string;
  categoryName: string;
  isFeatured: boolean;
};

export type AdminProductEdit = {
  id: string;
  categoryId: string;
  status: "draft" | "active" | "archived";
  deliveryMode: "auto" | "manual";
  priceCents: number;
  compareAtCents: number | null;
  isFeatured: boolean;
  sortOrder: number;
  badge: ProductBadge | "none";
  en: { name: string; slug: string; shortDescription: string; description: string };
  ar: { name: string; slug: string; shortDescription: string; description: string };
  imagePath: string | null;
};

export async function listAdminProducts(): Promise<AdminProductListItem[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("products")
    .select(
      `
      id,
      status,
      price_cents,
      delivery_mode,
      is_featured,
      product_translations!inner (name, slug, locale),
      categories!inner (
        category_translations!inner (name, locale)
      )
    `,
    )
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const r = row as {
      id: string;
      status: string;
      price_cents: number;
      delivery_mode: string;
      is_featured: boolean;
      product_translations: Array<{ name: string; slug: string; locale: string }>;
      categories:
        | { category_translations: Array<{ name: string; locale: string }> }
        | Array<{ category_translations: Array<{ name: string; locale: string }> }>;
    };
    const enTr = r.product_translations.find((t) => t.locale === "en") ?? r.product_translations[0];
    const cat = Array.isArray(r.categories) ? r.categories[0] : r.categories;
    const catTr =
      cat?.category_translations.find((t) => t.locale === "en") ??
      cat?.category_translations[0];

    return {
      id: r.id,
      name: enTr?.name ?? "Product",
      slug: enTr?.slug ?? "",
      status: r.status,
      priceCents: r.price_cents,
      deliveryMode: r.delivery_mode,
      categoryName: catTr?.name ?? "—",
      isFeatured: r.is_featured,
    };
  });
}

export async function getAdminProductEdit(
  productId: string,
): Promise<AdminProductEdit | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("products")
    .select(
      `
      id,
      category_id,
      status,
      delivery_mode,
      price_cents,
      compare_at_cents,
      is_featured,
      sort_order,
      badge,
      product_translations (locale, name, slug, short_description, description),
      product_media (storage_path, sort_order)
    `,
    )
    .eq("id", productId)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as {
    id: string;
    category_id: string;
    status: "draft" | "active" | "archived";
    delivery_mode: "auto" | "manual";
    price_cents: number;
    compare_at_cents: number | null;
    is_featured: boolean;
    sort_order: number;
    badge: ProductBadge | "none" | null;
    product_translations: Array<{
      locale: string;
      name: string;
      slug: string;
      short_description: string | null;
      description: string | null;
    }>;
    product_media: Array<{ storage_path: string; sort_order: number }>;
  };

  const pick = (locale: string) => {
    const t =
      row.product_translations.find((x) => x.locale === locale) ??
      row.product_translations[0];
    return {
      name: t?.name ?? "",
      slug: t?.slug ?? "",
      shortDescription: t?.short_description ?? "",
      description: t?.description ?? "",
    };
  };

  const media = [...(row.product_media ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  )[0];

  return {
    id: row.id,
    categoryId: row.category_id,
    status: row.status,
    deliveryMode: row.delivery_mode,
    priceCents: row.price_cents,
    compareAtCents: row.compare_at_cents,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    badge: row.badge ?? "none",
    en: pick("en"),
    ar: pick("ar"),
    imagePath: media?.storage_path ?? null,
  };
}

export async function saveProduct(
  input: z.infer<typeof saveProductSchema>,
): Promise<{ productId: string }> {
  const admin = createAdminClient();
  const compareAt =
    input.compareAtCents === undefined ? null : Number(input.compareAtCents);

  const productPayload = {
    category_id: input.categoryId,
    status: input.status,
    delivery_mode: input.deliveryMode,
    price_cents: input.priceCents,
    compare_at_cents: compareAt,
    is_featured: Boolean(input.isFeatured),
    sort_order: input.sortOrder ?? 0,
    badge: input.badge ?? "none",
    updated_at: new Date().toISOString(),
  };

  let productId = input.productId;

  if (productId) {
    const { error } = await admin
      .from("products")
      .update(productPayload)
      .eq("id", productId);
    if (error) throw error;
  } else {
    const { data, error } = await admin
      .from("products")
      .insert(productPayload)
      .select("id")
      .single();
    if (error || !data) throw new ServiceError("INTERNAL", "Failed to create product");
    productId = (data as { id: string }).id;
  }

  for (const locale of ["en", "ar"] as const) {
    const tr = input[locale];
    const slug = tr.slug.trim() || slugify(tr.name);
    const { error } = await admin.from("product_translations").upsert(
      {
        product_id: productId,
        locale,
        name: tr.name.trim(),
        slug,
        short_description: tr.shortDescription?.trim() || null,
        description: tr.description?.trim() || null,
      },
      { onConflict: "product_id,locale" },
    );
    if (error) throw error;
  }

  return { productId: productId! };
}

export async function archiveProduct(productId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("products")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", productId);
  if (error) throw error;
}

export async function setProductImagePath(
  productId: string,
  storagePath: string,
): Promise<void> {
  const admin = createAdminClient();
  await admin.from("product_media").delete().eq("product_id", productId);
  const { error } = await admin.from("product_media").insert({
    product_id: productId,
    media_type: "image",
    storage_path: storagePath,
    sort_order: 0,
  });
  if (error) throw error;
}

export async function uploadProductImage(
  productId: string,
  file: File,
): Promise<string> {
  const admin = createAdminClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `products/${productId}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("product-images")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) {
    throw new ServiceError("INTERNAL", uploadError.message);
  }

  await setProductImagePath(productId, path);
  return path;
}

export type AdminCategoryRow = {
  id: string;
  sortOrder: number;
  iconUrl: string | null;
  enName: string;
  enSlug: string;
  arName: string;
  arSlug: string;
};

export async function listAdminCategories(): Promise<AdminCategoryRow[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("categories")
    .select(
      `
      id,
      sort_order,
      icon_url,
      category_translations (locale, name, slug)
    `,
    )
    .order("sort_order");

  if (error) throw error;

  return (data ?? []).map((row) => {
    const r = row as {
      id: string;
      sort_order: number;
      icon_url: string | null;
      category_translations: Array<{ locale: string; name: string; slug: string }>;
    };
    const en = r.category_translations.find((t) => t.locale === "en");
    const ar = r.category_translations.find((t) => t.locale === "ar");
    return {
      id: r.id,
      sortOrder: r.sort_order,
      iconUrl: r.icon_url,
      enName: en?.name ?? "",
      enSlug: en?.slug ?? "",
      arName: ar?.name ?? "",
      arSlug: ar?.slug ?? "",
    };
  });
}

export async function listCategoryOptions(): Promise<
  Array<{ id: string; name: string }>
> {
  const rows = await listAdminCategories();
  return rows.map((c) => ({ id: c.id, name: c.enName }));
}

export async function saveCategory(
  input: z.infer<typeof saveCategorySchema>,
): Promise<void> {
  const admin = createAdminClient();
  let categoryId = input.categoryId;

  if (categoryId) {
    await admin
      .from("categories")
      .update({
        sort_order: input.sortOrder,
        icon_url: input.iconUrl?.trim() || null,
      })
      .eq("id", categoryId);
  } else {
    const { data, error } = await admin
      .from("categories")
      .insert({
        sort_order: input.sortOrder,
        icon_url: input.iconUrl?.trim() || null,
      })
      .select("id")
      .single();
    if (error || !data) throw error;
    categoryId = (data as { id: string }).id;
  }

  for (const locale of ["en", "ar"] as const) {
    const tr = input[locale];
    await admin.from("category_translations").upsert(
      {
        category_id: categoryId!,
        locale,
        name: tr.name.trim(),
        slug: tr.slug.trim() || slugify(tr.name),
        description: tr.description?.trim() || null,
      },
      { onConflict: "category_id,locale" },
    );
  }
}

export type AdminCouponRow = {
  id: string;
  code: string;
  couponType: string;
  value: number;
  minOrderCents: number | null;
  maxDiscountCents: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
};

export async function listAdminCoupons(): Promise<AdminCouponRow[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const r = row as {
      id: string;
      code: string;
      coupon_type: string;
      value: number;
      min_order_cents: number | null;
      max_discount_cents: number | null;
      usage_limit: number | null;
      usage_count: number;
      is_active: boolean;
    };
    return {
      id: r.id,
      code: r.code,
      couponType: r.coupon_type,
      value: r.value,
      minOrderCents: r.min_order_cents,
      maxDiscountCents: r.max_discount_cents,
      usageLimit: r.usage_limit,
      usageCount: r.usage_count,
      isActive: r.is_active,
    };
  });
}

export async function saveCoupon(
  input: z.infer<typeof saveCouponSchema>,
): Promise<void> {
  const admin = createAdminClient();
  const payload = {
    code: input.code.trim().toUpperCase(),
    coupon_type: input.couponType,
    value: input.value,
    min_order_cents: input.minOrderCents ?? null,
    max_discount_cents: input.maxDiscountCents ?? null,
    usage_limit: input.usageLimit ?? null,
    is_active: input.isActive !== false,
  };

  if (input.couponId) {
    const { error } = await admin
      .from("coupons")
      .update(payload)
      .eq("id", input.couponId);
    if (error) throw error;
  } else {
    const { error } = await admin.from("coupons").insert(payload);
    if (error) throw error;
  }
}

export async function deleteCoupon(couponId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("coupons").delete().eq("id", couponId);
  if (error) throw error;
}

export type AdminSiteSettings = {
  paymentInstructionsEn: string;
  paymentInstructionsAr: string;
  supportEmail: string;
  supportWhatsapp: string;
};

export async function getAdminSiteSettings(): Promise<AdminSiteSettings> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("site_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  const row = data as {
    payment_instructions_en: string | null;
    payment_instructions_ar: string | null;
    support_email: string | null;
    support_whatsapp: string | null;
  } | null;

  return {
    paymentInstructionsEn: row?.payment_instructions_en ?? "",
    paymentInstructionsAr: row?.payment_instructions_ar ?? "",
    supportEmail: row?.support_email ?? "",
    supportWhatsapp: row?.support_whatsapp ?? "",
  };
}

export async function updateSiteSettings(
  input: z.infer<typeof siteSettingsSchema>,
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .update({
      payment_instructions_en: input.paymentInstructionsEn.trim(),
      payment_instructions_ar: input.paymentInstructionsAr.trim(),
      support_email: input.supportEmail?.trim() || null,
      support_whatsapp: input.supportWhatsapp?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (error) throw error;
}

export async function getAdminProductFields(
  productId: string,
): Promise<AdminProductField[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("product_fields")
    .select(
      "id, field_key, field_type, label, help_text, required, is_sensitive, sort_order",
    )
    .eq("product_id", productId)
    .order("sort_order");

  if (error) throw error;

  return (data ?? []).map((row) => {
    const r = row as {
      id: string;
      field_key: string;
      field_type: string;
      label: Record<string, string>;
      help_text: Record<string, string> | null;
      required: boolean;
      is_sensitive: boolean;
      sort_order: number;
    };
    return {
      id: r.id,
      fieldKey: r.field_key,
      fieldType: r.field_type,
      labelEn: r.label.en ?? r.field_key,
      labelAr: r.label.ar ?? r.field_key,
      helpEn: r.help_text?.en ?? "",
      helpAr: r.help_text?.ar ?? "",
      required: r.required,
      isSensitive: r.is_sensitive,
      sortOrder: r.sort_order,
    };
  });
}

export async function saveAdminProductFields(
  productId: string,
  fields: AdminProductField[],
): Promise<void> {
  const admin = createAdminClient();
  await admin.from("product_fields").delete().eq("product_id", productId);

  if (fields.length === 0) return;

  const rows = fields.map((field, index) => ({
    product_id: productId,
    field_key: field.fieldKey.trim(),
    field_type: field.fieldType,
    label: { en: field.labelEn.trim(), ar: field.labelAr.trim() },
    help_text:
      field.helpEn || field.helpAr
        ? { en: field.helpEn?.trim() || null, ar: field.helpAr?.trim() || null }
        : null,
    required: field.required,
    is_sensitive: field.isSensitive,
    sort_order: field.sortOrder ?? index,
  }));

  const { error } = await admin.from("product_fields").insert(rows);
  if (error) throw error;
}

export async function getAdminProductVariants(
  productId: string,
): Promise<AdminProductVariant[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("product_variants")
    .select(
      "id, name, price_cents, compare_at_cents, offer_label, sort_order, is_default",
    )
    .eq("product_id", productId)
    .order("sort_order");

  if (error) throw error;

  return (data ?? []).map((row) => {
    const r = row as {
      id: string;
      name: Record<string, string>;
      price_cents: number;
      compare_at_cents: number | null;
      offer_label: Record<string, string> | null;
      sort_order: number;
      is_default: boolean;
    };
    return {
      id: r.id,
      nameEn: r.name.en ?? "Option",
      nameAr: r.name.ar ?? "Option",
      priceCents: r.price_cents,
      compareAtCents: r.compare_at_cents,
      offerLabelEn: r.offer_label?.en ?? "",
      offerLabelAr: r.offer_label?.ar ?? "",
      isDefault: r.is_default,
      sortOrder: r.sort_order,
    };
  });
}

export async function saveAdminProductVariants(
  productId: string,
  variants: AdminProductVariant[],
): Promise<void> {
  const admin = createAdminClient();
  await admin.from("product_variants").delete().eq("product_id", productId);

  if (variants.length === 0) return;

  const defaultIndex = variants.findIndex((v) => v.isDefault);
  const rows = variants.map((variant, index) => ({
    product_id: productId,
    name: { en: variant.nameEn.trim(), ar: variant.nameAr.trim() },
    price_cents: variant.priceCents,
    compare_at_cents: variant.compareAtCents ?? null,
    offer_label:
      variant.offerLabelEn || variant.offerLabelAr
        ? {
            en: variant.offerLabelEn?.trim() || null,
            ar: variant.offerLabelAr?.trim() || null,
          }
        : null,
    sort_order: variant.sortOrder ?? index,
    is_default: defaultIndex === -1 ? index === 0 : index === defaultIndex,
    is_active: true,
  }));

  const { error } = await admin.from("product_variants").insert(rows);
  if (error) throw error;
}

export async function getAdminProductRelatedIds(productId: string): Promise<string[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("product_related")
    .select("related_product_id, sort_order")
    .eq("product_id", productId)
    .order("sort_order");

  if (error) throw error;
  return (data ?? []).map((row) => (row as { related_product_id: string }).related_product_id);
}

export async function saveAdminProductRelated(
  productId: string,
  relatedIds: string[],
): Promise<void> {
  const admin = createAdminClient();
  await admin.from("product_related").delete().eq("product_id", productId);

  const unique = [...new Set(relatedIds.filter((id) => id && id !== productId))];
  if (unique.length === 0) return;

  const rows = unique.map((relatedProductId, index) => ({
    product_id: productId,
    related_product_id: relatedProductId,
    sort_order: index,
  }));

  const { error } = await admin.from("product_related").insert(rows);
  if (error) throw error;
}

export async function listProductsForRelatedPicker(
  excludeProductId?: string,
): Promise<Array<{ id: string; name: string }>> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("products")
    .select("id, product_translations!inner(name, locale)")
    .eq("status", "active")
    .eq("product_translations.locale", "en")
    .order("sort_order");

  if (error) throw error;

  return (data ?? [])
    .map((row) => {
      const r = row as {
        id: string;
        product_translations: Array<{ name: string }>;
      };
      return { id: r.id, name: r.product_translations[0]?.name ?? "Product" };
    })
    .filter((p) => p.id !== excludeProductId);
}

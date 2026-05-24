import { z } from "zod";

const translationSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(120),
  shortDescription: z.string().max(500).optional(),
  description: z.string().max(10000).optional(),
});

export const saveProductSchema = z.object({
  productId: z.string().uuid().optional(),
  categoryId: z.string().uuid(),
  status: z.enum(["draft", "active", "archived"]),
  deliveryMode: z.enum(["auto", "manual"]),
  priceCents: z.coerce.number().int().min(0),
  compareAtCents: z
    .union([z.coerce.number().int().min(0), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  isFeatured: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  en: translationSchema,
  ar: translationSchema,
});

export const saveCategorySchema = z.object({
  categoryId: z.string().uuid().optional(),
  sortOrder: z.coerce.number().int(),
  iconUrl: z.string().max(500).optional(),
  en: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
  }),
  ar: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
  }),
});

export const saveCouponSchema = z.object({
  couponId: z.string().uuid().optional(),
  code: z.string().min(2).max(50),
  couponType: z.enum(["percent", "fixed"]),
  value: z.coerce.number().int().min(1),
  minOrderCents: z.coerce.number().int().min(0).optional(),
  maxDiscountCents: z.coerce.number().int().min(0).optional(),
  usageLimit: z.coerce.number().int().min(1).optional(),
  isActive: z.coerce.boolean().optional(),
});

export const siteSettingsSchema = z.object({
  paymentInstructionsEn: z.string().max(5000),
  paymentInstructionsAr: z.string().max(5000),
  supportEmail: z.string().email().optional().or(z.literal("")),
  supportWhatsapp: z.string().max(50).optional(),
});

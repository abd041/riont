import { z } from "zod";

const productSlugSchema = z
  .string()
  .min(1, "Required")
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens only",
  );

const translationSchema = z.object({
  name: z.string().min(1, "Required").max(200),
  slug: productSlugSchema,
  shortDescription: z.string().max(500).optional(),
  description: z.string().max(10000).optional(),
});

const trustBadgeSchema = z.enum([
  "instantDelivery",
  "warranty",
  "verifiedService",
  "manualSupport",
  "securePayment",
]);

export const saveProductSchema = z
  .object({
    productId: z.string().uuid().optional(),
    categoryId: z.string().uuid("Choose a category"),
    status: z.enum(["draft", "active", "archived"]),
    deliveryMode: z.enum(["auto", "manual", "hybrid"]),
    availabilityStatus: z
      .enum([
        "available_now",
        "out_of_stock",
        "available_soon",
        "service_paused",
        "after_manual_review",
        "coming_soon",
        "manual_busy",
        "limited_availability",
      ])
      .optional()
      .default("available_now"),
    extraFeeType: z.enum(["none", "percent", "fixed"]).optional().default("none"),
    extraFeeValue: z.coerce.number().int().min(0).optional().default(0),
    trustBadges: z.array(trustBadgeSchema).optional().default([]),
    manualDailySlotLimit: z
      .union([z.coerce.number().int().min(0), z.literal(""), z.null()])
      .optional()
      .transform((v) => (v === "" || v === undefined || v === null ? null : v)),
    manualSlotsRemaining: z
      .union([z.coerce.number().int().min(0), z.literal(""), z.null()])
      .optional()
      .transform((v) => (v === "" || v === undefined || v === null ? null : v)),
    priceCents: z.coerce.number().int().min(1, "Sale price must be greater than zero"),
    compareAtCents: z
      .union([z.coerce.number().int().min(0), z.literal("")])
      .optional()
      .transform((v) => (v === "" || v === undefined ? undefined : v)),
    isFeatured: z.coerce.boolean().optional(),
    sortOrder: z.coerce.number().int().optional(),
    badge: z
      .enum([
        "none",
        "bestSeller",
        "instant",
        "hot",
        "trending",
        "limited",
        "offer",
        "recommended",
        "bestValue",
        "fastDelivery",
      ])
      .optional()
      .default("none"),
    en: translationSchema,
    ar: translationSchema,
  })
  .superRefine((data, ctx) => {
    if (
      data.compareAtCents !== undefined &&
      data.compareAtCents <= data.priceCents
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must be higher than the sale price",
        path: ["compareAtCents"],
      });
    }
  });

const categorySlugSchema = z
  .string()
  .min(1, "Required")
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens only",
  );

export const saveCategorySchema = z.object({
  categoryId: z.string().uuid().optional(),
  sortOrder: z.coerce.number().int(),
  iconUrl: z.string().max(500).optional(),
  en: z.object({
    name: z.string().min(1, "Required").max(200),
    slug: categorySlugSchema,
    description: z.string().max(2000).optional(),
  }),
  ar: z.object({
    name: z.string().min(1, "Required").max(200),
    slug: categorySlugSchema,
    description: z.string().max(2000).optional(),
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

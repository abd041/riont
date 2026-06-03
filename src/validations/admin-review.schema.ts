import { z } from "zod";

export const adminReviewSchema = z.object({
  productId: z.string().uuid(),
  authorName: z.string().min(1).max(120),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().min(1).max(2000),
  locale: z.enum(["en", "ar"]),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isApproved: z
    .union([z.literal("on"), z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v === "on" || v === "true"),
});

export const deleteReviewSchema = z.object({
  reviewId: z.string().uuid(),
  productId: z.string().uuid(),
});

export const approveReviewSchema = deleteReviewSchema;

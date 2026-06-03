import { z } from "zod";

export const submitProductReviewSchema = z.object({
  productId: z.string().uuid(),
  locale: z.enum(["en", "ar"]),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().min(10).max(2000),
  authorName: z.string().min(1).max(120).optional(),
  guestEmail: z.string().email().optional().or(z.literal("")),
});

export type SubmitProductReviewInput = z.infer<typeof submitProductReviewSchema>;

export const approveReviewSchema = z.object({
  reviewId: z.string().uuid(),
  productId: z.string().uuid(),
});

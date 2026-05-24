import { z } from "zod";

export const submitOrderSchema = z.object({
  productSlug: z.string().min(1).max(200),
  locale: z.enum(["en", "ar"]),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
  guestEmail: z.string().email().optional().or(z.literal("")),
  customerNote: z.string().max(2000).optional(),
  couponCode: z.string().max(50).optional(),
  termsAccepted: z.literal(true),
  fieldValues: z.record(z.string(), z.string().max(5000)).default({}),
});

export type SubmitOrderInput = z.infer<typeof submitOrderSchema>;

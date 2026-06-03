import { z } from "zod";

export const submitOrderSchema = z.object({
  productSlug: z.string().min(1).max(200),
  variantId: z.string().uuid().optional().or(z.literal("")),
  locale: z.enum(["en", "ar"]),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
  guestEmail: z.string().email().optional().or(z.literal("")),
  customerNote: z.string().max(2000).optional(),
  couponCode: z.string().max(50).optional(),
  paymentMethod: z.string().max(80).optional(),
  termsAccepted: z.literal(true),
  fieldValues: z.record(z.string(), z.string().max(5000)).default({}),
});

export type SubmitOrderInput = z.infer<typeof submitOrderSchema>;

export const cartOrderItemSchema = z.object({
  productSlug: z.string().min(1).max(200),
  variantId: z.string().uuid().optional().or(z.literal("")),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
  fieldValues: z.record(z.string(), z.string().max(5000)).default({}),
});

export const submitCartOrderSchema = z.object({
  locale: z.enum(["en", "ar"]),
  items: z.array(cartOrderItemSchema).min(1).max(10),
  guestEmail: z.string().email().optional().or(z.literal("")),
  customerNote: z.string().max(2000).optional(),
  couponCode: z.string().max(50).optional(),
  paymentMethod: z.string().max(80).optional(),
  termsAccepted: z.literal(true),
});

export type SubmitCartOrderInput = z.infer<typeof submitCartOrderSchema>;

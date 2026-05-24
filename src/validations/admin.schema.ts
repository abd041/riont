import { z } from "zod";
import { OrderStatus } from "@/lib/domain/enums";

export const transitionOrderSchema = z.object({
  orderId: z.string().uuid(),
  toStatus: z.enum([
    OrderStatus.PENDING_REVIEW,
    OrderStatus.AWAITING_PAYMENT,
    OrderStatus.PAYMENT_RECEIVED,
    OrderStatus.PROCESSING,
    OrderStatus.DELIVERED,
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED,
    OrderStatus.NEEDS_CUSTOMER_RESPONSE,
    OrderStatus.ON_HOLD,
  ]),
  note: z.string().max(500).optional(),
});

export const manualDeliverSchema = z.object({
  orderItemId: z.string().uuid(),
  deliveryText: z.string().min(1).max(10000),
});

export const addInventorySchema = z.object({
  productId: z.string().uuid(),
  payloads: z.string().min(1).max(50000),
});

export const adminNoteSchema = z.object({
  orderId: z.string().uuid(),
  adminNote: z.string().max(2000),
});

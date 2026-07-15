export const UserRole = {
  CUSTOMER: "customer",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const OrderStatus = {
  PENDING_REVIEW: "pending_review",
  AWAITING_PAYMENT: "awaiting_payment",
  PAYMENT_RECEIVED: "payment_received",
  PROCESSING: "processing",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
  NEEDS_CUSTOMER_RESPONSE: "needs_customer_response",
  ON_HOLD: "on_hold",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const DeliveryMode = {
  AUTO: "auto",
  MANUAL: "manual",
  HYBRID: "hybrid",
} as const;

export type DeliveryMode = (typeof DeliveryMode)[keyof typeof DeliveryMode];

export const ProductStatus = {
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

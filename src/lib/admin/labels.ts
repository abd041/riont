import {
  DeliveryMode,
  OrderStatus,
  ProductStatus,
  type DeliveryMode as DeliveryModeType,
  type OrderStatus as OrderStatusType,
  type ProductStatus as ProductStatusType,
} from "@/lib/domain/enums";
import type { SupportTicketStatus, SupportTicketType } from "@/types/support";

/** Plain-language order statuses for admin UI */
export const ORDER_STATUS_LABELS: Record<OrderStatusType, string> = {
  [OrderStatus.PENDING_REVIEW]: "New — needs review",
  [OrderStatus.AWAITING_PAYMENT]: "Waiting for payment",
  [OrderStatus.PAYMENT_RECEIVED]: "Paid — ready to process",
  [OrderStatus.PROCESSING]: "Being prepared",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.REFUNDED]: "Refunded",
  [OrderStatus.CANCELLED]: "Cancelled",
  [OrderStatus.NEEDS_CUSTOMER_RESPONSE]: "Waiting on customer",
  [OrderStatus.ON_HOLD]: "On hold",
};

/** Shorter labels for filter pills */
export const ORDER_STATUS_FILTER_LABELS: Record<OrderStatusType, string> = {
  [OrderStatus.PENDING_REVIEW]: "Needs review",
  [OrderStatus.AWAITING_PAYMENT]: "Awaiting payment",
  [OrderStatus.PAYMENT_RECEIVED]: "Payment received",
  [OrderStatus.PROCESSING]: "Processing",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.REFUNDED]: "Refunded",
  [OrderStatus.CANCELLED]: "Cancelled",
  [OrderStatus.NEEDS_CUSTOMER_RESPONSE]: "Needs response",
  [OrderStatus.ON_HOLD]: "On hold",
};

export function getOrderStatusLabel(status: OrderStatusType): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export const TICKET_STATUS_LABELS: Record<SupportTicketStatus, string> = {
  open: "Open",
  waiting_customer: "Waiting on customer",
  waiting_admin: "Needs your reply",
  resolved: "Resolved",
  closed: "Closed",
};

export const TICKET_TYPE_LABELS: Record<SupportTicketType, string> = {
  general: "General question",
  fulfillment: "Delivery help",
  order_issue: "Order issue",
};

export function getTicketStatusLabel(status: SupportTicketStatus): string {
  return TICKET_STATUS_LABELS[status] ?? status;
}

export function getTicketTypeLabel(type: SupportTicketType): string {
  return TICKET_TYPE_LABELS[type] ?? type;
}

export const PRODUCT_STATUS_LABELS: Record<ProductStatusType, string> = {
  [ProductStatus.DRAFT]: "Draft",
  [ProductStatus.ACTIVE]: "Live",
  [ProductStatus.ARCHIVED]: "Archived",
};

export const DELIVERY_MODE_LABELS: Record<DeliveryModeType, string> = {
  [DeliveryMode.AUTO]: "Automatic",
  [DeliveryMode.MANUAL]: "Manual delivery",
};

export function getProductStatusLabel(status: ProductStatusType | string): string {
  return PRODUCT_STATUS_LABELS[status as ProductStatusType] ?? status;
}

export function getDeliveryModeLabel(mode: DeliveryModeType | string): string {
  return DELIVERY_MODE_LABELS[mode as DeliveryModeType] ?? mode;
}

export const DELIVERY_MODE_HINTS: Record<DeliveryModeType, string> = {
  [DeliveryMode.AUTO]:
    "The site sends codes or keys automatically when you mark the order as processing (you upload stock on the product edit page after saving).",
  [DeliveryMode.MANUAL]:
    "You paste delivery details yourself on each order after payment is confirmed.",
};

export const PRODUCT_BADGE_LABELS: Record<
  "none" | "bestSeller" | "instant" | "hot" | "trending" | "limited" | "offer",
  string
> = {
  none: "None",
  bestSeller: "Best seller",
  instant: "Instant delivery",
  hot: "Hot",
  trending: "Trending",
  limited: "Limited",
  offer: "Special offer",
};

export const PRODUCT_STATUS_OPTIONS: Array<{
  value: ProductStatusType;
  label: string;
  hint: string;
}> = [
  {
    value: ProductStatus.DRAFT,
    label: "Draft — hidden from shop",
    hint: "Safe while you are still writing details.",
  },
  {
    value: ProductStatus.ACTIVE,
    label: "Live — visible to customers",
    hint: "Shows on the storefront when stock/rules allow.",
  },
  {
    value: ProductStatus.ARCHIVED,
    label: "Archived — hidden, kept for records",
    hint: "Old products you no longer sell.",
  },
];

export const MESSAGE_SENDER_LABELS: Record<string, string> = {
  customer: "Customer",
  admin: "You (staff)",
  system: "System",
};

export function getMessageSenderLabel(senderType: string): string {
  return MESSAGE_SENDER_LABELS[senderType] ?? senderType;
}

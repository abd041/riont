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
  [OrderStatus.PAYMENT_RECEIVED]: "Payment confirmed",
  [OrderStatus.PROCESSING]: "Being prepared",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.REFUNDED]: "Refunded",
  [OrderStatus.CANCELLED]: "Cancelled",
  [OrderStatus.NEEDS_CUSTOMER_RESPONSE]: "Waiting on customer",
  [OrderStatus.ON_HOLD]: "On hold",
};

/** Action button labels — what the admin is doing when they click */
export const ORDER_STATUS_ACTION_LABELS: Record<OrderStatusType, string> = {
  [OrderStatus.PENDING_REVIEW]: "Mark as new",
  [OrderStatus.AWAITING_PAYMENT]: "Send payment instructions",
  [OrderStatus.PAYMENT_RECEIVED]: "Confirm payment received",
  [OrderStatus.PROCESSING]: "Start processing",
  [OrderStatus.DELIVERED]: "Mark all delivered",
  [OrderStatus.COMPLETED]: "Mark complete",
  [OrderStatus.REFUNDED]: "Mark refunded",
  [OrderStatus.CANCELLED]: "Cancel order",
  [OrderStatus.NEEDS_CUSTOMER_RESPONSE]: "Request customer reply",
  [OrderStatus.ON_HOLD]: "Put on hold",
};

/** Shorter labels for filter pills */
export const ORDER_STATUS_FILTER_LABELS: Record<OrderStatusType, string> = {
  [OrderStatus.PENDING_REVIEW]: "Needs review",
  [OrderStatus.AWAITING_PAYMENT]: "Awaiting payment",
  [OrderStatus.PAYMENT_RECEIVED]: "Payment confirmed",
  [OrderStatus.PROCESSING]: "Processing",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.REFUNDED]: "Refunded",
  [OrderStatus.CANCELLED]: "Cancelled",
  [OrderStatus.NEEDS_CUSTOMER_RESPONSE]: "Needs response",
  [OrderStatus.ON_HOLD]: "On hold",
};

export const ORDER_QUEUE_FILTER_LABELS = {
  unpaid: "Unpaid queue",
  fulfill: "Ready to fulfill",
} as const;

export type OrderQueueFilter = keyof typeof ORDER_QUEUE_FILTER_LABELS;

export function getOrderStatusLabel(status: OrderStatusType): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function getOrderStatusActionLabel(status: OrderStatusType): string {
  return ORDER_STATUS_ACTION_LABELS[status] ?? getOrderStatusLabel(status);
}

/** Next-step guidance for manual payment workflow */
export function getOrderWorkflowHint(status: OrderStatusType): {
  title: string;
  body: string;
  tone: "info" | "warning" | "success" | "neutral";
} {
  switch (status) {
    case OrderStatus.PENDING_REVIEW:
      return {
        title: "Step 1 — Review order",
        body: "Check items and customer details. Send payment instructions when ready, or cancel if invalid.",
        tone: "info",
      };
    case OrderStatus.AWAITING_PAYMENT:
      return {
        title: "Step 2 — Wait for payment",
        body: "Customer should pay via bank transfer, WhatsApp, or your method in Settings. Only confirm payment after you verify the transfer.",
        tone: "warning",
      };
    case OrderStatus.PAYMENT_RECEIVED:
      return {
        title: "Step 3 — Payment confirmed",
        body: "Start processing to deliver codes or paste manual delivery for each line item.",
        tone: "success",
      };
    case OrderStatus.PROCESSING:
      return {
        title: "Step 4 — Deliver items",
        body: "Fulfill each line below (auto stock or manual paste), then mark the order delivered.",
        tone: "info",
      };
    case OrderStatus.DELIVERED:
      return {
        title: "Step 5 — Wrap up",
        body: "Mark complete when the customer has everything. Refund only if needed.",
        tone: "neutral",
      };
    case OrderStatus.ON_HOLD:
      return {
        title: "On hold",
        body: "Resume when ready — return to awaiting payment, start processing, or cancel.",
        tone: "warning",
      };
    case OrderStatus.NEEDS_CUSTOMER_RESPONSE:
      return {
        title: "Waiting on customer",
        body: "Resume processing when the customer replies, or cancel the order.",
        tone: "warning",
      };
    default:
      return {
        title: "Order closed",
        body: "No further action required unless you need to refund.",
        tone: "neutral",
      };
  }
}

export function isPrimaryOrderAction(
  fromStatus: OrderStatusType,
  toStatus: OrderStatusType,
): boolean {
  if (toStatus === OrderStatus.CANCELLED || toStatus === OrderStatus.REFUNDED) {
    return false;
  }
  if (
    fromStatus === OrderStatus.AWAITING_PAYMENT &&
    toStatus === OrderStatus.PAYMENT_RECEIVED
  ) {
    return true;
  }
  if (
    fromStatus === OrderStatus.PAYMENT_RECEIVED &&
    toStatus === OrderStatus.PROCESSING
  ) {
    return true;
  }
  if (
    fromStatus === OrderStatus.PENDING_REVIEW &&
    toStatus === OrderStatus.AWAITING_PAYMENT
  ) {
    return true;
  }
  if (
    fromStatus === OrderStatus.PROCESSING &&
    toStatus === OrderStatus.DELIVERED
  ) {
    return true;
  }
  if (
    fromStatus === OrderStatus.DELIVERED &&
    toStatus === OrderStatus.COMPLETED
  ) {
    return true;
  }
  return false;
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
    "The site sends codes or keys automatically when you start processing an order. Upload stock on this product page (one code or key per line).",
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

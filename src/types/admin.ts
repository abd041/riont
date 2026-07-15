import type { OrderStatus } from "@/lib/domain/enums";
import type { PaymentStatus } from "@/lib/order/payment-status";

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalCents: number;
  currency: string;
  submittedAt: string;
  customerLabel: string;
  productSummary: string;
};

export type AdminOrderFieldValue = {
  fieldKey: string;
  label: string;
  value: string;
  isSensitive: boolean;
};

export type AdminOrderItem = {
  id: string;
  productId: string;
  productName: string;
  variantName: string | null;
  unitPriceCents: number;
  quantity: number;
  deliveryMode: "auto" | "manual" | "hybrid";
  fulfillmentStatus: string;
  deliveryContent: string | null;
};

export type AdminOrderDetail = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotalCents: number;
  discountCents: number;
  feeCents: number;
  totalCents: number;
  currency: string;
  locale: string;
  customerNote: string | null;
  adminNote: string | null;
  guestEmail: string | null;
  userId: string | null;
  submittedAt: string;
  paymentReceivedAt: string | null;
  paymentMethod: string | null;
  paymentStatus: PaymentStatus;
  items: AdminOrderItem[];
  fields: AdminOrderFieldValue[];
  timeline: Array<{
    toStatus: OrderStatus;
    note: string | null;
    createdAt: string;
  }>;
};

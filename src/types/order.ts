import type { OrderStatus } from "@/lib/domain/enums";

export type CheckoutField = {
  id: string;
  fieldKey: string;
  fieldType: string;
  label: string;
  helpText: string | null;
  required: boolean;
  options: string[] | null;
  isSensitive: boolean;
};

export type CheckoutProduct = {
  id: string;
  slug: string;
  name: string;
  categoryName?: string | null;
  shortDescription: string | null;
  priceCents: number;
  compareAtCents: number | null;
  deliveryMode: "auto" | "manual";
  imageUrl: string | null;
  fields: CheckoutField[];
  variantId?: string | null;
  variantName?: string | null;
  variants: Array<{
    id: string;
    name: string;
    priceCents: number;
    compareAtCents?: number | null;
    offerLabel?: string | null;
    isDefault?: boolean;
  }>;
};

export type OrderSubmitSuccess = {
  orderNumber: string;
  orderId: string;
  guestToken?: string;
};

export type OrderLineItem = {
  id: string;
  productName: string;
  unitPriceCents: number;
  quantity: number;
  deliveryMode: "auto" | "manual";
  fulfillmentStatus: string;
  deliveryContent: string | null;
};

export type OrderFieldDisplay = {
  fieldKey: string;
  label: string;
  displayValue: string;
  isSensitive: boolean;
};

export type OrderStatusEvent = {
  toStatus: OrderStatus;
  note: string | null;
  createdAt: string;
};

export type CustomerOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  currency: string;
  locale: string;
  submittedAt: string;
  items: OrderLineItem[];
  fields: OrderFieldDisplay[];
  paymentInstructions: string | null;
  timeline: OrderStatusEvent[];
};

export type OrderListItem = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalCents: number;
  currency: string;
  submittedAt: string;
  productSummary: string;
};

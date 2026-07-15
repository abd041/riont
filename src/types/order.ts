import type { OrderStatus } from "@/lib/domain/enums";
import type {
  DeliveryModeValue,
  ProductAvailabilityStatus,
  ProductExtraFeeType,
  ProductTrustBadgeKey,
  VariantPlanHighlight,
} from "@/lib/catalog/product-commerce";

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

export type CartCheckoutLine = CheckoutProduct & {
  quantity: number;
};

export type CheckoutProduct = {
  id: string;
  slug: string;
  name: string;
  categoryName?: string | null;
  shortDescription: string | null;
  priceCents: number;
  compareAtCents: number | null;
  deliveryMode: DeliveryModeValue;
  availabilityStatus?: ProductAvailabilityStatus;
  trustBadges?: ProductTrustBadgeKey[];
  extraFeeType?: ProductExtraFeeType;
  extraFeeValue?: number;
  imageUrl: string | null;
  fields: CheckoutField[];
  variantId?: string | null;
  variantName?: string | null;
  manualSlotsRemaining?: number | null;
  manualDailySlotLimit?: number | null;
  variants: Array<{
    id: string;
    name: string;
    priceCents: number;
    compareAtCents?: number | null;
    offerLabel?: string | null;
    isDefault?: boolean;
    benefits?: string[];
    planHighlight?: VariantPlanHighlight;
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
  variantName?: string | null;
  unitPriceCents: number;
  quantity: number;
  deliveryMode: DeliveryModeValue;
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
  feeCents: number;
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

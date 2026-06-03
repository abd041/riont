import { OrderStatus, type OrderStatus as OrderStatusType } from "@/lib/domain/enums";

export type PaymentStatus = "unpaid" | "paid" | "failed";

const PAID_STATUSES: OrderStatusType[] = [
  OrderStatus.PAYMENT_RECEIVED,
  OrderStatus.PROCESSING,
  OrderStatus.DELIVERED,
  OrderStatus.COMPLETED,
];

export function derivePaymentStatus(
  status: OrderStatusType,
  paymentReceivedAt: string | null | undefined,
): PaymentStatus {
  if (status === OrderStatus.CANCELLED || status === OrderStatus.REFUNDED) return "failed";
  if (paymentReceivedAt) return "paid";
  if (PAID_STATUSES.includes(status)) return "paid";
  return "unpaid";
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  paid: "Paid",
  failed: "Failed / cancelled",
};

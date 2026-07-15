/** Shared product commerce helpers (fees, availability, trust, slots). */

export const PRODUCT_TRUST_BADGE_KEYS = [
  "instantDelivery",
  "warranty",
  "verifiedService",
  "manualSupport",
  "securePayment",
] as const;

export type ProductTrustBadgeKey = (typeof PRODUCT_TRUST_BADGE_KEYS)[number];

export type ProductAvailabilityStatus =
  | "available_now"
  | "out_of_stock"
  | "available_soon"
  | "service_paused"
  | "after_manual_review"
  | "coming_soon"
  | "manual_busy"
  | "limited_availability";

export type ProductExtraFeeType = "none" | "percent" | "fixed";

export type VariantPlanHighlight =
  | "none"
  | "bestValue"
  | "recommended"
  | "mostPopular";

export type DeliveryModeValue = "auto" | "manual" | "hybrid";

/** Statuses that still allow checkout (others soft-block purchase). */
export const PURCHASABLE_AVAILABILITY = new Set<ProductAvailabilityStatus>([
  "available_now",
  "after_manual_review",
  "limited_availability",
]);

export function isPurchasableAvailability(
  status: ProductAvailabilityStatus | null | undefined,
): boolean {
  if (!status) return true;
  return PURCHASABLE_AVAILABILITY.has(status);
}

export function parseTrustBadges(raw: unknown): ProductTrustBadgeKey[] {
  if (!Array.isArray(raw)) return [];
  const allowed = new Set<string>(PRODUCT_TRUST_BADGE_KEYS);
  return raw.filter((v): v is ProductTrustBadgeKey =>
    typeof v === "string" && allowed.has(v),
  );
}

/** Extra fee for a line: percent of line subtotal, or fixed cents × quantity. */
export function computeLineExtraFeeCents(opts: {
  feeType: ProductExtraFeeType | null | undefined;
  feeValue: number | null | undefined;
  lineSubtotalCents: number;
  quantity: number;
}): number {
  const type = opts.feeType ?? "none";
  const value = Math.max(0, Math.floor(opts.feeValue ?? 0));
  if (type === "none" || value === 0) return 0;
  if (type === "percent") {
    return Math.round((opts.lineSubtotalCents * value) / 100);
  }
  return value * Math.max(1, opts.quantity);
}

export function utcTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Effective remaining slots after UTC day rollover (does not write DB). */
export function effectiveManualSlotsRemaining(opts: {
  dailyLimit: number | null | undefined;
  remaining: number | null | undefined;
  slotsDate: string | null | undefined;
}): number | null {
  if (opts.dailyLimit == null) return null;
  const today = utcTodayIsoDate();
  if (opts.slotsDate !== today) return opts.dailyLimit;
  return opts.remaining ?? opts.dailyLimit;
}

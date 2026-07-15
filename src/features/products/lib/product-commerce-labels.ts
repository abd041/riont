import type {
  DeliveryModeValue,
  ProductAvailabilityStatus,
  ProductTrustBadgeKey,
  VariantPlanHighlight,
} from "@/lib/catalog/product-commerce";

export function deliveryModeLabelKey(
  mode: DeliveryModeValue | undefined,
): "deliveryInstant" | "deliveryManual" | "deliveryHybrid" | null {
  if (mode === "auto") return "deliveryInstant";
  if (mode === "manual") return "deliveryManual";
  if (mode === "hybrid") return "deliveryHybrid";
  return null;
}

export function availabilityStatusLabelKey(
  status: ProductAvailabilityStatus | undefined,
): string | null {
  if (!status || status === "available_now") return null;
  return `availability_${status}`;
}

export function planHighlightLabelKey(
  highlight: VariantPlanHighlight | undefined,
): "planBestValue" | "planRecommended" | "planMostPopular" | null {
  if (highlight === "bestValue") return "planBestValue";
  if (highlight === "recommended") return "planRecommended";
  if (highlight === "mostPopular") return "planMostPopular";
  return null;
}

export function trustBadgeLabelKey(
  badge: ProductTrustBadgeKey,
): `trust_${ProductTrustBadgeKey}` {
  return `trust_${badge}`;
}

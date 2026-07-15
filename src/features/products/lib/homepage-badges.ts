import type { ProductBadge } from "@/types/catalog";

/** Display badges used on homepage Most Requested / mini cards. */
export function homepageBadgeLabelKey(
  badge: ProductBadge | undefined,
):
  | "bestSellerBadge"
  | "recommendedBadge"
  | "bestValueBadge"
  | "fastDeliveryBadge"
  | "instantBadge"
  | null {
  switch (badge) {
    case "recommended":
      return "recommendedBadge";
    case "bestValue":
      return "bestValueBadge";
    case "fastDelivery":
      return "fastDeliveryBadge";
    case "bestSeller":
      return "bestSellerBadge";
    case "instant":
      return "instantBadge";
    default:
      return null;
  }
}

export function homepageBadgeClass(badge: ProductBadge | undefined): string {
  switch (badge) {
    case "recommended":
      return "mp-badge mp-badge--recommended";
    case "bestValue":
      return "mp-badge mp-badge--value";
    case "fastDelivery":
    case "instant":
      return "mp-badge mp-badge--instant";
    case "bestSeller":
      return "mp-badge mp-badge--hot";
    default:
      return "mp-badge";
  }
}

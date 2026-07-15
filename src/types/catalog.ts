/** Shared catalog domain types (used by server services and storefront features). */

import type {
  DeliveryModeValue,
  ProductAvailabilityStatus,
  ProductExtraFeeType,
  ProductTrustBadgeKey,
  VariantPlanHighlight,
} from "@/lib/catalog/product-commerce";

export type ProductBadge =
  | "bestSeller"
  | "instant"
  | "hot"
  | "trending"
  | "limited"
  | "offer"
  | "recommended"
  | "bestValue"
  | "fastDelivery";

export type ProductMediaItem = {
  type: "image" | "video";
  url: string;
  alt: string | null;
};

export type ProductVariant = {
  id: string;
  name: string;
  priceCents: number;
  compareAtCents?: number | null;
  offerLabel?: string | null;
  isDefault?: boolean;
  benefits?: string[];
  planHighlight?: VariantPlanHighlight;
};

export interface CatalogProduct {
  id?: string;
  slug: string;
  name: string;
  category: string;
  categorySlug?: string;
  priceCents: number;
  compareAtCents?: number | null;
  badge?: ProductBadge;
  shortDescription?: string | null;
  imageUrl?: string | null;
  deliveryMode?: DeliveryModeValue;
  availabilityStatus?: ProductAvailabilityStatus;
  trustBadges?: ProductTrustBadgeKey[];
  manualSlotsRemaining?: number | null;
  manualDailySlotLimit?: number | null;
  inStock?: boolean;
  isFeatured?: boolean;
  salesCount?: number;
  averageRating?: number;
  reviewCount?: number;
}

export interface CatalogProductDetail extends CatalogProduct {
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
  media: ProductMediaItem[];
  variants: ProductVariant[];
  extraFeeType?: ProductExtraFeeType;
  extraFeeValue?: number;
}

export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  productCount: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export type AdminProductField = {
  id?: string;
  fieldKey: string;
  fieldType: string;
  labelEn: string;
  labelAr: string;
  helpEn?: string;
  helpAr?: string;
  required: boolean;
  isSensitive: boolean;
  sortOrder: number;
};

export type AdminProductVariant = {
  id?: string;
  nameEn: string;
  nameAr: string;
  priceCents: number;
  compareAtCents?: number | null;
  offerLabelEn?: string;
  offerLabelAr?: string;
  benefitsEn?: string;
  benefitsAr?: string;
  planHighlight?: VariantPlanHighlight;
  isDefault: boolean;
  sortOrder: number;
};

export type {
  DeliveryModeValue,
  ProductAvailabilityStatus,
  ProductExtraFeeType,
  ProductTrustBadgeKey,
  VariantPlanHighlight,
};

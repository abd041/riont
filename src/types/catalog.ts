/** Shared catalog domain types (used by server services and storefront features). */

export type ProductBadge = "bestSeller" | "instant";

export type ProductMediaItem = {
  type: "image" | "video";
  url: string;
  alt: string | null;
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
}

export interface CatalogProductDetail extends CatalogProduct {
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
  media: ProductMediaItem[];
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

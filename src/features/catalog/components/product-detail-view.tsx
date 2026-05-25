import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Check, Star } from "lucide-react";
import type { CatalogProductDetail } from "@/features/catalog/types";
import { ProductDetailGallery } from "./product-detail-gallery";
import { ProductDetailPurchase } from "./product-detail-purchase";
import { ProductDetailServices } from "./product-detail-services";

function hashSlug(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash += slug.charCodeAt(i);
  return hash;
}

function reviewCount(slug: string) {
  return 80 + (hashSlug(slug) % 420);
}

function ratingValue(slug: string) {
  const variants = [4.7, 4.8, 4.9];
  return variants[hashSlug(slug) % variants.length];
}

export async function ProductDetailView({
  product,
  slug,
}: {
  product: CatalogProductDetail;
  slug: string;
}) {
  const t = await getTranslations("product");
  const tCatalog = await getTranslations("catalog");
  const productId = product.id ?? slug;
  const rating = ratingValue(slug);
  const reviews = reviewCount(slug);
  const categoryLabel = product.category?.trim() || tCatalog("breadcrumbGames");

  return (
    <div className="nex-pdp-page">
      <nav className="nex-pdp-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">{tCatalog("breadcrumbHome")}</Link>
        <span aria-hidden>›</span>
        <Link href={`/products?category=${product.categorySlug ?? "gaming"}`}>
          {categoryLabel}
        </Link>
        <span aria-hidden>›</span>
        <span>{product.name}</span>
      </nav>

      <div className="nex-pdp-layout">
        <ProductDetailGallery media={product.media} productName={product.name} />

        <div className="nex-pdp-info">
          <div className="nex-pdp-title-row">
            <h1 className="nex-pdp-title">{product.name}</h1>
            {product.badge === "bestSeller" && (
              <span className="nex-pdp-bestseller">{t("bestSellerBadge")}</span>
            )}
          </div>

          <div className="nex-pdp-rating">
            <span className="nex-pdp-rating-stars" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} strokeWidth={0} />
              ))}
            </span>
            <span className="nex-pdp-rating-text">
              {t("reviews", { rating, count: reviews })}
            </span>
          </div>

          <ul className="nex-pdp-features">
            <li className="nex-pdp-feature">
              <Check strokeWidth={2} />
              {t("featureAccess")}
            </li>
            <li className="nex-pdp-feature">
              <Check strokeWidth={2} />
              {t("featurePlatform")}
            </li>
            <li className="nex-pdp-feature">
              <Check strokeWidth={2} />
              {t("featureInstant")}
            </li>
          </ul>

          {product.shortDescription && (
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              {product.shortDescription}
            </p>
          )}

          <ProductDetailPurchase
            productId={productId}
            slug={slug}
            name={product.name}
            imageUrl={product.imageUrl ?? null}
            priceCents={product.priceCents}
            compareAtCents={product.compareAtCents}
          />
        </div>

        <ProductDetailServices />
      </div>
    </div>
  );
}

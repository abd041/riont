import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Check, Star } from "lucide-react";
import { StorefrontPageShell } from "@/components/shared/storefront-page-shell";
import type { CatalogProductDetail } from "@/types/catalog";
import { ProductDetailGallery } from "./product-detail-gallery";
import { ProductDetailInteractive } from "./product-detail-interactive";
import { ProductDetailRelated } from "./product-detail-related";
import { ProductDetailTabs } from "./product-detail-tabs";
import { listRelatedProducts } from "@/server/services/product.service";

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
  locale,
}: {
  product: CatalogProductDetail;
  slug: string;
  locale: string;
}) {
  const t = await getTranslations("product");
  const tCatalog = await getTranslations("catalog");
  const productId = product.id ?? slug;
  const rating = ratingValue(slug);
  const reviews = reviewCount(slug);
  const categoryLabel = product.category?.trim() || tCatalog("breadcrumbGames");
  const backHref = product.categorySlug
    ? `/products?category=${product.categorySlug}`
    : "/products";

  const relatedProducts = product.id
    ? await listRelatedProducts(locale, product.id, 4)
    : [];

  return (
    <StorefrontPageShell variant="wide">
      <div className="sf-pdp-wrap nex-pdp-page">
        <div className="sf-pdp-toolbar">
          <Link
            href={backHref}
            className="nex-browse-back"
            aria-label={tCatalog("breadcrumbHome")}
          >
            <ArrowLeft strokeWidth={1.5} />
          </Link>
          <nav className="nex-pdp-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">{tCatalog("breadcrumbHome")}</Link>
            <span aria-hidden>›</span>
            <Link href={backHref}>{categoryLabel}</Link>
            <span aria-hidden>›</span>
            <span>{product.name}</span>
          </nav>
        </div>

        <div className="nex-pdp-layout">
          <ProductDetailGallery media={product.media} productName={product.name} />

          <div className="nex-pdp-info">
            <div className="nex-pdp-title-row">
              <h1 className="nex-pdp-title">{product.name}</h1>
              {product.badge === "bestSeller" && (
                <span className="nex-pdp-bestseller">{t("bestSellerBadge")}</span>
              )}
            </div>

            {product.categorySlug && (
              <Link href={backHref} className="nex-pdp-category">
                {categoryLabel}
              </Link>
            )}

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
                {product.badge === "instant" ? t("featureInstant") : t("manualDeliveryHint")}
              </li>
            </ul>

            <ProductDetailInteractive
              productId={productId}
              slug={slug}
              name={product.name}
              imageUrl={product.imageUrl ?? null}
              basePriceCents={product.priceCents}
              baseCompareAtCents={product.compareAtCents}
              isInstant={product.badge === "instant"}
              variants={product.variants ?? []}
            />
          </div>

          <ProductDetailTabs
            shortDescription={product.shortDescription}
            description={product.description}
            rating={rating}
            reviewCount={reviews}
          />

          <ProductDetailRelated products={relatedProducts} />
        </div>
      </div>
    </StorefrontPageShell>
  );
}

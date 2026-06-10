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
import { getProductReviewSummary } from "@/server/services/review.service";

export async function ProductDetailView({
  product,
  slug,
  locale,
  isLoggedIn,
  userEmail,
  userDisplayName,
}: {
  product: CatalogProductDetail;
  slug: string;
  locale: string;
  isLoggedIn: boolean;
  userEmail?: string | null;
  userDisplayName?: string | null;
}) {
  const t = await getTranslations("product");
  const tCatalog = await getTranslations("catalog");
  const productId = product.id ?? slug;
  const categoryLabel = product.category?.trim() || tCatalog("breadcrumbGames");
  const backHref = product.categorySlug
    ? `/products?category=${product.categorySlug}`
    : "/products";

  const [relatedProducts, reviewSummary] = await Promise.all([
    product.id ? listRelatedProducts(locale, product.id, 4) : Promise.resolve([]),
    product.id && !product.id.startsWith("demo-")
      ? getProductReviewSummary(product.id, locale)
      : Promise.resolve(null),
  ]);

  const hasReviews = (reviewSummary?.count ?? 0) > 0;
  const rating = hasReviews ? reviewSummary!.averageRating : 0;
  const reviews = hasReviews ? reviewSummary!.count : 0;

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
            <span className="nex-pdp-breadcrumbs__current">{product.name}</span>
          </nav>
        </div>

        <div className="nex-pdp-layout">
          <div className="nex-pdp-purchase-card">
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

              {hasReviews ? (
                <div className="nex-pdp-rating">
                  <span className="nex-pdp-rating-stars" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} strokeWidth={0} />
                    ))}
                  </span>
                  <span className="nex-pdp-rating-text">
                    {t("reviews", { rating: rating.toFixed(1), count: reviews })}
                  </span>
                </div>
              ) : (
                <p className="nex-pdp-rating-text nex-pdp-rating-text--empty">
                  {t("noReviewsYet")}
                </p>
              )}

              <ProductDetailInteractive
                productId={productId}
                slug={slug}
                name={product.name}
                imageUrl={product.imageUrl ?? null}
                basePriceCents={product.priceCents}
                baseCompareAtCents={product.compareAtCents}
                isInstant={product.badge === "instant"}
                inStock={product.inStock !== false}
                variants={product.variants ?? []}
              />

              {product.shortDescription?.trim() && (
                <p className="nex-pdp-excerpt">{product.shortDescription}</p>
              )}

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
            </div>
          </div>

          <ProductDetailTabs
            productId={productId}
            productSlug={slug}
            locale={locale}
            isLoggedIn={isLoggedIn}
            userEmail={userEmail}
            userDisplayName={userDisplayName}
            shortDescription={product.shortDescription}
            description={product.description}
            rating={rating}
            reviewCount={reviews}
            reviews={reviewSummary?.reviews ?? []}
            hasDbReviews={hasReviews}
          />

          <ProductDetailRelated products={relatedProducts} />
        </div>
      </div>
    </StorefrontPageShell>
  );
}

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { StorefrontPageShell } from "@/components/shared/storefront-page-shell";
import type { CatalogProductDetail } from "@/types/catalog";
import { ProductDetailGallery } from "./product-detail-gallery";
import { ProductDetailInteractive } from "./product-detail-interactive";
import { ProductDetailRelated } from "./product-detail-related";
import { ProductDetailTabs } from "./product-detail-tabs";
import { listRelatedProducts } from "@/server/services/product.service";
import { getProductReviewSummary } from "@/server/services/review.service";
import { cn } from "@/utils/cn";

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
  const inStock = product.inStock !== false;
  const isInstant = product.badge === "instant";

  const shortText = product.shortDescription?.trim() ?? "";
  const fullText = product.description?.trim() ?? "";
  const previewText =
    shortText || (fullText.length > 280 ? `${fullText.slice(0, 280).trim()}…` : fullText);

  return (
    <StorefrontPageShell variant="wide">
      <div className="sf-pdp-wrap nex-pdp-page nex-pdp-page--compact">
        <div className="sf-pdp-toolbar">
          <Link
            href={backHref}
            className="nex-browse-back"
            aria-label={tCatalog("backToBrowse")}
          >
            <ArrowLeft strokeWidth={1.5} />
          </Link>
          <nav className="nex-pdp-breadcrumbs" aria-label={tCatalog("breadcrumbNav")}>
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
              <h1 className="nex-pdp-title">{product.name}</h1>

              <div className="nex-pdp-meta-strip">
                {product.categorySlug && (
                  <Link href={backHref} className="nex-pdp-category">
                    {categoryLabel}
                  </Link>
                )}
                {product.badge === "bestSeller" && (
                  <span className="nex-pdp-bestseller">{t("bestSellerBadge")}</span>
                )}
                <span
                  className={cn(
                    "nex-pdp-availability",
                    !inStock && "nex-pdp-availability--soldout",
                    inStock && isInstant && "nex-pdp-availability--instant",
                    inStock && !isInstant && "nex-pdp-availability--manual",
                  )}
                >
                  {!inStock
                    ? t("soldOut")
                    : isInstant
                      ? t("instantDelivery")
                      : t("manualDelivery")}
                </span>
                {hasReviews ? (
                  <div className="nex-pdp-rating nex-pdp-rating--inline">
                    <span className="nex-pdp-rating-stars" aria-hidden>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} strokeWidth={0} />
                      ))}
                    </span>
                    <span className="nex-pdp-rating-text">
                      {rating.toFixed(1)} ({reviews})
                    </span>
                  </div>
                ) : (
                  <span className="nex-pdp-rating-text nex-pdp-rating-text--empty">
                    {t("noReviewsYet")}
                  </span>
                )}
              </div>

              <ProductDetailInteractive
                productId={productId}
                slug={slug}
                name={product.name}
                imageUrl={product.imageUrl ?? null}
                basePriceCents={product.priceCents}
                baseCompareAtCents={product.compareAtCents}
                isInstant={isInstant}
                inStock={inStock}
                variants={product.variants ?? []}
                betweenPricingAndActions={
                  previewText ? (
                    <div className="nex-pdp-description-block">
                      <p className="nex-pdp-excerpt">
                        {shortText || previewText}
                      </p>
                      {fullText && shortText && fullText !== shortText && (
                        <div className="nex-pdp-description-preview whitespace-pre-line">
                          {fullText}
                        </div>
                      )}
                    </div>
                  ) : null
                }
              />
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

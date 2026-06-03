"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import { Star } from "lucide-react";
import type { ProductReview } from "@/server/services/review.service";
import { ProductReviewForm } from "./product-review-form";

type TabId = "details" | "description" | "reviews";

type ProductDetailTabsProps = {
  productId: string;
  productSlug: string;
  locale: string;
  isLoggedIn: boolean;
  userEmail?: string | null;
  userDisplayName?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  hasDbReviews: boolean;
};

export function ProductDetailTabs({
  productId,
  productSlug,
  locale,
  isLoggedIn,
  userEmail,
  userDisplayName,
  shortDescription,
  description,
  rating,
  reviewCount,
  reviews,
  hasDbReviews,
}: ProductDetailTabsProps) {
  const t = useTranslations("product");
  const [active, setActive] = useState<TabId>("details");

  const tabs: { id: TabId; label: string }[] = [
    { id: "details", label: t("tabDetails") },
    { id: "description", label: t("tabDescription") },
    { id: "reviews", label: t("tabReviews") },
  ];

  const detailsText =
    shortDescription?.trim() ||
    description?.trim() ||
    t("detailsPlaceholder");

  const descriptionText = description?.trim() || t("descriptionPlaceholder");

  return (
    <div className="nex-pdp-tabs">
      <div className="nex-pdp-tabs__list" role="tablist" aria-label={t("tabDetails")}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={cn("nex-pdp-tabs__tab", active === tab.id && "nex-pdp-tabs__tab--active")}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="nex-pdp-tabs__panel" role="tabpanel">
        {active === "details" && (
          <p className="nex-pdp-tabs__text">{detailsText}</p>
        )}

        {active === "description" && (
          <div className="nex-pdp-tabs__text nex-pdp-tabs__prose whitespace-pre-line">
            {descriptionText}
          </div>
        )}

        {active === "reviews" && (
          <div className="nex-pdp-tabs__reviews">
            {hasDbReviews ? (
              <div className="nex-pdp-tabs__review-score">
                <Star className="nex-pdp-tabs__review-star" strokeWidth={0} aria-hidden />
                <span className="nex-pdp-tabs__review-value">{rating.toFixed(1)}</span>
                <span className="nex-pdp-tabs__review-count">
                  {t("reviews", { rating: rating.toFixed(1), count: reviewCount })}
                </span>
              </div>
            ) : (
              <p className="nex-pdp-tabs__text">{t("noReviewsYet")}</p>
            )}

            {reviews.length > 0 ? (
              <ul className="nex-pdp-review-list">
                {reviews.map((review) => (
                  <li key={review.id} className="nex-pdp-review-item">
                    <div className="nex-pdp-review-item__head">
                      <span className="nex-pdp-review-item__author">{review.authorName}</span>
                      <span className="nex-pdp-review-item__rating" aria-label={`${review.rating} stars`}>
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="nex-pdp-review-item__body">{review.body}</p>
                  </li>
                ))}
              </ul>
            ) : null}

            <ProductReviewForm
              productId={productId}
              productSlug={productSlug}
              locale={locale}
              isLoggedIn={isLoggedIn}
              userEmail={userEmail}
              userDisplayName={userDisplayName}
            />
          </div>
        )}
      </div>
    </div>
  );
}

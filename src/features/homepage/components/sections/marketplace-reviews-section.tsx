"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import type { ProductReview } from "@/server/services/review.service";
import {
  MarketplaceSectionReveal,
  MarketplaceSectionRevealChild,
} from "../marketplace/marketplace-section-reveal";
import { MarketplaceSectionHeader } from "../marketplace/marketplace-section-header";

const fallbackReviewKeys = ["review1", "review2", "review3"] as const;

function ReviewStars({ rating }: { rating: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="mp-review-card__stars" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "mp-review-card__star",
            index < filled
              ? "mp-review-card__star--filled"
              : "mp-review-card__star--empty",
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

type MarketplaceReviewsSectionProps = {
  reviews?: ProductReview[];
};

export function MarketplaceReviewsSection({
  reviews = [],
}: MarketplaceReviewsSectionProps) {
  const t = useTranslations("home");

  const useDatabaseReviews = reviews.length > 0;

  return (
    <MarketplaceSectionReveal
      aria-label={t("customerReviewsTitle")}
      delay={0.06}
      className="mp-reviews"
    >
      <MarketplaceSectionRevealChild>
        <MarketplaceSectionHeader title={t("customerReviewsTitle")} />
      </MarketplaceSectionRevealChild>

      <div className="mp-reviews__track">
        {useDatabaseReviews
          ? reviews.map((review) => (
              <article key={review.id} className="mp-review-card">
                <ReviewStars rating={review.rating} />
                <p className="mp-review-card__quote">{review.body}</p>
                <p className="mp-review-card__author">{review.authorName}</p>
              </article>
            ))
          : fallbackReviewKeys.map((key) => (
              <article key={key} className="mp-review-card">
                <ReviewStars rating={5} />
                <p className="mp-review-card__quote">{t(`${key}Quote`)}</p>
                <p className="mp-review-card__author">{t(`${key}Author`)}</p>
              </article>
            ))}
      </div>

      <p className="mp-reviews__cta">
        <Link href="/products" className="mp-reviews__cta-link">
          {t("reviewsShopCta")}
        </Link>
      </p>
    </MarketplaceSectionReveal>
  );
}

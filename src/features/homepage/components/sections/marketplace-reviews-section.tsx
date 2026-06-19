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
import { StoreReviewForm } from "../store-review-form";

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
  locale: string;
  isLoggedIn: boolean;
  userEmail?: string | null;
  userDisplayName?: string | null;
};

export function MarketplaceReviewsSection({
  reviews = [],
  locale,
  isLoggedIn,
  userEmail,
  userDisplayName,
}: MarketplaceReviewsSectionProps) {
  const t = useTranslations("home");

  if (reviews.length === 0) {
    return null;
  }

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
        {reviews.map((review) => (
          <article key={review.id} className="mp-review-card">
            <ReviewStars rating={review.rating} />
            <p className="mp-review-card__quote">{review.body}</p>
            <p className="mp-review-card__author">{review.authorName}</p>
          </article>
        ))}
      </div>

      <div className="mp-reviews__footer">
        <StoreReviewForm
          locale={locale}
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          userDisplayName={userDisplayName}
        />
        <p className="mp-reviews__cta">
          <Link href="/products" className="mp-reviews__cta-link">
            {t("reviewsShopCta")}
          </Link>
        </p>
      </div>
    </MarketplaceSectionReveal>
  );
}

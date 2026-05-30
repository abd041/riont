"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import {
  MarketplaceSectionReveal,
  MarketplaceSectionRevealChild,
} from "../marketplace/marketplace-section-reveal";
import { MarketplaceSectionHeader } from "../marketplace/marketplace-section-header";

const reviewKeys = ["review1", "review2", "review3"] as const;

export function MarketplaceReviewsSection() {
  const t = useTranslations("home");

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
        {reviewKeys.map((key) => (
          <article key={key} className="mp-review-card">
            <div className="mp-review-card__stars" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="mp-review-card__star" strokeWidth={1.5} />
              ))}
            </div>
            <p className="mp-review-card__quote">{t(`${key}Quote`)}</p>
            <p className="mp-review-card__author">{t(`${key}Author`)}</p>
          </article>
        ))}
      </div>
    </MarketplaceSectionReveal>
  );
}

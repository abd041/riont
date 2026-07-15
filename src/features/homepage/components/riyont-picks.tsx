"use client";

import { useTranslations } from "next-intl";
import type { CatalogProduct } from "@/types/catalog";
import { MarketplaceMiniCard } from "@/features/products/components/marketplace-mini-card";

type PickView = {
  product: CatalogProduct;
  reason: string;
};

export function RiyontPicks({ picks }: { picks: PickView[] }) {
  const t = useTranslations("home");
  if (picks.length === 0) return null;

  return (
    <section className="mp-riyont-picks" aria-label={t("riyontPicksTitle")}>
      <div className="mp-riyont-picks__head">
        <h2 className="mp-riyont-picks__title">{t("riyontPicksTitle")}</h2>
        <p className="mp-riyont-picks__subtitle">{t("riyontPicksSubtitle")}</p>
      </div>
      <div className="mp-riyont-picks__grid">
        {picks.slice(0, 3).map(({ product, reason }) => (
          <div key={product.id ?? product.slug} className="mp-riyont-picks__cell">
            <MarketplaceMiniCard product={product} />
            {reason ? (
              <p className="mp-riyont-picks__reason">{reason}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

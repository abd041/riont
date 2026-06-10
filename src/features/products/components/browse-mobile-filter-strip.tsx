"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  BROWSE_PLATFORMS,
  MAX_PRICE_CENTS,
} from "./products-filter-sidebar";

type BrowseMobileFilterStripProps = {
  onOpenFullFilters: () => void;
};

export function BrowseMobileFilterStrip({
  onOpenFullFilters,
}: BrowseMobileFilterStripProps) {
  const t = useTranslations("catalog");
  const router = useRouter();
  const searchParams = useSearchParams();

  const maxPriceParam = searchParams.get("maxPrice");
  const maxPriceCents = maxPriceParam
    ? Math.min(MAX_PRICE_CENTS, Math.max(0, Number(maxPriceParam) || MAX_PRICE_CENTS))
    : MAX_PRICE_CENTS;

  const activePlatforms = searchParams.getAll("platform");
  const hasPriceFilter = maxPriceCents < MAX_PRICE_CENTS;
  const hasActiveFilters = hasPriceFilter || activePlatforms.length > 0;

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  }

  function togglePlatform(id: string) {
    updateParams((params) => {
      const current = params.getAll("platform");
      params.delete("platform");
      if (current.includes(id)) {
        current.filter((p) => p !== id).forEach((p) => params.append("platform", p));
      } else {
        [...current, id].forEach((p) => params.append("platform", p));
      }
    });
  }

  return (
    <div className="nex-browse-mobile-filters" aria-label={t("filters")}>
      <div className="nex-browse-mobile-filters__row">
        <span className="nex-browse-mobile-filters__label">{t("platform")}</span>
        <div className="nex-browse-mobile-filters__chips">
          {BROWSE_PLATFORMS.map(({ id, labelKey }) => {
            const active = activePlatforms.includes(id);
            return (
              <button
                key={id}
                type="button"
                className={cn(
                  "nex-browse-mobile-filters__chip",
                  active && "nex-browse-mobile-filters__chip--active",
                )}
                aria-pressed={active}
                onClick={() => togglePlatform(id)}
              >
                {t(labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="nex-browse-mobile-filters__row nex-browse-mobile-filters__row--price">
        <div className="nex-browse-mobile-filters__price-head">
          <span className="nex-browse-mobile-filters__label">{t("priceRange")}</span>
          <span className="nex-browse-mobile-filters__price-value" dir="ltr">
            $0 – ${Math.round(maxPriceCents / 100)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={MAX_PRICE_CENTS}
          step={500}
          value={maxPriceCents}
          className="nex-browse-range nex-browse-mobile-filters__range"
          aria-label={t("priceRange")}
          onChange={(e) => {
            const value = Number(e.target.value);
            updateParams((params) => {
              if (value >= MAX_PRICE_CENTS) params.delete("maxPrice");
              else params.set("maxPrice", String(value));
            });
          }}
        />
      </div>

      <div className="nex-browse-mobile-filters__actions">
        <button
          type="button"
          className="nex-browse-mobile-filters__more"
          onClick={onOpenFullFilters}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
          {t("allFilters")}
        </button>
        {hasActiveFilters ? (
          <button
            type="button"
            className="nex-browse-mobile-filters__clear"
            onClick={() => router.push("/products")}
          >
            {t("clearFilters")}
          </button>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import {
  iconForCategory,
  themeForCategorySlug,
} from "@/features/categories/lib/category-theme";
import {
  MarketplaceSectionReveal,
  MarketplaceSectionRevealChild,
} from "@/features/homepage/components/marketplace/marketplace-section-reveal";
import { MarketplaceSectionHeader } from "@/features/homepage/components/marketplace/marketplace-section-header";
import { mpSpring, mpTap, mpCardHoverMini } from "@/features/homepage/motion/marketplace-motion";
import type { CatalogCategory } from "@/types/catalog";

type CategorySliderProps = {
  categories: CatalogCategory[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
  variant?: "default" | "primary";
};

export function CategorySlider({
  categories,
  activeSlug,
  onSelect,
  variant = "default",
}: CategorySliderProps) {
  const t = useTranslations("home");

  if (categories.length === 0) return null;

  return (
    <MarketplaceSectionReveal
      aria-label={t("browseCategories")}
      delay={0.02}
      className={cn(variant === "primary" && "mp-cat-section--primary")}
    >
      <MarketplaceSectionRevealChild>
        <MarketplaceSectionHeader title={t("browseCategories")} />
      </MarketplaceSectionRevealChild>

      <div className="mp-scroll mp-scroll--fade mp-cat-slider">
        <div
          className="mp-cat-scroll mp-cat-scroll--slider"
          role="list"
          aria-label={t("browseCategories")}
        >
          <motion.button
            type="button"
            layout={false}
            whileTap={mpTap}
            whileHover={mpCardHoverMini}
            transition={mpSpring.soft}
            className={cn("mp-cat mp-cat--premium", activeSlug === null && "mp-cat--active")}
            onClick={() => onSelect(null)}
            role="listitem"
          >
            <span className="mp-cat__icon mp-cat__icon--all" aria-hidden>
              ★
            </span>
            <span className="mp-cat__label">{t("allCategories")}</span>
          </motion.button>

          {categories.map((category, index) => {
            const theme = themeForCategorySlug(category.slug, index);
            const Icon = iconForCategory(category.slug, theme);
            const isActive = activeSlug === category.slug;

            return (
              <motion.button
                key={category.id}
                type="button"
                layout={false}
                whileTap={mpTap}
                whileHover={mpCardHoverMini}
                transition={mpSpring.soft}
                className={cn(
                  "mp-cat mp-cat--premium",
                  `mp-cat--${theme}`,
                  isActive && "mp-cat--active",
                )}
                onClick={() => onSelect(category.slug)}
                role="listitem"
              >
                <span className="mp-cat__icon" aria-hidden>
                  <Icon strokeWidth={1.5} className="h-[18px] w-[18px]" />
                </span>
                <span className="mp-cat__label">{category.name}</span>
              </motion.button>
            );
          })}
          <span className="mp-cat-scroll__spacer" aria-hidden />
        </div>
      </div>
    </MarketplaceSectionReveal>
  );
}

"use client";

import { useRef, useState, useCallback, useEffect } from "react";
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
import { mpSpring, mpTap } from "@/features/homepage/motion/marketplace-motion";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dotIndex, setDotIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const updateDots = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setPageCount(1);
      setDotIndex(0);
      return;
    }
    const pages = Math.min(5, Math.ceil(el.scrollWidth / el.clientWidth));
    setPageCount(pages);
    setDotIndex(Math.round((el.scrollLeft / maxScroll) * (pages - 1)));
  }, []);

  useEffect(() => {
    updateDots();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateDots, { passive: true });
    window.addEventListener("resize", updateDots);
    return () => {
      el.removeEventListener("scroll", updateDots);
      window.removeEventListener("resize", updateDots);
    };
  }, [updateDots, categories.length]);

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

      <div className="mp-scroll mp-scroll--fade">
        <div ref={scrollRef} className="mp-cat-scroll">
          <motion.button
            type="button"
            layout
            whileTap={mpTap}
            transition={mpSpring.soft}
            className={cn("mp-cat", activeSlug === null && "mp-cat--active")}
            onClick={() => onSelect(null)}
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
                layout
                whileTap={mpTap}
                transition={mpSpring.soft}
                className={cn("mp-cat", `mp-cat--${theme}`, isActive && "mp-cat--active")}
                onClick={() => onSelect(category.slug)}
              >
                <span className="mp-cat__icon" aria-hidden>
                  <Icon strokeWidth={1.5} className="h-[18px] w-[18px]" />
                </span>
                <span className="mp-cat__label">{category.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {pageCount > 1 && (
        <div className="mp-dots" aria-hidden>
          {Array.from({ length: pageCount }).map((_, i) => (
            <span
              key={i}
              className={cn("mp-dot", i === dotIndex && "mp-dot--active")}
            />
          ))}
        </div>
      )}
    </MarketplaceSectionReveal>
  );
}

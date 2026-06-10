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
import { mpSpring, mpTap, mpCardHoverMini } from "@/features/homepage/motion/marketplace-motion";
import type { CatalogCategory } from "@/types/catalog";
import {
  getHorizontalScrollProgress,
  scrollToHorizontalProgress,
} from "@/lib/dom/horizontal-scroll";

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
    if (maxScroll <= 8) {
      setPageCount(1);
      setDotIndex(0);
      return;
    }

    const pages = Math.min(Math.ceil(el.scrollWidth / el.clientWidth), 8);
    setPageCount(pages);
    const progress = getHorizontalScrollProgress(el);
    setDotIndex(Math.min(pages - 1, Math.round(progress * (pages - 1))));
  }, []);

  const scrollToPage = useCallback(
    (page: number) => {
      const el = scrollRef.current;
      if (!el || pageCount <= 1) return;
      const progress =
        page >= pageCount - 1 ? 1 : page / Math.max(1, pageCount - 1);
      scrollToHorizontalProgress(el, progress, "smooth");
    },
    [pageCount],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let scrollTimer: number | null = null;

    const measure = () => {
      requestAnimationFrame(updateDots);
    };

    const onScroll = () => {
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        scrollTimer = null;
        updateDots();
      }, 80);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
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

      <div className="mp-scroll mp-scroll--fade mp-cat-slider">
        <div
          ref={scrollRef}
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

      {pageCount > 1 && (
        <div className="mp-dots mp-dots--slider" role="tablist" aria-label={t("browseCategories")}>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === dotIndex}
              aria-label={`Page ${i + 1}`}
              className={cn("mp-dot", i === dotIndex && "mp-dot--active")}
              onClick={() => scrollToPage(i)}
            />
          ))}
        </div>
      )}
    </MarketplaceSectionReveal>
  );
}

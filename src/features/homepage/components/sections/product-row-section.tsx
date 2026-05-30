"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { CatalogProduct } from "@/types/catalog";
import {
  MarketplaceSectionReveal,
  MarketplaceSectionRevealChild,
} from "../marketplace/marketplace-section-reveal";
import { MarketplaceSectionHeader } from "../marketplace/marketplace-section-header";
import { MarketplaceMiniCard } from "@/features/products/components/marketplace-mini-card";
import { mpStaggerContainer, mpStaggerItem } from "@/features/homepage/motion/marketplace-motion";
import { cn } from "@/utils/cn";

type ProductRowSectionProps = {
  products: CatalogProduct[];
  titleKey:
    | "mostRequested"
    | "trendingProducts"
    | "recentlyAdded"
    | "bestSellers"
    | "recommended"
    | "limitedDeals"
    | "popularServices";
  viewAllHref?: string;
  delay?: number;
  variant?: "default" | "deals" | "featured";
};

export function ProductRowSection({
  products,
  titleKey,
  viewAllHref = "/products",
  delay = 0,
  variant = "default",
}: ProductRowSectionProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  if (products.length === 0) return null;

  const rowClass =
    variant === "deals"
      ? "mp-row mp-row--deals"
      : variant === "featured"
        ? "mp-row mp-row--featured"
        : "mp-row";

  return (
    <MarketplaceSectionReveal
      aria-label={t(titleKey)}
      delay={delay}
      className={rowClass}
    >
      <MarketplaceSectionRevealChild>
        <MarketplaceSectionHeader
          title={t(titleKey)}
          action={{ label: tCommon("viewAll"), href: viewAllHref }}
          meta={variant === "deals" ? t("dealsMeta") : undefined}
        />
      </MarketplaceSectionRevealChild>

      <div className={cn(variant === "featured" && "mp-row__scroll-full")}>
        <div className="mp-scroll mp-scroll--fade">
          <motion.div
            className={cn(
              "mp-scroll__track",
              variant === "featured" && "mp-scroll__track--full",
            )}
            variants={mpStaggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {products.map((product) => (
              <motion.div
                key={`${titleKey}-${product.slug}`}
                variants={mpStaggerItem}
                className={variant === "featured" ? "mp-scroll__cell--full" : undefined}
              >
                <MarketplaceMiniCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </MarketplaceSectionReveal>
  );
}

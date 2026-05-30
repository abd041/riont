"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CatalogProduct } from "@/types/catalog";
import { MarketplaceProductCard } from "./marketplace-product-card";
import {
  mpFilterTransition,
  mpGridContainer,
  mpGridItem,
  mpTransition,
} from "@/features/homepage/motion/marketplace-motion";

type MarketplaceProductGridProps = {
  products: CatalogProduct[];
  filterKey: string;
  emptyMessage: string;
};

export function MarketplaceProductGrid({
  products,
  filterKey,
  emptyMessage,
}: MarketplaceProductGridProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={filterKey}
        className="mp-grid"
        initial={mpFilterTransition.initial}
        animate={mpFilterTransition.animate}
        exit={mpFilterTransition.exit}
        transition={mpTransition.normal}
      >
        {products.length === 0 ? (
          <p className="mp-empty">{emptyMessage}</p>
        ) : (
          <motion.div
            className="mp-grid__inner"
            variants={mpGridContainer}
            initial="hidden"
            animate="visible"
          >
            {products.map((product) => (
              <motion.div key={product.slug} variants={mpGridItem} className="mp-grid__cell">
                <MarketplaceProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

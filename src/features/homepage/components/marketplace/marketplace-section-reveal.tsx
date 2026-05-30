"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { mpSectionReveal, mpSectionChild } from "@/features/homepage/motion/marketplace-motion";

type MarketplaceSectionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  "aria-label"?: string;
};

/** Subtle section entrance — respects reduced motion. */
export function MarketplaceSectionReveal({
  children,
  className,
  delay = 0,
  "aria-label": ariaLabel,
}: MarketplaceSectionRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section className={cn("mp-section", className)} aria-label={ariaLabel}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      className={cn("mp-section mp-section--reveal", className)}
      aria-label={ariaLabel}
      variants={mpSectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "-24px" }}
      transition={{ delay }}
    >
      {children}
    </motion.section>
  );
}

export function MarketplaceSectionRevealChild({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={mpSectionChild}>
      {children}
    </motion.div>
  );
}

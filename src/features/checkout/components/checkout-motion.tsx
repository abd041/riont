"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  checkoutFadeUp,
  checkoutStagger,
  checkoutViewport,
} from "../motion/checkout-motion";
import { fadeReducedSection } from "@/features/homepage/motion/home-motion";

export function CheckoutMotionSection({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const variants = reduceMotion
    ? fadeReducedSection
    : {
        ...checkoutFadeUp,
        visible: {
          ...checkoutFadeUp.visible,
          transition: {
            ...checkoutFadeUp.visible.transition,
            delay,
          },
        },
      };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={checkoutViewport}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export function CheckoutMotionStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={checkoutViewport}
      variants={reduceMotion ? fadeReducedSection : checkoutStagger}
    >
      {children}
    </motion.div>
  );
}

export function CheckoutMotionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduceMotion ? fadeReducedSection : checkoutFadeUp}
    >
      {children}
    </motion.div>
  );
}

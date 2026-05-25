"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  fadeReducedSection,
  fadeUpSection,
  homeViewport,
} from "./home-motion";

type HomeMotionSectionProps = {
  children: ReactNode;
  className?: string;
  /** Seconds before reveal starts */
  delay?: number;
};

export function HomeMotionSection({
  children,
  className,
  delay = 0,
}: HomeMotionSectionProps) {
  const reduceMotion = useReducedMotion();

  const variants = reduceMotion
    ? fadeReducedSection
    : {
        ...fadeUpSection,
        visible: {
          ...fadeUpSection.visible,
          transition: {
            ...fadeUpSection.visible.transition,
            delay,
          },
        },
      };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={homeViewport}
    >
      {children}
    </motion.div>
  );
}

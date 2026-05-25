"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  fadeReducedContainer,
  fadeReducedItem,
  fadeUpItem,
  fadeUpStaggerContainer,
  homeViewport,
} from "./home-motion";

type HomeMotionStaggerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul";
};

export function HomeMotionStagger({
  children,
  className,
  as = "div",
}: HomeMotionStaggerProps) {
  const reduceMotion = useReducedMotion();
  const container = reduceMotion ? fadeReducedContainer : fadeUpStaggerContainer;
  const item = reduceMotion ? fadeReducedItem : fadeUpItem;

  if (as === "ul") {
    return (
      <motion.ul
        className={className}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={homeViewport}
      >
        {Children.map(children, (child) =>
          child ? (
            <motion.li key={(child as { key?: React.Key }).key} variants={item}>
              {child}
            </motion.li>
          ) : null
        )}
      </motion.ul>
    );
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={homeViewport}
    >
      {Children.map(children, (child) =>
        child ? (
          <motion.div
            key={(child as { key?: React.Key }).key}
            variants={item}
            className="nex-home-stagger-item"
          >
            {child}
          </motion.div>
        ) : null
      )}
    </motion.div>
  );
}

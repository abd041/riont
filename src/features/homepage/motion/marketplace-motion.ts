import { motion as motionTokens } from "@/constants/design-system";

export const mpEase = motionTokens.ease;

export const mpTransition = {
  fast: { duration: motionTokens.duration.fast, ease: mpEase },
  normal: { duration: motionTokens.duration.normal, ease: mpEase },
  slow: { duration: motionTokens.duration.slow, ease: mpEase },
} as const;

export const mpSpring = {
  soft: { type: "spring" as const, stiffness: 380, damping: 32 },
  snappy: { type: "spring" as const, stiffness: 480, damping: 28 },
};

export const mpFadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8, scale: 0.99 },
};

export const mpSectionReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.normal,
      ease: mpEase,
      when: "beforeChildren" as const,
      staggerChildren: 0.05,
    },
  },
};

export const mpSectionChild = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.duration.normal, ease: mpEase },
  },
};

export const mpStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.045, delayChildren: 0.04 },
  },
};

export const mpStaggerItem = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: motionTokens.duration.normal, ease: mpEase },
  },
};

export const mpGridContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.035, delayChildren: 0.06 },
  },
};

export const mpGridItem = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: mpEase },
  },
};

export const mpFilterTransition = {
  initial: { opacity: 0, y: 6, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -4, filter: "blur(2px)" },
};

export const mpTap = { scale: 0.97 };
export const mpHoverLift = { y: -2 };

export const mpCardHover = {
  y: -6,
  scale: 1.02,
  transition: { type: "spring" as const, stiffness: 420, damping: 28 },
};

export const mpCardHoverMini = {
  y: -4,
  scale: 1.03,
  transition: { type: "spring" as const, stiffness: 450, damping: 30 },
};

/**
 * Canonical hero slider animation (approved default).
 * Do not replace with experimental motion unless explicitly requested.
 * Used by: hero-section.tsx
 */

export const HERO_ANIMATION_DEFAULT = {
  slideIntervalMs: 6500,
  bg: {
    duration: 1.35,
    ease: [0.22, 1, 0.36, 1] as const,
    inactiveScale: 1.06,
  },
  text: {
    ease: [0.22, 1, 0.36, 1] as const,
    staggerChildren: 0.09,
    delayChildren: 0.12,
    exitStaggerChildren: 0.05,
    itemDuration: 0.4,
    lineDuration: 0.42,
    exitDuration: 0.32,
    lineExitDuration: 0.34,
    itemBlurEnter: 10,
    itemBlurExit: 8,
    lineBlurEnter: 12,
    lineBlurExit: 10,
    itemYEnter: 28,
    itemYExit: -18,
    lineYEnter: 32,
    lineYExit: -22,
  },
  presenceMode: "wait" as const,
} as const;

export const easePremium = HERO_ANIMATION_DEFAULT.text.ease;

export const textStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: HERO_ANIMATION_DEFAULT.text.staggerChildren,
      delayChildren: HERO_ANIMATION_DEFAULT.text.delayChildren,
    },
  },
  exit: {
    transition: {
      staggerChildren: HERO_ANIMATION_DEFAULT.text.exitStaggerChildren,
      staggerDirection: -1,
    },
  },
};

export const textItem = {
  hidden: {
    opacity: 0,
    y: HERO_ANIMATION_DEFAULT.text.itemYEnter,
    filter: `blur(${HERO_ANIMATION_DEFAULT.text.itemBlurEnter}px)`,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: HERO_ANIMATION_DEFAULT.text.itemDuration,
      ease: easePremium,
    },
  },
  exit: {
    opacity: 0,
    y: HERO_ANIMATION_DEFAULT.text.itemYExit,
    filter: `blur(${HERO_ANIMATION_DEFAULT.text.itemBlurExit}px)`,
    transition: {
      duration: HERO_ANIMATION_DEFAULT.text.exitDuration,
      ease: easePremium,
    },
  },
};

export const lineItem = {
  hidden: {
    opacity: 0,
    y: HERO_ANIMATION_DEFAULT.text.lineYEnter,
    filter: `blur(${HERO_ANIMATION_DEFAULT.text.lineBlurEnter}px)`,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: HERO_ANIMATION_DEFAULT.text.lineDuration,
      ease: easePremium,
    },
  },
  exit: {
    opacity: 0,
    y: HERO_ANIMATION_DEFAULT.text.lineYExit,
    filter: `blur(${HERO_ANIMATION_DEFAULT.text.lineBlurExit}px)`,
    transition: {
      duration: HERO_ANIMATION_DEFAULT.text.lineExitDuration,
      ease: easePremium,
    },
  },
};

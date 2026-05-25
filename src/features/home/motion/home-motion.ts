/** Homepage scroll-reveal + stagger variants (DESIGN_SYSTEM §7) */

export const easePremium = [0.22, 1, 0.36, 1] as const;

export const fadeUpSection = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easePremium },
  },
};

export const fadeUpStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
      duration: 0.35,
      ease: easePremium,
    },
  },
};

export const fadeUpItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easePremium },
  },
};

export const fadeReducedSection = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
};

export const fadeReducedContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
};

export const fadeReducedItem = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
};

export const homeViewport = { once: true, margin: "-48px 0px" as const };

import { easePremium } from "@/features/home/motion/home-motion";

export const checkoutFadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: easePremium },
  },
};

export const checkoutStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
      ease: easePremium,
    },
  },
};

export const checkoutViewport = { once: true, margin: "-40px 0px" as const };

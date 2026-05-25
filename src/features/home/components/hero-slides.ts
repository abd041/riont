import { HERO_ANIMATION_DEFAULT } from "./hero-animation.default";

/** @deprecated Use HERO_ANIMATION_DEFAULT — kept for imports */
export const HERO_SLIDE_INTERVAL_MS = HERO_ANIMATION_DEFAULT.slideIntervalMs;
export const HERO_BG_TRANSITION = {
  duration: HERO_ANIMATION_DEFAULT.bg.duration,
  ease: HERO_ANIMATION_DEFAULT.bg.ease,
};
export const HERO_TEXT_TRANSITION = {
  duration: HERO_ANIMATION_DEFAULT.text.itemDuration,
  ease: HERO_ANIMATION_DEFAULT.text.ease,
};

export const HERO_SLIDES = [
  {
    id: "slide-1",
    image: "/hero/hero.png",
    titleKey: "heroSlide1Title",
    highlightKey: "heroSlide1Highlight",
    subtitleKey: "heroSlide1Subtitle",
    imagePosition: "65% 38%",
  },
  {
    id: "slide-2",
    image: "/hero/hero-second.png",
    titleKey: "heroSlide2Title",
    highlightKey: "heroSlide2Highlight",
    subtitleKey: "heroSlide2Subtitle",
    imagePosition: "65% 38%",
  },
  {
    id: "slide-3",
    image: "/hero/hero-third.png",
    titleKey: "heroSlide3Title",
    highlightKey: "heroSlide3Highlight",
    subtitleKey: "heroSlide3Subtitle",
    imagePosition: "65% 38%",
  },
] as const;

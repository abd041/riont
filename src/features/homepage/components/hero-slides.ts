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

export type HeroPromoTheme = "deals" | "gaming" | "instant";

export const HERO_SLIDES = [
  {
    id: "promo-deals",
    type: "promo" as const,
    theme: "deals" as HeroPromoTheme,
    titleKey: "heroPromo1Title",
    highlightKey: "heroPromo1Highlight",
    subtitleKey: "heroPromo1Subtitle",
    tagKey: "heroPromo1Tag",
  },
  {
    id: "promo-gaming",
    type: "promo" as const,
    theme: "gaming" as HeroPromoTheme,
    titleKey: "heroPromo2Title",
    highlightKey: "heroPromo2Highlight",
    subtitleKey: "heroPromo2Subtitle",
    tagKey: "heroPromo2Tag",
  },
  {
    id: "promo-instant",
    type: "promo" as const,
    theme: "instant" as HeroPromoTheme,
    titleKey: "heroPromo3Title",
    highlightKey: "heroPromo3Highlight",
    subtitleKey: "heroPromo3Subtitle",
    tagKey: "heroPromo3Tag",
  },
] as const;

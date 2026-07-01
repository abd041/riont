/** Hero carousel slide ids — keep in sync with hero-slides.ts */
export const HERO_SLIDE_IDS = [
  "promo-deals",
  "promo-gaming",
  "promo-instant",
] as const;

export type HeroSlideId = (typeof HERO_SLIDE_IDS)[number];

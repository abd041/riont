/**
 * ARCHIVED — experimental AAA motion polish (not active).
 * Kept for reference only. The live hero uses hero-animation.default.ts.
 *
 * To try again: swap imports in hero-section.tsx and add hero-motion.polish.archive.css
 */

export const HERO_SLIDE_INTERVAL_MS = 6500;
export const HERO_BG_DURATION = 1.55;

export const EASE_LUXURY_IN = [0.16, 1, 0.3, 1] as const;
export const EASE_LUXURY_OUT = [0.55, 0.06, 0.2, 1] as const;
export const EASE_CROSSFADE = [0.42, 0.05, 0.18, 1] as const;

export const SLIDE_BG_DRIFT = [
  { enterX: "2.8%", exitX: "-1.5%", enterScale: 1.065, exitScale: 1.035 },
  { enterX: "-2.8%", exitX: "1.5%", enterScale: 1.065, exitScale: 1.035 },
  { enterX: "2%", exitX: "-2%", enterScale: 1.06, exitScale: 1.03 },
] as const;

/** Overlapping copy layers + non-linear stagger — see git/conversation May 2026 */

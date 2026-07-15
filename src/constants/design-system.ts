/**
 * Marketplace design tokens — sync with CSS variables in globals.css + nexora-marketplace-system.css.
 * Prefer Tailwind + mp-* classes in UI; use these for JS logic and Framer Motion.
 */

export const colors = {
  void: "#000000",
  base: "#000000",
  elevated: "#0a0a0a",
  surface: "#111111",
  surface2: "#171717",
  text: {
    primary: "#ededed",
    secondary: "rgba(237, 237, 237, 0.65)",
    muted: "rgba(237, 237, 237, 0.42)",
    faint: "rgba(237, 237, 237, 0.28)",
  },
  accent: {
    300: "#d4bc8c",
    400: "#c9b896",
    500: "#b59a6a",
    600: "#9a8158",
    700: "#7d6847",
  },
  border: {
    subtle: "rgba(255, 255, 255, 0.06)",
    default: "rgba(255, 255, 255, 0.1)",
    strong: "rgba(255, 255, 255, 0.14)",
    glow: "rgba(181, 154, 106, 0.22)",
    active: "rgba(181, 154, 106, 0.32)",
  },
} as const;

/** Compact marketplace spacing (px) — mobile-first density. */
export const spacing = {
  pageX: { mobile: 10, tablet: 14, desktop: 18 },
  pageY: { mobile: 8, tablet: 10, desktop: 14 },
  section: { mobile: 10, tablet: 12, desktop: 14 },
  block: { mobile: 6, tablet: 8, desktop: 10 },
  card: { mobile: 6, tablet: 8, desktop: 10 },
  inline: { xs: 4, sm: 6, md: 8, lg: 10 },
  grid: { mobile: 6, tablet: 8, desktop: 10 },
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  pill: 9999,
} as const;

export const shadows = {
  card: "0 8px 24px rgba(0, 0, 0, 0.45)",
  cardHover: "0 12px 32px rgba(0, 0, 0, 0.52)",
  topbar: "0 4px 20px rgba(0, 0, 0, 0.5)",
  inset: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
} as const;

/** Accent glow — hairline / minimal; prefer borders over bloom. */
export const glow = {
  sm: "0 0 0 1px rgba(255, 255, 255, 0.06)",
  md: "0 0 0 1px rgba(255, 255, 255, 0.1)",
  lg: "0 0 0 1px rgba(255, 255, 255, 0.12)",
  active: "0 0 0 1px rgba(181, 154, 106, 0.28)",
  cardHover: "0 0 0 1px rgba(255, 255, 255, 0.1)",
} as const;

/** Compact typography scale (px). */
export const typography = {
  sectionTitle: { size: 10, weight: 700, tracking: "0.14em" },
  cardTitle: { size: 11, weight: 600, lineHeight: 1.25 },
  cardMeta: { size: 9, weight: 500 },
  price: { size: 11, weight: 700 },
  priceLg: { size: 12, weight: 700 },
  badge: { size: 9, weight: 700 },
  link: { size: 10, weight: 500 },
} as const;

export const motion = {
  ease: [0.22, 1, 0.36, 1] as const,
  duration: {
    fast: 0.2,
    normal: 0.28,
    slow: 0.4,
  },
} as const;

/** Layout conventions for marketplace pages. */
export const marketplace = {
  maxContentWidth: 1440,
  topbarHeight: 52,
  sidebarWidth: 240,
  productGrid: {
    mobile: 2,
    sm: 3,
    lg: 4,
    xl: 5,
  },
  heroCompactHeight: { mobile: 140, tablet: 168, desktop: 188 },
  miniCardWidth: 113,
  categoryChipWidth: 60,
} as const;

/** CSS custom property names exposed on :root via marketplace stylesheet. */
export const cssVarNames = {
  mpPageX: "--mp-page-x",
  mpPageY: "--mp-page-y",
  mpSectionGap: "--mp-section-gap",
  mpCardGap: "--mp-card-gap",
  mpTopbarH: "--mp-topbar-h",
} as const;

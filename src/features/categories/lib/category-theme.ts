import {
  Crown,
  FileCog,
  Gamepad2,
  Gift,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Category theme keys map to CSS modifier classes (e.g. mp-cat--violet).
 * All themes render bronze/neutral in the bronze theme stylesheet.
 */
export type CategoryTheme = "violet" | "blue" | "amber" | "emerald" | "rose";

const THEME_ORDER: CategoryTheme[] = [
  "amber",
  "violet",
  "emerald",
  "rose",
  "blue",
];

const SLUG_THEME: Record<string, CategoryTheme> = {
  gaming: "amber",
  games: "amber",
  software: "amber",
  subscriptions: "amber",
  "gift-cards": "emerald",
  gifts: "emerald",
  accounts: "rose",
  instagram: "rose",
};

export const CATEGORY_THEME_ICONS: Record<CategoryTheme, LucideIcon> = {
  violet: Gamepad2,
  blue: FileCog,
  amber: Crown,
  emerald: Gift,
  rose: Users,
};

export function themeForCategorySlug(
  slug: string,
  index = 0,
): CategoryTheme {
  return SLUG_THEME[slug.toLowerCase()] ?? THEME_ORDER[index % THEME_ORDER.length];
}

export function iconForCategory(slug: string, theme: CategoryTheme): LucideIcon {
  if (slug.toLowerCase() === "instagram") return Sparkles;
  return CATEGORY_THEME_ICONS[theme];
}

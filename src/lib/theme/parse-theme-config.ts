import type { ThemeTokens } from "./tokens";
import { GEIST_DARK_PRESET } from "./tokens";
import { parseThemeGradients } from "./gradients";

export function parseThemeTokenOverrides(
  raw: unknown,
): Partial<ThemeTokens> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const keys = Object.keys(GEIST_DARK_PRESET) as (keyof ThemeTokens)[];
  const result: Partial<ThemeTokens> = {};

  for (const key of keys) {
    const value = (raw as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) {
      result[key] = value.trim();
    }
  }

  return result;
}

export function parseThemeConfig(raw: unknown): {
  tokenOverrides: Partial<ThemeTokens>;
  gradientOverrides: ReturnType<typeof parseThemeGradients>;
} {
  return {
    tokenOverrides: parseThemeTokenOverrides(raw),
    gradientOverrides: parseThemeGradients(raw),
  };
}

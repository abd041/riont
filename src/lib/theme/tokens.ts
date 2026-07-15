/**
 * Default theme presets — source of truth for Phase 1+ theme engine.
 * Phase 0: CSS in nexora-geist-dark.css mirrors this preset.
 */

export type ThemeTokens = {
  bgVoid: string;
  bgBase: string;
  bgElevated: string;
  bgSurface: string;
  bgSurface2: string;
  borderSubtle: string;
  borderDefault: string;
  borderStrong: string;
  accent400: string;
  accent500: string;
  accent600: string;
  accent700: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;
  success: string;
  warning: string;
  error: string;
};

/** Modern Dark Tech — gold is accent-only, not the visual weight of the UI. */
export const GEIST_DARK_PRESET: ThemeTokens = {
  bgVoid: "#000000",
  bgBase: "#000000",
  bgElevated: "#0a0a0a",
  bgSurface: "#111111",
  bgSurface2: "#171717",
  borderSubtle: "rgba(255, 255, 255, 0.06)",
  borderDefault: "rgba(255, 255, 255, 0.1)",
  borderStrong: "rgba(255, 255, 255, 0.14)",
  accent400: "#c9b896",
  accent500: "#b59a6a",
  accent600: "#9a8158",
  accent700: "#7d6847",
  textPrimary: "#ededed",
  textSecondary: "rgba(237, 237, 237, 0.65)",
  textMuted: "rgba(237, 237, 237, 0.42)",
  textAccent: "#c9b896",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
};

export const BRONZE_PRESET: ThemeTokens = {
  bgVoid: "#000000",
  bgBase: "#000000",
  bgElevated: "#080808",
  bgSurface: "#0a0a0a",
  bgSurface2: "#101010",
  borderSubtle: "rgba(255, 255, 255, 0.06)",
  borderDefault: "rgba(255, 255, 255, 0.1)",
  borderStrong: "rgba(255, 255, 255, 0.14)",
  accent400: "#c4a574",
  accent500: "#a67c52",
  accent600: "#8b6340",
  accent700: "#6e4f32",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.72)",
  textMuted: "rgba(255, 255, 255, 0.45)",
  textAccent: "#d4bc8c",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
};

export const THEME_PRESET_IDS = ["geist-dark", "bronze"] as const;
export type ThemePresetId = (typeof THEME_PRESET_IDS)[number];

export const DEFAULT_THEME_PRESET: ThemePresetId = "geist-dark";

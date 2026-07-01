import {
  BRONZE_PRESET,
  GEIST_DARK_PRESET,
  type ThemePresetId,
  type ThemeTokens,
} from "./tokens";
import {
  getDefaultGradients,
  resolveThemeGradients,
  type ThemeGradients,
} from "./gradients";
import { parseThemeConfig } from "./parse-theme-config";

const PRESETS: Record<ThemePresetId, ThemeTokens> = {
  "geist-dark": GEIST_DARK_PRESET,
  bronze: BRONZE_PRESET,
};

export function getPresetTokens(presetId: ThemePresetId): ThemeTokens {
  return { ...PRESETS[presetId] };
}

export function resolveThemeTokens(
  presetId: ThemePresetId,
  overrides: Partial<ThemeTokens>,
): ThemeTokens {
  const base = getPresetTokens(presetId);
  return { ...base, ...overrides };
}

export type ResolvedTheme = {
  preset: ThemePresetId;
  tokens: ThemeTokens;
  gradients: ThemeGradients;
};

export function resolveTheme(
  presetId: ThemePresetId,
  rawConfig: unknown,
): ResolvedTheme {
  const { tokenOverrides, gradientOverrides } = parseThemeConfig(rawConfig);
  const tokens = resolveThemeTokens(presetId, tokenOverrides);
  const gradients = resolveThemeGradients(tokens, gradientOverrides);

  return { preset: presetId, tokens, gradients };
}

/** @deprecated Use parseThemeConfig */
export function parseThemeOverrides(raw: unknown): Partial<ThemeTokens> {
  return parseThemeConfig(raw).tokenOverrides;
}

export { getDefaultGradients };

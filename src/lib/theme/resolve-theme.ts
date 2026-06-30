import {
  BRONZE_PRESET,
  GEIST_DARK_PRESET,
  type ThemePresetId,
  type ThemeTokens,
} from "./tokens";

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

export function parseThemeOverrides(
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

import type { ThemeTokens } from "./tokens";
import { deriveGlowFromAccent } from "./derive-tokens";

const CSS_VAR_MAP: Record<keyof ThemeTokens, string> = {
  bgVoid: "--bg-void",
  bgBase: "--bg-base",
  bgElevated: "--bg-elevated",
  bgSurface: "--bg-surface",
  bgSurface2: "--bg-surface-2",
  borderSubtle: "--border-subtle",
  borderDefault: "--border-default",
  borderStrong: "--border-strong",
  accent400: "--accent-400",
  accent500: "--accent-500",
  accent600: "--accent-600",
  accent700: "--accent-700",
  textPrimary: "--text-primary",
  textSecondary: "--text-secondary",
  textMuted: "--text-muted",
  textAccent: "--text-accent",
  success: "--success",
  warning: "--warning",
  error: "--error",
};

export function themeTokensToCssBlock(tokens: ThemeTokens): string {
  const glow = deriveGlowFromAccent(tokens.accent500);
  const lines = Object.entries(CSS_VAR_MAP).map(([key, cssVar]) => {
    const value = tokens[key as keyof ThemeTokens];
    return `  ${cssVar}: ${value};`;
  });

  lines.push(`  --accent-glow: ${glow.accentGlow};`);
  lines.push(`  --accent-glow-sm: ${glow.accentGlowSm};`);
  lines.push(`  --border-glow: ${glow.borderGlow};`);
  lines.push(`  --gradient-primary: ${tokens.accent500};`);
  lines.push(`  --bg-card: ${tokens.bgSurface};`);
  lines.push(`  --bg-card-hover: ${tokens.bgSurface2};`);
  lines.push(`  --text-accent: ${tokens.textAccent};`);

  return `:root {\n${lines.join("\n")}\n}`;
}

export function themeTokensToInlineStyle(
  tokens: ThemeTokens,
): Record<string, string> {
  const glow = deriveGlowFromAccent(tokens.accent500);
  const style: Record<string, string> = {};

  for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
    style[cssVar] = tokens[key as keyof ThemeTokens];
  }

  style["--accent-glow"] = glow.accentGlow;
  style["--accent-glow-sm"] = glow.accentGlowSm;
  style["--border-glow"] = glow.borderGlow;
  style["--gradient-primary"] = tokens.accent500;
  style["--bg-card"] = tokens.bgSurface;
  style["--bg-card-hover"] = tokens.bgSurface2;

  return style;
}

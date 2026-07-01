import type { ThemeTokens } from "./tokens";
import { deriveGlowFromAccent } from "./derive-tokens";
import {
  gradientToCss,
  resolveGradientBackground,
  type ThemeGradients,
} from "./gradients";

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

export function themeTokensToCssBlock(
  tokens: ThemeTokens,
  gradients?: ThemeGradients,
): string {
  const glow = deriveGlowFromAccent(tokens.accent500);
  const lines = Object.entries(CSS_VAR_MAP).map(([key, cssVar]) => {
    const value = tokens[key as keyof ThemeTokens];
    return `  ${cssVar}: ${value};`;
  });

  lines.push(`  --accent-glow: ${glow.accentGlow};`);
  lines.push(`  --accent-glow-sm: ${glow.accentGlowSm};`);
  lines.push(`  --border-glow: ${glow.borderGlow};`);
  lines.push(`  --bg-card: ${tokens.bgSurface};`);
  lines.push(`  --bg-card-hover: ${tokens.bgSurface2};`);
  lines.push(`  --text-accent: ${tokens.textAccent};`);

  const g = gradients;
  const pageBg = g
    ? resolveGradientBackground(g.pageBackground, tokens.bgBase)
    : tokens.bgBase;
  const cardBg = g
    ? resolveGradientBackground(g.cardBackground, tokens.bgSurface)
    : tokens.bgSurface;
  const cardHoverBg = g
    ? resolveGradientBackground(g.cardHover, tokens.bgSurface2)
    : tokens.bgSurface2;
  const cardMediaBg = g
    ? resolveGradientBackground(g.cardMedia, tokens.bgElevated)
    : tokens.bgElevated;
  const accentBg = g
    ? resolveGradientBackground(g.accentButton, tokens.accent500)
    : tokens.accent500;
  const badgeBg = g
    ? resolveGradientBackground(g.saleBadge, tokens.accent600)
    : tokens.accent600;

  lines.push(`  --gradient-page: ${pageBg};`);
  lines.push(`  --gradient-card: ${cardBg};`);
  lines.push(`  --gradient-card-hover: ${cardHoverBg};`);
  lines.push(`  --gradient-card-media: ${cardMediaBg};`);
  lines.push(`  --gradient-accent: ${accentBg};`);
  lines.push(`  --gradient-badge: ${badgeBg};`);
  lines.push(`  --gradient-primary: ${accentBg};`);

  const sectionMostRequested = g
    ? resolveGradientBackground(g.sectionMostRequested, "transparent")
    : "transparent";
  const sectionBrowse = g
    ? resolveGradientBackground(g.sectionBrowse, "transparent")
    : "transparent";
  const promoBannerBg = g
    ? resolveGradientBackground(g.promoBanner, tokens.accent600)
    : tokens.accent600;

  lines.push(`  --gradient-section-most-requested: ${sectionMostRequested};`);
  lines.push(`  --gradient-section-browse: ${sectionBrowse};`);
  lines.push(`  --gradient-promo-banner: ${promoBannerBg};`);

  if (g) {
    for (const [slot, gradient] of Object.entries(g) as Array<
      [keyof ThemeGradients, (typeof g)[keyof ThemeGradients]]
    >) {
      const varName = `--gradient-slot-${slot.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
      lines.push(
        `  ${varName}: ${gradient.enabled ? gradientToCss(gradient) : "none"};`,
      );
    }
  }

  lines.push(`  --co-bg-top: ${tokens.bgElevated};`);
  lines.push(`  --co-bg-bottom: ${tokens.bgBase};`);
  lines.push(`  --co-glass-top: ${tokens.bgSurface};`);
  lines.push(`  --co-glass-bottom: ${tokens.bgElevated};`);
  lines.push(`  --co-border: ${glow.borderGlow};`);
  lines.push(`  --co-border-soft: ${tokens.borderSubtle};`);
  lines.push(`  --co-glow: ${glow.accentGlowSm};`);
  lines.push(`  --co-glow-strong: ${glow.accentGlow};`);
  lines.push(`  --co-text-muted: ${tokens.textMuted};`);
  lines.push(`  --co-text-secondary: ${tokens.textSecondary};`);
  lines.push(`  --success-muted: rgba(34, 197, 94, 0.15);`);
  lines.push(`  --error-muted: rgba(239, 68, 68, 0.15);`);
  lines.push(`  --warning-muted: rgba(245, 158, 11, 0.15);`);

  lines.push(`  --card-bg: ${cardBg};`);
  lines.push(`  --card-bg-hover: ${cardHoverBg};`);
  lines.push(`  --card-border: ${tokens.borderSubtle};`);
  lines.push(`  --card-border-hover: ${glow.borderGlow};`);
  lines.push(`  --card-media-bg: ${cardMediaBg};`);
  lines.push(`  --card-badge-bg: ${badgeBg};`);
  lines.push(`  --card-badge-text: #ffffff;`);
  lines.push(`  --card-glow: ${glow.accentGlowSm};`);

  return `:root {\n${lines.join("\n")}\n}`;
}

export function themeTokensToInlineStyle(
  tokens: ThemeTokens,
  gradients?: ThemeGradients,
): Record<string, string> {
  const block = themeTokensToCssBlock(tokens, gradients);
  const style: Record<string, string> = {};
  const inner = block.replace(/^:root\s*\{\n?/, "").replace(/\n?\}$/, "");
  for (const line of inner.split("\n")) {
    const match = line.match(/^\s*(--[^:]+):\s*(.+);\s*$/);
    if (match) {
      style[match[1]!] = match[2]!;
    }
  }
  return style;
}

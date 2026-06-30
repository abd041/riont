import type { ThemeTokens } from "./tokens";

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.replace("#", "").trim();
  if (raw.length === 3) {
    const r = parseInt(raw[0]! + raw[0]!, 16);
    const g = parseInt(raw[1]! + raw[1]!, 16);
    const b = parseInt(raw[2]! + raw[2]!, 16);
    return { r, g, b };
  }
  if (raw.length === 6) {
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return { r, g, b };
  }
  return null;
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")}`;
}

/** Lighten (+) or darken (-) a hex color by a 0–1 factor. */
export function adjustHex(hex: string, factor: number): string {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  if (factor >= 0) {
    return toHex(
      rgb.r + (255 - rgb.r) * factor,
      rgb.g + (255 - rgb.g) * factor,
      rgb.b + (255 - rgb.b) * factor,
    );
  }
  const f = 1 + factor;
  return toHex(rgb.r * f, rgb.g * f, rgb.b * f);
}

export function deriveAccentScale(accent500: string): Pick<
  ThemeTokens,
  "accent400" | "accent500" | "accent600" | "accent700" | "textAccent"
> {
  return {
    accent400: adjustHex(accent500, 0.22),
    accent500,
    accent600: adjustHex(accent500, -0.12),
    accent700: adjustHex(accent500, -0.24),
    textAccent: adjustHex(accent500, 0.18),
  };
}

export function deriveGlowFromAccent(accent500: string): {
  accentGlow: string;
  accentGlowSm: string;
  borderGlow: string;
} {
  const rgb = parseHex(accent500);
  if (!rgb) {
    return {
      accentGlow: "rgba(196, 165, 116, 0.2)",
      accentGlowSm: "rgba(196, 165, 116, 0.1)",
      borderGlow: "rgba(196, 165, 116, 0.28)",
    };
  }
  return {
    accentGlow: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
    accentGlowSm: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
    borderGlow: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.28)`,
  };
}

import type { ThemeTokens } from "./tokens";

export type GradientType = "linear" | "radial";

export type ThemeGradient = {
  enabled: boolean;
  type: GradientType;
  /** Linear gradient angle in degrees */
  angle: number;
  from: string;
  to: string;
  via?: string;
};

export const GRADIENT_SLOT_IDS = [
  "pageBackground",
  "cardBackground",
  "cardHover",
  "cardMedia",
  "accentButton",
  "saleBadge",
] as const;

export type GradientSlotId = (typeof GRADIENT_SLOT_IDS)[number];

export type ThemeGradients = Record<GradientSlotId, ThemeGradient>;

export const GRADIENT_SLOT_META: Record<
  GradientSlotId,
  { label: string; description: string }
> = {
  pageBackground: {
    label: "Page background",
    description: "Main storefront backdrop behind all sections",
  },
  cardBackground: {
    label: "Product cards",
    description: "Most Requested, Featured, browse grid, and related cards",
  },
  cardHover: {
    label: "Cards on hover",
    description: "Background when a product card is hovered",
  },
  cardMedia: {
    label: "Card image area",
    description: "Top image/icon section on each product card",
  },
  accentButton: {
    label: "Buttons & cart icons",
    description: "Primary buttons, add-to-cart, and main CTAs",
  },
  saleBadge: {
    label: "Sale badges",
    description: "Discount tags such as -14% on product cards",
  },
};

export function createDefaultGradient(
  from: string,
  to: string,
  angle = 180,
): ThemeGradient {
  return {
    enabled: false,
    type: "linear",
    angle,
    from,
    to,
  };
}

export function getDefaultGradients(tokens: ThemeTokens): ThemeGradients {
  return {
    pageBackground: createDefaultGradient(tokens.bgBase, tokens.bgElevated, 180),
    cardBackground: createDefaultGradient(
      tokens.bgSurface,
      tokens.bgElevated,
      165,
    ),
    cardHover: createDefaultGradient(tokens.bgSurface2, tokens.bgSurface, 165),
    cardMedia: createDefaultGradient(tokens.bgElevated, tokens.bgVoid, 145),
    accentButton: createDefaultGradient(
      tokens.accent500,
      tokens.accent700,
      135,
    ),
    saleBadge: createDefaultGradient(tokens.accent600, tokens.accent700, 135),
  };
}

export function parseThemeGradients(raw: unknown): Partial<ThemeGradients> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const container = raw as Record<string, unknown>;
  const gradientsRaw = container.gradients;
  if (!gradientsRaw || typeof gradientsRaw !== "object" || Array.isArray(gradientsRaw)) {
    return {};
  }

  const result: Partial<ThemeGradients> = {};
  const g = gradientsRaw as Record<string, unknown>;

  for (const id of GRADIENT_SLOT_IDS) {
    const entry = g[id];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const o = entry as Record<string, unknown>;
    const from = typeof o.from === "string" ? o.from.trim() : "";
    const to = typeof o.to === "string" ? o.to.trim() : "";
    if (!from || !to) continue;

    result[id] = {
      enabled: o.enabled === true,
      type: o.type === "radial" ? "radial" : "linear",
      angle:
        typeof o.angle === "number" && Number.isFinite(o.angle)
          ? o.angle
          : 180,
      from,
      to,
      via:
        typeof o.via === "string" && o.via.trim() ? o.via.trim() : undefined,
    };
  }

  return result;
}

export function resolveThemeGradients(
  tokens: ThemeTokens,
  overrides: Partial<ThemeGradients>,
): ThemeGradients {
  const defaults = getDefaultGradients(tokens);
  const resolved = { ...defaults };

  for (const id of GRADIENT_SLOT_IDS) {
    const override = overrides[id];
    if (override) {
      resolved[id] = { ...defaults[id], ...override };
    }
  }

  return resolved;
}

export function gradientToCss(gradient: ThemeGradient): string {
  if (!gradient.enabled) {
    return gradient.from;
  }

  if (gradient.type === "radial") {
    const stops = gradient.via
      ? `${gradient.from} 0%, ${gradient.via} 50%, ${gradient.to} 100%`
      : `${gradient.from} 0%, ${gradient.to} 100%`;
    return `radial-gradient(ellipse 120% 100% at 50% 0%, ${stops})`;
  }

  const stops = gradient.via
    ? `${gradient.from} 0%, ${gradient.via} 50%, ${gradient.to} 100%`
    : `${gradient.from} 0%, ${gradient.to} 100%`;
  return `linear-gradient(${gradient.angle}deg, ${stops})`;
}

export function resolveGradientBackground(
  gradient: ThemeGradient,
  solidFallback: string,
): string {
  if (!gradient.enabled) return solidFallback;
  return gradientToCss(gradient);
}

/** Quick presets admin can apply to a gradient slot */
export const GRADIENT_QUICK_PRESETS: Array<{
  id: string;
  label: string;
  gradient: Omit<ThemeGradient, "enabled">;
}> = [
  {
    id: "bronze-shine",
    label: "Bronze shine",
    gradient: {
      type: "linear",
      angle: 135,
      from: "#c4a574",
      to: "#6e4f32",
    },
  },
  {
    id: "midnight",
    label: "Midnight",
    gradient: {
      type: "linear",
      angle: 180,
      from: "#0a0a0f",
      to: "#000000",
    },
  },
  {
    id: "purple-fade",
    label: "Purple fade",
    gradient: {
      type: "linear",
      angle: 160,
      from: "#1a1028",
      via: "#0d0a14",
      to: "#000000",
    },
  },
  {
    id: "ember",
    label: "Ember",
    gradient: {
      type: "linear",
      angle: 145,
      from: "#2a1210",
      to: "#0a0606",
    },
  },
  {
    id: "ocean",
    label: "Ocean",
    gradient: {
      type: "linear",
      angle: 180,
      from: "#0a1628",
      to: "#020408",
    },
  },
  {
    id: "radial-glow",
    label: "Radial glow",
    gradient: {
      type: "radial",
      angle: 0,
      from: "#1a1510",
      to: "#000000",
    },
  },
];

export function buildThemeConfigPayload(
  tokenOverrides: Partial<ThemeTokens>,
  gradients: ThemeGradients,
  defaults: ThemeGradients,
): Record<string, unknown> {
  const payload: Record<string, unknown> = { ...tokenOverrides };

  const gradientDiff: Partial<ThemeGradients> = {};
  let hasGradientDiff = false;

  for (const id of GRADIENT_SLOT_IDS) {
    const current = gradients[id];
    const base = defaults[id];
    const changed =
      current.enabled !== base.enabled ||
      current.type !== base.type ||
      current.angle !== base.angle ||
      current.from !== base.from ||
      current.to !== base.to ||
      (current.via ?? "") !== (base.via ?? "");

    if (changed) {
      gradientDiff[id] = current;
      hasGradientDiff = true;
    }
  }

  if (hasGradientDiff) {
    payload.gradients = gradientDiff;
  }

  return payload;
}

"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  saveThemeSettingsAction,
  resetThemeSettingsAction,
  type ThemeActionResult,
} from "@/server/actions/admin-theme.actions";
import { deriveAccentScale } from "@/lib/theme/derive-tokens";
import {
  buildThemeConfigPayload,
  getDefaultGradients,
  type ThemeGradients,
} from "@/lib/theme/gradients";
import { getPresetTokens, resolveThemeTokens } from "@/lib/theme/resolve-theme";
import {
  THEME_PRESET_IDS,
  type ThemePresetId,
  type ThemeTokens,
} from "@/lib/theme/tokens";
import {
  ThemeColorField,
  ThemePreviewPanel,
  useThemeEditorState,
} from "./admin-theme-editor";
import { ThemeGradientPanel } from "./admin-theme-gradient-panel";

const PRESET_INFO: Record<
  ThemePresetId,
  { label: string; description: string; swatch: string[] }
> = {
  "geist-dark": {
    label: "Geist Dark",
    description: "Flat black surfaces, minimal glow — modern & clean",
    swatch: ["#000000", "#111111", "#c4a574"],
  },
  bronze: {
    label: "Bronze",
    description: "Warmer bronze accent on deep black — premium feel",
    swatch: ["#000000", "#0a0a0a", "#a67c52"],
  },
};

const TOKEN_GROUPS: Array<{
  title: string;
  description: string;
  fields: Array<{
    key: keyof ThemeTokens;
    label: string;
    hint?: string;
    rgba?: boolean;
  }>;
}> = [
  {
    title: "Page backgrounds",
    description: "Solid fallbacks when gradients are off",
    fields: [
      { key: "bgVoid", label: "Deepest layer", hint: "Rarely visible edge cases" },
      { key: "bgBase", label: "Page background", hint: "Main shop backdrop" },
      { key: "bgElevated", label: "Raised areas", hint: "Product image area on cards" },
      { key: "bgSurface", label: "Cards & panels", hint: "Product card background" },
      { key: "bgSurface2", label: "Hovered cards", hint: "Card background on hover" },
    ],
  },
  {
    title: "Borders & dividers",
    description: "Use rgba values for subtle lines on dark backgrounds",
    fields: [
      { key: "borderSubtle", label: "Subtle", hint: "e.g. rgba(255,255,255,0.06)", rgba: true },
      { key: "borderDefault", label: "Default", hint: "Cards and inputs", rgba: true },
      { key: "borderStrong", label: "Strong", hint: "Emphasized outlines", rgba: true },
    ],
  },
  {
    title: "Text colors",
    description: "Headings, body copy, and muted labels",
    fields: [
      { key: "textPrimary", label: "Headings & prices", hint: "Highest contrast" },
      { key: "textSecondary", label: "Body text", hint: "Descriptions", rgba: true },
      { key: "textMuted", label: "Labels & hints", hint: "Timestamps, captions", rgba: true },
      { key: "textAccent", label: "Highlighted text", hint: "Links and accents" },
    ],
  },
  {
    title: "Brand accent",
    description: "Solid fallbacks for buttons and badges",
    fields: [
      { key: "accent400", label: "Light accent", hint: "Icons and hover states" },
      { key: "accent500", label: "Main accent", hint: "Primary buttons" },
      { key: "accent600", label: "Pressed accent", hint: "Sale badges" },
      { key: "accent700", label: "Dark accent", hint: "Deep emphasis" },
    ],
  },
  {
    title: "Status colors",
    description: "Success, warning, and error messages across the shop",
    fields: [
      { key: "success", label: "Success", hint: "Order confirmed, in stock" },
      { key: "warning", label: "Warning", hint: "Pending actions" },
      { key: "error", label: "Error", hint: "Validation and failures" },
    ],
  },
];

export function AdminThemeForm({
  preset: initialPreset,
  tokens: initialTokens,
  gradients: initialGradients,
}: {
  preset: ThemePresetId;
  tokens: ThemeTokens;
  gradients: ThemeGradients;
}) {
  const [preset, setPreset] = useState<ThemePresetId>(initialPreset);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showGradients, setShowGradients] = useState(true);
  const { tokens, setTokens, updateToken } = useThemeEditorState(initialTokens);
  const [gradients, setGradients] = useState<ThemeGradients>(initialGradients);
  const [state, formAction, pending] = useActionState<
    ThemeActionResult | null,
    FormData
  >(saveThemeSettingsAction, null);
  const [resetPending, startReset] = useTransition();

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message ?? "Saved");
    else toast.error(state.error);
  }, [state]);

  function applyPreset(next: ThemePresetId) {
    setPreset(next);
    const baseTokens = getPresetTokens(next);
    setTokens(baseTokens);
    setGradients(getDefaultGradients(baseTokens));
  }

  function handleAccentQuickPick(hex: string) {
    const scale = deriveAccentScale(hex);
    setTokens((prev) => ({ ...prev, ...scale }));
    setGradients((prev) => ({
      ...prev,
      accentButton: {
        ...prev.accentButton,
        from: scale.accent500,
        to: scale.accent700,
      },
      saleBadge: {
        ...prev.saleBadge,
        from: scale.accent600,
        to: scale.accent700,
      },
      promoBanner: {
        ...prev.promoBanner,
        from: scale.accent700,
        to: scale.accent500,
      },
    }));
  }

  function handleReset() {
    startReset(async () => {
      const result = await resetThemeSettingsAction();
      if (result.success) {
        toast.success(result.message);
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    });
  }

  const diffFromPreset = (key: keyof ThemeTokens): boolean => {
    const base = resolveThemeTokens(preset, {});
    return tokens[key] !== base[key];
  };

  const defaultGradients = getDefaultGradients(resolveThemeTokens(preset, {}));
  const customTokenCount = (Object.keys(tokens) as (keyof ThemeTokens)[]).filter(
    (key) => diffFromPreset(key),
  ).length;
  const activeGradientCount = Object.values(gradients).filter((g) => g.enabled)
    .length;

  const tokenOverrides = Object.fromEntries(
    (Object.keys(tokens) as (keyof ThemeTokens)[])
      .filter((key) => diffFromPreset(key))
      .map((key) => [key, tokens[key]]),
  );

  const themeConfigJson = JSON.stringify(
    buildThemeConfigPayload(tokenOverrides, gradients, defaultGradients),
  );

  return (
    <div className="admin-theme-layout">
      <form action={formAction} className="admin-panel admin-panel--flat admin-theme-form">
        <input type="hidden" name="preset" value={preset} />
        <input type="hidden" name="themeConfig" value={themeConfigJson} />

        <div className="admin-section-intro">
          <h3 className="font-semibold">Store colors & gradients</h3>
          <p className="admin-section-intro__desc">
            Change colors anytime — save once and the whole storefront updates
            instantly. Use solid colors, gradients, or both together.
          </p>
        </div>

        <fieldset className="admin-theme-group">
          <legend>1. Choose a base style</legend>
          <p className="admin-theme-group__desc">
            Starting point for the whole shop: homepage, products, checkout, and
            account pages.
          </p>
          <div className="admin-theme-preset-cards">
            {THEME_PRESET_IDS.map((id) => {
              const info = PRESET_INFO[id];
              return (
                <button
                  key={id}
                  type="button"
                  className={
                    preset === id
                      ? "admin-theme-preset-card admin-theme-preset-card--active"
                      : "admin-theme-preset-card"
                  }
                  onClick={() => applyPreset(id)}
                >
                  <div className="admin-theme-preset-card__swatches">
                    {info.swatch.map((color) => (
                      <span
                        key={color}
                        style={{ background: color }}
                        aria-hidden
                      />
                    ))}
                  </div>
                  <span className="admin-theme-preset-card__label">{info.label}</span>
                  <span className="admin-theme-preset-card__desc">{info.description}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="admin-theme-group">
          <legend>2. Brand accent color</legend>
          <p className="admin-theme-group__desc">
            Updates buttons, badges, cart icons, and accent gradients across all
            product cards.
          </p>
          <div className="admin-theme-accent-row">
            <input
              type="color"
              value={
                tokens.accent500.startsWith("#")
                  ? tokens.accent500.slice(0, 7)
                  : "#c4a574"
              }
              onChange={(e) => handleAccentQuickPick(e.target.value)}
              className="admin-theme-field__picker admin-theme-field__picker--lg"
              aria-label="Brand accent color"
            />
            <div>
              <p className="admin-theme-accent-row__label">Main accent</p>
              <p className="admin-theme-accent-row__value">{tokens.accent500}</p>
              <p className="admin-theme-accent-row__hint">
                Also updates button and badge gradient stops when enabled.
              </p>
            </div>
          </div>
        </fieldset>

        <div className="admin-theme-advanced-toggle">
          <button
            type="button"
            className="admin-theme-advanced-toggle__btn"
            onClick={() => setShowGradients((v) => !v)}
            aria-expanded={showGradients}
          >
            {showGradients ? "Hide gradients" : "Show gradients"}
            {activeGradientCount > 0 ? (
              <span className="admin-theme-advanced-toggle__badge">
                {activeGradientCount} active
              </span>
            ) : null}
          </button>
          <p className="admin-theme-advanced-toggle__hint">
            Turn gradients on per area — page background, product cards, buttons,
            and sale badges. Pick quick presets or custom from/to colors.
          </p>
        </div>

        {showGradients && (
          <fieldset className="admin-theme-group">
            <legend>3. Gradients</legend>
            <ThemeGradientPanel
              gradients={gradients}
              onChange={(id, patch) =>
                setGradients((prev) => ({
                  ...prev,
                  [id]: { ...prev[id], ...patch },
                }))
              }
              onApplyPreset={(id, presetGradient) =>
                setGradients((prev) => ({
                  ...prev,
                  [id]: { ...presetGradient, enabled: true },
                }))
              }
            />
          </fieldset>
        )}

        <div className="admin-theme-advanced-toggle">
          <button
            type="button"
            className="admin-theme-advanced-toggle__btn"
            onClick={() => setShowAdvanced((v) => !v)}
            aria-expanded={showAdvanced}
          >
            {showAdvanced ? "Hide solid color overrides" : "Show solid color overrides"}
            {customTokenCount > 0 && !showAdvanced ? (
              <span className="admin-theme-advanced-toggle__badge">
                {customTokenCount} custom
              </span>
            ) : null}
          </button>
          <p className="admin-theme-advanced-toggle__hint">
            Fine-tune individual solid colors. These are used as fallbacks when a
            gradient is turned off.
          </p>
        </div>

        {showAdvanced &&
          TOKEN_GROUPS.map((group) => (
            <fieldset key={group.title} className="admin-theme-group">
              <legend>{group.title}</legend>
              <p className="admin-theme-group__desc">{group.description}</p>
              <div className="admin-theme-group__grid">
                {group.fields.map((field) => (
                  <div key={field.key} className="admin-theme-field-wrap">
                    <ThemeColorField
                      label={field.label}
                      tokenKey={field.key}
                      value={tokens[field.key]}
                      onChange={updateToken}
                      allowRgba={field.rgba}
                    />
                    {field.hint ? (
                      <p className="admin-theme-field-wrap__hint">{field.hint}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </fieldset>
          ))}

        <div className="admin-theme-form__actions">
          <Button type="submit" disabled={pending || resetPending}>
            {pending ? "Saving…" : "Save & update storefront"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending || resetPending}
            onClick={handleReset}
          >
            {resetPending ? "Resetting…" : "Reset to defaults"}
          </Button>
        </div>
      </form>

      <ThemePreviewPanel tokens={tokens} gradients={gradients} />
    </div>
  );
}

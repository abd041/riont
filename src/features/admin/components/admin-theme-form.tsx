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
import { resolveThemeTokens } from "@/lib/theme/resolve-theme";
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

const TOKEN_GROUPS: Array<{
  title: string;
  fields: Array<{ key: keyof ThemeTokens; label: string; rgba?: boolean }>;
}> = [
  {
    title: "Backgrounds",
    fields: [
      { key: "bgVoid", label: "Void" },
      { key: "bgBase", label: "Base" },
      { key: "bgElevated", label: "Elevated" },
      { key: "bgSurface", label: "Surface" },
      { key: "bgSurface2", label: "Surface 2" },
    ],
  },
  {
    title: "Borders",
    fields: [
      { key: "borderSubtle", label: "Subtle", rgba: true },
      { key: "borderDefault", label: "Default", rgba: true },
      { key: "borderStrong", label: "Strong", rgba: true },
    ],
  },
  {
    title: "Text",
    fields: [
      { key: "textPrimary", label: "Primary" },
      { key: "textSecondary", label: "Secondary", rgba: true },
      { key: "textMuted", label: "Muted", rgba: true },
      { key: "textAccent", label: "Accent" },
    ],
  },
  {
    title: "Accent",
    fields: [
      { key: "accent400", label: "Light" },
      { key: "accent500", label: "Main" },
      { key: "accent600", label: "Dark" },
      { key: "accent700", label: "Darker" },
    ],
  },
  {
    title: "Status",
    fields: [
      { key: "success", label: "Success" },
      { key: "warning", label: "Warning" },
      { key: "error", label: "Error" },
    ],
  },
];

export function AdminThemeForm({
  preset: initialPreset,
  tokens: initialTokens,
}: {
  preset: ThemePresetId;
  tokens: ThemeTokens;
}) {
  const [preset, setPreset] = useState<ThemePresetId>(initialPreset);
  const { tokens, setTokens, updateToken } = useThemeEditorState(initialTokens);
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
    setTokens(resolveThemeTokens(next, {}));
  }

  function handleAccentQuickPick(hex: string) {
    const scale = deriveAccentScale(hex);
    setTokens((prev) => ({ ...prev, ...scale }));
  }

  function handleReset() {
    startReset(async () => {
      const result = await resetThemeSettingsAction();
      if (result.success) {
        toast.success(result.message);
        setPreset("geist-dark");
        setTokens(resolveThemeTokens("geist-dark", {}));
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

  const themeConfigJson = JSON.stringify(
    Object.fromEntries(
      (Object.keys(tokens) as (keyof ThemeTokens)[]).filter((key) =>
        diffFromPreset(key),
      ).map((key) => [key, tokens[key]]),
    ),
  );

  return (
    <div className="admin-theme-layout">
      <form action={formAction} className="admin-panel admin-panel--flat admin-theme-form">
        <input type="hidden" name="preset" value={preset} />
        <input type="hidden" name="themeConfig" value={themeConfigJson} />

        <div className="admin-theme-form__toolbar">
          <div>
            <p className="admin-theme-form__hint">
              Pick any color — changes apply to the whole storefront after save.
            </p>
            <div className="admin-theme-form__presets">
              {THEME_PRESET_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={
                    preset === id
                      ? "admin-theme-preset admin-theme-preset--active"
                      : "admin-theme-preset"
                  }
                  onClick={() => applyPreset(id)}
                >
                  {id === "geist-dark" ? "Geist Dark" : "Bronze"}
                </button>
              ))}
            </div>
          </div>
          <div className="admin-theme-form__accent-quick">
            <label className="admin-theme-field__label">Quick accent</label>
            <input
              type="color"
              defaultValue={tokens.accent500}
              onChange={(e) => handleAccentQuickPick(e.target.value)}
              className="admin-theme-field__picker"
              aria-label="Quick accent color"
            />
          </div>
        </div>

        {TOKEN_GROUPS.map((group) => (
          <fieldset key={group.title} className="admin-theme-group">
            <legend>{group.title}</legend>
            <div className="admin-theme-group__grid">
              {group.fields.map((field) => (
                <ThemeColorField
                  key={field.key}
                  label={field.label}
                  tokenKey={field.key}
                  value={tokens[field.key]}
                  onChange={updateToken}
                  allowRgba={field.rgba}
                />
              ))}
            </div>
          </fieldset>
        ))}

        <div className="admin-theme-form__actions">
          <Button type="submit" disabled={pending || resetPending}>
            {pending ? "Saving…" : "Save & apply to storefront"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending || resetPending}
            onClick={handleReset}
          >
            {resetPending ? "Resetting…" : "Reset to default"}
          </Button>
        </div>
      </form>

      <ThemePreviewPanel tokens={tokens} />
    </div>
  );
}

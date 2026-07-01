"use client";

import { useMemo, useState } from "react";
import type { ThemeTokens } from "@/lib/theme/tokens";
import { themeTokensToInlineStyle } from "@/lib/theme/apply-theme";
import type { ThemeGradients } from "@/lib/theme/gradients";

type ColorFieldProps = {
  label: string;
  tokenKey: keyof ThemeTokens;
  value: string;
  onChange: (key: keyof ThemeTokens, value: string) => void;
  allowRgba?: boolean;
};

function toPickerHex(value: string): string {
  if (value.startsWith("#") && value.length >= 7) {
    return value.slice(0, 7);
  }
  return "#000000";
}

export function ThemeColorField({
  label,
  tokenKey,
  value,
  onChange,
  allowRgba = false,
}: ColorFieldProps) {
  const pickerValue = toPickerHex(value);
  const textOnly = allowRgba;

  return (
    <div className="admin-theme-field">
      <label className="admin-theme-field__label">{label}</label>
      <div className="admin-theme-field__row">
        {!textOnly && (
          <input
            type="color"
            value={pickerValue}
            onChange={(e) => onChange(tokenKey, e.target.value)}
            className="admin-theme-field__picker"
            aria-label={`${label} color picker`}
          />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(tokenKey, e.target.value)}
          className={
            textOnly
              ? "admin-theme-field__hex admin-theme-field__hex--full"
              : "admin-theme-field__hex"
          }
          spellCheck={false}
          placeholder={allowRgba ? "rgba(...)" : "#000000"}
        />
      </div>
    </div>
  );
}

type ThemePreviewProps = {
  tokens: ThemeTokens;
  gradients?: ThemeGradients;
};

export function ThemePreviewPanel({ tokens, gradients }: ThemePreviewProps) {
  const style = useMemo(
    () => themeTokensToInlineStyle(tokens, gradients),
    [tokens, gradients],
  );

  return (
    <div className="admin-theme-preview" style={style}>
      <p className="admin-theme-preview__label">Live preview</p>
      <div
        className="admin-theme-preview__canvas"
        style={{ background: "var(--bg-base)" }}
      >
        <div
          className="admin-theme-preview__product-card"
          style={{
            background: "var(--gradient-card, var(--card-bg, var(--bg-surface)))",
            border: "1px solid var(--card-border, var(--border-subtle))",
          }}
        >
          <div
            className="admin-theme-preview__product-media"
            style={{
              background:
                "var(--gradient-card-media, var(--card-media-bg, var(--bg-elevated)))",
            }}
          />
          <div className="admin-theme-preview__product-body">
            <p
              className="admin-theme-preview__product-title"
              style={{ color: "var(--text-primary)" }}
            >
              Steam Premium
            </p>
            <p
              className="admin-theme-preview__product-cat"
              style={{ color: "var(--text-muted)" }}
            >
              Gaming · Instant
            </p>
            <div className="admin-theme-preview__product-row">
              <span
                className="admin-theme-preview__product-price"
                style={{ color: "var(--text-primary)" }}
              >
                $29.99
              </span>
              <span
                className="admin-theme-preview__product-badge"
                style={{
                  background: "var(--gradient-badge, var(--card-badge-bg, var(--accent-600)))",
                  color: "#fff",
                }}
              >
                -14%
              </span>
              <span
                className="admin-theme-preview__product-cart"
                style={{ background: "var(--gradient-accent, var(--accent-500))" }}
                aria-hidden
              />
            </div>
          </div>
        </div>

        <div
          className="admin-theme-preview__card"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            marginTop: 12,
          }}
        >
          <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            Buttons
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Checkout and CTAs
          </p>
          <div className="admin-theme-preview__actions">
            <span
              style={{
                background: "var(--gradient-accent, var(--accent-500))",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Primary
            </span>
            <span
              style={{
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              Outline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useThemeEditorState(initial: ThemeTokens) {
  const [tokens, setTokens] = useState<ThemeTokens>(initial);

  const updateToken = (key: keyof ThemeTokens, value: string) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
  };

  return { tokens, setTokens, updateToken };
}

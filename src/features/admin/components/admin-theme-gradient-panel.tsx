"use client";

import {
  GRADIENT_QUICK_PRESETS,
  GRADIENT_SLOT_IDS,
  GRADIENT_SLOT_META,
  gradientToCss,
  type GradientSlotId,
  type ThemeGradient,
  type ThemeGradients,
} from "@/lib/theme/gradients";

const ANGLE_OPTIONS = [0, 45, 90, 135, 180, 225, 270, 315] as const;

type GradientEditorProps = {
  gradients: ThemeGradients;
  onChange: (id: GradientSlotId, patch: Partial<ThemeGradient>) => void;
  onApplyPreset: (id: GradientSlotId, preset: Omit<ThemeGradient, "enabled">) => void;
};

function GradientSlotEditor({
  id,
  gradient,
  onChange,
  onApplyPreset,
}: {
  id: GradientSlotId;
  gradient: ThemeGradient;
  onChange: (patch: Partial<ThemeGradient>) => void;
  onApplyPreset: (preset: Omit<ThemeGradient, "enabled">) => void;
}) {
  const meta = GRADIENT_SLOT_META[id];
  const preview = gradient.enabled
    ? gradientToCss(gradient)
    : gradient.from;

  return (
    <div className="admin-gradient-slot">
      <div className="admin-gradient-slot__head">
        <div>
          <p className="admin-gradient-slot__label">{meta.label}</p>
          <p className="admin-gradient-slot__desc">{meta.description}</p>
        </div>
        <label className="admin-gradient-slot__toggle">
          <span>Gradient on</span>
          <input
            type="checkbox"
            checked={gradient.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
          />
        </label>
      </div>

      <div
        className="admin-gradient-slot__preview"
        style={{ background: preview }}
        aria-hidden
      />

      <div className="admin-gradient-slot__presets">
        {GRADIENT_QUICK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="admin-gradient-preset-chip"
            onClick={() => onApplyPreset(preset.gradient)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="admin-gradient-slot__fields">
        <label className="admin-gradient-field">
          <span>Type</span>
          <select
            value={gradient.type}
            onChange={(e) =>
              onChange({
                type: e.target.value === "radial" ? "radial" : "linear",
              })
            }
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </label>

        {gradient.type === "linear" && (
          <label className="admin-gradient-field">
            <span>Angle</span>
            <select
              value={gradient.angle}
              onChange={(e) => onChange({ angle: Number(e.target.value) })}
            >
              {ANGLE_OPTIONS.map((angle) => (
                <option key={angle} value={angle}>
                  {angle}°
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="admin-gradient-field admin-gradient-field--color">
          <span>From</span>
          <input
            type="color"
            value={
              gradient.from.startsWith("#")
                ? gradient.from.slice(0, 7)
                : "#000000"
            }
            onChange={(e) => onChange({ from: e.target.value })}
          />
          <input
            type="text"
            value={gradient.from}
            onChange={(e) => onChange({ from: e.target.value })}
            spellCheck={false}
          />
        </label>

        <label className="admin-gradient-field admin-gradient-field--color">
          <span>Via (optional)</span>
          <input
            type="color"
            value={
              gradient.via?.startsWith("#")
                ? gradient.via.slice(0, 7)
                : "#333333"
            }
            onChange={(e) => onChange({ via: e.target.value })}
          />
          <input
            type="text"
            value={gradient.via ?? ""}
            placeholder="Middle stop (optional)"
            onChange={(e) =>
              onChange({ via: e.target.value.trim() || undefined })
            }
            spellCheck={false}
          />
        </label>

        <label className="admin-gradient-field admin-gradient-field--color">
          <span>To</span>
          <input
            type="color"
            value={
              gradient.to.startsWith("#") ? gradient.to.slice(0, 7) : "#000000"
            }
            onChange={(e) => onChange({ to: e.target.value })}
          />
          <input
            type="text"
            value={gradient.to}
            onChange={(e) => onChange({ to: e.target.value })}
            spellCheck={false}
          />
        </label>
      </div>
    </div>
  );
}

export function ThemeGradientPanel({
  gradients,
  onChange,
  onApplyPreset,
}: GradientEditorProps) {
  return (
    <div className="admin-gradient-panel">
      {GRADIENT_SLOT_IDS.map((id) => (
        <GradientSlotEditor
          key={id}
          id={id}
          gradient={gradients[id]}
          onChange={(patch) => onChange(id, patch)}
          onApplyPreset={(preset) => onApplyPreset(id, preset)}
        />
      ))}
    </div>
  );
}

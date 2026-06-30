import { z } from "zod";
import { THEME_PRESET_IDS } from "@/lib/theme/tokens";

export const themeColorSchema = z
  .string()
  .min(1)
  .max(80)
  .refine(
    (v) =>
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v) ||
      /^rgba?\([\d\s%,.]+\)$/.test(v),
    "Invalid color value",
  );

export const themeTokensPartialSchema = z.object({
  bgVoid: themeColorSchema.optional(),
  bgBase: themeColorSchema.optional(),
  bgElevated: themeColorSchema.optional(),
  bgSurface: themeColorSchema.optional(),
  bgSurface2: themeColorSchema.optional(),
  borderSubtle: themeColorSchema.optional(),
  borderDefault: themeColorSchema.optional(),
  borderStrong: themeColorSchema.optional(),
  accent400: themeColorSchema.optional(),
  accent500: themeColorSchema.optional(),
  accent600: themeColorSchema.optional(),
  accent700: themeColorSchema.optional(),
  textPrimary: themeColorSchema.optional(),
  textSecondary: themeColorSchema.optional(),
  textMuted: themeColorSchema.optional(),
  textAccent: themeColorSchema.optional(),
  success: themeColorSchema.optional(),
  warning: themeColorSchema.optional(),
  error: themeColorSchema.optional(),
});

export const saveThemeSettingsSchema = z.object({
  preset: z.enum(THEME_PRESET_IDS),
  themeConfig: themeTokensPartialSchema,
});

export type SaveThemeSettingsInput = z.infer<typeof saveThemeSettingsSchema>;

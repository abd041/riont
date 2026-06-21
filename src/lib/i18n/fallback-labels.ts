import { isRtlLocale } from "@/constants/locales";

const LABELS = {
  defaultOption: { en: "Option", ar: "خيار" },
  anonymousCustomer: { en: "Customer", ar: "عميل" },
} as const;

export type FallbackLabelKey = keyof typeof LABELS;

export function resolveFallbackLabel(locale: string, key: FallbackLabelKey): string {
  const entry = LABELS[key];
  return isRtlLocale(locale) ? entry.ar : entry.en;
}

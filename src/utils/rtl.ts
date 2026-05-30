import { isRtlLocale, RTL_LOCALES } from "@/constants/locales";

export { isRtlLocale, RTL_LOCALES };

/** Resolve text direction for a locale string. */
export function getDirection(locale: string): "rtl" | "ltr" {
  return isRtlLocale(locale) ? "rtl" : "ltr";
}

/** Logical inline-start/end helpers for RTL-safe positioning. */
export const logical = {
  start: (locale: string) => (isRtlLocale(locale) ? "right" : "left"),
  end: (locale: string) => (isRtlLocale(locale) ? "left" : "right"),
} as const;

/** Apply dir attribute value for React/HTML. */
export function dirAttribute(locale: string): "rtl" | "ltr" {
  return getDirection(locale);
}

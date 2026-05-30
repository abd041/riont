import { routing } from "@/i18n/routing";

/** Supported storefront locales — keep in sync with next-intl routing. */
export const LOCALES = routing.locales;
export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE = routing.defaultLocale;

export const RTL_LOCALES: readonly AppLocale[] = ["ar"];

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as AppLocale);
}

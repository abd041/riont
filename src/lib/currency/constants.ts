export const BASE_CURRENCY = "USD" as const;

export const SUPPORTED_CURRENCIES = [
  { code: "USD", label: "USD $" },
  { code: "EUR", label: "EUR €" },
  { code: "SAR", label: "SAR ﷼" },
  { code: "AED", label: "AED" },
  { code: "EGP", label: "EGP £" },
] as const;

export type DisplayCurrency = (typeof SUPPORTED_CURRENCIES)[number]["code"];

export const DISPLAY_CURRENCY_COOKIE = "display_currency";

export const CURRENCY_BY_LOCALE: Record<string, DisplayCurrency> = {
  ar: "SAR",
  en: "USD",
};

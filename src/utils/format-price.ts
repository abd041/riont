import { isRtlLocale } from "@/constants/locales";

/** Format USD cents for display in the active locale. */
export function formatPrice(
  cents: number,
  locale: string,
  currency = "USD",
): string {
  const intlLocale = isRtlLocale(locale) ? "ar-SA" : "en-US";
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

/** @alias formatPrice — matches legacy lib naming. */
export const formatMoney = formatPrice;

import { isRtlLocale } from "@/constants/locales";

type DateFormatOptions = Intl.DateTimeFormatOptions;

const DEFAULT_OPTIONS: DateFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

/** Locale-aware date formatting with RTL locale support. */
export function formatDate(
  value: Date | string | number,
  locale: string,
  options: DateFormatOptions = DEFAULT_OPTIONS,
): string {
  const date = value instanceof Date ? value : new Date(value);
  const intlLocale = isRtlLocale(locale) ? "ar-SA" : "en-US";
  return new Intl.DateTimeFormat(intlLocale, options).format(date);
}

/** Relative-friendly time (e.g. order timestamps). */
export function formatDateTime(
  value: Date | string | number,
  locale: string,
): string {
  return formatDate(value, locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMoney(
  cents: number,
  locale: string,
  currency = "USD",
): string {
  const intlLocale = locale === "ar" ? "ar-SA" : "en-US";
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

import type { DisplayCurrency } from "@/lib/currency/constants";

export function convertFromUsdCents(
  usdCents: number,
  target: DisplayCurrency,
  rates: Record<string, number>,
): number {
  const rate = rates[target] ?? 1;
  return Math.round(usdCents * rate);
}

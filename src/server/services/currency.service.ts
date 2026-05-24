import { createAdminClient } from "@/lib/supabase/admin";
import {
  BASE_CURRENCY,
  type DisplayCurrency,
  SUPPORTED_CURRENCIES,
} from "@/lib/currency/constants";

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  SAR: 3.75,
  AED: 3.67,
  EGP: 48.5,
};

export async function getExchangeRates(): Promise<Record<string, number>> {
  const rates: Record<string, number> = { ...FALLBACK_RATES };

  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("exchange_rates")
      .select("target_currency, rate")
      .eq("base_currency", BASE_CURRENCY);

    for (const row of data ?? []) {
      const r = row as { target_currency: string; rate: number };
      rates[r.target_currency] = Number(r.rate);
    }
  } catch {
    // use fallbacks
  }

  return rates;
}

export { convertFromUsdCents } from "@/lib/currency/convert";

export function isSupportedCurrency(code: string): code is DisplayCurrency {
  return SUPPORTED_CURRENCIES.some((c) => c.code === code);
}

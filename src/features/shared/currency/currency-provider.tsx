"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DISPLAY_CURRENCY_COOKIE,
  type DisplayCurrency,
  SUPPORTED_CURRENCIES,
} from "@/lib/currency/constants";
import { convertFromUsdCents } from "@/lib/currency/convert";
import { formatMoney } from "@/lib/format/currency";

type CurrencyContextValue = {
  currency: DisplayCurrency;
  setCurrency: (code: DisplayCurrency) => void;
  formatPrice: (usdCents: number, locale: string) => string;
  rates: Record<string, number>;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  children,
  initialCurrency,
  rates,
}: {
  children: ReactNode;
  initialCurrency: DisplayCurrency;
  rates: Record<string, number>;
}) {
  const [currency, setCurrencyState] = useState<DisplayCurrency>(initialCurrency);

  const setCurrency = useCallback((code: DisplayCurrency) => {
    setCurrencyState(code);
    document.cookie = `${DISPLAY_CURRENCY_COOKIE}=${code};path=/;max-age=31536000;samesite=lax`;
  }, []);

  const formatPrice = useCallback(
    (usdCents: number, locale: string) => {
      const converted = convertFromUsdCents(usdCents, currency, rates);
      return formatMoney(converted, locale, currency);
    },
    [currency, rates],
  );

  const value = useMemo(
    () => ({ currency, setCurrency, formatPrice, rates }),
    [currency, setCurrency, formatPrice, rates],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}

export function useCurrencyOptional() {
  return useContext(CurrencyContext);
}

export { SUPPORTED_CURRENCIES };

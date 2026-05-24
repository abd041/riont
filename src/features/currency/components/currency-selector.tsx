"use client";

import { useTranslations } from "next-intl";
import { useCurrency, SUPPORTED_CURRENCIES } from "./currency-provider";
import type { DisplayCurrency } from "@/lib/currency/constants";

export function CurrencySelector() {
  const t = useTranslations("currency");
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as DisplayCurrency)}
      aria-label={t("label")}
      className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-2 text-xs text-[var(--text-primary)] focus:border-[var(--border-glow)] focus:outline-none"
    >
      {SUPPORTED_CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.label}
        </option>
      ))}
    </select>
  );
}

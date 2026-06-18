"use client";

import { useTranslations } from "next-intl";
import { useCurrency, SUPPORTED_CURRENCIES } from "./currency-provider";
import type { DisplayCurrency } from "@/lib/currency/constants";
import { cn } from "@/lib/utils/cn";

export function CurrencySelector({ className }: { className?: string }) {
  const t = useTranslations("currency");
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as DisplayCurrency)}
      aria-label={t("label")}
      className={cn(
        "nex-pill-select cursor-pointer focus:border-[rgba(166,124,82,0.35)] focus:outline-none",
        className,
      )}
    >
      {SUPPORTED_CURRENCIES.map((c) => (
        <option key={c.code} value={c.code} className="bg-[#0a0a0a]">
          {c.label}
        </option>
      ))}
    </select>
  );
}

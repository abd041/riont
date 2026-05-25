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
        "nex-pill-select cursor-pointer focus:border-[rgba(139,92,246,0.35)] focus:outline-none",
        className,
      )}
    >
      {SUPPORTED_CURRENCIES.map((c) => (
        <option key={c.code} value={c.code} className="bg-[#0a0a0f]">
          {c.label}
        </option>
      ))}
    </select>
  );
}

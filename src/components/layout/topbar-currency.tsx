"use client";

import { ChevronDown, CircleDollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCurrency, SUPPORTED_CURRENCIES } from "@/features/currency/components/currency-provider";
import type { DisplayCurrency } from "@/lib/currency/constants";

export function TopbarCurrency() {
  const t = useTranslations("currency");
  const { currency, setCurrency } = useCurrency();
  const label = SUPPORTED_CURRENCIES.find((c) => c.code === currency)?.code ?? currency;

  return (
    <div className="nex-topbar-pill nex-topbar-currency hidden md:inline-flex">
      <CircleDollarSign className="nex-topbar-currency-icon" strokeWidth={1.75} />
      <span className="nex-topbar-currency-label">{label}</span>
      <ChevronDown className="nex-topbar-pill-chevron" strokeWidth={1.75} />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as DisplayCurrency)}
        aria-label={t("label")}
        className="nex-topbar-currency-select"
      >
        {SUPPORTED_CURRENCIES.map((c) => (
          <option key={c.code} value={c.code} className="bg-[#0a0a0f]">
            {c.code}
          </option>
        ))}
      </select>
    </div>
  );
}

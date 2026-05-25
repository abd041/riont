"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function CheckoutPremiumCheckbox({
  id,
  name,
  checked,
  onChange,
  disabled,
  label,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: ReactNode;
}) {
  return (
    <label htmlFor={id} className="nex-co-checkbox">
      <input
        id={id}
        type="checkbox"
        name={name}
        value="on"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="nex-co-checkbox-native"
        required
      />
      <span
        className={cn("nex-co-checkbox-box", checked && "nex-co-checkbox-box--checked")}
        aria-hidden
      >
        {checked ? <Check className="nex-co-checkbox-icon" strokeWidth={2.5} /> : null}
      </span>
      <span className="nex-co-checkbox-label">{label}</span>
    </label>
  );
}

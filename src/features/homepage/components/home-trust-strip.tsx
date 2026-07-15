"use client";

import { useTranslations } from "next-intl";
import {
  Headphones,
  Shield,
  Zap,
  BadgeCheck,
  Timer,
  type LucideIcon,
} from "lucide-react";
import type { TrustBlockContent } from "@/server/services/content-block.service";

const ICONS: LucideIcon[] = [Shield, Zap, BadgeCheck, Headphones, Timer];

const FALLBACK_KEYS = [
  "trustSecure",
  "trustInstant",
  "trustWarranty",
  "trustSupport",
  "trustFast",
] as const;

export function HomeTrustStrip({
  content,
}: {
  content?: TrustBlockContent | null;
}) {
  const t = useTranslations("home");

  const labels =
    content?.items.map((item) => item.label).filter(Boolean) ??
    FALLBACK_KEYS.map((key) => t(key));

  if (labels.length === 0) return null;

  return (
    <div className="mp-trust-strip" aria-label={t("trustStripLabel")}>
      {labels.slice(0, 5).map((label, index) => {
        const Icon = ICONS[index % ICONS.length] ?? Shield;
        return (
          <div key={`${label}-${index}`} className="mp-trust-strip__item">
            <Icon className="mp-trust-strip__icon" strokeWidth={1.5} aria-hidden />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

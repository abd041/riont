"use client";

import { useTranslations } from "next-intl";
import { Headphones, Shield, Zap } from "lucide-react";
import {
  MarketplaceSectionReveal,
  MarketplaceSectionRevealChild,
} from "../marketplace/marketplace-section-reveal";
import { MarketplaceSectionHeader } from "../marketplace/marketplace-section-header";

const features = [
  { icon: Zap, titleKey: "whyInstantTitle", descKey: "whyInstantDesc" },
  { icon: Shield, titleKey: "whySecureTitle", descKey: "whySecureDesc" },
  { icon: Headphones, titleKey: "whySupportTitle", descKey: "whySupportDesc" },
] as const;

export function MarketplaceTrustSection() {
  const t = useTranslations("home");

  const stats = [
    { value: t("trustStatCustomersValue"), label: t("trustStatCustomersLabel") },
    { value: t("trustStatOrdersValue"), label: t("trustStatOrdersLabel") },
    { value: t("trustStatSupportValue"), label: t("trustStatSupportLabel") },
    { value: t("trustStatRatingValue"), label: t("trustStatRatingLabel") },
  ];

  return (
    <MarketplaceSectionReveal
      aria-label={t("trustSectionTitle")}
      delay={0.05}
      className="mp-trust"
    >
      <MarketplaceSectionRevealChild>
        <MarketplaceSectionHeader title={t("trustSectionTitle")} />
      </MarketplaceSectionRevealChild>

      <div className="mp-trust__stats">
        {stats.map((stat) => (
          <div key={stat.label} className="mp-trust__stat">
            <span className="mp-trust__stat-value">{stat.value}</span>
            <span className="mp-trust__stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="mp-trust__features">
        {features.map(({ icon: Icon, titleKey, descKey }) => (
          <div key={titleKey} className="mp-trust__feature">
            <span className="mp-trust__feature-icon" aria-hidden>
              <Icon strokeWidth={1.5} />
            </span>
            <div className="mp-trust__feature-copy">
              <p className="mp-trust__feature-title">{t(titleKey)}</p>
              <p className="mp-trust__feature-desc">{t(descKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </MarketplaceSectionReveal>
  );
}

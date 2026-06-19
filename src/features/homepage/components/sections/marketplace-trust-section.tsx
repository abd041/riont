"use client";

import { useTranslations } from "next-intl";
import { Headphones, PackageCheck, Shield, Zap } from "lucide-react";
import {
  MarketplaceSectionReveal,
  MarketplaceSectionRevealChild,
} from "../marketplace/marketplace-section-reveal";
import { MarketplaceSectionHeader } from "../marketplace/marketplace-section-header";

const features = [
  { icon: Shield, titleKey: "whySecureTitle", descKey: "whySecureDesc" },
  { icon: Zap, titleKey: "whyInstantTitle", descKey: "whyInstantDesc" },
  { icon: Headphones, titleKey: "whySupportTitle", descKey: "whySupportDesc" },
  { icon: PackageCheck, titleKey: "whyTrackingTitle", descKey: "whyTrackingDesc" },
] as const;

export function MarketplaceTrustSection() {
  const t = useTranslations("home");

  return (
    <MarketplaceSectionReveal
      aria-label={t("trustSectionTitle")}
      delay={0.05}
      className="mp-trust"
    >
      <MarketplaceSectionRevealChild>
        <MarketplaceSectionHeader title={t("trustSectionTitle")} />
        <p className="mp-trust__subtitle">{t("trustSectionSubtitle")}</p>
      </MarketplaceSectionRevealChild>

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

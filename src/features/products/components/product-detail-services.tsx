import { getTranslations } from "next-intl/server";
import { Zap, Shield, Clock, Award } from "lucide-react";

const iconStroke = 1.5;

export async function ProductDetailServices() {
  const t = await getTranslations("home");

  const items = [
    { icon: Zap, title: t("whyInstantTitle"), desc: t("whyInstantDesc") },
    { icon: Shield, title: t("whySecureTitle"), desc: t("whySecureDesc") },
    { icon: Clock, title: t("whySupportTitle"), desc: t("whySupportDesc") },
    { icon: Award, title: t("whyQualityTitle"), desc: t("whyQualityDesc") },
  ];

  return (
    <div className="nex-pdp-services">
      {items.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="nex-pdp-service-card">
          <span className="nex-pdp-service-icon">
            <Icon strokeWidth={iconStroke} />
          </span>
          <div className="min-w-0">
            <p className="nex-pdp-service-title">{title}</p>
            <p className="nex-pdp-service-desc">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

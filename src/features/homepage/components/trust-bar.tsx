import { useTranslations } from "next-intl";
import { Headphones, Shield, Tag, Zap } from "lucide-react";
import type { TrustBlockContent } from "@/server/services/content-block.service";

const defaultIcons = [Zap, Headphones, Shield, Tag];
const defaultKeys = [
  "trustInstant",
  "trustSupport",
  "trustSecure",
  "trustQuality",
] as const;

export function TrustBar({ content }: { content?: TrustBlockContent | null }) {
  const t = useTranslations("home");

  const labels =
    content?.items.map((item) => item.label) ??
    defaultKeys.map((key) => t(key));

  return (
    <div className="mp-trust__features">
      {labels.map((label, index) => {
        const Icon = defaultIcons[index] ?? Tag;
        return (
          <div key={`${label}-${index}`} className="mp-trust__feature">
            <span className="mp-trust__feature-icon" aria-hidden>
              <Icon strokeWidth={1.5} />
            </span>
            <div className="mp-trust__feature-copy">
              <p className="mp-trust__feature-title">{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

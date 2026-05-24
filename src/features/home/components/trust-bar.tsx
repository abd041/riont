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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {labels.map((label, index) => {
        const Icon = defaultIcons[index] ?? Tag;
        return (
          <div
            key={`${label}-${index}`}
            className="glass-card flex items-center gap-3 rounded-[var(--radius-md)] p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500/15">
              <Icon className="h-4 w-4 text-accent-500" />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

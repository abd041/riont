"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function TopbarBrand({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("common");

  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="nex-topbar-brand"
      aria-label={t("brand")}
    >
      <span className="nex-topbar-logo-icon" aria-hidden>
        <span className="nex-topbar-logo-letter">R</span>
      </span>
      <span className="nex-topbar-brand-text">{t("brand").toUpperCase()}</span>
    </Link>
  );
}

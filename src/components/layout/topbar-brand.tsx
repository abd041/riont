"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";

export function TopbarBrand({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("common");

  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="nex-topbar-brand"
      aria-label={t("brand")}
    >
      <BrandLogo className="nex-brand-logo nex-brand-logo--topbar" priority />
    </Link>
  );
}

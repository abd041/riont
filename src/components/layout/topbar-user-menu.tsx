"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronDown, User } from "lucide-react";
import { useStorefrontAuth } from "@/features/auth/components/storefront-auth-provider";

export function TopbarUserMenu() {
  const t = useTranslations("common");
  const { user } = useStorefrontAuth();

  if (!user) {
    return (
      <Link href="/login" className="nex-topbar-login hidden sm:inline-flex">
        <User className="me-1.5 inline h-4 w-4" strokeWidth={1.75} />
        {t("login")}
      </Link>
    );
  }

  const displayName = user.displayName?.trim() || user.email.split("@")[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Link href="/account/orders" className="nex-topbar-user">
      <span className="nex-topbar-user-avatar" aria-hidden>
        {initial}
      </span>
      <span className="nex-topbar-user-text min-w-0">
        <p className="nex-topbar-user-greeting">{t("welcomeBackPrefix")}</p>
        <p className="nex-topbar-user-name truncate">{displayName}</p>
      </span>
      <ChevronDown className="nex-topbar-user-chevron" strokeWidth={1.75} />
    </Link>
  );
}

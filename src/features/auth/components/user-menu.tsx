"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStorefrontAuth } from "./storefront-auth-provider";

export function UserMenu() {
  const t = useTranslations("common");
  const { user, signingOut, signOut } = useStorefrontAuth();

  if (!user) {
    return (
      <Button variant="secondary" size="sm" asChild>
        <Link href="/login">
          <User className="h-4 w-4" />
          {t("login")}
        </Link>
      </Button>
    );
  }

  const label = user.displayName?.trim() || user.email.split("@")[0];

  return (
    <div className="flex items-center gap-2">
      <span
        className="hidden max-w-[140px] truncate text-sm text-[var(--text-secondary)] sm:inline"
        title={user.email}
      >
        {label}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => void signOut()}
        disabled={signingOut}
        aria-label={t("signOut")}
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden md:inline">{signingOut ? "…" : t("signOut")}</span>
      </Button>
    </div>
  );
}

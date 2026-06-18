"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStorefrontAuth } from "./storefront-auth-provider";

function Avatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-xs font-bold text-white shadow-[0_0_18px_rgba(166,124,82,0.35)] ring-2 ring-accent-500/35">
      {initial}
    </span>
  );
}

export function UserMenu() {
  const t = useTranslations("common");
  const { user, signingOut, signOut } = useStorefrontAuth();

  if (!user) {
    return (
      <Button variant="secondary" size="sm" asChild className="h-9">
        <Link href="/login">
          <User className="h-4 w-4" />
          {t("login")}
        </Link>
      </Button>
    );
  }

  const displayName = user.displayName?.trim() || user.email.split("@")[0];

  return (
    <div className="flex items-center gap-2.5 ps-1">
      <div className="hidden items-center gap-2.5 sm:flex">
        <Avatar name={displayName} />
        <div className="max-w-[140px] leading-tight">
          <p className="text-[11px] text-[var(--text-muted)]">{t("welcomeBackPrefix")}</p>
          <p className="truncate text-sm font-semibold text-white">{displayName}</p>
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="hidden sm:inline-flex h-9 gap-1.5 text-[var(--text-muted)] hover:text-white"
        onClick={() => void signOut()}
        disabled={signingOut}
        aria-label={t("signOut")}
      >
        <LogOut className="h-4 w-4" />
        {signingOut ? t("signingOut") : t("signOut")}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        onClick={() => void signOut()}
        disabled={signingOut}
        aria-label={t("signOut")}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

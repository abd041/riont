"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { UserRole } from "@/lib/domain/enums";
import { useStorefrontAuth } from "@/features/auth/components/storefront-auth-provider";
import { cn } from "@/utils/cn";

export function TopbarUserMenu() {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const { user, signingOut, signOut } = useStorefrontAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (!user) {
    return (
      <div className="nex-topbar-auth">
        <Link href="/login" className="nex-topbar-login">
          <User className="nex-topbar-login__icon" strokeWidth={1.75} aria-hidden />
          <span className="nex-topbar-login__label">{t("login")}</span>
        </Link>
        <Link href="/login?mode=signup" className="nex-topbar-signup">
          {t("signUp")}
        </Link>
      </div>
    );
  }

  const displayName = user.displayName?.trim() || user.email.split("@")[0];
  const initial = displayName.charAt(0).toUpperCase();

  async function handleSignOut() {
    setOpen(false);
    await signOut();
  }

  return (
    <div className="nex-topbar-user-menu" ref={rootRef}>
      <button
        type="button"
        className={cn("nex-topbar-user nex-topbar-user--trigger", open && "nex-topbar-user--open")}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={signingOut}
      >
        <span className="nex-topbar-user-avatar" aria-hidden>
          {initial}
        </span>
        <span className="nex-topbar-user-text min-w-0">
          <p className="nex-topbar-user-greeting">{t("welcomeBackPrefix")}</p>
          <p className="nex-topbar-user-name truncate">{displayName}</p>
        </span>
        <ChevronDown className="nex-topbar-user-chevron" strokeWidth={1.75} />
      </button>

      <div
        className={cn(
          "nex-topbar-user-dropdown",
          open && "nex-topbar-user-dropdown--open",
        )}
        role="menu"
      >
        <Link
          href="/account/orders"
          className="nex-topbar-user-dropdown__item"
          role="menuitem"
          onClick={() => setOpen(false)}
        >
          <ClipboardList strokeWidth={1.75} />
          {tNav("orders")}
        </Link>
        {user.role === UserRole.ADMIN && (
          <NextLink
            href="/admin"
            className="nex-topbar-user-dropdown__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard strokeWidth={1.75} />
            {tNav("adminDashboard")}
          </NextLink>
        )}
        <button
          type="button"
          className="nex-topbar-user-dropdown__item nex-topbar-user-dropdown__item--danger"
          role="menuitem"
          onClick={() => void handleSignOut()}
          disabled={signingOut}
        >
          <LogOut strokeWidth={1.75} />
          {signingOut ? t("signingOut") : t("signOut")}
        </button>
      </div>
    </div>
  );
}

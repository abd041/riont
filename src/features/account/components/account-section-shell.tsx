"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { StorefrontPageHeader } from "@/components/shared/storefront-page-header";
import { StorefrontPageShell } from "@/components/shared/storefront-page-shell";
import { cn } from "@/utils/cn";

const links = [{ href: "/account/orders", key: "orders" as const }];

export function AccountSectionShell({ children }: { children: ReactNode }) {
  const t = useTranslations("account");
  const tNav = useTranslations("nav");
  const pathname = usePathname();

  return (
    <StorefrontPageShell>
      <StorefrontPageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        backHref="/products"
        backLabel={tNav("browse")}
      />

      <nav className="sf-account-nav" aria-label={t("navLabel")}>
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn("sf-account-nav__link", active && "sf-account-nav__link--active")}
            >
              {t(link.key)}
            </Link>
          );
        })}
      </nav>

      {children}
    </StorefrontPageShell>
  );
}

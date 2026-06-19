"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Compass, Grid3X3, Home, Menu } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { cn } from "@/utils/cn";
import { isNavActive, type NavItemConfig } from "./sidebar-nav";

const railNav: (NavItemConfig & { icon: typeof Home })[] = [
  { href: "/", icon: Home, key: "home", exact: true },
  { href: "/products", icon: Compass, key: "browse", match: "products-root" },
  { href: "/categories", icon: Grid3X3, key: "categories", match: "path" },
];

const iconStroke = 1.5;

type SidebarIconRailProps = {
  onOpenMenu: () => void;
  menuOpen?: boolean;
};

export function SidebarIconRail({ onOpenMenu, menuOpen }: SidebarIconRailProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <aside className="nex-icon-rail" aria-label={t("browse")}>
      <div className="nex-icon-rail__ambient" aria-hidden />
      <Link href="/" className="nex-icon-rail__brand" aria-label={tCommon("brand")}>
        <BrandLogo
          className="nex-brand-logo nex-brand-logo--rail nex-brand-logo--mark"
          variant="mark"
          height={38}
        />
      </Link>

      <nav className="nex-icon-rail__nav" aria-label={t("browse")}>
        {railNav.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(pathname, searchParams, item);

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn("nex-icon-rail__link", active && "nex-icon-rail__link--active")}
              aria-current={active ? "page" : undefined}
              title={t(item.key)}
            >
              <Icon strokeWidth={iconStroke} />
              <span className="sr-only">{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className={cn("nex-icon-rail__menu", menuOpen && "nex-icon-rail__menu--open")}
        onClick={onOpenMenu}
        aria-label={t("openMenu")}
        aria-expanded={menuOpen}
      >
        <Menu strokeWidth={iconStroke} />
      </button>
    </aside>
  );
}

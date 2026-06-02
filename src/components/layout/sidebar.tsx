"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Home,
  Compass,
  Grid3X3,
  Gamepad2,
  Gift,
  Monitor,
  CreditCard,
  Tag,
  ClipboardList,
  Heart,
  Ticket,
  Headphones,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { isNavActive, type NavItemConfig } from "./sidebar-nav";

const primaryNav = [
  { href: "/", icon: Home, key: "home" as const, exact: true },
  { href: "/products", icon: Compass, key: "browse" as const, match: "products-root" as const },
  { href: "/categories", icon: Grid3X3, key: "categories" as const, match: "path" as const },
  {
    href: "/products?category=gaming",
    icon: Gamepad2,
    key: "games" as const,
    match: "products-category" as const,
    categorySlug: "gaming",
  },
  {
    href: "/products?category=gift-cards",
    icon: Gift,
    key: "giftCards" as const,
    match: "products-category" as const,
    categorySlug: "gift-cards",
  },
  {
    href: "/products?category=software",
    icon: Monitor,
    key: "software" as const,
    match: "products-category" as const,
    categorySlug: "software",
  },
  {
    href: "/products?category=subscriptions",
    icon: CreditCard,
    key: "subscriptions" as const,
    match: "products-category" as const,
    categorySlug: "subscriptions",
  },
  { href: "/products", icon: Tag, key: "deals" as const, match: "never" as const },
] as const;

const secondaryNav = [
  { href: "/account/orders", icon: ClipboardList, key: "orders" as const, match: "path-prefix" as const },
  { href: "/wishlist", icon: Heart, key: "wishlist" as const, match: "path" as const },
  { href: "/products", icon: Ticket, key: "coupons" as const, match: "never" as const },
  { href: "/support", icon: Headphones, key: "support" as const, match: "path-prefix" as const },
] as const;

const iconStroke = 1.5;

type NavItem = NavItemConfig & { icon: typeof Home };

function NavLink({
  item,
  active,
  onNavigate,
  label,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
  label: string;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn("nex-nav-link", active && "nex-nav-link--active")}
      aria-current={active ? "page" : undefined}
    >
      <span className="nex-nav-link__icon" aria-hidden>
        <Icon strokeWidth={iconStroke} />
      </span>
      <span className="nex-nav-link__text">{label}</span>
      {active && <span className="nex-nav-link__pulse" aria-hidden />}
    </Link>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tPromo = useTranslations("promo");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <aside className="nex-sidebar nex-sidebar--storefront flex shrink-0 flex-col">
      <div className="nex-sidebar__ambient" aria-hidden />
      <div className="nex-sidebar__edge-glow" aria-hidden />
      <div className="nex-sidebar__noise" aria-hidden />

      <nav className="nex-sidebar-nav nex-sidebar-nav--no-brand" aria-label={t("home")}>
        <p className="nex-sidebar-nav-label">{t("browse")}</p>
        <div className="nex-sidebar-nav-group">
          {primaryNav.map((item) => (
            <NavLink
              key={item.key}
              item={item}
              active={isNavActive(pathname, searchParams, item)}
              onNavigate={onNavigate}
              label={t(item.key)}
            />
          ))}
        </div>

        <div className="nex-sidebar-divider" role="separator" />

        <p className="nex-sidebar-nav-label">{tCommon("account")}</p>
        <div className="nex-sidebar-nav-group nex-sidebar-nav-group--secondary">
          {secondaryNav.map((item) => (
            <NavLink
              key={item.key}
              item={item}
              active={isNavActive(pathname, searchParams, item)}
              onNavigate={onNavigate}
              label={t(item.key)}
            />
          ))}
        </div>
      </nav>

      <footer className="nex-sidebar-footer">
        <div className="nex-sidebar-promo">
          <p className="nex-sidebar-promo-line1">{tPromo("titleLine1")}</p>
          <p className="nex-sidebar-promo-line2">{tPromo("titleLine2")}</p>
          <Link
            href="/products"
            onClick={onNavigate}
            className="nex-sidebar-promo-btn"
          >
            {tPromo("cta")}
          </Link>

          <div className="nex-sidebar-promo-art" aria-hidden>
            <Image
              src="/sidebar/promo-gifts.png"
              alt=""
              width={280}
              height={200}
              className="nex-sidebar-promo-art-img"
            />
          </div>

          <div className="nex-sidebar-theme" role="group" aria-label={t("themeDark")}>
            <span className="nex-sidebar-theme-active">
              <Moon strokeWidth={iconStroke} />
              {t("themeDark")}
            </span>
            <span className="nex-sidebar-theme-inactive">{t("themeLight")}</span>
            <Sun className="sr-only" aria-hidden />
          </div>
        </div>
      </footer>
    </aside>
  );
}

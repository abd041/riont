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
import { cn } from "@/lib/utils/cn";

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
  { href: "/products", icon: Heart, key: "wishlist" as const, match: "never" as const },
  { href: "/products", icon: Ticket, key: "coupons" as const, match: "never" as const },
  { href: "/support", icon: Headphones, key: "support" as const, match: "path-prefix" as const },
] as const;

const iconStroke = 1.5;

type NavItem =
  | (typeof primaryNav)[number]
  | (typeof secondaryNav)[number];

function isNavActive(
  pathname: string,
  searchParams: URLSearchParams,
  item: NavItem,
): boolean {
  if ("exact" in item && item.exact) {
    return pathname === "/" || pathname === "";
  }

  const match = "match" in item ? item.match : "path";

  if (match === "never") {
    return false;
  }

  if (match === "products-root") {
    return pathname === "/products" && !searchParams.get("category");
  }

  if (match === "products-category" && "categorySlug" in item) {
    return (
      pathname === "/products" &&
      searchParams.get("category") === item.categorySlug
    );
  }

  if (match === "path-prefix") {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  if (match === "path") {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tPromo = useTranslations("promo");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <aside className="nex-sidebar flex shrink-0 flex-col">
      <div className="nex-sidebar__ambient" aria-hidden />
      <div className="nex-sidebar__noise" aria-hidden />

      <header className="nex-sidebar-header">
        <Link
          href="/"
          onClick={onNavigate}
          className="nex-sidebar-brand"
          aria-label={tCommon("brand")}
        >
          <div className="nex-sidebar-logo-icon">
            <span className="nex-sidebar-logo-letter">R</span>
          </div>
          <span className="nex-sidebar-brand-text">
            {tCommon("brand").toUpperCase()}
          </span>
        </Link>
      </header>

      <nav className="nex-sidebar-nav" aria-label={t("home")}>
        <div className="nex-sidebar-nav-group">
          {primaryNav.map((item) => {
            const { href, icon: Icon, key } = item;
            const active = isNavActive(pathname, searchParams, item);

            return (
              <Link
                key={key}
                href={href}
                onClick={onNavigate}
                className={cn("nex-nav-link", active && "nex-nav-link--active")}
              >
                <Icon className="shrink-0" strokeWidth={iconStroke} />
                <span>{t(key)}</span>
              </Link>
            );
          })}
        </div>

        <div className="nex-sidebar-divider" role="separator" />

        <div className="nex-sidebar-nav-group nex-sidebar-nav-group--secondary">
          {secondaryNav.map((item) => {
            const { href, icon: Icon, key } = item;
            const active = isNavActive(pathname, searchParams, item);

            return (
              <Link
                key={key}
                href={href}
                onClick={onNavigate}
                className={cn("nex-nav-link", active && "nex-nav-link--active")}
              >
                <Icon className="shrink-0" strokeWidth={iconStroke} />
                <span>{t(key)}</span>
              </Link>
            );
          })}
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

"use client";

import { useLocale, useTranslations } from "next-intl";
import { Bell, ChevronDown, Heart, Menu, ShoppingCart } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ProductSearch } from "@/components/layout/product-search";
import { TopbarBrand } from "@/components/layout/topbar-brand";
import { Button } from "@/components/ui/button";
import { TopbarUserMenu } from "@/components/layout/topbar-user-menu";
import { TopbarCurrency } from "@/components/layout/topbar-currency";
import { useStorefrontAuth } from "@/features/auth/components/storefront-auth-provider";
import { NotificationsMenu } from "@/features/shared/notifications/notifications-menu";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/utils/cn";

export function Topbar({
  onMenuClick,
  showMenuButton = true,
  menuOpen = false,
}: {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  menuOpen?: boolean;
}) {
  const { user, notifications } = useStorefrontAuth();
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const otherLocale = locale === "en" ? "ar" : "en";

  function switchLocale() {
    router.replace(pathname, { locale: otherLocale });
  }

  return (
    <header className="nex-topbar nex-topbar--fullwidth nex-topbar--floating sticky top-0 z-40 shrink-0">
      <div className="nex-topbar__float">
        <div className="nex-topbar__inner">
        <div className="nex-topbar-start nex-topbar-start--with-brand">
          <TopbarBrand />
        </div>

        <div className="nex-topbar-center">
          <ProductSearch />
        </div>

        <div className="nex-topbar-end">
        <button
          type="button"
          onClick={switchLocale}
          className="nex-topbar-pill nex-lang-btn hidden sm:inline-flex"
        >
          <span className="nex-topbar-pill-flag" aria-hidden>
            {locale === "en" ? "🇬🇧" : "🇸🇦"}
          </span>
          <span className="text-[11px]">{locale === "en" ? "EN" : "AR"}</span>
          <ChevronDown className="nex-topbar-pill-chevron" strokeWidth={1.75} />
        </button>

        <TopbarCurrency />

        <Link
          href="/wishlist"
          className={cn(
            "nex-topbar-action nex-topbar-wishlist relative",
            wishlistCount > 0 && "nex-topbar-wishlist--active",
          )}
          aria-label={t("wishlist")}
        >
          <Heart strokeWidth={1.75} />
          {wishlistCount > 0 && (
            <span className="nex-topbar-badge">
              {wishlistCount > 9 ? "9+" : wishlistCount}
            </span>
          )}
        </Link>

        <Link href="/cart" className="nex-topbar-action nex-topbar-cart relative" aria-label={t("cart")}>
          <ShoppingCart strokeWidth={1.75} />
          {itemCount > 0 && (
            <span className="nex-topbar-badge">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </Link>

        {user ? (
          <div className="nex-topbar-notifications">
            <NotificationsMenu notifications={notifications} />
          </div>
        ) : (
          <Link href="/login" className="nex-topbar-action" aria-label={t("notifications")}>
            <Bell strokeWidth={1.75} />
          </Link>
        )}

        <TopbarUserMenu />

        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "nex-topbar-menu-btn nex-topbar-menu-btn--end shrink-0",
              menuOpen && "nex-topbar-menu-btn--open",
            )}
            type="button"
            onClick={onMenuClick}
            aria-label={tNav("openMenu")}
            aria-expanded={menuOpen}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        </div>
        </div>
      </div>
    </header>
  );
}

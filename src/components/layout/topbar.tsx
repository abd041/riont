"use client";

import { useLocale, useTranslations } from "next-intl";
import { Bell, ChevronDown, Menu, ShoppingCart } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ProductSearch } from "@/components/layout/product-search";
import { TopbarBrand } from "@/components/layout/topbar-brand";
import { Button } from "@/components/ui/button";
import { TopbarUserMenu } from "@/components/layout/topbar-user-menu";
import { TopbarCurrency } from "@/components/layout/topbar-currency";
import { useStorefrontAuth } from "@/features/auth/components/storefront-auth-provider";
import { NotificationsMenu } from "@/features/notifications/components/notifications-menu";
import { useCart } from "@/features/cart/cart-context";

export function Topbar({
  onMenuClick,
  showMenuButton = true,
  showBrand = false,
}: {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  /** Show logo when main sidebar is hidden (e.g. browse products page). */
  showBrand?: boolean;
}) {
  const { user, notifications } = useStorefrontAuth();
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const otherLocale = locale === "en" ? "ar" : "en";

  function switchLocale() {
    router.replace(pathname, { locale: otherLocale });
  }

  return (
    <header className="nex-topbar sticky top-0 z-40">
      <div
        className={
          showBrand ? "nex-topbar-start nex-topbar-start--with-brand" : "nex-topbar-start"
        }
      >
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            className="nex-topbar-menu-btn shrink-0 lg:hidden"
            type="button"
            onClick={onMenuClick}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {showBrand && <TopbarBrand />}
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
          <span>{locale === "en" ? "English" : "العربية"}</span>
          <ChevronDown className="nex-topbar-pill-chevron" strokeWidth={1.75} />
        </button>

        <TopbarCurrency />

        <Link href="/cart" className="nex-topbar-action nex-topbar-cart" aria-label={t("cart")}>
          <ShoppingCart strokeWidth={1.75} />
          {itemCount > 0 && (
            <span className="nex-topbar-cart-badge">
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
      </div>
    </header>
  );
}

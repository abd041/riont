"use client";

import { useLocale, useTranslations } from "next-intl";
import { Menu, ShoppingCart } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ProductSearch } from "@/components/layout/product-search";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/features/auth/components/user-menu";
import { useStorefrontAuth } from "@/features/auth/components/storefront-auth-provider";
import { CurrencySelector } from "@/features/currency/components/currency-selector";
import { NotificationsMenu } from "@/features/notifications/components/notifications-menu";
import { useCart } from "@/features/cart/cart-context";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
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
    <header className="sticky top-0 z-40 flex h-[var(--topbar-height)] items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/80 px-4 backdrop-blur-md sm:gap-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        type="button"
        onClick={onMenuClick}
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <ProductSearch className="relative mx-auto min-w-0 w-full max-w-xl flex-1" />

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <CurrencySelector />

        <Button variant="ghost" size="sm" type="button" onClick={switchLocale}>
          {locale === "en" ? "العربية" : "EN"}
        </Button>

        {user ? (
          <NotificationsMenu notifications={notifications} />
        ) : null}

        <Button variant="ghost" size="icon" aria-label={t("cart")} asChild>
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </Button>

        <UserMenu />
      </div>
    </header>
  );
}

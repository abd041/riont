import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { StorefrontProviders } from "@/components/providers/storefront-providers";
import { getStorefrontUser } from "@/server/services/storefront-user.service";
import {
  CURRENCY_BY_LOCALE,
  DISPLAY_CURRENCY_COOKIE,
  type DisplayCurrency,
} from "@/lib/currency/constants";
import {
  getExchangeRates,
  isSupportedCurrency,
} from "@/server/services/currency.service";
import { listUserNotifications } from "@/server/services/notification-list.service";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getStorefrontUser();
  const locale = await getLocale();
  const cookieStore = await cookies();
  const cookieCurrency = cookieStore.get(DISPLAY_CURRENCY_COOKIE)?.value;
  const initialCurrency: DisplayCurrency =
    cookieCurrency && isSupportedCurrency(cookieCurrency)
      ? cookieCurrency
      : CURRENCY_BY_LOCALE[locale] ?? "USD";

  const rates = await getExchangeRates();
  const notifications = user
    ? await listUserNotifications(user.id, locale)
    : [];

  return (
    <StorefrontProviders
      initialCurrency={initialCurrency}
      rates={rates}
      initialUser={user}
      initialNotifications={notifications}
    >
      <StorefrontShell>{children}</StorefrontShell>
    </StorefrontProviders>
  );
}

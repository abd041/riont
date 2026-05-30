import type { ReactNode } from "react";
import type { DisplayCurrency } from "@/lib/currency/constants";
import { CurrencyProvider } from "@/features/shared/currency/currency-provider";
import { StorefrontAuthProvider } from "@/features/auth/components/storefront-auth-provider";
import { StoreHydration } from "@/store/store-hydration";
import type { StorefrontUser } from "@/types/auth";
import type { UserNotification } from "@/server/services/notification-list.service";

export function StorefrontProviders({
  children,
  initialCurrency,
  rates,
  initialUser,
  initialNotifications,
}: {
  children: ReactNode;
  initialCurrency: DisplayCurrency;
  rates: Record<string, number>;
  initialUser: StorefrontUser | null;
  initialNotifications: UserNotification[];
}) {
  return (
    <StorefrontAuthProvider
      initialUser={initialUser}
      initialNotifications={initialNotifications}
    >
      <CurrencyProvider initialCurrency={initialCurrency} rates={rates}>
        <StoreHydration>{children}</StoreHydration>
      </CurrencyProvider>
    </StorefrontAuthProvider>
  );
}

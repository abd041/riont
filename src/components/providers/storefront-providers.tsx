"use client";

import type { ReactNode } from "react";
import type { DisplayCurrency } from "@/lib/currency/constants";
import { CurrencyProvider } from "@/features/currency/components/currency-provider";
import { CartProvider } from "@/features/cart/cart-context";
import { StorefrontAuthProvider } from "@/features/auth/components/storefront-auth-provider";
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
        <CartProvider>{children}</CartProvider>
      </CurrencyProvider>
    </StorefrontAuthProvider>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/hooks/use-cart";
import { CartCheckoutForm } from "./cart-checkout-form";

export function CartCheckoutPageClient({
  locale,
  paymentInstructions,
  isLoggedIn,
  userEmail,
}: {
  locale: string;
  paymentInstructions: string;
  isLoggedIn: boolean;
  userEmail?: string | null;
}) {
  const router = useRouter();
  const { items, hydrated } = useCart();

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/cart");
    }
  }, [hydrated, items.length, router]);

  if (!hydrated || items.length === 0) {
    return null;
  }

  return (
    <CartCheckoutForm
      cartItems={items}
      locale={locale}
      paymentInstructions={paymentInstructions}
      isLoggedIn={isLoggedIn}
      userEmail={userEmail}
    />
  );
}

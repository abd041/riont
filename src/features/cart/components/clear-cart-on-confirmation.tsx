"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";

/** Clears persisted cart after a successful order confirmation. */
export function ClearCartOnConfirmation() {
  const { clearCart, hydrated } = useCart();

  useEffect(() => {
    if (hydrated) clearCart();
  }, [hydrated, clearCart]);

  return null;
}

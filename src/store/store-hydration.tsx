"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

/** Ensures persisted Zustand stores rehydrate on the client before relying on counts. */
export function StoreHydration({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
  }, []);

  return children;
}

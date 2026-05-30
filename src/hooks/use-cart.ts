"use client";

import { useShallow } from "zustand/react/shallow";
import {
  selectCartItemCount,
  useCartStore,
} from "@/store/cart-store";

/** Stable cart API — backed by Zustand (replaces legacy React Context). */
export function useCart() {
  return useCartStore(
    useShallow((state) => ({
      items: state.items,
      itemCount: selectCartItemCount(state),
      addItem: state.addItem,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
      clearCart: state.clearCart,
      hydrated: state._hasHydrated,
    })),
  );
}

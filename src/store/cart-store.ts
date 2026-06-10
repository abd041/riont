import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { cartLineKey } from "@/features/cart/cart-line-key";
import { notifyCartItemAdded } from "@/features/cart/cart-events";
import type { CartLine } from "@/features/cart/types";

type CartState = {
  items: CartLine[];
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addItem: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string | null,
  ) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      addItem: (line, quantity = 1) => {
        set((state) => {
          const key = cartLineKey(line);
          const existing = state.items.find((i) => cartLineKey(i) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                cartLineKey(i) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...line, quantity }] };
        });
        notifyCartItemAdded();
      },

      removeItem: (productId, variantId) =>
        set((state) => {
          const key = cartLineKey({ productId, variantId });
          return {
            items: state.items.filter((i) => cartLineKey(i) !== key),
          };
        }),

      updateQuantity: (productId, quantity, variantId) =>
        set((state) => {
          const key = cartLineKey({ productId, variantId });
          if (quantity < 1) {
            return {
              items: state.items.filter((i) => cartLineKey(i) !== key),
            };
          }
          return {
            items: state.items.map((i) =>
              cartLineKey(i) === key ? { ...i, quantity } : i,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: STORAGE_KEYS.cart,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function selectCartItemCount(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}

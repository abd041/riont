import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import type { CartLine } from "@/features/cart/types";

type CartState = {
  items: CartLine[];
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addItem: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      addItem: (line, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === line.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === line.productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...line, quantity }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity < 1) {
            return { items: state.items.filter((i) => i.productId !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i,
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

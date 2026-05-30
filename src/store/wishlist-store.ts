import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage-keys";

export type WishlistItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  priceCents: number;
  addedAt: string;
};

type WishlistState = {
  items: WishlistItem[];
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  toggleItem: (item: Omit<WishlistItem, "addedAt">) => boolean;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      toggleItem: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        if (exists) {
          set((state) => ({
            items: state.items.filter((i) => i.productId !== item.productId),
          }));
          return false;
        }
        set((state) => ({
          items: [
            ...state.items,
            { ...item, addedAt: new Date().toISOString() },
          ],
        }));
        return true;
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      hasItem: (productId) => get().items.some((i) => i.productId === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: STORAGE_KEYS.wishlist,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function selectWishlistCount(state: WishlistState): number {
  return state.items.length;
}

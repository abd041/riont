"use client";

import { useShallow } from "zustand/react/shallow";
import {
  selectWishlistCount,
  useWishlistStore,
} from "@/store/wishlist-store";

export function useWishlist() {
  return useWishlistStore(
    useShallow((state) => ({
      items: state.items,
      count: selectWishlistCount(state),
      toggleItem: state.toggleItem,
      removeItem: state.removeItem,
      hasItem: state.hasItem,
      clearWishlist: state.clearWishlist,
      hydrated: state._hasHydrated,
    })),
  );
}

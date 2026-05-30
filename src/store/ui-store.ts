import { create } from "zustand";

type UIState = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  homeCategorySlug: string | null;
  setHomeCategorySlug: (slug: string | null) => void;
};

/** Ephemeral UI state — not persisted. */
export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
  homeCategorySlug: null,
  setHomeCategorySlug: (slug) => set({ homeCategorySlug: slug }),
}));

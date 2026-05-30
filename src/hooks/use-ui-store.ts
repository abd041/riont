"use client";

import { useShallow } from "zustand/react/shallow";
import { useUIStore } from "@/store/ui-store";

export function useMobileNav() {
  return useUIStore(
    useShallow((state) => ({
      isOpen: state.mobileNavOpen,
      setOpen: state.setMobileNavOpen,
      toggle: state.toggleMobileNav,
    })),
  );
}

export function useHomeCategoryFilter() {
  return useUIStore(
    useShallow((state) => ({
      activeSlug: state.homeCategorySlug,
      setActiveSlug: state.setHomeCategorySlug,
    })),
  );
}

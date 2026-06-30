"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { StoreRuntimeConfig } from "@/lib/site/store-config";

const SiteStoreContext = createContext<StoreRuntimeConfig | null>(null);

export function SiteStoreProvider({
  config,
  children,
}: {
  config: StoreRuntimeConfig;
  children: ReactNode;
}) {
  return (
    <SiteStoreContext.Provider value={config}>{children}</SiteStoreContext.Provider>
  );
}

export function useSiteStore(): StoreRuntimeConfig {
  const ctx = useContext(SiteStoreContext);
  if (!ctx) {
    throw new Error("useSiteStore must be used within SiteStoreProvider");
  }
  return ctx;
}

export function useSiteStoreOptional(): StoreRuntimeConfig | null {
  return useContext(SiteStoreContext);
}

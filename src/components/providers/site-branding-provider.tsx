"use client";

import { createContext, useContext, type ReactNode } from "react";

type SiteBrandingValue = {
  logoUrl: string | null;
};

const SiteBrandingContext = createContext<SiteBrandingValue>({ logoUrl: null });

export function SiteBrandingProvider({
  logoUrl,
  children,
}: {
  logoUrl: string | null;
  children: ReactNode;
}) {
  return (
    <SiteBrandingContext.Provider value={{ logoUrl }}>
      {children}
    </SiteBrandingContext.Provider>
  );
}

export function useSiteBranding(): SiteBrandingValue {
  return useContext(SiteBrandingContext);
}

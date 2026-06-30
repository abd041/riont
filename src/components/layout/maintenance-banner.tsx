"use client";

import { useLocale } from "next-intl";
import { useSiteStore } from "@/components/providers/site-store-provider";

export function MaintenanceBanner() {
  const locale = useLocale();
  const { features } = useSiteStore();

  if (!features.maintenanceMode) return null;

  const message =
    locale === "ar"
      ? features.maintenanceMessageAr || features.maintenanceMessageEn
      : features.maintenanceMessageEn || features.maintenanceMessageAr;

  if (!message?.trim()) return null;

  return (
    <div className="sf-maintenance-banner" role="status">
      {message}
    </div>
  );
}

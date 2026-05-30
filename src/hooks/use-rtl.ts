"use client";

import { useLocale } from "next-intl";
import { getDirection, isRtlLocale } from "@/utils/rtl";

export function useIsRtl(): boolean {
  const locale = useLocale();
  return isRtlLocale(locale);
}

export function useDirection(): "rtl" | "ltr" {
  const locale = useLocale();
  return getDirection(locale);
}

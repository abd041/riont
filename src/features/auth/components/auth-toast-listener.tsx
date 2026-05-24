"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export type AuthNotice = "registered" | "authFailed" | "signedOut" | null;

export function AuthToastListener({ notice }: { notice: AuthNotice }) {
  const t = useTranslations("auth.toast");
  const shown = useRef(false);

  useEffect(() => {
    if (!notice || shown.current) return;
    shown.current = true;

    if (notice === "registered") {
      toast.success(t("registered"));
    } else if (notice === "authFailed") {
      toast.error(t("authFailed"));
    } else if (notice === "signedOut") {
      toast.success(t("signedOut"));
    }
  }, [notice, t]);

  return null;
}

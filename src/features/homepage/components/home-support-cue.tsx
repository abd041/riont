"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Headphones } from "lucide-react";

export function HomeSupportCue() {
  const t = useTranslations("home");

  return (
    <div className="mp-support-cue">
      <div className="mp-support-cue__copy">
        <p className="mp-support-cue__title">{t("supportCueTitle")}</p>
        <p className="mp-support-cue__text">{t("supportCueText")}</p>
      </div>
      <Link href="/support" className="mp-support-cue__btn">
        <Headphones strokeWidth={1.5} aria-hidden />
        {t("supportCueCta")}
      </Link>
    </div>
  );
}

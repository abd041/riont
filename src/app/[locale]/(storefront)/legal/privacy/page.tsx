import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPageShell } from "@/features/homepage/components/legal/legal-page-shell";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });

  return buildPageMetadata({
    locale,
    path: "/legal/privacy",
    title: t("privacyTitle"),
    description: t("privacyDescription"),
  });
}

export default async function PrivacyPage() {
  const t = await getTranslations("legal");

  return (
    <LegalPageShell title={t("privacyTitle")}>
      <p>{t("privacyIntro")}</p>
      <h2>{t("privacySection1Title")}</h2>
      <p>{t("privacySection1Body")}</p>
      <h2>{t("privacySection2Title")}</h2>
      <p>{t("privacySection2Body")}</p>
    </LegalPageShell>
  );
}

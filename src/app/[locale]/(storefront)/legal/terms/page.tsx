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
    path: "/legal/terms",
    title: t("termsTitle"),
    description: t("termsDescription"),
  });
}

export default async function TermsPage() {
  const t = await getTranslations("legal");

  return (
    <LegalPageShell title={t("termsTitle")}>
      <p>{t("termsIntro")}</p>
      <h2>{t("termsSection1Title")}</h2>
      <p>{t("termsSection1Body")}</p>
      <h2>{t("termsSection2Title")}</h2>
      <p>{t("termsSection2Body")}</p>
    </LegalPageShell>
  );
}

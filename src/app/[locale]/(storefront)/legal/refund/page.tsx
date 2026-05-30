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
    path: "/legal/refund",
    title: t("refundTitle"),
    description: t("refundDescription"),
  });
}

export default async function RefundPage() {
  const t = await getTranslations("legal");

  return (
    <LegalPageShell title={t("refundTitle")}>
      <p>{t("refundIntro")}</p>
      <h2>{t("refundSection1Title")}</h2>
      <p>{t("refundSection1Body")}</p>
      <h2>{t("refundSection2Title")}</h2>
      <p>{t("refundSection2Body")}</p>
    </LegalPageShell>
  );
}

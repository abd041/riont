import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
    path: "/contact",
    title: t("contactTitle"),
    description: t("contactDescription"),
  });
}

export default async function ContactPage() {
  const t = await getTranslations("legal");

  return (
    <LegalPageShell title={t("contactTitle")}>
      <p>{t("contactIntro")}</p>
      <p>{t("contactSupportHint")}</p>
      <Link href="/support" className="sf-legal-page__link">
        {t("contactSupportLink")}
      </Link>
    </LegalPageShell>
  );
}

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import { getSession } from "@/server/services/auth.service";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("common");
  const user = await getSession();

  if (user) {
    redirect(`/${locale}`);
  }

  return (
    <div className="sf-auth-page">
      <div className="sf-auth-page__ambient" aria-hidden>
        <span className="nex-orb nex-orb--purple" />
        <span className="nex-orb nex-orb--blue" />
        <span className="nex-noise" />
      </div>

      <Link href="/" className="nex-auth-brand mb-8" aria-label={t("brand")}>
        <BrandLogo className="nex-brand-logo nex-brand-logo--auth" height={44} priority />
      </Link>
      {children}
    </div>
  );
}

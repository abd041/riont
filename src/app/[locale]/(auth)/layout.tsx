import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-base)] p-6">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/20">
          <Zap className="h-5 w-5 text-accent-500" />
        </div>
        {t("brand")}
      </Link>
      {children}
    </div>
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/features/auth/components/login-form";
import type { AuthNotice } from "@/features/auth/components/auth-toast-listener";
import { safeAuthRedirectPath } from "@/lib/auth/safe-redirect";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ mode?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { mode } = await searchParams;
  const t = await getTranslations({ locale, namespace: "auth" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const title =
    mode === "signup" ? t("createAccountTitle") : t("welcomeBack");

  return buildPageMetadata({
    locale,
    path: "/login",
    title: `${title} | ${tCommon("brand")}`,
    description: t("metaDescription"),
  });
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    registered?: string;
    error?: string;
    mode?: string;
    next?: string;
  }>;
}) {
  const { locale } = await params;
  const query = await searchParams;

  let authNotice: AuthNotice = null;
  if (query.registered === "1") authNotice = "registered";
  if (query.error === "auth") authNotice = "authFailed";

  const initialMode = query.mode === "signup" ? "signUp" : "signIn";
  const redirectTo = safeAuthRedirectPath(query.next ?? null, locale);

  return (
    <LoginForm
      locale={locale}
      authNotice={authNotice}
      initialMode={initialMode}
      redirectTo={redirectTo}
    />
  );
}

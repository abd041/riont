import { LoginForm } from "@/features/auth/components/login-form";
import type { AuthNotice } from "@/features/auth/components/auth-toast-listener";
import { safeAuthRedirectPath } from "@/lib/auth/safe-redirect";

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

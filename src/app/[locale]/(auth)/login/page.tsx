import { LoginForm } from "@/features/auth/components/login-form";
import type { AuthNotice } from "@/features/auth/components/auth-toast-listener";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ registered?: string; error?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;

  let authNotice: AuthNotice = null;
  if (query.registered === "1") authNotice = "registered";
  if (query.error === "auth") authNotice = "authFailed";

  return <LoginForm locale={locale} authNotice={authNotice} />;
}

import { redirect } from "next/navigation";
import { resolveRequestLocale } from "@/lib/i18n/resolve-request-locale";
import { getProfile, getSession } from "@/server/services/auth.service";

export async function requireAdmin() {
  const locale = await resolveRequestLocale();
  const user = await getSession();

  if (!user) {
    redirect(`/${locale}/login?next=${encodeURIComponent("/admin")}`);
  }

  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    redirect(`/${locale}`);
  }

  return { user, profile };
}

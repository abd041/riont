import { createClient } from "@/lib/supabase/server";
import { AuthError } from "@/lib/domain/errors";
import type { UserRole } from "@/lib/domain/enums";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, locale, display_name, preferred_currency")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as {
    id: string;
    role: UserRole;
    locale: string;
    display_name: string | null;
    preferred_currency: string | null;
  };
}

export async function assertAdmin() {
  const user = await getSession();
  if (!user) throw new AuthError("UNAUTHENTICATED");

  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    throw new AuthError("FORBIDDEN");
  }

  return { user, profile };
}

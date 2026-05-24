import { getProfile, getSession } from "@/server/services/auth.service";
import type { StorefrontUser } from "@/types/auth";

export async function getStorefrontUser(): Promise<StorefrontUser | null> {
  const sessionUser = await getSession();
  if (!sessionUser?.email) return null;

  const profile = await getProfile(sessionUser.id);

  return {
    id: sessionUser.id,
    email: sessionUser.email,
    displayName: profile?.display_name ?? null,
  };
}

import { getProfile, getSession } from "@/server/services/auth.service";

export async function getAdminSession() {
  const user = await getSession();
  if (!user) return null;

  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") return null;

  return { user, profile };
}

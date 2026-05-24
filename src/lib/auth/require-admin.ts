import { redirect } from "next/navigation";
import { getProfile, getSession } from "@/server/services/auth.service";

export async function requireAdmin() {
  const user = await getSession();
  if (!user) {
    redirect("/en/login?next=/admin/orders");
  }

  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    redirect("/en");
  }

  return { user, profile };
}

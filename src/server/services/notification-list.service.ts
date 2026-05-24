import { createAdminClient } from "@/lib/supabase/admin";
import { resolveLocalizedLabel, type LocalizedLabel } from "@/lib/i18n/json-label";

export type UserNotification = {
  id: string;
  notificationType: string;
  title: string;
  body: string;
  link: string | null;
  readAt: string | null;
  createdAt: string;
};

export async function listUserNotifications(
  userId: string,
  locale: string,
  limit = 20,
): Promise<UserNotification[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("notifications")
    .select("id, notification_type, title, body, link, read_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => {
    const r = row as {
      id: string;
      notification_type: string;
      title: LocalizedLabel;
      body: LocalizedLabel;
      link: string | null;
      read_at: string | null;
      created_at: string;
    };
    return {
      id: r.id,
      notificationType: r.notification_type,
      title: resolveLocalizedLabel(r.title, locale, ""),
      body: resolveLocalizedLabel(r.body, locale, ""),
      link: r.link,
      readAt: r.read_at,
      createdAt: r.created_at,
    };
  });
}

export async function markNotificationRead(
  notificationId: string,
  userId: string,
): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", userId);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);
}

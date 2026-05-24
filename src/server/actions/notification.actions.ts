"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/server/services/auth.service";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/server/services/notification-list.service";

export async function markNotificationReadAction(notificationId: string) {
  const user = await getSession();
  if (!user) return { success: false as const };

  await markNotificationRead(notificationId, user.id);
  revalidatePath("/", "layout");
  return { success: true as const };
}

export async function markAllNotificationsReadAction() {
  const user = await getSession();
  if (!user) return { success: false as const };

  await markAllNotificationsRead(user.id);
  revalidatePath("/", "layout");
  return { success: true as const };
}

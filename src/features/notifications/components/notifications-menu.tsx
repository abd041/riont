"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Bell } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { UserNotification } from "@/server/services/notification-list.service";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/server/actions/notification.actions";

export function NotificationsMenu({
  notifications,
}: {
  notifications: UserNotification[];
}) {
  const t = useTranslations("notifications");
  const locale = useLocale();
  const router = useRouter();
  const unread = notifications.filter((n) => !n.readAt).length;

  async function handleMarkAll() {
    await markAllNotificationsReadAction();
    router.refresh();
  }

  async function handleMarkOne(id: string) {
    await markNotificationReadAction(id);
    router.refresh();
  }

  return (
    <div className="group relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("title")}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute end-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>

      <div className="invisible absolute end-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-elevated)] opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
          <p className="text-sm font-semibold">{t("title")}</p>
          {unread > 0 && (
            <button
              type="button"
              onClick={handleMarkAll}
              className="text-xs text-accent-400 hover:text-accent-300"
            >
              {t("markAllRead")}
            </button>
          )}
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
              {t("empty")}
            </li>
          ) : (
            notifications.map((n) => (
              <li
                key={n.id}
                className={`border-b border-[var(--border-subtle)] px-4 py-3 last:border-0 ${
                  !n.readAt ? "bg-accent-500/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {n.link ? (
                      <Link
                        href={n.link.replace(/^\/(en|ar)/, "") || "/"}
                        className="block hover:text-accent-400"
                        onClick={() => {
                          if (!n.readAt) void handleMarkOne(n.id);
                        }}
                      >
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-muted)]">
                          {n.body}
                        </p>
                      </Link>
                    ) : (
                      <>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                          {n.body}
                        </p>
                      </>
                    )}
                    <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                      {new Date(n.createdAt).toLocaleString(locale)}
                    </p>
                  </div>
                  {!n.readAt && (
                    <button
                      type="button"
                      onClick={() => void handleMarkOne(n.id)}
                      className="shrink-0 text-[10px] text-accent-400 hover:underline"
                    >
                      {t("markRead")}
                    </button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

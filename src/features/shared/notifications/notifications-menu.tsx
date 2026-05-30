"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Bell } from "lucide-react";
import { Link } from "@/i18n/navigation";
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
      <button
        type="button"
        aria-label={t("title")}
        className="nex-topbar-action relative"
      >
        <Bell strokeWidth={1.75} />
        {unread > 0 && (
          <span className="nex-topbar-cart-badge">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <div className="invisible absolute end-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-elevated)] opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
          <p className="text-sm font-semibold text-white">{t("title")}</p>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => void handleMarkAll()}
              className="text-xs text-violet-400 hover:text-violet-300"
            >
              {t("markAllRead")}
            </button>
          )}
        </div>
        <ul className="max-h-72 overflow-y-auto py-1">
          {notifications.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
              {t("empty")}
            </li>
          ) : (
            notifications.slice(0, 8).map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => void handleMarkOne(n.id)}
                  className={`w-full px-4 py-3 text-start transition hover:bg-white/[0.03] ${
                    n.readAt ? "opacity-70" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-white">{n.title}</p>
                  {n.body && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-muted)]">
                      {n.body}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                    {new Date(n.createdAt).toLocaleString(locale)}
                  </p>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="border-t border-[var(--border-subtle)] p-2">
          <Link
            href="/account/orders"
            className="block rounded-md px-3 py-2 text-center text-xs text-violet-400 hover:bg-white/[0.03]"
          >
            {t("title")}
          </Link>
        </div>
      </div>
    </div>
  );
}

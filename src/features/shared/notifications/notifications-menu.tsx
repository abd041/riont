"use client";

import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.readAt).length;

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("pointerdown", onPointerDown);
      return () => document.removeEventListener("pointerdown", onPointerDown);
    }
  }, [open]);

  async function handleMarkAll() {
    await markAllNotificationsReadAction();
    router.refresh();
  }

  async function handleMarkOne(id: string) {
    await markNotificationReadAction(id);
    router.refresh();
  }

  return (
    <div
      ref={rootRef}
      className="nex-notifications-menu relative"
      data-open={open ? "true" : "false"}
    >
      <button
        type="button"
        aria-label={t("title")}
        aria-expanded={open}
        aria-haspopup="true"
        className="nex-topbar-action relative"
        onClick={() => setOpen((value) => !value)}
      >
        <Bell strokeWidth={1.75} />
        {unread > 0 && (
          <span className="nex-topbar-cart-badge">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <div className="nex-notifications-panel absolute end-0 top-full z-50 mt-2 w-80 max-w-[min(20rem,calc(100vw-1.5rem))] rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
          <p className="text-sm font-semibold text-white">{t("title")}</p>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => void handleMarkAll()}
              className="min-h-[36px] px-2 text-xs text-accent-400 hover:text-accent-300"
            >
              {t("markAllRead")}
            </button>
          )}
        </div>
        <ul className="max-h-[min(18rem,50vh)] overflow-y-auto py-1">
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
                  className={`min-h-[44px] w-full px-4 py-3 text-start transition hover:bg-white/[0.03] ${
                    n.readAt ? "opacity-70" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-white">{n.title}</p>
                    {n.body && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-muted)]">
                        {n.body}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
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
            className="flex min-h-[44px] items-center justify-center rounded-md px-3 py-2 text-center text-xs text-accent-400 hover:bg-white/[0.03]"
            onClick={() => setOpen(false)}
          >
            {t("title")}
          </Link>
        </div>
      </div>
    </div>
  );
}

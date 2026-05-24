"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, Package, Grid3X3, Headphones, ClipboardList, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/", icon: Home, key: "home" as const },
  { href: "/products", icon: Package, key: "products" as const },
  { href: "/categories", icon: Grid3X3, key: "categories" as const },
  { href: "/account/orders", icon: ClipboardList, key: "orders" as const },
  { href: "/support", icon: Headphones, key: "support" as const },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tPromo = useTranslations("promo");
  const pathname = usePathname();

  return (
    <aside className="glass-card flex h-full w-[var(--sidebar-width)] shrink-0 flex-col rounded-none border-y-0 border-s-0">
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/20 glow-sm">
          <Zap className="h-5 w-5 text-accent-500" />
        </div>
        <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
          {tCommon("brand")}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, icon: Icon, key }) => {
          const active =
            href === "/"
              ? pathname === "/" || pathname === ""
              : pathname.startsWith(href);

          return (
            <Link
              key={key}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex h-10 items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm transition-all duration-200",
                active
                  ? "bg-accent-500/15 text-[var(--text-primary)] glow-sm"
                  : "text-[var(--text-muted)] hover:bg-surface-2 hover:text-[var(--text-secondary)]",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              {t(key)}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-[var(--radius-lg)] border border-[var(--border-glow)] bg-gradient-to-br from-accent-600/20 to-transparent p-4">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {tPromo("title")}
        </p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{tPromo("subtitle")}</p>
        <Link
          href="/products"
          className="mt-3 inline-flex h-8 items-center justify-center rounded-[var(--radius-md)] bg-[image:var(--gradient-primary)] px-3 text-xs font-medium text-white"
        >
          {tPromo("cta")}
        </Link>
      </div>
    </aside>
  );
}

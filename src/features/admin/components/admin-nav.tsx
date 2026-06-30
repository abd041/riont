"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

type NavLink = {
  href: string;
  label: string;
  exact?: boolean;
};

type NavGroup = {
  label: string | null;
  links: NavLink[];
};

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    links: [{ href: "/admin", label: "Dashboard", exact: true }],
  },
  {
    label: "Sales",
    links: [
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/tickets", label: "Support" },
      { href: "/admin/customers", label: "Customers" },
    ],
  },
  {
    label: "Catalog",
    links: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/categories", label: "Categories" },
      { href: "/admin/coupons", label: "Coupons" },
    ],
  },
  {
    label: "Site",
    links: [
      { href: "/admin/homepage", label: "Homepage" },
      { href: "/admin/appearance", label: "Appearance" },
      { href: "/admin/reviews", label: "Store reviews" },
    ],
  },
  {
    label: "More",
    links: [
      { href: "/admin/settings", label: "Settings" },
      { href: "/admin/activity", label: "History" },
    ],
  },
];

function isLinkActive(pathname: string, link: NavLink): boolean {
  if (link.exact) return pathname === link.href;
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

type AdminNavProps = {
  variant?: "sidebar" | "horizontal";
};

export function AdminNav({ variant = "sidebar" }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("admin-nav", variant === "sidebar" && "admin-nav--sidebar")}
      aria-label="Admin navigation"
    >
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.label ?? "overview"} className="admin-nav__group">
          {group.label && (
            <span className="admin-nav__group-label">{group.label}</span>
          )}
          <div className="admin-nav__links">
            {group.links.map((link) => {
              const active = isLinkActive(pathname, link);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "admin-nav__link",
                    active && "admin-nav__link--active",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

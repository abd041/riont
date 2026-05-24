"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/tickets", label: "Support" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              active
                ? "bg-accent-500/20 text-accent-300"
                : "border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

/** Full-width browse pages hide the nav rail (logo in topbar). */
function isFullWidthBrowsePath(pathname: string) {
  return pathname === "/products" || pathname === "/categories";
}

function isCheckoutPath(pathname: string) {
  return pathname.includes("/checkout");
}

export function StorefrontShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const hideNavSidebar = isFullWidthBrowsePath(pathname);
  const isCheckout = isCheckoutPath(pathname);

  return (
    <div
      className={cn(
        "nex-storefront flex min-h-screen",
        hideNavSidebar && "nex-storefront--no-nav",
        isCheckout && "nex-storefront--checkout",
      )}
    >
      {!hideNavSidebar && (
        <>
          <div
            className={cn(
              "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden",
              mobileNavOpen ? "block" : "hidden",
            )}
            onClick={() => setMobileNavOpen(false)}
            aria-hidden
          />

          <div
            className={cn(
              "nex-sidebar-rail",
              mobileNavOpen ? "is-open" : "is-closed",
            )}
          >
            <div className="nex-sidebar__fade nex-sidebar__fade--top" aria-hidden />
            <div className="nex-sidebar__fade nex-sidebar__fade--bottom" aria-hidden />
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </>
      )}

      <div className="nex-storefront-main flex min-w-0 flex-1 flex-col">
        <Topbar
          showMenuButton={!hideNavSidebar}
          showBrand={hideNavSidebar}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="nex-main flex-1">{children}</main>
      </div>

      {!hideNavSidebar && mobileNavOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed end-4 top-4 z-[60] lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

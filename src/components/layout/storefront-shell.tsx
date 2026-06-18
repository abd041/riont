"use client";

import { X } from "lucide-react";
import { MarketplaceFooter } from "@/features/homepage/components/marketplace/marketplace-footer";
import { usePathname } from "@/i18n/navigation";
import { useMobileNav } from "@/hooks/use-ui-store";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

function isHomePath(pathname: string) {
  return pathname === "/";
}

/** Full-width browse pages hide the nav drawer trigger (logo in topbar). */
function isFullWidthBrowsePath(pathname: string) {
  if (pathname === "/products" || pathname === "/categories") return true;

  if (pathname.startsWith("/products/") && !pathname.includes("/checkout")) {
    const segments = pathname.split("/").filter(Boolean);
    return segments.length === 2 && segments[0] === "products";
  }

  return false;
}

function isCheckoutPath(pathname: string) {
  return pathname.includes("/checkout");
}

export function StorefrontShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen: navOpen, toggle: toggleNav, setOpen: setNavOpen } = useMobileNav();
  const pathname = usePathname();
  const isCheckout = isCheckoutPath(pathname);
  const hideNavSidebar = isCheckout;

  const closeNav = () => setNavOpen(false);

  return (
    <div
      className={cn(
        "nex-storefront flex min-h-screen flex-col",
        isFullWidthBrowsePath(pathname) && "nex-storefront--browse",
        hideNavSidebar && "nex-storefront--no-nav",
        isCheckout && "nex-storefront--checkout",
        !hideNavSidebar && "nex-storefront--drawer-nav",
        navOpen && "nex-storefront--nav-open",
      )}
    >
      <div className="nex-storefront-ambient" aria-hidden>
        <span className="nex-orb nex-orb--purple" />
        <span className="nex-orb nex-orb--violet" />
        <span className="nex-noise" />
        <span className="nex-grid-overlay" />
      </div>

      <Topbar
        showMenuButton={!isCheckout}
        menuOpen={navOpen}
        onMenuClick={toggleNav}
      />

      {!hideNavSidebar && (
        <>
          <div
            className={cn(
              "nex-nav-backdrop",
              navOpen ? "nex-nav-backdrop--visible" : "nex-nav-backdrop--hidden",
            )}
            onClick={closeNav}
            aria-hidden
          />

          <div
            className={cn(
              "nex-nav-drawer",
              navOpen ? "nex-nav-drawer--open" : "nex-nav-drawer--closed",
            )}
          >
            <div className="nex-sidebar__fade nex-sidebar__fade--top" aria-hidden />
            <div className="nex-sidebar__fade nex-sidebar__fade--bottom" aria-hidden />
            <Sidebar onNavigate={closeNav} />
          </div>
        </>
      )}

      <main className="nex-main nex-storefront-main flex-1">
        <Container className="nex-storefront-container">{children}</Container>
        {!isHomePath(pathname) && !isCheckout && (
          <Container className="nex-storefront-container">
            <MarketplaceFooter />
          </Container>
        )}
      </main>

      {!hideNavSidebar && navOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="nex-nav-close fixed end-4 top-4 z-[60] flex h-11 w-11 items-center justify-center lg:hidden"
          onClick={closeNav}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

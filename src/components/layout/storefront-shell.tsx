"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
export function StorefrontShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 lg:hidden",
          mobileNavOpen ? "block" : "hidden",
        )}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden
      />

      <div
        className={cn(
          "fixed inset-y-0 z-50 w-[var(--sidebar-width)] transition-transform duration-200 lg:static lg:translate-x-0",
          "start-0",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
        )}
      >
        <Sidebar onNavigate={() => setMobileNavOpen(false)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>

      {mobileNavOpen && (
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

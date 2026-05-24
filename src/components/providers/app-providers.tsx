"use client";

import { Toaster } from "sonner";

export function AppProviders({ dir }: { dir: "ltr" | "rtl" }) {
  return (
    <Toaster
      dir={dir}
      theme="dark"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "glass-card border border-[var(--border-default)] bg-surface text-[var(--text-primary)]",
          title: "text-[var(--text-primary)]",
          description: "text-[var(--text-muted)]",
          success: "border-emerald-500/30",
          error: "border-red-500/30",
        },
      }}
      closeButton
      richColors
    />
  );
}

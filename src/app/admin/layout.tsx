import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { requireAdmin } from "@/lib/auth/require-admin";
import Link from "next/link";
import { AdminNav } from "@/features/admin/components/admin-nav";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Admin | riont",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <html lang="en" dir="ltr" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
          <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
              <div className="flex items-center gap-6">
                <Link href="/admin/orders" className="text-lg font-bold text-accent-400">
                  riont admin
                </Link>
                <AdminNav />
              </div>
              <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                <span>{profile.display_name ?? profile.id.slice(0, 8)}</span>
                <Link href="/en" className="text-accent-400 hover:underline">
                  Storefront
                </Link>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </div>
        <Toaster theme="dark" richColors position="top-center" />
      </body>
    </html>
  );
}

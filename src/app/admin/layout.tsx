import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { requireAdmin } from "@/lib/auth/require-admin";
import Link from "next/link";
import { AdminNav } from "@/features/admin/components/admin-nav";
import { AdminSignOutButton } from "@/features/admin/components/admin-sign-out-button";
import { BrandLogo } from "@/components/shared/brand-logo";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Admin | riyont",
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
        <div className="admin-app">
          <div className="admin-app__ambient" aria-hidden>
            <span className="nex-orb nex-orb--purple" />
            <span className="nex-orb nex-orb--blue" />
            <span className="nex-noise" />
          </div>

          <header className="admin-header">
            <div className="admin-header__inner">
              <div className="admin-header__start">
                <Link href="/admin" className="admin-header__brand-link" aria-label="Riyont admin">
                  <BrandLogo className="nex-brand-logo" height={32} />
                </Link>
                <p className="admin-header__title">Admin</p>
              </div>
              <AdminNav />
              <div className="admin-header__meta">
                <span>{profile.display_name ?? profile.id.slice(0, 8)}</span>
                <Link href="/en" className="admin-header__store-link">
                  Storefront →
                </Link>
                <AdminSignOutButton />
              </div>
            </div>
          </header>

          <main className="admin-main">
            <div className="admin-container">{children}</div>
          </main>
        </div>
        <Toaster theme="dark" richColors position="top-center" />
      </body>
    </html>
  );
}

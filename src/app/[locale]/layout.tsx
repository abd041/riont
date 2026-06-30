import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Inter_Tight, IBM_Plex_Sans_Arabic } from "next/font/google";
import { routing } from "@/i18n/routing";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteBrandingProvider } from "@/components/providers/site-branding-provider";
import { SiteThemeStyle } from "@/components/theme/site-theme-style";
import { BRAND_LOGO } from "@/components/shared/brand-logo";
import { getSiteAppearance } from "@/server/services/theme.service";
import { getStoreRuntimeConfig } from "@/server/services/store-config.service";
import { SiteStoreProvider } from "@/components/providers/site-store-provider";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: {
      default: t("brand"),
      template: `%s | ${t("brand")}`,
    },
    icons: {
      icon: BRAND_LOGO.src,
      apple: BRAND_LOGO.src,
    },
    description: t("siteDescription"),
  };
}

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const appearance = await getSiteAppearance();
  const storeConfig = await getStoreRuntimeConfig();

  return (
    <html lang={locale} dir={dir} className="dark">
      <body
        className={`${inter.variable} ${interTight.variable} ${arabic.variable} ${
          locale === "ar" ? "font-arabic" : "font-sans"
        } antialiased`}
      >
        <SiteThemeStyle />
        <NextIntlClientProvider messages={messages}>
          <SiteBrandingProvider logoUrl={appearance.logoUrl}>
            <SiteStoreProvider config={storeConfig}>
              <AppProviders dir={dir} />
              {children}
            </SiteStoreProvider>
          </SiteBrandingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

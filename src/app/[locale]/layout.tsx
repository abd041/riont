import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { GeistSans } from "geist/font/sans";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { routing } from "@/i18n/routing";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteBrandingProvider } from "@/components/providers/site-branding-provider";
import { SiteThemeStyle } from "@/components/theme/site-theme-style";
import { getSiteRuntimeSettings } from "@/server/services/site-runtime.service";
import { BRAND_LOGO } from "@/components/shared/brand-logo";
import { SiteStoreProvider } from "@/components/providers/site-store-provider";
import "@/styles/globals.css";

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const runtime = await getSiteRuntimeSettings();
  const favicon = runtime.logoUrl ?? BRAND_LOGO.src;

  return {
    title: {
      default: t("brand"),
      template: `%s | ${t("brand")}`,
    },
    icons: {
      icon: favicon,
      apple: favicon,
    },
    description: t("siteDescription"),
  };
}

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
  const runtime = await getSiteRuntimeSettings();

  return (
    <html
      lang={locale}
      dir={dir}
      className={`dark ${GeistSans.variable} ${arabic.variable}`}
      data-theme={runtime.preset}
    >
      <body
        className={`${
          locale === "ar" ? "font-arabic" : "font-sans"
        } antialiased`}
      >
        <SiteThemeStyle themeCss={runtime.themeCss} />
        <NextIntlClientProvider messages={messages}>
          <SiteBrandingProvider logoUrl={runtime.logoUrl}>
            <SiteStoreProvider
              config={{
                features: runtime.features,
                socialLinks: runtime.socialLinks,
                supportWhatsapp: runtime.supportWhatsapp,
              }}
            >
              <AppProviders dir={dir} />
              {children}
            </SiteStoreProvider>
          </SiteBrandingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

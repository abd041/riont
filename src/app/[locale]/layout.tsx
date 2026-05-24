import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { routing } from "@/i18n/routing";
import { AppProviders } from "@/components/providers/app-providers";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    description:
      locale === "ar"
        ? "سوق رقمي مميز للمنتجات الرقمية مع تسليم سريع ودعم موثوق."
        : "Premium digital marketplace with fast delivery and trusted support.",
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

  return (
    <html lang={locale} dir={dir} className="dark">
      <body
        className={`${inter.variable} ${arabic.variable} ${
          locale === "ar" ? "font-arabic" : "font-sans"
        } antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <AppProviders dir={dir} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

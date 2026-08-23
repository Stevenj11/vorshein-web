import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { Concierge } from "@/components/Concierge";
import { Footer } from "@/components/Footer";
import { IntroLoader } from "@/components/IntroLoader";
import { Navbar } from "@/components/Navbar";
import { routing } from "@/i18n/routing";
import { BRAND } from "@/lib/brand";
import "../globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const tb = await getTranslations({ locale, namespace: "brand" });

  return {
    title: `${BRAND.name} — ${tb("system")}`,
    description: t("description"),
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

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-void text-fg">
        <NextIntlClientProvider>
          <IntroLoader />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Concierge />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

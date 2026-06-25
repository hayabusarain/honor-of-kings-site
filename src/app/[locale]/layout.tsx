import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { MobileAppShell } from "@/components/mobile/MobileAppShell";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Script from "next/script";
import { CanonicalLinks } from '@/components/CanonicalLinks';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL('https://hok.hub-game.com'),
    title: {
      template: '%s | Honor of Kings Hub',
      default: t('defaultTitle'),
    },
    description: t('description'),
    keywords: ["Honor of Kings", "Tier List", "パッチノート", "LoL", "相性", "オナーオブキングス", "HoK"],
    openGraph: {
      title: 'Honor of Kings Hub',
      description: t('description'),
      url: 'https://hok.hub-game.com',
      siteName: 'Honor of Kings Hub',
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Honor of Kings Hub',
        },
      ],
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Honor of Kings Hub',
      description: t('description'),
      images: ['/images/og-image.png'],
    },
    other: {
      'google-adsense-account': 'ca-pub-7201202773518258',
    },
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <CanonicalLinks locale={locale} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#f8fafc" />
        {/* AdSense Script */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7201202773518258"
          crossOrigin="anonymous"
        ></script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-65P6KEVN7X"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-65P6KEVN7X');
          `}
        </Script>
      </head>
      <body className="antialiased bg-slate-200">
        <NextIntlClientProvider messages={messages}>
          <MobileAppShell>
            {children}
          </MobileAppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

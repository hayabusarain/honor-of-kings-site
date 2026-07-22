import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { MobileAppShell } from "@/components/mobile/MobileAppShell";
import CookieBanner from "@/components/layout/CookieBanner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Script from "next/script";
import { CanonicalLinks } from '@/components/CanonicalLinks';
import { PwaRegister } from '@/components/pwa/PwaRegister';

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
    keywords: ["Honor of Kings", "HoK", "オナーオブキングス", "オーナーオブキングス", "攻略", "Tier List", "Tier表", "最強ランキング", "パッチノート", "ビルド", "使い方", "対策", "相性", "メタ", "おすすめ装備", "全ヒーロー"],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'ja': '/ja',
        'en': '/en',
        'x-default': '/ja',
      },
    },
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
  const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Honor of Kings Hub",
    "url": "https://hok.hub-game.com",
    "description": tMeta('description'),
    "publisher": {
      "@type": "Organization",
      "name": "Honor of Kings Hub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hok.hub-game.com/images/og-image.png"
      }
    }
  };

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="HoK Hub" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#4f46e5" />
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
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-slate-200">
        <NextIntlClientProvider messages={messages}>
          <MobileAppShell>
            {children}
          </MobileAppShell>
          <CookieBanner />
          <PwaRegister />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

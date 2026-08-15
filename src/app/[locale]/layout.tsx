import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "../globals.css";
import { MobileAppShell } from "@/components/mobile/MobileAppShell";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { PwaRegister } from '@/components/pwa/PwaRegister';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 玉璽デザイン: 日本語本文は Noto Sans JP、見出しは Noto Serif JP。
// 従来は日本語フォント未指定で OS 依存のばらつきがあった
const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, viewportFit: 'cover' };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL('https://hok.hub-game.com'),
    title: {
      template: '%s | Honor of Kings Hub',
      default: t('defaultTitle'),
    },
    // 個別ページで上書きされるが、トップページはここが唯一の description になる。
    // 設定漏れがあると検索結果のスニペットを検索エンジンに任せることになる。
    description: t('description'),
    keywords: locale === 'ja'
      ? ["Honor of Kings", "HoK", "オナーオブキングス", "オーナーオブキングス", "攻略", "Tier List", "Tier表", "最強ランキング", "パッチノート", "ビルド", "使い方", "対策", "相性", "メタ", "おすすめ装備", "全ヒーロー"]
      : ["Honor of Kings", "HoK", "Guides", "Tier List", "Best Builds", "Patch Notes", "Hero Guides", "Counter Picks", "Items", "Arcana", "Meta", "All Heroes"],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'ja': '/ja',
        'en': '/en',
        // 日英以外の全世界からの検索は英語版へ誘導する（英語圏グロース方針）
        'x-default': '/en',
      },
    },
    openGraph: {
      title: 'Honor of Kings Hub',
      description: t('description'),
      url: 'https://hok.hub-game.com',
      siteName: 'Honor of Kings Hub',
      images: [
        {
          url: '/images/og-image.jpg',
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
      images: ['/images/og-image.jpg'],
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
  
  if (!routing.locales.includes(locale as 'en' | 'ja')) {
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
        "url": "https://hok.hub-game.com/images/og-image.jpg"
      }
    }
  };

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} ${notoSansJp.variable} ${notoSerifJp.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="HoK Hub" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#f8f6f1" />
        {/* Consent Mode v2 の既定値。Google のタグより先に実行されないと意味がない。
            素の script で書くこと。next/script の beforeInteractive は同意コードを
            self.__next_s のキューに積むだけで、実行はフレームワークの起動後になる。
            外部スクリプト側を async ではなく defer にしているのも順序のため。
            async だと React 19 が head の先頭へ巻き上げ、この同期ブロックを追い越す。
            EEA・UK からのアクセスだけ denied で開始し、同意が取れた時点で CMP が granted へ更新する。
            日本など対象外の地域まで denied にすると計測が無駄に落ちるので、region で絞る */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500,
              'region': ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB']
            });
            gtag('consent', 'default', {
              'ad_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted',
              'analytics_storage': 'granted'
            });
            gtag('set', 'ads_data_redaction', true);
          `,
          }}
        />
        {/* Google AdSense。public/ads.txt に登録済みのパブリッシャーIDと同じものを使う。
            審査はこのタグの有無で判定されるため、広告を出す前から設置しておく必要がある。
            next/script の afterInteractive はハイドレーション後に body へ挿入される仕様で、
            サーバーが返す HTML にタグ本体が出ない。審査で「コードが見つかりません」と
            判定されうるので素の script にした。AdSense 管理画面で作成した GDPR メッセージも
            このタグ経由で配信されるため、初期HTMLに出ていないと同意バナー自体が遅れる */}
        <script
          defer
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7201202773518258"
          crossOrigin="anonymous"
        />
        <script defer src="https://www.googletagmanager.com/gtag/js?id=G-65P6KEVN7X" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            gtag('js', new Date());
            gtag('config', 'G-65P6KEVN7X');
          `,
          }}
        />
        {/* next/script は既定で afterInteractive、つまりハイドレーション後に注入される。
            構造化データは初期HTMLに無いと読まれないので、素の script で出す
            （ヒーロー詳細の Article/BreadcrumbList は元から素の script で正しく出ていた） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-background font-sans">
        <NextIntlClientProvider messages={messages}>
          <MobileAppShell>
            {children}
          </MobileAppShell>
          <PwaRegister />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

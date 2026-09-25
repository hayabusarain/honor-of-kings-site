import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "../globals.css";
import { MobileAppShell } from "@/components/mobile/MobileAppShell";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Script from 'next/script';
import { PwaRegister } from '@/components/pwa/PwaRegister';
import { TITLE_TEMPLATE } from '@/lib/buildMetadata';

// 玉璽デザイン: 英語ページの本文は Noto Sans JP、ワードマークは Noto Serif JP。
// 日本語ページの本文は端末のフォント（iPhone はヒラギノ、Android は Noto Sans CJK、
// Windows はメイリオ）で、Noto Sans JP を読まない。指定は globals.css の --font-body。
//
// 2026-09-25 に日本語ページも端末のフォントへ切り替えた。日本語の Web フォントは文字の帯ごとに
// 124個のファイルに分かれ、1ページで 1.4〜2.9MB を読み、届くたびにページ全体を組み直していた。
// スマホ想定（CPU 4倍遅く）で測ると、フォントを止めただけで読み込み中に画面が固まる時間が
// /ja/heroes 12.5秒 → 3.0秒、/ja/tier-list 10.1秒 → 2.8秒 になった（英語ページは元から1.5秒）。
// Android の標準フォントは Noto Sans JP と同じ字形なので、見た目がほぼ変わらない端末が多い。
//
// create-next-app 由来の Geist / Geist_Mono は 2026-08-31 に外した。
// font-mono の使用は0件で、font-sans も先頭が Noto Sans JP なので
// 一度も描画されないまま 52,396 B を毎ページ preload していた
//
// weight を指定せず、可変フォント（太さ100〜900を1つのファイルで持つ）として宣言する。
// 以前は 400/500/700/900 の4つを指定していたが、Google が返すファイルは4つとも同じ
// 可変フォントだった（2026-09-25 に確認。@font-face 496個に対して URL は124個で、
// 可変フォントの124個と完全に一致）。フォント本体の転送量は変わらず、宣言だけが4倍あった。
// 1つにまとめて、描画を止める CSS が 182KB → 83KB になった（スマホ幅の実測）。
// font-semibold は4つのころ 700 の宣言で描かれていたので、globals.css で 700 に固定して見た目を保つ
//
// preload しない。preload は言語を問わず全ページに付くので、このフォントを使わない
// 日本語ページでも英字の 43KB を先に取らせることになる
const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// 使い道はワードマーク「Honor of Kings Hub」の2箇所（Sidebar と AppBar）だけ。
// どちらも font-bold なので weight は 700 だけでよい。
// preload しないのは、preload 対象の 147,292 B のうち 113,904 B が
// U+7D57 以降の漢字帯で、ワードマークが ASCII だけである以上どのページでも
// 描画されないため。ラテン 33,388 B は描画時の遅延取得に回る
const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, viewportFit: 'cover' };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL('https://hok.hub-game.com'),
    title: {
      template: TITLE_TEMPLATE,
      default: t('defaultTitle'),
    },
    // 個別ページで上書きされるが、トップページはここが唯一の description になる。
    // 設定漏れがあると検索結果のスニペットを検索エンジンに任せることになる。
    description: t('description'),
    // keywords は置かない。Google は2009年に「ランキングに使わない」と明言しており、
    // Bing も同様。書いても検索結果は変わらず、競合に狙っている語を教えるだけになる
    // canonical・hreflang・フィードの自動発見リンクはここに置かない。
    // レイアウトのメタデータは404にも継承される。しかも notFound() が投げられると
    // Next.js はページ側の generateMetadata を捨て、レイアウト分だけを出力する。
    // ここに canonical があると存在しないURLがすべて
    // 「noindex ＋ canonical=トップページ」という食い違った指示になり、
    // noindex がトップページ側へ伝播しうる（2026-08-29 にビルド出力で確認）。
    // トップページ用の canonical は [locale]/page.tsx が自分で出す。
    openGraph: {
      title: 'Honor of Kings Hub',
      description: t('description'),
      // og:url も入れない。canonical と同じ理由で、404 に og:url=トップページが付く。
      // 各ページは buildPageMetadata が openGraph ごと上書きする
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
      },
      // 運営者の同一性を示す。サイト内に公開リンクがある2つだけを挙げる。
      // wildrift.hub-game.com は入れない。同じ組織の別プロフィールではなく
      // 別サイトで、sameAs の意味と食い違う
      "sameAs": [
        "https://hub-game.com/",
        "https://x.com/hub_gamecom"
      ]
    }
  };

  return (
    <html lang={locale} className={`${notoSansJp.variable} ${notoSerifJp.variable}`}>
      <head>
        {/* manifest はロケール別。start_url が "/" だと、ホーム画面から
            起動するたびに src/app/page.tsx の307を1回踏む。
            両方の manifest に "id": "/" を入れてあるので、start_url を
            変えても既存インストールは同じアプリのまま */}
        <link rel="manifest" href={locale === 'ja' ? '/manifest.ja.json' : '/manifest.json'} />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="HoK Hub" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0e0c09" />
        {/* Consent Mode v2 の既定値。Google のタグより先に実行されないと意味がない。
            素の script で書く。next/script の beforeInteractive は、外部・インラインを
            問わず self.__next_s のキューに積むだけで実タグにならず、しかも
            この同期ブロックより前に置かれるため使えない（2026-08-16 に実測）。
            このブロックは HTML 解析中に走り、下の afterInteractive 群は
            ハイドレーション後に読み込まれるので、順序は確実に保たれる。
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
              'region': ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH']
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
        {/* Google AdSense と GA。public/ads.txt に登録済みのパブリッシャーIDと同じものを使う。
            afterInteractive はハイドレーション後に body へ挿入されるため、
            サーバーが返す HTML にはタグ本体が出ない。それを承知でこうしている。

            一度これを素の <script> に変えたが、adsbygoogle.js が読み込まれると
            自前の show_ads_impl を head の先頭に差し込むため、React が描画した位置と
            DOM がずれて全ページでハイドレーションが失敗した（SSR結果を捨てて
            クライアントで丸ごと再描画される）。2026-08-16 に実機のコンソールで確認。
            beforeInteractive も __next_s キュー経由で実タグにならず、代替にならない。

            初期HTMLにタグが無いことの影響は小さい。審査クローラは JS を実行するし、
            サイト所有権の確認は ads.txt のパブリッシャーID一致で足りる。
            ハイドレーション失敗のほうが実害が大きいと判断した。 */}
        <Script
          id="google-adsense"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7201202773518258"
          crossOrigin="anonymous"
        />
        <Script
          id="google-gtag"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-65P6KEVN7X"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            gtag('js', new Date());
            gtag('config', 'G-65P6KEVN7X');
          `}
        </Script>
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

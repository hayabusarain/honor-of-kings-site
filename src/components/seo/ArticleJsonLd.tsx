/**
 * ガイド記事用の Article 構造化データ。
 *
 * /guide 配下の4記事がそれぞれ同じ形の JSON を手で組み立てていたので、
 * 組み立てを純関数 buildArticleJsonLd に寄せた。値の計算だけなので、
 * 'use client' のページからも import できる。
 * /guide 本体は 2026-08-31 にサーバーコンポーネント化したので、
 * こちらは ArticleJsonLd コンポーネントの方を使っている。
 *
 * FAQPage/HowTo はリッチリザルト廃止済みのため付けない。
 * 日付は git 履歴由来（page.tsx の初コミット/最終コミット）。内容を更新したら
 * 呼び出し側の dateModified を上げる。
 */

const ORIGIN = 'https://hok.hub-game.com';

export type ArticleJsonLdArgs = {
  locale: string;
  /** ロケールを除いたパス。例 '/guide/bosses' */
  path: string;
  headline: string;
  description: string;
  /** YYYY-MM-DD */
  datePublished: string;
  /** YYYY-MM-DD */
  dateModified: string;
};

export function buildArticleJsonLd({ locale, path, headline, description, datePublished, dateModified }: ArticleJsonLdArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: `${ORIGIN}/${locale}${path}`,
    image: `${ORIGIN}/images/og-image.jpg`,
    inLanguage: locale === 'ja' ? 'ja-JP' : 'en-US',
    datePublished,
    dateModified,
    author: { '@type': 'Organization', name: 'Honor of Kings Hub' },
  };
}

/**
 * サーバーコンポーネント。ページ本体が 'use client' のルートでは layout に置く。
 * 構造化データは初期HTMLに必要なので next/script ではなく素の script で出す
 * （BreadcrumbJsonLd と同じ理由）。
 */
export function ArticleJsonLd(args: ArticleJsonLdArgs) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd(args)) }}
    />
  );
}

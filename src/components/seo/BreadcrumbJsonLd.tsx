/**
 * 一覧ページ用の BreadcrumbList 構造化データ。
 *
 * ヒーロー詳細だけが BreadcrumbList を持っていて、一覧側（Tier表・アイテム・
 * ガイド等）には無かった。パンくずリッチリザルトの対象にならないままだった。
 *
 * ページ本体が 'use client' でもそのまま置ける（初期HTMLに出る）。layout に置くと
 * 子ルートで一覧ぶんが重ねて出るため、ページごとに自分の階層を書く。
 * next/script は初期HTMLに出ないので、素の script で出す（ルートレイアウトの
 * JSON-LD と同じ理由）。
 */

const ORIGIN = 'https://hok.hub-game.com';

type Crumb = {
  name: string;
  /** ロケールを除いたパス。例 '/guide/bosses' */
  path: string;
};

export function BreadcrumbJsonLd({ locale, trail }: { locale: string; trail: Crumb[] }) {
  const items = [
    { name: locale === 'ja' ? 'ホーム' : 'Home', path: '' },
    ...trail,
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${ORIGIN}/${locale}${c.path}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

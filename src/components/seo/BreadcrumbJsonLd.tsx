/**
 * パンくず。構造化データ（BreadcrumbJsonLd）と可視の導線（Breadcrumb）を同居させる。
 *
 * 構造化データだけが先に入り、画面には出ていなかった。検索から下層ページへ
 * 直接来た読者は、自分がサイトのどこにいるか分からないまま読むことになる。
 * 2つを同じファイルに置くのは、トレイルを1本の配列から両方へ渡させるため。
 * 別々に書くと、片方だけ直して食い違う。
 *
 * ページ本体が 'use client' でもそのまま置ける（初期HTMLに出る）。layout に置くと
 * 子ルートで一覧ぶんが重ねて出るため、ページごとに自分の階層を書く。
 * next/script は初期HTMLに出ないので、素の script で出す（ルートレイアウトの
 * JSON-LD と同じ理由）。
 */
import { Link } from '@/i18n/routing';

const ORIGIN = 'https://hok.hub-game.com';

export type Crumb = {
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


/**
 * 可視のパンくず。構造化データと同じトレイルを渡す。
 *
 * 先頭の「ホーム」と、末尾を非リンクにするのはここで作る。呼び出し側は
 * 自分の階層だけを書けばよく、BreadcrumbJsonLd と同じ配列を使い回せる。
 * 区切りの › は aria-hidden。読み上げでは順序がリンクの並びで伝わる。
 */
export function Breadcrumb({ locale, trail, className = '' }: { locale: string; trail: Crumb[]; className?: string }) {
  const items = [{ name: locale === 'ja' ? 'ホーム' : 'Home', path: '' }, ...trail];
  return (
    <nav
      aria-label={locale === 'ja' ? 'パンくず' : 'Breadcrumb'}
      className={`flex items-center gap-1.5 text-[11px] font-bold text-slate-500 flex-wrap ${className}`}
    >
      {items.map((c, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${c.path}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">›</span>}
            {isLast ? (
              <span className="text-slate-700">{c.name}</span>
            ) : (
              <Link href={c.path || '/'} className="hover:text-brand-700 transition-colors">
                {c.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

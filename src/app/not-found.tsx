import Link from 'next/link';
import './globals.css';

// アプリ全体の 404。
//
// このプロジェクトには src/app/layout.tsx が無く、[locale]/layout.tsx が
// ルートレイアウトを兼ねている。そのため notFound() が [locale] より外側で
// 処理され、[locale]/not-found.tsx は一度も表示されていなかった
// （Next.js 組み込みの英語のみ・ナビ無しの画面が出ていた）。
// ここはロケール層の外側なので、自前で <html>/<body> を持ち、
// next-intl のプロバイダにも依存しない形で書く必要がある。
//
// 訪問者の言語が確定できないため日英を併記する。
export const metadata = {
  title: 'ページが見つかりません / Page Not Found | Honor of Kings Hub',
  // 404 は検索結果に載せる必要がないため、明示的に除外する
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: '/ja', ja: 'トップページ', en: 'Home' },
  { href: '/ja/heroes', ja: 'ヒーロー一覧', en: 'Heroes' },
  { href: '/ja/tier-list', ja: 'Tier表', en: 'Tier List' },
  { href: '/ja/guide', ja: '初心者ガイド', en: 'Beginner Guide' },
];

export default function NotFound() {
  return (
    <html lang="ja">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <main className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md w-full">
            <p className="text-7xl font-black text-slate-300 mb-4">404</p>

            <h1 className="text-2xl font-black text-slate-800 mb-2">
              ページが見つかりません
            </h1>
            <p className="text-lg font-bold text-slate-500 mb-6">Page Not Found</p>

            <p className="text-sm text-slate-500 font-medium mb-2 leading-relaxed">
              お探しのページは移動または削除された可能性があります。
              下のリンクからお探しください。
            </p>
            <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">
              The page may have been moved or removed. Try one of the links below.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {LINKS.map(({ href, ja, en }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center justify-center gap-0.5 px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-700">{ja}</span>
                  <span className="text-[11px] font-medium text-slate-400">{en}</span>
                </Link>
              ))}
            </div>

            <Link
              href="/en"
              className="text-xs font-bold text-slate-500 underline underline-offset-4 hover:text-slate-700"
            >
              English version
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

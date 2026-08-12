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
  title: 'Page Not Found / ページが見つかりません | Honor of Kings Hub',
  // 404 は検索結果に載せる必要がないため、明示的に除外する
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: '/en', en: 'Home', ja: 'トップページ' },
  { href: '/en/heroes', en: 'Heroes', ja: 'ヒーロー一覧' },
  { href: '/en/tier-list', en: 'Tier List', ja: 'Tier表' },
  { href: '/en/guide', en: 'Beginner Guide', ja: '初心者ガイド' },
];

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <main className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md w-full">
            <p className="text-7xl font-black text-slate-300 mb-4">404</p>

            <h1 className="text-2xl font-black text-slate-800 mb-2">
              Page Not Found
            </h1>
            <p className="text-lg font-bold text-slate-500 mb-6">ページが見つかりません</p>

            <p className="text-sm text-slate-500 font-medium mb-2 leading-relaxed">
              The page may have been moved or removed. Try one of the links below.
            </p>
            <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">
              お探しのページは移動または削除された可能性があります。
              下のリンクからお探しください。
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {LINKS.map(({ href, ja, en }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center justify-center gap-0.5 px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-700">{en}</span>
                  <span className="text-[11px] font-medium text-slate-400">{ja}</span>
                </Link>
              ))}
            </div>

            <Link
              href="/ja"
              className="text-xs font-bold text-slate-500 underline underline-offset-4 hover:text-slate-700"
            >
              日本語版
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

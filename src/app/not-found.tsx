import './globals.css';
import { NotFoundLinks } from '@/components/NotFoundLinks';

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

            {/* /ja 配下から来た場合は日本語主体のリンクに切り替わる */}
            <NotFoundLinks />
          </div>
        </main>
      </body>
    </html>
  );
}

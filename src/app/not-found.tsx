import './globals.css';
import { NotFoundLinks } from '@/components/NotFoundLinks';

// サイト全体の404。/ja・/en 配下の未知のURLもここが出る
// （[locale]/[...rest] の notFound() が最終的にこのファイルへ落ちる。
// 以前は [locale]/not-found.tsx も置いていたが一度も描画されず、削除した）。
//
// ここはロケール層の外側なので、自前で <html>/<body> を持ち、
// next-intl のプロバイダにも依存しない形で書く必要がある。
// 訪問者の言語が確定できないため日英を併記する。
//
// title は absolute で置く。[locale]/layout.tsx が子ルートへ
// 「%s | Honor of Kings Hub」というテンプレートを渡しており、
// 素の文字列にすると屋号が2回付く。
// robots は書かない。Next.js が not-found へ noindex を自動で付けるため、
// ここで足すと meta robots が2本並ぶだけになる（follow は指定なしの既定値）
export const metadata = {
  title: { absolute: 'Page Not Found / ページが見つかりません | Honor of Kings Hub' },
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
            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
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

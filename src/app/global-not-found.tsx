import './globals.css';
import { NotFoundBody } from '@/components/NotFoundBody';

// サイト全体の404。next.config.ts の experimental.globalNotFound で有効になる。
//
// これを入れる前の404は <html id="__next_error__"> というエラーシェルで、
// サーバーが返すHTMLの可視テキストは <title> の57文字だけだった。
// 「Page Not Found」も復帰リンクも RSC ペイロードの中にしか無く、
// JavaScript を実行しないクローラーと読者には空白のページが届いていた。
//
// ここはロケール層の外側なので、自前で <html>/<body> を持ち、
// next-intl のプロバイダにも依存しない形で書く。
// 訪問者の言語が確定できないため日英を併記する。
//
// title は absolute で置く。[locale]/layout.tsx が子ルートへ
// 「%s | Honor of Kings Hub」というテンプレートを渡しており、
// 素の文字列にすると屋号が2回付く。
// robots は書かない。Next.js が404へ noindex を自動で付けるため、
// ここで足すと meta robots が2本並ぶだけになる（follow は指定なしの既定値）。
// canonical も書かない。dce7f7b（2026-08-29）で「404が canonical=トップを返す」
// のを直したばかりで、[locale]/layout.tsx の alternates を戻すと再発する。
export const metadata = {
  title: { absolute: 'Page Not Found / ページが見つかりません | Honor of Kings Hub' },
};

export default function GlobalNotFound() {
  return (
    // lang は en 固定。サーバー側では訪問者の言語が分からず、
    // 日英を併記しているので、どちらか一方を名乗るならページの
    // 最初の見出し（Page Not Found）に合わせる
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <NotFoundBody />
      </body>
    </html>
  );
}

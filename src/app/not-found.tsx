import './globals.css';
import { NotFoundBody } from '@/components/NotFoundBody';

// 404の予備。実際に描画されるのは src/app/global-not-found.tsx で、
// next.config.ts の experimental.globalNotFound がそちらを選ぶ。
//
// このファイルを残すのは、そのフラグが将来失われたときの落とし先にするため。
// 両方を置いた状態でビルドしても競合せず、出力も同じになることを確認済み。
// 本文は NotFoundBody に置いて二重管理を避けている。
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
        <NotFoundBody />
      </body>
    </html>
  );
}

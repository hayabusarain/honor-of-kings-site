import { NotFoundLinks } from '@/components/NotFoundLinks';

/**
 * 404の本文。global-not-found.tsx と not-found.tsx の両方から使う。
 *
 * この2つは同じ画面を出すが、Next.js の中での立ち位置が違う。
 * global-not-found.tsx は experimental.globalNotFound が有効なときに使われ、
 * ロケールレイアウトを迂回してサーバー側でHTMLを組み立てる。
 * not-found.tsx はそのフラグが将来失われたときの落とし先として残してある。
 * 本文をここに置いて、二重管理にしない。
 *
 * 訪問者の言語はサーバー側では確定できない（ロケール層の外側なので
 * headers() も使えない）。そのため日英を併記し、リンクだけを
 * NotFoundLinks がクライアント側の location.pathname で切り替える。
 */
export function NotFoundBody() {
  return (
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
  );
}

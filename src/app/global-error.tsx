'use client';

import './globals.css';
import { useEffect } from 'react';
import { NotFoundLinks } from '@/components/NotFoundLinks';

/**
 * ルートレイアウト自体が壊れたときの最後の砦となる 500 画面。
 *
 * ここは [locale]/layout.tsx（＝ルートレイアウト兼任）の外側で描画されるため、
 * 自前で <html>/<body> を持つ必要があり、next-intl のプロバイダにも依存できない。
 * 訪問者の言語が確定できないので、not-found.tsx と同じ日英併記方式にする。
 * 復帰リンクは NotFoundLinks を流用する（/ja 配下なら日本語主体に切り替わる）。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // digest はサーバーログと突き合わせるためのキー。画面には出さずコンソールに残す
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-slate-900 antialiased">
        <main className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md w-full">
            {/* 飾りの数字は 404 と同じ brand-400（slate-300 は夜の配色で 2.17:1） */}
            <p className="text-7xl font-black text-brand-400 mb-4">500</p>

            <h1 className="text-2xl font-black text-slate-800 mb-2">
              Something Went Wrong
            </h1>
            <p className="text-lg font-bold text-slate-500 mb-6">エラーが発生しました</p>

            <p className="text-sm text-slate-500 font-medium mb-2 leading-relaxed">
              An unexpected error occurred. Try again, or use one of the links below.
            </p>
            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
              予期しないエラーが発生しました。再試行するか、下のリンクからお進みください。
            </p>

            {/* 以前は墨の塗り（slate-900 の地に白文字）。夜の配色では白く光るので、金の線のボタンにした */}
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center justify-center px-8 mb-8 border border-brand-700 bg-brand-50 text-brand-700 text-sm font-bold rounded-2xl hover:bg-brand-100 active:scale-95 transition-all"
            >
              Try Again / 再試行
            </button>

            <NotFoundLinks />
          </div>
        </main>
      </body>
    </html>
  );
}

'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

/**
 * [locale] 配下のページで例外が起きたときの 500 画面。
 *
 * ここは [locale]/layout.tsx の内側で差し替え描画されるため、
 * NextIntlClientProvider が生きており useLocale で言語を確定できる
 * （ロケール層の外で出る 404 と違い、日英併記にしない）。
 * デザインとリンク構成は not-found.tsx / NotFoundLinks.tsx に合わせる。
 */

const LINKS = [
  { path: '/', ja: 'トップページ', en: 'Home' },
  { path: '/heroes', ja: 'ヒーロー一覧', en: 'Heroes' },
  { path: '/tier-list', ja: 'Tier表', en: 'Tier List' },
  { path: '/guide', ja: '初心者ガイド', en: 'Beginner Guide' },
] as const;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isJa = locale === 'ja';

  useEffect(() => {
    // digest はサーバーログと突き合わせるためのキー。画面には出さずコンソールに残す
    console.error(error);
  }, [error]);

  // MobileAppShell 側にすでに <main> があるため、ここは div にして main の二重化を避ける。
  // 背景色は外枠が同じ slate-50 なので付けない
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md w-full">
        <p className="text-7xl font-black text-slate-300 mb-4">500</p>

        <h1 className="text-2xl font-black text-slate-800 mb-2">
          {isJa ? 'エラーが発生しました' : 'Something Went Wrong'}
        </h1>

        <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
          {isJa
            ? '一時的な不具合の可能性があります。再試行するか、下のリンクから他のページをご覧ください。'
            : 'This may be a temporary glitch. Try again, or head to one of the pages below.'}
        </p>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center px-8 py-3 mb-8 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-md hover:bg-slate-700 active:scale-95 transition-all"
        >
          {isJa ? '再試行する' : 'Try Again'}
        </button>

        <div className="grid grid-cols-2 gap-3">
          {LINKS.map(({ path, ja, en }) => (
            <Link
              key={path}
              href={path}
              className="flex flex-col items-center justify-center gap-0.5 px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors"
            >
              <span className="text-sm font-bold text-slate-700">{isJa ? ja : en}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';

/**
 * 404ページの復帰リンク。
 *
 * この404はロケール層の外側で描画されるため、サーバー側では訪問者の言語が
 * 分からない（not-found.tsx では headers() も使えない）。リクエストパスには
 * /ja が含まれるので、クライアント側で location.pathname を見てリンク先を
 * 切り替える。従来は4リンクすべて /en 固定で、/ja のページを踏み外した
 * 日本語読者への導線が最下部のテキストリンク1本しかなかった。
 */

const LINKS = [
  { path: '', en: 'Home', ja: 'トップページ' },
  { path: '/heroes', en: 'Heroes', ja: 'ヒーロー一覧' },
  { path: '/tier-list', en: 'Tier List', ja: 'Tier表' },
  { path: '/guide', en: 'Beginner Guide', ja: '初心者ガイド' },
];

// パスは404の表示中に変わらないので、購読は何もしない
const subscribe = () => () => {};
// 前方一致だけだと /javascript.html のようなパスも日本語判定になる
const readIsJa = () => {
  const p = window.location.pathname;
  return p === '/ja' || p.startsWith('/ja/');
};

export function NotFoundLinks() {
  // SSRでは言語が分からないので /en（false）を出し、ハイドレーション後に実際のパスで判定する。
  // useEffect + setState でも同じことはできるが、描画を2回に分ける必要がないため
  // useSyncExternalStore で読む（サーバー用スナップショットが SSR の値になる）
  const isJa = useSyncExternalStore(subscribe, readIsJa, () => false);
  const prefix = isJa ? '/ja' : '/en';

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {LINKS.map(({ path, ja, en }) => (
          <Link
            key={path}
            href={`${prefix}${path}`}
            className="flex flex-col items-center justify-center gap-0.5 px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors"
          >
            {/* 日本語のURLから来た人には日本語を主に出す */}
            <span className="text-sm font-bold text-slate-700">{isJa ? ja : en}</span>
            <span className="text-[11px] font-medium text-slate-400">{isJa ? en : ja}</span>
          </Link>
        ))}
      </div>

      <Link
        href={isJa ? '/en' : '/ja'}
        className="text-xs font-bold text-slate-500 underline underline-offset-4 hover:text-slate-700"
      >
        {isJa ? 'English version' : '日本語版'}
      </Link>
    </>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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

export function NotFoundLinks() {
  // SSRでは /en を出し、/ja 配下と分かった時点で差し替える
  const [prefix, setPrefix] = useState('/en');
  const [isJa, setIsJa] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith('/ja')) {
      setPrefix('/ja');
      setIsJa(true);
    }
  }, []);

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

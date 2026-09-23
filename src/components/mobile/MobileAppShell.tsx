"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { TabBar } from "./TabBar";
import { AppBar } from "./AppBar";
import { Sidebar } from "../layout/Sidebar";
import { Footer } from "../layout/Footer";
import dynamic from "next/dynamic";

// 検索モーダルはヒーロー・アイテム・パッチの JSON を計 286KB 抱えている。
// このシェルは全ページを包むので、静的に import すると全ページの JS に載る。
// 検索を開いたときに初めて取りに行かせる
const GlobalSearchModal = dynamic(
  () => import("../search/GlobalSearchModal").then((m) => m.GlobalSearchModal),
  { ssr: false }
);

interface MobileAppShellProps {
  children: React.ReactNode;
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const locale = useLocale();

  // ⌘K / Ctrl+K で検索を開く（UIに⌘Kバッジがあるのに開くトリガーが未実装だった）。
  // 閉じる側は GlobalSearchModal 内のリスナーが担当する
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex w-full mx-auto min-h-[100dvh] bg-background text-slate-900 selection:bg-blue-100">
      {/* キーボードだけで読む人向けの飛ばしリンク。これが無いと、
          サイドバー14項目とAppBarを毎ページ Tab で通過しないと本文に入れない。
          文言はロケールで出し分ける。ハードコードするとENページに日本語が出て、
          スモークの日本語漏れ検査にも落ちる */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-900 focus:shadow-lg focus:outline-2 focus:outline-brand-700"
      >
        {locale === 'ja' ? '本文へskip' : 'Skip to content'}
      </a>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-40 bg-white border-r border-slate-200">
        <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />
      </aside>

      {/* Main Content Area。
          overflow-x は hidden ではなく clip。hidden は overflow-y を auto に
          計算させてスクロールコンテナを作るので、中の sticky がビューポートでは
          なくこの箱に貼り付き、AppBar もページ内の見出しも1つも効かなくなる。
          clip はコンテナを作らないので、横溢れの防御はそのままに sticky が戻る。
          この overflow-x は初期コミット cd8cd02 由来で、以降の改修でも
          理由が書かれないまま引き継がれていた */}
      <div className="flex-1 flex flex-col relative w-full overflow-x-clip md:pl-64">
        {/* Mobile App Bar。ラッパで包まないこと。sticky は親のボックスから
            出られないので、高さ56pxの箱に入れると画面外へ流れていく。
            md:hidden は header 自身に付けてある */}
        <AppBar onOpenSearch={() => setIsSearchOpen(true)} />
        
        <main id="main-content" className="flex-1 flex flex-col pb-20 md:pb-0">
          <div className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6">
            {children}
          </div>
          <Footer />
        </main>

        {/* Mobile Tab Bar */}
        <div className="md:hidden">
          <TabBar />
        </div>
      </div>

      {/* Global Search Modal
          開くまで描画しない。常に置いておくと dynamic import の意味が無くなる */}
      {isSearchOpen && (
        <GlobalSearchModal
          isOpen
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { TabBar } from "./TabBar";
import { AppBar } from "./AppBar";
import { Sidebar } from "../layout/Sidebar";
import { Footer } from "../layout/Footer";
import { ThemeProvider } from "../theme/ThemeProvider";
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
    <ThemeProvider>
      <div className="flex w-full mx-auto min-h-[100dvh] bg-slate-50 text-slate-900 selection:bg-blue-100 transition-colors">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-50 bg-white border-r border-slate-200">
          <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative w-full overflow-x-hidden md:pl-64">
          {/* Mobile App Bar */}
          <div className="md:hidden">
            <AppBar onOpenSearch={() => setIsSearchOpen(true)} />
          </div>
          
          <main className="flex-1 flex flex-col pb-20 md:pb-0">
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
    </ThemeProvider>
  );
}

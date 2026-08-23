"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { Home, Users, ShoppingBag, Trophy, Menu, X, FileText, Zap, Hexagon, BookOpen, Link2, Swords, Compass, Calculator, BarChart3, TrendingUp, SlidersHorizontal } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import dataFreshness from "@/data/data_freshness.json";

export function TabBar() {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 再訪時、前回見たときからサイトが更新されていたらメニューボタンに赤点を出す。
  // SSRの初期HTMLと食い違わないよう、初期値は false 固定で useEffect でのみ true にする
  const [hasNewUpdate, setHasNewUpdate] = useState(false);

  useEffect(() => {
    // localStorage はレンダー中に触れない（SSR不一致になる）ため必ずここで読む
    try {
      const seen = localStorage.getItem("hok_last_seen_update");
      if (seen === null) {
        // 初回訪問は基準日を記録するだけ。次の更新から光らせる
        localStorage.setItem("hok_last_seen_update", dataFreshness.site.lastUpdated);
      } else if (seen < dataFreshness.site.lastUpdated) {
        // localStorage という外部状態を初回マウント時に1回だけ読み取る用途。
        // SSR不一致を避けるため初期stateには入れられず、ここで同期する以外にない
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasNewUpdate(true);
      }
    } catch {
      // プライベートブラウズ等で localStorage が使えない環境ではバッジを出さない
    }
  }, []);

  // メニューを閉じた時点で「見た」ことにしてバッジを消す。開いている間は
  // バッジと下の案内文を出したままにして、何が光っていたのかを確認できるようにする。
  // どこから閉じても（×・背景・ESC・リンク遷移）通るよう、開閉 state の cleanup で行う
  useEffect(() => {
    if (!isMenuOpen) return;
    return () => {
      try {
        localStorage.setItem("hok_last_seen_update", dataFreshness.site.lastUpdated);
      } catch {
        // 保存できなくても表示上のバッジだけは消す
      }
      setHasNewUpdate(false);
    };
  }, [isMenuOpen]);

  const menuLabel = hasNewUpdate
    ? (locale === 'ja' ? 'メニュー（前回訪問後に更新あり）' : 'Menu (updated since your last visit)')
    : t("menu");

  // 試合中に引くのはアイテムなので固定タブに出す。
  // 月1更新のパッチノートをここに置いていたのを入れ替えた
  const navItems = [
    { href: "/", icon: Home, label: t("home") },
    { href: "/heroes", icon: Users, label: t("heroes") },
    { href: "/items", icon: ShoppingBag, label: locale === 'ja' ? 'アイテム' : 'Items' },
    { href: "/tier-list", icon: Trophy, label: t("tierList") },
  ];

  const menuItems = [
    { href: "/guide", icon: BookOpen, label: t("guide") },
    { href: "/guide/bosses", icon: Swords, label: locale === 'ja' ? 'ボス攻略' : 'Bosses' },
    { href: "/guide/macro", icon: Compass, label: locale === 'ja' ? 'レーン別の立ち回り' : 'Macro by Lane' },
    { href: "/patches", icon: FileText, label: t("dashboard") },
    { href: "/spells", icon: Zap, label: locale === 'ja' ? 'サモナースペル' : 'Spells' },
    { href: "/arcana", icon: Hexagon, label: locale === 'ja' ? 'アルカナ一覧' : 'Arcana' },
    { href: "/heroes/stats", icon: BarChart3, label: locale === 'ja' ? '基本ステータス比較' : 'Base Stat Rankings' },
    { href: "/items/usage", icon: TrendingUp, label: locale === 'ja' ? 'アイテム採用率' : 'Item Pick Rates' },
    { href: "/items/simulator", icon: SlidersHorizontal, label: locale === 'ja' ? '装備シミュレータ' : 'Build Simulator' },
    { href: "/arcana/calculator", icon: Calculator, label: locale === 'ja' ? 'アルカナ計算機' : 'Arcana Calculator' },
  ];

  // 完全一致だと /heroes/lian-po のような詳細ページで、タブが4つとも無点灯になる
  const allHrefs = [...navItems, ...menuItems].map((i) => i.href);
  const isCurrent = (href: string) => {
    if (href === '/') return pathname === '/';
    if (pathname === href) return true;
    if (!pathname.startsWith(href + '/')) return false;
    return !allHrefs.some((o) => o !== href && o.startsWith(href + '/') && (pathname === o || pathname.startsWith(o + '/')));
  };

  // ESC でメニューを閉じる（検索モーダルと同じ挙動に揃える）
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end md:w-full md:max-w-md md:left-auto md:right-auto mx-auto transition-opacity">
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("menu")}
            className="bg-white rounded-t-3xl shadow-2xl p-6 pb-28 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-800">{t("menu")}</h2>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                aria-label="メニューを閉じる"
                className="p-2 bg-slate-100 active:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 赤点の意味を文字でも伝える。メニューを閉じると既読になり、次回は出ない */}
            {hasNewUpdate && (
              <p role="status" className="-mt-3 mb-5 text-[11px] font-bold text-rose-600 flex items-center gap-1.5">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                {locale === 'ja'
                  ? `前回の訪問後にサイトが更新されました（最終更新 ${dataFreshness.site.lastUpdated}）`
                  : `The site has been updated since your last visit (last updated ${dataFreshness.site.lastUpdated})`}
              </p>
            )}

            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-transform"
                  >
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
                      <Icon size={24} className="text-brand-600" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Legal / Settings Links */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap justify-center gap-x-6 gap-y-3 px-4">
              <Link href="/legal" onClick={() => setIsMenuOpen(false)} className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                {t("legal")}
              </Link>
              <Link href="/privacy" onClick={() => setIsMenuOpen(false)} className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                {t("privacy")}
              </Link>
              <Link href="/terms" onClick={() => setIsMenuOpen(false)} className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                {t("terms")}
              </Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                {t("contact")}
              </Link>
            </div>
            
            {/* Added Links Page */}
            <div className="mt-4 px-4">
              <Link href="/links" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 w-full p-3 bg-brand-50 text-brand-600 rounded-xl font-bold text-sm hover:bg-brand-100 transition-colors">
                <Link2 size={16} />
                {t("links") || "リンク集"}
              </Link>
            </div>
            
            <div className="mt-6 px-4">
              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                {t("legalText")}
              </p>
              <p className="text-[10px] text-slate-500 text-center font-bold mt-3">
                {t("footer")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-slate-200 pb-safe md:w-full md:max-w-md md:left-auto md:right-auto mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <nav className="flex items-center justify-around h-[65px] px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isCurrent(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => setIsMenuOpen(false)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "fill-brand-50" : ""} />
                <span className={`text-[10px] leading-none tracking-tight ${isActive ? 'font-black' : 'font-semibold'}`}>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={menuLabel}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isMenuOpen ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <span className="relative">
              <Menu size={24} strokeWidth={isMenuOpen ? 2.5 : 2} className={isMenuOpen ? "fill-brand-50" : ""} />
              {/* 前回訪問より後にサイトが更新されていることを示す赤点 */}
              {hasNewUpdate && (
                <span aria-hidden="true" className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </span>
            <span className={`text-[10px] leading-none tracking-tight ${isMenuOpen ? 'font-black' : 'font-semibold'}`}>{t("menu")}</span>
          </button>
        </nav>
      </div>
    </>
  );
}

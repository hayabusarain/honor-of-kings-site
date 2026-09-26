"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Home, Users, Trophy, FileText, BookOpen, Info, Search, ShoppingBag, Hexagon, Languages, Zap, Swords, Calculator, BarChart3, TrendingUp, SlidersHorizontal, Sprout } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { SELECTED } from "@/components/common/tones";

interface SidebarProps {
  onOpenSearch?: () => void;
}

export function Sidebar({ onOpenSearch }: SidebarProps) {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const nextLocale = locale === 'ja' ? 'en' : 'ja';
    // next-intl の usePathname はクエリを含まない。そのまま渡すと
    // /items?item=1137 で切り替えたときに開いていた詳細が閉じてしまう（AppBar と同じ対処）
    const search = typeof window !== 'undefined' ? window.location.search : '';
    router.replace(`${pathname}${search}`, { locale: nextLocale });
  };

  const navItems = [
    { href: "/", icon: Home, label: t("home") },
    { href: "/heroes", icon: Users, label: t("heroes") },
    { href: "/items", icon: ShoppingBag, label: locale === 'ja' ? 'アイテム一覧' : 'Items' },
    { href: "/spells", icon: Zap, label: locale === 'ja' ? 'サモナースペル' : 'Spells' },
    { href: "/arcana", icon: Hexagon, label: locale === 'ja' ? 'アルカナ一覧' : 'Arcana' },
    { href: "/patches", icon: FileText, label: t("dashboard") },
    { href: "/tier-list", icon: Trophy, label: t("tierList") },
  ];

  // ボス攻略とマクロ解説はガイドページ内のカードからしか入口が無かった。
  // 湧き時間は検索需要が大きいので、ナビから直接開けるようにする
  const menuItems = [
    { href: "/guide", icon: BookOpen, label: t("guide") },
    { href: "/guide/bosses", icon: Swords, label: locale === 'ja' ? 'ボス攻略' : 'Bosses' },
    { href: "/heroes/stats", icon: BarChart3, label: locale === 'ja' ? '基本ステータス比較' : 'Base Stat Rankings' },
    { href: "/items/usage", icon: TrendingUp, label: locale === 'ja' ? 'アイテム採用率' : 'Item Pick Rates' },
    { href: "/items/simulator", icon: SlidersHorizontal, label: locale === 'ja' ? '装備シミュレータ' : 'Build Simulator' },
    { href: "/arcana/calculator", icon: Calculator, label: locale === 'ja' ? 'アルカナ計算機' : 'Arcana Calculator' },
    // 「最初にどのヒーローを選ぶか」はガイド内のカードからしか入口が無かった
    { href: "/guide/beginner-heroes", icon: Sprout, label: locale === 'ja' ? '最初に選ぶヒーロー' : 'Heroes to Start With' },
    // /links から /about に差し替えた。データの出どころと検証範囲は
    // 運営者が誰でどう作っているかを外から確かめる入口で、こちらのほうが要る。
    // /links ページ自体は残してある（フッターから入れる）
    { href: "/about", icon: Info, label: locale === 'ja' ? 'このサイトについて' : 'About this site' },
  ];

  // 完全一致だと /heroes/lian-po のような詳細ページで何も光らず、
  // サイト内で最も見られる階層でナビが現在地を示せていなかった。
  // /guide と /guide/bosses のような親子は、より深い方だけをアクティブにする
  const allHrefs = [...navItems, ...menuItems].map((i) => i.href);
  const isCurrent = (href: string) => {
    if (href === '/') return pathname === '/';
    if (pathname === href) return true;
    if (!pathname.startsWith(href + '/')) return false;
    return !allHrefs.some((o) => o !== href && o.startsWith(href + '/') && (pathname === o || pathname.startsWith(o + '/')));
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pt-6 px-4 pb-6 scrollbar-hide">
      {/* Brand Header — 玉璽ワードマーク: Hub のみ金、FAN SITE 常時表記で誤認防止 */}
      <div className="px-2 mb-6 flex shrink-0 items-center justify-between">
        {/* ロゴは h1 にしない。各ページ本体に主題の h1 があり、見出しジャンプで
            毎ページ「HoK Hub」に着地してしまうため */}
        {/* 印は金の線にする（夜の配色、2026-09-26）。金の塗りは Tier S のバッジだけに残す */}
        <div className="text-xl font-serif font-bold text-slate-800 tracking-wide flex items-center gap-2">
          <div className="w-8 h-8 border border-brand-500 bg-brand-50 rounded-lg flex items-center justify-center">
            <Trophy size={18} className="text-brand-700" />
          </div>
          <span className="flex flex-col leading-none">
            <span>HoK <em className="not-italic text-brand-700">Hub</em></span>
            {/* 10px から 14px に上げた（文字は 14px 以上の方針）。字間は 0.22em だと幅を取りすぎるので詰めた */}
            <span className="text-sm font-sans font-bold tracking-wider text-slate-500 mt-1">FAN SITE</span>
          </span>
        </div>
        
        {/* Language Switcher */}
        <button
          onClick={toggleLocale}
          className="flex h-11 items-center gap-1.5 px-3 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-slate-700 text-sm font-bold transition-colors"
          title={locale === 'ja' ? 'English に切り替え' : 'Switch to Japanese'}
          aria-label={locale === 'ja' ? '言語切り替え' : 'Switch language'}
        >
          <Languages size={15} className="text-brand-700" />
          <span>{locale === 'ja' ? 'EN' : 'JA'}</span>
        </button>
      </div>

      {/* Global Search Button Trigger。
          サイドバーは高さの決まった flex の縦並びで、項目が画面に収まらないと子が縮む。
          shrink-0 が無いと h-11 を付けても約24px に潰れた（1280×900 で実測） */}
      {onOpenSearch && (
        <button
          onClick={onOpenSearch}
          aria-label={locale === 'ja' ? '検索モーダルを開く' : 'Open search modal'}
          className="w-full mb-6 flex h-11 shrink-0 items-center justify-between px-3 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 transition-colors group"
        >
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            <Search size={16} className="text-slate-400 group-hover:text-brand-700 transition-colors" />
            <span>{locale === 'ja' ? '検索・探す...' : 'Search...'}</span>
          </div>
          <kbd className="text-sm font-bold leading-none px-1.5 py-1 rounded bg-white text-slate-600 border border-slate-200">
            ⌘K
          </kbd>
        </button>
      )}

      <nav
        aria-label={locale === 'ja' ? 'サイト内ナビゲーション' : 'Site navigation'}
        className="flex-1 space-y-8"
      >
        <div>
          <div className="px-3 mb-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Main
          </div>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrent(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex min-h-11 items-center gap-3 px-3 py-2 rounded-xl border transition-colors ${
                      isActive
                        ? `${SELECTED} font-bold`
                        : "border-transparent text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-brand-700" : "text-slate-400"} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className="px-3 mb-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Resources
          </div>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrent(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex min-h-11 items-center gap-3 px-3 py-2 rounded-xl border transition-colors ${
                      isActive
                        ? `${SELECTED} font-bold`
                        : "border-transparent text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-brand-700" : "text-slate-400"} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="mt-auto pt-6">
        {/* 11px の文字だけのリンク（高さ約16px）だったので、14px・高さ44px にした。
            行の間はリンク自身の高さで取るので gap-y は付けない */}
        <div className="flex flex-wrap gap-x-4 px-3 text-sm font-semibold text-slate-500">
          <Link href="/legal" className="inline-flex min-h-11 items-center hover:text-slate-700 transition-colors">{t("legal")}</Link>
          <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-slate-700 transition-colors">{t("privacy")}</Link>
          <Link href="/terms" className="inline-flex min-h-11 items-center hover:text-slate-700 transition-colors">{t("terms")}</Link>
          <Link href="/contact" className="inline-flex min-h-11 items-center hover:text-slate-700 transition-colors">{t("contact")}</Link>
        </div>
        <p className="px-3 mt-2 text-sm text-slate-500 font-bold">
          {t("footer")}
        </p>
      </div>
    </div>
  );
}

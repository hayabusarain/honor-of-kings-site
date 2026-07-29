"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Home, Users, Trophy, FileText, BookOpen, Link2, Search, ShoppingBag, Hexagon, Languages } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

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
    router.replace(pathname, { locale: nextLocale });
  };

  const navItems = [
    { href: "/", icon: Home, label: t("home") },
    { href: "/heroes", icon: Users, label: t("heros") },
    { href: "/items", icon: ShoppingBag, label: locale === 'ja' ? 'アイテム一覧' : 'Items' },
    { href: "/arcana", icon: Hexagon, label: locale === 'ja' ? 'アルカナ一覧' : 'Arcana' },
    { href: "/patches", icon: FileText, label: t("dashboard") },
    { href: "/tier-list", icon: Trophy, label: t("tierList") },
  ];

  const menuItems = [
    { href: "/guide", icon: BookOpen, label: t("guide") },
    { href: "/links", icon: Link2, label: t("links") || "リンク集" },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto pt-6 px-4 pb-6 scrollbar-hide">
      {/* Brand Header */}
      <div className="px-2 mb-6 flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xs">
            <Trophy size={18} className="text-white" />
          </div>
          HoK Hub
        </h1>
        
        {/* Language Switcher */}
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs"
          title={locale === 'ja' ? 'Englishに切替' : 'Switch to Japanese'}
        >
          <Languages size={15} className="text-indigo-600" />
          <span>{locale === 'ja' ? 'EN' : 'JA'}</span>
        </button>
      </div>

      {/* Global Search Button Trigger */}
      {onOpenSearch && (
        <button
          onClick={onOpenSearch}
          className="w-full mb-6 flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/80 transition-colors shadow-xs group"
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <Search size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span>検索・探す...</span>
          </div>
          <kbd className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-400 border border-slate-200">
            ⌘K
          </kbd>
        </button>
      )}

      <nav className="flex-1 space-y-8">
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Main
          </div>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Resources
          </div>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="mt-auto pt-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2 px-3 text-[11px] font-semibold text-slate-400">
          <Link href="/legal" className="hover:text-slate-600 transition-colors">{t("legal")}</Link>
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">{t("privacy")}</Link>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">{t("terms")}</Link>
          <Link href="/contact" className="hover:text-slate-600 transition-colors">{t("contact")}</Link>
        </div>
        <p className="px-3 mt-4 text-[10px] text-slate-400 font-bold">
          {t("footer")}
        </p>
      </div>
    </div>
  );
}

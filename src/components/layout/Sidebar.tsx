"use client";

import { Link, usePathname } from "@/i18n/routing";
import { Home, Users, Trophy, FileText, BookOpen, Link2, Search, ShoppingBag, Hexagon } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface SidebarProps {
  onOpenSearch?: () => void;
}

export function Sidebar({ onOpenSearch }: SidebarProps) {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const pathname = usePathname();

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
    <div className="flex flex-col h-full overflow-y-auto pt-6 px-4 pb-6 scrollbar-hide dark:bg-slate-900 dark:border-slate-800">
      {/* Brand Header */}
      <div className="px-2 mb-6 flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xs">
            <Trophy size={18} className="text-white" />
          </div>
          HoK Hub
        </h1>
        <ThemeToggle />
      </div>

      {/* Global Search Button Trigger */}
      {onOpenSearch && (
        <button
          onClick={onOpenSearch}
          className="w-full mb-6 flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 transition-colors shadow-xs group"
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <Search size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            <span>検索・探す...</span>
          </div>
          <kbd className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
            ⌘K
          </kbd>
        </button>
      )}

      <nav className="flex-1 space-y-8">
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
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
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold"
                        : "text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
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
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold"
                        : "text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="mt-auto pt-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2 px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          <Link href="/legal" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{t("legal")}</Link>
          <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{t("privacy")}</Link>
          <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{t("terms")}</Link>
          <Link href="/contact" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{t("contact")}</Link>
        </div>
        <p className="px-3 mt-4 text-[10px] text-slate-400 dark:text-slate-600 font-bold">
          {t("footer")}
        </p>
      </div>
    </div>
  );
}

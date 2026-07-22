"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Languages, Search } from "lucide-react";
import { ThemeToggle } from "../theme/ThemeToggle";

interface AppBarProps {
  onOpenSearch?: () => void;
}

export function AppBar({ onOpenSearch }: AppBarProps) {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'ja' ? 'en' : 'ja';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 h-14 flex items-center justify-between px-4 transition-colors">
      <div className="flex items-center gap-2">
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            aria-label="Open Search"
          >
            <Search size={18} />
          </button>
        )}
      </div>

      <h1 className="font-bold text-base text-slate-800 dark:text-slate-100 tracking-tight text-center flex-1">
        {t("title")}
      </h1>

      <div className="flex items-center gap-1.5">
        <ThemeToggle className="scale-95" />
        <button
          onClick={toggleLocale}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex flex-col items-center justify-center"
          aria-label="Toggle Language"
        >
          <Languages size={16} />
          <span className="text-[8px] font-bold leading-none mt-0.5">{locale === 'ja' ? 'EN' : 'JA'}</span>
        </button>
      </div>
    </header>
  );
}

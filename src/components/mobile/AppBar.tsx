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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 h-14 flex items-center justify-between px-4 transition-colors">
      <div className="flex items-center gap-2">
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Open Search"
          >
            <Search size={18} />
          </button>
        )}
      </div>

      {/* 玉璽ワードマーク: Hub のみ金で独自ブランドを強調し、
          FAN SITE 表記を常時表示して公式との誤認を防ぐ */}
      <h1 className="font-serif font-bold text-base text-slate-800 tracking-wide text-center flex-1 flex flex-col items-center leading-none">
        <span>
          Honor of Kings <em className="not-italic text-brand-600">Hub</em>
        </span>
        <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-slate-400 mt-0.5">
          {locale === 'ja' ? '非公式ファンサイト' : 'UNOFFICIAL FAN SITE'}
        </span>
      </h1>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <button
          onClick={toggleLocale}
          className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition-colors flex flex-col items-center justify-center"
          aria-label="Toggle Language"
        >
          <Languages size={16} />
          <span className="text-[10px] font-bold leading-none mt-0.5">{locale === 'ja' ? 'EN' : 'JA'}</span>
        </button>
      </div>
    </header>
  );
}

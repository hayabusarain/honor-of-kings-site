"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Languages } from "lucide-react";

export function AppBar() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const toggleLocale = () => {
    const nextLocale = locale === 'ja' ? 'en' : 'ja';
    router.replace(pathname, { locale: nextLocale });
  };
  
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 h-14 flex items-center justify-between px-4">
      <div className="w-10 flex justify-start"></div>
      
      <h1 className="font-bold text-base text-slate-800 tracking-tight text-center flex-1">
        {t("title")}
      </h1>

      <div className="w-10 flex justify-end">
        <button 
          onClick={toggleLocale}
          className="p-2 -mr-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex flex-col items-center justify-center"
          aria-label="Toggle Language"
        >
          <Languages size={18} />
          <span className="text-[9px] font-bold leading-none mt-0.5">{locale === 'ja' ? 'EN' : 'JA'}</span>
        </button>
      </div>
    </header>
  );
}

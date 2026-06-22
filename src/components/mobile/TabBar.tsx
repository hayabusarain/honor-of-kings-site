"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { Home, Users, ShoppingBag, Trophy, Menu, X, FileText, Calculator, Zap, Hexagon, BookOpen, Map, HelpCircle, Swords } from "lucide-react";
import { useTranslations } from "next-intl";

export function TabBar() {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", icon: Home, label: t("home") },
    { href: "/heroes", icon: Users, label: t("heros") },
    { href: "/patches", icon: FileText, label: t("dashboard") },
    { href: "/tier-list", icon: Trophy, label: t("tierList") },
  ];

  const menuItems = [
    { href: "/guide", icon: BookOpen, label: t("guide") },
  ];

  return (
    <>
      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end md:w-full md:max-w-md md:left-auto md:right-auto mx-auto transition-opacity">
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
          
          <div className="bg-white rounded-t-3xl shadow-2xl p-6 pb-28 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-800">{t("menu")}</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 active:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>

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
                      <Icon size={24} className="text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Legal / Settings Links */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap justify-center gap-x-6 gap-y-3 px-4">
              <Link href="/legal" onClick={() => setIsMenuOpen(false)} className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                {t("legal")}
              </Link>
              <Link href="/privacy" onClick={() => setIsMenuOpen(false)} className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                {t("privacy")}
              </Link>
              <Link href="/terms" onClick={() => setIsMenuOpen(false)} className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                {t("terms")}
              </Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                {t("contact")}
              </Link>
            </div>
            
            <div className="mt-6 px-4">
              <p className="text-[9px] text-slate-400 text-center leading-relaxed">
                {t("legalText")}
              </p>
              <p className="text-[10px] text-slate-400 text-center font-bold mt-3">
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
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => setIsMenuOpen(false)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "fill-indigo-50" : ""} />
                <span className={`text-[10px] leading-none tracking-tight ${isActive ? 'font-black' : 'font-semibold'}`}>{item.label}</span>
              </Link>
            );
          })}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isMenuOpen ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Menu size={24} strokeWidth={isMenuOpen ? 2.5 : 2} className={isMenuOpen ? "fill-indigo-50" : ""} />
            <span className={`text-[10px] leading-none tracking-tight ${isMenuOpen ? 'font-black' : 'font-semibold'}`}>{t("menu")}</span>
          </button>
        </nav>
      </div>
    </>
  );
}

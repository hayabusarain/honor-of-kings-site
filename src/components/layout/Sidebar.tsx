"use client";

import { Link, usePathname } from "@/i18n/routing";
import { Home, Users, Trophy, FileText, BookOpen, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function Sidebar() {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: t("home") },
    { href: "/heroes", icon: Users, label: t("heros") },
    { href: "/patches", icon: FileText, label: t("dashboard") },
    { href: "/tier-list", icon: Trophy, label: t("tierList") },
  ];

  const menuItems = [
    { href: "/guide", icon: BookOpen, label: t("guide") },
    { href: "/links", icon: Link2, label: t("links") || "リンク集" },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto pt-6 px-4 pb-6 scrollbar-hide">
      <div className="px-2 mb-8">
        <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Trophy size={18} className="text-white" />
          </div>
          HoK Hub
        </h1>
      </div>

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

      <div className="mt-auto pt-8">
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

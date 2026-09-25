"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Languages, Search } from "lucide-react";

interface AppBarProps {
  onOpenSearch?: () => void;
}

export function AppBar({ onOpenSearch }: AppBarProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'ja' ? 'en' : 'ja';
    // next-intl の usePathname はクエリを含まない。そのまま渡すと
    // /items?item=1137 で切り替えたときに開いていた詳細が閉じてしまう
    const search = typeof window !== 'undefined' ? window.location.search : '';
    router.replace(`${pathname}${search}`, { locale: nextLocale });
  };

  // md:hidden は header 自身に付ける。ラッパの div に付けて包むと、
  // sticky が高さ56pxの箱から出られず画面外へ流れていく
  // 左右のボタンは 44px 角（以前は検索 34px・言語 約28×40px）。
  // 両脇の箱を同じ w-11 にして、中央のワードマークが画面の真ん中に来るようにする。
  // 外側の余白は px-4 から px-2 に詰め、アイコンの位置はほぼ前のまま
  return (
    <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 h-14 flex items-center justify-between px-2">
      <div className="flex w-11 shrink-0 items-center">
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="flex h-11 w-11 items-center justify-center text-slate-500 hover:text-brand-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label={locale === 'ja' ? '検索を開く' : 'Open search'}
          >
            <Search size={20} />
          </button>
        )}
      </div>

      {/* 玉璽ワードマーク: Hub のみ金で独自ブランドを強調し、
          FAN SITE 表記を常時表示して公式との誤認を防ぐ */}
      {/* ロゴは h1 にしない。各ページ本体に主題の h1 があり、モバイルでは
          見出しジャンプが毎ページ「Honor of Kings Hub」に着地していた */}
      {/* 「非公式」はサイト名の横の金の線の札にする（MLBB Hub と同じ、2026-09-26）。
          以前はサイト名の下に 11px で「非公式ファンサイト」と書いていたが、文字は 14px 未満を使わない方針にした */}
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 leading-none">
        <span className="whitespace-nowrap font-serif text-base font-bold tracking-wide text-slate-800">
          Honor of Kings <em className="not-italic text-brand-700">Hub</em>
        </span>
        <span className="shrink-0 whitespace-nowrap rounded-md border border-brand-500 px-1.5 py-1 font-sans text-sm font-bold leading-none text-brand-700">
          {locale === 'ja' ? '非公式' : 'Unofficial'}
        </span>
      </div>

      <div className="flex w-11 shrink-0 items-center justify-end">
        <button
          onClick={toggleLocale}
          className="flex h-11 w-11 flex-col items-center justify-center text-slate-500 hover:text-brand-700 rounded-lg hover:bg-slate-100 transition-colors"
          // 読み上げ名に、見えている「EN」「JA」を含める（WCAG 2.5.3。音声操作で「EN」と言って押せるように）
          aria-label={locale === 'ja' ? '英語版（EN）に切り替える' : 'Switch to Japanese (JA)'}
        >
          <Languages size={16} />
          <span className="text-sm font-bold leading-none mt-0.5">{locale === 'ja' ? 'EN' : 'JA'}</span>
        </button>
      </div>
    </header>
  );
}

'use client';

import { useState } from 'react';
import { Coffee, ChevronDown, ChevronUp, ExternalLink, ShoppingBag } from 'lucide-react';

import { useLocale } from 'next-intl';

interface AmazonSupportProps {
  compact?: boolean;
  defaultOpen?: boolean;
}

export function AmazonSupport({ compact = false, defaultOpen = true }: AmazonSupportProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const locale = useLocale();

  if (locale === 'en') return null;

  const AMAZON_URL = "https://amzn.to/4pzbECr";

  return (
    <div className={`w-full bg-amber-500/10 border border-amber-500/30 rounded-2xl ${compact ? 'p-3 my-2' : 'p-4 my-4'} transition-all`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Coffee size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              【サイト運営支援のお願い☕】
            </h4>
            <p className="text-[10px] font-semibold text-amber-600">
              (タップして詳細を見る)
            </p>
          </div>
        </div>
        <div className="text-slate-400 group-hover:text-slate-600 transition-colors p-1">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-amber-500/20 text-xs text-slate-700 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* 注意: 「広告を排除」系の文言は AdSense 掲載と矛盾するため使わない */}
          <p className="leading-relaxed text-[11px]">
            当サイトの運営には、サーバー代やデータ更新などの費用がかかっています。広告収入とあわせて、皆さまの応援がサイト継続の支えになっています。
          </p>
          <p className="leading-relaxed text-[11px]">
            もし当サイトを応援していただける場合は、以下のAmazonリンクを経由して普段のお買い物（日用品や飲み物など）をしていただくだけで、売上の一部が還元され、サイトのサーバー維持費となります！
          </p>
          <p className="text-[10px] text-amber-800 font-bold bg-amber-500/15 p-2 rounded-xl border border-amber-500/20 leading-snug">
            ※ユーザーの皆様への追加費用などは一切発生しません。ぜひネットショッピングの際の「入り口」としてご活用ください！
          </p>

          <a
            href={AMAZON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 text-xs text-center mt-1"
          >
            <ShoppingBag size={15} />
            <span>Amazonトップページでお買い物</span>
            <ExternalLink size={13} className="opacity-80" />
          </a>
        </div>
      )}
    </div>
  );
}

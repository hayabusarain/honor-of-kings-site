'use client';

import { History } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { PatchTable } from '@/components/patches/PatchTable';
import dataFreshness from '@/data/data_freshness.json';

export default function PatchesPage() {
  const t = useTranslations('PatchTable');
  const locale = useLocale();
  const isJa = locale === 'ja';
  const src = dataFreshness.patchNotes;

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 sticky top-0 z-20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
          <History className="text-brand-600" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none mb-1">
            Patch Notes
          </h1>
          <p className="text-slate-500 text-[10px] font-bold leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* 出典表記。本文は公式パッチノートの翻訳なので、どこが公式でどこが
            当サイトの解説かを、表を読む前に示しておく */}
        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[11px] font-medium leading-relaxed text-slate-500">
          {isJa ? '変更内容は' : 'The changes themselves are translated from '}
          <a
            href={src.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-600 underline underline-offset-2 hover:text-brand-700"
          >
            {isJa ? src.sourceJa : src.sourceEn}
          </a>
          {isJa
            ? 'を翻訳して掲載しています。「この変更の意味」など、各項目に付けた解説は当サイトによるものです。'
            : '. The commentary added to each entry — “What this change means” and similar — is written by this site.'}
        </p>
        <PatchTable />
      </div>
    </div>
  );
}

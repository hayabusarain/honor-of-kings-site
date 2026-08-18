'use client';

import { History, Rss } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { PatchTable } from '@/components/patches/PatchTable';
import { ShareButton } from '@/components/common/ShareButton';
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
        {/* パッチ更新は共有されやすい話題なので、見出し行から直接共有できるようにする */}
        <ShareButton
          title={isJa
            ? 'オナーオブキングス（HoK）最新パッチノートと変更点の解説'
            : 'Honor of Kings patch notes with commentary'}
          className="ml-auto shrink-0"
        />
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
        {/* フィードは locale プレフィックスの外にあるため、i18n の Link ではなく素の a で参照する。
            フィード本文は日本語のみなので、英語ページではその旨を添える */}
        <a
          href="/feed.xml"
          className="inline-flex items-center gap-1.5 px-1 text-[11px] font-bold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <Rss size={12} className="shrink-0" />
          {isJa
            ? 'フィードで更新を受け取る（RSS/Atom対応リーダー・Discord用）'
            : 'Follow updates by feed (Japanese only; for RSS/Atom readers and Discord)'}
        </a>
        <PatchTable />
      </div>
    </div>
  );
}

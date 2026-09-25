import { History, Rss } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PatchTable, type PatchMeta } from '@/components/patches/PatchTable';
import { ShareButton } from '@/components/common/ShareButton';
import dataFreshness from '@/data/data_freshness.json';
import patchMetas from '@/data/patch_meta.json';
import { getAllPatches } from '@/lib/patchData';
import { PageFaq } from '@/components/common/PageFaq';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

// パッチ本文（184KB）とメタ分析（32KB）はここで読んで PatchTable へ渡す。
// 以前はこのページが 'use client' で、PatchTable が両方を直接 import していた。
// その分がクライアントの共有チャンクへ入り、パッチと無関係なトップページや
// ヒーロー詳細でも同じ180KBを読み込んでいた
export default async function PatchesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PatchTable' });
  const isJa = locale === 'ja';
  const src = dataFreshness.patchNotes;

  return (
    <div className="w-full bg-background font-sans text-slate-800">
      <BreadcrumbJsonLd locale={locale} trail={[{ name: isJa ? 'パッチノート' : 'Patch Notes', path: '/patches' }]} />
      {/* スマホでは固定しない。上に高さ56pxの AppBar（sticky top-0 z-40）があり、
          top-0 で貼り付くと題名がその裏に潜る。題名とリンクだけの帯を AppBar の下に
          固定し直しても、画面を狭くするだけなので、固定はPC（AppBar が無い幅）に限る */}
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 md:sticky md:top-0 z-20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
          <History className="text-brand-700" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none mb-1">
            {isJa ? 'パッチノート' : 'Patch Notes'}
          </h1>
          <p className="text-slate-500 text-xs font-bold leading-relaxed">
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
        {/* 出典表記。数値と仕様は公式の発表が出どころで、文章は当サイトが書いている。
            どこまでが公式の事実で、どこからが当サイトの解説かを、表を読む前に示しておく */}
        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium leading-relaxed text-slate-500">
          {isJa ? '変更内容の数値と仕様は' : 'The figures and mechanics come from '}
          <a
            href={src.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-700"
          >
            {isJa ? src.sourceJa : src.sourceEn}
          </a>
          {isJa
            ? 'によります。文章と、「この変更の意味」などの解説は当サイトが書いています。'
            : '. The write-ups themselves, including the “What this change means” commentary on each entry, are written by this site.'}
        </p>
        {/* フィードは locale プレフィックスの外にあるため、i18n の Link ではなく素の a で参照する。
            フィード本文は日本語のみなので、英語ページではその旨を添える */}
        <a
          href="/feed.xml"
          className="inline-flex min-h-6 items-center gap-1.5 px-1 text-xs font-bold text-slate-500 hover:text-brand-700 transition-colors"
        >
          <Rss size={12} className="shrink-0" />
          {isJa
            ? 'フィードで更新を受け取る（RSS/Atom対応リーダー・Discord用）'
            : 'Follow updates by feed (Japanese only; for RSS/Atom readers and Discord)'}
        </a>
        <PatchTable patches={getAllPatches()} patchMetas={patchMetas as PatchMeta[]} />
        {/* 答えの全文は src/content/faq.ts。置き場の対応は監査の検査23が見ている */}
        <PageFaq page="/patches" locale={locale} />
      </div>
    </div>
  );
}

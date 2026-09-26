import { History, Rss } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PatchTable, type PatchMeta } from '@/components/patches/PatchTable';
import { ShareButton } from '@/components/common/ShareButton';
import dataFreshness from '@/data/data_freshness.json';
import patchMetas from '@/data/patch_meta.json';
import { getAllPatches } from '@/lib/patchData';
import { withBasePath } from '@/lib/basePath';
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
      {/* 冒頭の帯は Tier表・ヒーロー一覧と同じ page-hero（globals.css）。影は墨の地で見えないので枠線で区切る。
          page-hero はカードの地を最後に敷いているので、PC で貼り付けても下の本文が透けない。
          装飾のアイコンはスマホで畳む（Tier表と同じ）。残すと 360px で副題が「メタ／分析」と語の途中で折れた */}
      <div className="page-hero pt-6 pb-5 px-4 border-b border-slate-200 md:sticky md:top-0 z-20 flex items-center gap-3">
        <div className="hidden sm:flex w-11 h-11 rounded-xl bg-brand-50 border border-brand-200 items-center justify-center shrink-0">
          <History className="text-brand-700" size={22} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
            {isJa ? 'パッチノート' : 'Patch Notes'}
          </h1>
          <p className="mt-1 text-slate-600 text-sm font-bold leading-snug [word-break:auto-phrase]">
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
            どこまでが公式の事実で、どこからが当サイトの解説かを、表を読む前に示しておく。
            390px で「「こ／の変更の意味」」と括弧の中で折れていたので、文節で折る（auto-phrase） */}
        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-relaxed text-slate-500 [word-break:auto-phrase]">
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
        {/* 14px にすると 390px でも2行になる。日本語はどの字の間でも折れるので、
            括弧の前だけで折れるよう2つの塊に分けて間に <wbr> を置く（英語は空白で折れる） */}
        <a
          href={withBasePath('/feed.xml')}
          className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-bold leading-snug text-slate-500 hover:text-brand-700 transition-colors"
        >
          <Rss size={16} className="shrink-0" aria-hidden="true" />
          {isJa ? (
            <span>
              <span className="whitespace-nowrap">フィードで更新を受け取る</span>
              <wbr />
              <span className="whitespace-nowrap">（RSS/Atom対応リーダー・Discord用）</span>
            </span>
          ) : (
            <span>Follow updates by feed (Japanese only; for RSS/Atom readers and Discord)</span>
          )}
        </a>
        <PatchTable patches={getAllPatches()} patchMetas={patchMetas as PatchMeta[]} />
        {/* 答えの全文は src/content/faq.ts。置き場の対応は監査の検査23が見ている */}
        <PageFaq page="/patches" locale={locale} />
      </div>
    </div>
  );
}

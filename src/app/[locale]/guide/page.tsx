import { setRequestLocale } from 'next-intl/server';
import { guidePageUpdatedAt, GUIDE_PUBLISHED } from '@/lib/contentDates';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import GuideClient, { type GuideData } from './GuideClient';
import { PageFaq } from '@/components/common/PageFaq';
// ガイド本文はロケールに応じて片方だけ読む。
// 以前はページ本体が 'use client' で ja.json と en.json を両方 import しており、
// 読者は読まない側の言語（計58KB）も必ずダウンロードしていた
import guideJa from '@/data/guide/ja.json';
import guideEn from '@/data/guide/en.json';

// /guide の用語集の節に出す語の数。本文は /guide/glossary にある
const GLOSSARY_PREVIEW_COUNT = 6;

// 描画本体は GuideClient（ScrollSpy とタブの現在地表示にクライアントが要る）。
// このページはロケールの解決と、初期HTMLに必要なものを組み立てるだけ。
// metadata は layout.tsx にある（/guide/bosses などの子ルートへ
// タイトルのテンプレートを渡す役目も持っているので動かさない）。
export default async function GuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 静的プリレンダに載せるために必要。呼ばないとこのページだけ動的レンダリングに落ちる
  setRequestLocale(locale);

  // JSON の形が GuideData から外れたら、ここで型エラーになる
  const guideData: GuideData = locale === 'en' ? guideEn : guideJa;
  // 用語集の説明文は /guide/glossary にだけ出す。ここからは先頭の語名だけを渡し、
  // 28語ぶんの説明文をクライアントへ送らない
  const { glossary, ...rest } = guideData;
  const glossaryPreview = glossary.slice(0, GLOSSARY_PREVIEW_COUNT).map(({ id, term }) => ({ id, term }));

  return (
    <>
      {/* /guide 本体の Article 構造化データ。親 layout はサブページ（/guide/bosses 等）も
          包むので、そこに置くとサブページの Article と二重になる。ページ側で出せば
          /guide のときだけ確実に出るため、経路判定が要らない。
          日付は git 履歴由来（初コミット/最終コミット）。内容を更新したら dateModified を上げる */}
      <ArticleJsonLd
        locale={locale}
        path="/guide"
        headline={locale === 'ja'
          ? '初心者ガイド（ゲームの流れ・レーン・オブジェクト）'
          : "Beginner's Guide: Game Flow, Lanes & Objectives"}
        description={locale === 'ja'
          ? 'オナーオブキングス（HoK）初心者向けの基本ガイド。ゲームの流れ、レーンと役割、中立オブジェクトをまとめています。用語は別ページの用語集にあります。'
          : 'Honor of Kings (HoK) basics: the game flow, lane roles and map objectives. Terms have their own glossary page.'}
        datePublished={GUIDE_PUBLISHED.guide}
        dateModified={guidePageUpdatedAt('guide')}
      />
      <GuideClient locale={locale} guideData={rest} glossaryPreview={glossaryPreview} glossaryCount={glossary.length} />
      {/* 答えの全文は src/content/faq.ts。置き場の対応は監査の検査23が見ている */}
      {/* 左右の余白と幅は、ページ本体の内側の枠と同じにする（揃えないとカードの端がずれる） */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <PageFaq page="/guide" locale={locale} className="mt-6" />
      </div>
    </>
  );
}

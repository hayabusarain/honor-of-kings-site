import { setRequestLocale } from 'next-intl/server';
import { guidePageUpdatedAt, GUIDE_PUBLISHED } from '@/lib/contentDates';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import GuideClient from './GuideClient';
// ガイド本文はロケールに応じて片方だけ読む。
// 以前はページ本体が 'use client' で ja.json と en.json を両方 import しており、
// 読者は読まない側の言語（計58KB）も必ずダウンロードしていた
import guideJa from '@/data/guide/ja.json';
import guideEn from '@/data/guide/en.json';

// 描画本体は GuideClient（ScrollSpy とタブの現在地表示にクライアントが要る）。
// このページはロケールの解決と、初期HTMLに必要なものを組み立てるだけ。
// metadata は layout.tsx にある（/guide/bosses などの子ルートへ
// タイトルのテンプレートを渡す役目も持っているので動かさない）。
export default async function GuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 静的プリレンダに載せるために必要。呼ばないとこのページだけ動的レンダリングに落ちる
  setRequestLocale(locale);

  const guideData: Record<string, unknown> = locale === 'en' ? guideEn : guideJa;

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
          ? '初心者ガイド（レーン・オブジェクト・用語集）'
          : "Beginner's Guide: Lanes, Objectives & Glossary"}
        description={locale === 'ja'
          ? 'オナーオブキングス（HoK）初心者向けの基本ガイド。ゲームの流れ、レーンと役割、中立オブジェクト、用語集まで網羅。'
          : 'Honor of Kings (HoK) basics: game flow roadmap, lane roles, map objectives, mechanics, and glossary.'}
        datePublished={GUIDE_PUBLISHED.guide}
        dateModified={guidePageUpdatedAt('guide')}
      />
      <GuideClient locale={locale} guideData={guideData} />
    </>
  );
}

import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd, Breadcrumb } from '@/components/seo/BreadcrumbJsonLd';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import { guidePageUpdatedAt, GUIDE_PUBLISHED } from '@/lib/contentDates';
import { PageFaq } from '@/components/common/PageFaq';

const PATH = '/guide/bosses';

// metadata と Article 構造化データの両方から参照する。片方だけ直すと食い違うので1か所にまとめる
function pageText(locale: string) {
  const isJa = locale === 'ja';
  return {
    title: isJa ? '中立ボス攻略（タイラント・オーバーロード）' : 'Jungle Boss Guide: Tyrant & Overlord',
    description: isJa
      ? 'オナーオブキングス（HoK）の中立ボス（タイラント・オーバーロード・テンペストドラゴン）の効果と倒すタイミングを解説。'
      : 'When and how to take Honor of Kings (HoK) neutral objectives: Tyrant, Overlord, and Tempest Dragon buffs explained.',
  };
}

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { title, description } = pageText(locale);
  return buildPageMetadata({ locale, path: PATH, title, description });
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 可視のパンくず（Breadcrumb）はサーバー側の Link でロケールを読む。next-intl は、サーバー側で
  // 使う layout とページのそれぞれで呼ぶよう求めている（未設定だと headers() を読み、静的生成から外れる）
  setRequestLocale(locale);
  const { title, description } = pageText(locale);
  const trail = [
    { name: locale === 'ja' ? '初心者ガイド' : "Beginner's Guide", path: '/guide' },
    { name: locale === 'ja' ? 'ボス攻略' : 'Bosses', path: PATH },
  ];
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={trail} />
      {/* 構造化データと同じトレイルを画面にも出す。ページ上端の「ガイド一覧へ」の帯を外したので、
          一覧へ戻る導線はこれが持つ。幅と左右の余白はページ本体の枠（max-w-4xl px-4）に揃える */}
      <Breadcrumb locale={locale} trail={trail} className="max-w-4xl mx-auto px-4 pt-3" />
      {/* 日付は git 履歴由来（page.tsx の初コミット/最終コミット）。内容を更新したら dateModified を上げる */}
      <ArticleJsonLd
        locale={locale}
        path={PATH}
        headline={title}
        description={description}
        datePublished={GUIDE_PUBLISHED.bosses}
        dateModified={guidePageUpdatedAt('bosses')}
      />
      {children}
      {/* ページ本体が 'use client' で差し込み口のデータを読めないため、FAQ はここから出す。
          このルートに子ページは無いので、ほかのページに重ねて出ることはない */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <PageFaq page="/guide/bosses" locale={locale} className="mt-6" />
      </div>
    </>
  );
}

import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import { guidePageUpdatedAt, GUIDE_PUBLISHED } from '@/lib/contentDates';

const PATH = '/guide/beginner-heroes';

// metadata と Article 構造化データの両方から参照する。片方だけ直すと食い違うので1か所にまとめる。
// Article 側の description は、meta description の1文目だけを使う（構造化データは短い要約でよい）
function pageText(locale: string) {
  const isJa = locale === 'ja';
  const lead = isJa
    ? 'オナーオブキングス（HoK）を始めたばかりの人向けに、5レーンそれぞれで最初の1体に向くヒーローを2体ずつ選びました。'
    : 'Ten Honor of Kings (HoK) heroes to start with, two for each of the five lanes.';
  return {
    title: isJa ? 'レーン別・最初に選ぶヒーロー10体' : 'Which Hero to Start With: 10 Picks by Lane',
    description: isJa
      ? `${lead}難易度と勝率で機械的に絞ったうえで、なぜ向くのかと、先に知っておくべき弱みを1体ずつ書いています。`
      : `${lead} Filtered by difficulty and win rate, then written up one by one: why each suits a first pick, and the weakness to know about going in.`,
    lead,
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
  const { title, lead } = pageText(locale);
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? '初心者ガイド' : "Beginner's Guide", path: '/guide' }, { name: locale === 'ja' ? '最初に選ぶヒーロー' : 'First Heroes', path: PATH }]} />
      {/* 日付は git 履歴由来（page.tsx の初コミット/最終コミット）。内容を更新したら dateModified を上げる */}
      <ArticleJsonLd
        locale={locale}
        path={PATH}
        headline={title}
        description={lead}
        datePublished={GUIDE_PUBLISHED.beginnerHeroes}
        dateModified={guidePageUpdatedAt('beginnerHeroes')}
      />
      {children}
    </>
  );
}

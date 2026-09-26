import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd, Breadcrumb } from '@/components/seo/BreadcrumbJsonLd';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import { guidePageUpdatedAt, GUIDE_PUBLISHED } from '@/lib/contentDates';
import { PageFaq } from '@/components/common/PageFaq';

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

// metadata はこの layout で定義する。ページは 2026-09-25 にサーバー部品に戻したが、
// pageText を Article 構造化データと共有しているので置き場は動かさない
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
  const { title, lead } = pageText(locale);
  const trail = [
    { name: locale === 'ja' ? '初心者ガイド' : "Beginner's Guide", path: '/guide' },
    { name: locale === 'ja' ? '最初に選ぶヒーロー' : 'First Heroes', path: PATH },
  ];
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={trail} />
      {/* 構造化データと同じトレイルを画面にも出す（ボス攻略と揃える）。
          検索から直接来た人が、ガイドの下の階層にいると分かるように。
          幅と左右の余白はページ本体と FAQ の枠（max-w-3xl px-4）に揃える（PC でパンくずだけ左端に出ていた） */}
      <Breadcrumb locale={locale} trail={trail} className="max-w-3xl mx-auto px-4 pt-3" />
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
      {/* FAQ はここから出す（ページが 'use client' だった頃からの置き場。ページ側へ移す理由は今のところ無い）。
          このルートに子ページは無いので、ほかのページに重ねて出ることはない */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        <PageFaq page="/guide/beginner-heroes" locale={locale} className="mt-6" />
      </div>
    </>
  );
}

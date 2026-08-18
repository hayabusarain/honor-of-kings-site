import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';

const PATH = '/guide/macro';

// metadata と Article 構造化データの両方から参照する。片方だけ直すと食い違うので1か所にまとめる
function pageText(locale: string) {
  const isJa = locale === 'ja';
  return {
    title: isJa ? 'マクロ講座（立ち回り・視界・オブジェクト管理）' : 'Macro Guide: Rotations & Objective Control',
    description: isJa
      ? 'オナーオブキングス（HoK）で勝率を上げるマクロの基礎。ウェーブ管理・ローテーション・オブジェクト優先度を解説。'
      : 'Improve your Honor of Kings (HoK) win rate with macro fundamentals: wave management, rotations, and objective priority.',
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
  const { title, description } = pageText(locale);
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? '初心者ガイド' : "Beginner's Guide", path: '/guide' }, { name: locale === 'ja' ? 'レーン別の立ち回り' : 'Macro by Lane', path: PATH }]} />
      {/* 日付は git 履歴由来（page.tsx の初コミット/最終コミット）。内容を更新したら dateModified を上げる */}
      <ArticleJsonLd
        locale={locale}
        path={PATH}
        headline={title}
        description={description}
        datePublished="2026-08-08"
        dateModified="2026-08-15"
      />
      {children}
    </>
  );
}

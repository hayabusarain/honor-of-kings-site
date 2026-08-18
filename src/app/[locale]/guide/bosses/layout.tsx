import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';

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
  const { title, description } = pageText(locale);
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? '初心者ガイド' : "Beginner's Guide", path: '/guide' }, { name: locale === 'ja' ? 'ボス攻略' : 'Bosses', path: PATH }]} />
      {/* 日付は git 履歴由来（page.tsx の初コミット/最終コミット）。内容を更新したら dateModified を上げる */}
      <ArticleJsonLd
        locale={locale}
        path={PATH}
        headline={title}
        description={description}
        datePublished="2026-08-08"
        dateModified="2026-08-11"
      />
      {children}
    </>
  );
}

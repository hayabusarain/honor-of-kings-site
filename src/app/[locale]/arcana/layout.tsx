import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/arcana',
    // 掲載しているのはレベル5の数値のみ。「レベル別」とは書かない
    title: isJa ? "アルカナ全30種の効果とロール別構成" : "All 30 Arcana: Effects & Builds by Role",
    description: isJa
      ? "オナーオブキングス（HoK）の全30種のアルカナを赤・青・緑の色別に掲載し、レベル5の効果を全文表示しています。マークスマン・メイジ・アサシン・ファイター・タンク／サポートのロール別構成も、選ぶ理由つきで解説。"
      : "All 30 Honor of Kings (HoK) arcana by colour with their full Level 5 effects, plus arcana builds for marksman, mage, assassin, fighter and tank/support with the reasoning behind each pick.",
  });
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? 'アルカナ一覧' : 'Arcana', path: '/arcana' }]} />
      {children}
    </>
  );
}

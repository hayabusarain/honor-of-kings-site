import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/esports/asian-games-2026',
    // 大会後（2026-09-30）に結果の形へ直した。大会前は日程と観かたを題名と説明に出していた
    title: isJa
      ? 'アジア競技大会2026のHonor of Kings 結果（金は中国）'
      : 'Honor of Kings at the 2026 Asian Games: Results (China Wins Gold)',
    description: isJa
      ? '第20回アジア競技大会（2026／愛知・名古屋）の Honor of Kings は、9月28日の決勝で中国がマレーシアを4−0で破り金メダル。銅は香港とフィリピン。グループステージから決勝までの全15試合の結果と、試合形式・予選をまとめています。'
      : 'At the 20th Asian Games in Aichi-Nagoya, China won Honor of Kings gold by beating Malaysia 4–0 in the final on 28 September 2026, with bronze for Hong Kong and the Philippines. Results of all 15 matches, the format and the qualifiers.',
  });
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? 'アジア競技大会2026' : '2026 Asian Games', path: '/esports/asian-games-2026' }]} />
      {children}
    </>
  );
}

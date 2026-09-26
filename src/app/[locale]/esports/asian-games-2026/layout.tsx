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
    title: isJa
      ? 'アジア競技大会2026のHonor of Kings（9月27〜28日・愛知）'
      : 'Honor of Kings at the 2026 Asian Games (27–28 Sept, Aichi)',
    description: isJa
      ? 'Honor of Kings は第20回アジア競技大会（2026／愛知・名古屋）のeスポーツ11種目の1つです。試合は9月27〜28日で、決勝は28日14:00から。出場する10の国と地域、組み分け、試合形式、日本からの観かたをまとめています。'
      : 'Honor of Kings is one of eleven esports disciplines at the 20th Asian Games in Aichi-Nagoya. Matches run 27–28 September 2026, with the final at 14:00 JST on the 28th. The ten teams, the groups, the format and how to watch.',
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

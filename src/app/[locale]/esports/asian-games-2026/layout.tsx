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
      ? 'アジア競技大会2026のHonor of Kings（9月28日・愛知）'
      : 'Honor of Kings at the 2026 Asian Games (28 Sept, Aichi)',
    description: isJa
      ? 'Honor of Kings は第20回アジア競技大会（2026／愛知・名古屋）のeスポーツ11種目の1つです。競技日は9月28日、会場はAichi Sky Expo展示ホールD。日程・会場・実施内容と、まだ確認できていないことをまとめています。'
      : 'Honor of Kings is one of eleven esports disciplines at the 20th Asian Games in Aichi-Nagoya. It runs on 28 September 2026 at Aichi Sky Expo, Exhibition Hall D. Dates, venue and format — plus what is still unconfirmed.',
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

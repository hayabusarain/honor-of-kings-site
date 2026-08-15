import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/guide/beginner-heroes',
    title: isJa
      ? 'レーン別・最初に選ぶヒーロー10体'
      : 'Which Hero to Start With: 10 Picks by Lane',
    description: isJa
      ? 'オナーオブキングス（HoK）を始めたばかりの人向けに、5レーンそれぞれで最初の1体に向くヒーローを2体ずつ選びました。難易度と勝率で機械的に絞ったうえで、なぜ向くのかと、先に知っておくべき弱みを1体ずつ書いています。'
      : 'Ten Honor of Kings (HoK) heroes to start with, two for each of the five lanes. Filtered by difficulty and win rate, then written up one by one: why each suits a first pick, and the weakness to know about going in.',
  });
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? '初心者ガイド' : 'Guide', path: '/guide' }, { name: locale === 'ja' ? '最初に選ぶヒーロー' : 'First Heroes', path: '/guide/beginner-heroes' }]} />
      {children}
    </>
  );
}

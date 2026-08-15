import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/guide/bosses',
    title: isJa ? "中立ボス攻略（タイラント・オーバーロード）" : "Jungle Boss Guide: Tyrant & Overlord",
    description: isJa ? "オナーオブキングス（HoK）の中立ボス（タイラント・オーバーロード・テンペストドラゴン）の効果と倒すタイミングを解説。" : "When and how to take Honor of Kings (HoK) neutral objectives: Tyrant, Overlord, and Tempest Dragon buffs explained.",
  });
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? '初心者ガイド' : 'Guide', path: '/guide' }, { name: locale === 'ja' ? 'ボス攻略' : 'Bosses', path: '/guide/bosses' }]} />
      {children}
    </>
  );
}

import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/guide/macro',
    title: isJa ? "マクロ講座（立ち回り・視界・オブジェクト管理）" : "Macro Guide: Rotations & Objective Control",
    description: isJa ? "オナーオブキングス（HoK）で勝率を上げるマクロの基礎。ウェーブ管理・ローテーション・オブジェクト優先度を解説。" : "Improve your Honor of Kings (HoK) win rate with macro fundamentals: wave management, rotations, and objective priority.",
  });
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? '初心者ガイド' : 'Guide', path: '/guide' }, { name: locale === 'ja' ? 'レーン別の立ち回り' : 'Macro by Lane', path: '/guide/macro' }]} />
      {children}
    </>
  );
}

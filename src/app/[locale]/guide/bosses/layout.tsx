import type { ReactNode } from 'react';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return {
    title: isJa ? "中立ボス攻略（タイラント・オーバーロード）" : "Jungle Boss Guide: Tyrant & Overlord",
    description: isJa ? "オナーオブキングス（HoK）の中立ボス（タイラント・オーバーロード・テンペストドラゴン）の効果と倒すタイミングを解説。" : "When and how to take Honor of Kings (HoK) neutral objectives: Tyrant, Overlord, and Tempest Dragon buffs explained.",
    alternates: {
      canonical: `/${locale}/guide/bosses`,
      languages: {
        'ja': '/ja/guide/bosses',
        'en': '/en/guide/bosses',
        'x-default': '/en/guide/bosses',
      },
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

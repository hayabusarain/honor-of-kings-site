import type { ReactNode } from 'react';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return {
    title: isJa ? "マクロ講座（立ち回り・視界・オブジェクト管理）" : "Macro Guide: Rotations & Objective Control",
    description: isJa ? "オナーオブキングス（HoK）で勝率を上げるマクロの基礎。ウェーブ管理・ローテーション・オブジェクト優先度を解説。" : "Improve your Honor of Kings (HoK) win rate with macro fundamentals: wave management, rotations, and objective priority.",
    alternates: {
      canonical: `/${locale}/guide/macro`,
      languages: {
        'ja': '/ja/guide/macro',
        'en': '/en/guide/macro',
        'x-default': '/en/guide/macro',
      },
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

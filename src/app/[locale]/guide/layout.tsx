import type { ReactNode } from 'react';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return {
    title: isJa ? "初心者ガイド（レーン・オブジェクト・用語集）" : "Beginner's Guide: Lanes, Objectives & Glossary",
    description: isJa ? "オナーオブキングス（HoK）初心者向けの基本ガイド。ゲームの流れ、レーンと役割、中立オブジェクト、用語集まで網羅。" : "Honor of Kings (HoK) basics: game flow roadmap, lane roles, map objectives, mechanics, and glossary.",
    alternates: {
      canonical: `/${locale}/guide`,
      languages: {
        'ja': '/ja/guide',
        'en': '/en/guide',
        'x-default': '/en/guide',
      },
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

import type { ReactNode } from 'react';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return {
    title: isJa ? "アルカナ一覧とおすすめ構成" : "Arcana Database & Effects",
    description: isJa ? "オナーオブキングス（HoK）の全アルカナの効果を色別・レベル別に一覧掲載。ロール別のおすすめ構成も紹介。" : "All Honor of Kings (HoK) arcana listed by color and level with full effect details.",
    alternates: {
      canonical: `/${locale}/arcana`,
      languages: {
        'ja': '/ja/arcana',
        'en': '/en/arcana',
        'x-default': '/en/arcana',
      },
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

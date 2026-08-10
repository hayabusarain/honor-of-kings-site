import type { ReactNode } from 'react';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return {
    title: isJa ? "アイテム（装備）一覧と効果解説" : "Items & Equipment Database",
    description: isJa ? "オナーオブキングス（HoK）の全アイテムの価格・ステータス・パッシブ効果を一覧で解説。カテゴリ別に検索できます。" : "Complete Honor of Kings (HoK) item database: prices, stats, and passive effects for every piece of equipment.",
    alternates: {
      canonical: `/${locale}/items`,
      languages: {
        'ja': '/ja/items',
        'en': '/en/items',
        'x-default': '/en/items',
      },
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

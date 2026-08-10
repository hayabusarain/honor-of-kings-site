import type { ReactNode } from 'react';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return {
    title: isJa ? "パッチノート・アップデート履歴まとめ" : "Patch Notes & Update History",
    description: isJa ? "オナーオブキングス（HoK）の最新パッチノートとヒーロー・アイテム調整履歴を日本語でまとめて掲載。" : "Latest Honor of Kings (HoK) patch notes with full hero and item balance change history.",
    alternates: {
      canonical: `/${locale}/patches`,
      languages: {
        'ja': '/ja/patches',
        'en': '/en/patches',
        'x-default': '/en/patches',
      },
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

import type { ReactNode } from 'react';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return {
    title: isJa ? "全ヒーロー一覧（ロール別・Tier付き）" : "All Heroes List by Role & Tier",
    description: isJa ? "オナーオブキングス（HoK）の全116ヒーローをロール別に一覧掲載。Tier・勝率データ付きで最強ヒーローがすぐ分かる！" : "Browse all 116 Honor of Kings (HoK) heroes by role, with tier ratings and win rates at a glance.",
    alternates: {
      canonical: `/${locale}/heroes`,
      languages: {
        'ja': '/ja/heroes',
        'en': '/en/heroes',
        'x-default': '/en/heroes',
      },
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

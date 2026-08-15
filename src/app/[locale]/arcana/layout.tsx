import type { ReactNode } from 'react';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return {
    // 掲載しているのはレベル5の数値のみ。「レベル別」とは書かない
    title: isJa ? "アルカナ全30種の効果とロール別構成" : "All 30 Arcana: Effects & Builds by Role",
    description: isJa
      ? "オナーオブキングス（HoK）の全30種のアルカナを赤・青・緑の色別に掲載し、レベル5の効果を全文表示しています。マークスマン・メイジ・アサシン・ファイター・タンク／サポートのロール別構成も、選ぶ理由つきで解説。"
      : "All 30 Honor of Kings (HoK) arcana by colour with their full Level 5 effects, plus arcana builds for marksman, mage, assassin, fighter and tank/support with the reasoning behind each pick.",
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

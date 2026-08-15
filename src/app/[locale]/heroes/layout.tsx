import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/heroes',
    title: isJa ? "全ヒーロー一覧（ロール別・Tier付き）" : "All Heroes List by Role & Tier",
    description: isJa ? "オナーオブキングス（HoK）の全116ヒーローをロール別に一覧掲載。Tier・勝率データ付きで最強ヒーローがすぐ分かる！" : "Browse all 116 Honor of Kings (HoK) heroes by role, with tier ratings and win rates at a glance.",
  });
}

// 注意: この layout は /heroes/[id]（全232ページ）も包む。ここに BreadcrumbJsonLd を
// 置くと、ヒーロー詳細が自前で出している3階層のパンくずと二重になり、
// どちらがリッチリザルトに使われるか制御できなくなる（夜間レビューで検出）。
// 一覧ページ自体のパンくずは2階層で情報量が少ないため、出さない
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

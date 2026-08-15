import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

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

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? 'ヒーロー一覧' : 'Heroes', path: '/heroes' }]} />
      {children}
    </>
  );
}

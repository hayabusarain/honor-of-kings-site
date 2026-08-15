import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/items',
    title: isJa ? "アイテム（装備）一覧と効果解説" : "Items & Equipment Database",
    description: isJa ? "オナーオブキングス（HoK）の全アイテムの価格・ステータス・パッシブ効果を一覧で解説。カテゴリ別に検索できます。" : "Complete Honor of Kings (HoK) item database: prices, stats, and passive effects for every piece of equipment.",
  });
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? 'アイテム一覧' : 'Items', path: '/items' }]} />
      {children}
    </>
  );
}

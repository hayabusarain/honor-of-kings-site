import type { ReactNode } from 'react';
import { buildPageMetadata, withChildTitleTemplate } from '@/lib/buildMetadata';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return withChildTitleTemplate(buildPageMetadata({
    locale,
    path: '/items',
    title: isJa ? "アイテム（装備）一覧と効果解説" : "Items & Equipment Database",
    description: isJa ? "オナーオブキングス（HoK）の全アイテムの価格・ステータス・パッシブ効果を一覧で解説。カテゴリ別に検索できます。" : "Complete Honor of Kings (HoK) item database: prices, stats, and passive effects for every piece of equipment.",
  }));
}

// BreadcrumbList は各ページが自分で出す。ここに置くと /items/usage でも
// 一覧ぶんが重ねて出てしまい、階層が実際と食い違うため
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

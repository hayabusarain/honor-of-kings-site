import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

// BreadcrumbJsonLd をページ本体と分けたいのでこの layout を置いている。metadata もここ
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/patches',
    title: isJa ? "パッチノート・アップデート履歴まとめ" : "Patch Notes & Update History",
    description: isJa ? "オナーオブキングス（HoK）の最新パッチノートとヒーロー・アイテム調整履歴を日本語でまとめて掲載。" : "Latest Honor of Kings (HoK) patch notes with full hero and item balance change history.",
  });
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? 'パッチノート' : 'Patch Notes', path: '/patches' }]} />
      {children}
    </>
  );
}

import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

// このルートのページは 'use client' のため、metadata はこの layout で定義する
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/guide',
    title: isJa ? "初心者ガイド（レーン・オブジェクト・用語集）" : "Beginner's Guide: Lanes, Objectives & Glossary",
    description: isJa ? "オナーオブキングス（HoK）初心者向けの基本ガイド。ゲームの流れ、レーンと役割、中立オブジェクト、用語集まで網羅。" : "Honor of Kings (HoK) basics: game flow roadmap, lane roles, map objectives, mechanics, and glossary.",
  });
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? '初心者ガイド' : 'Guide', path: '/guide' }]} />
      {children}
    </>
  );
}

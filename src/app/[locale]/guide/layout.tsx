import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';

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

// 注意: この layout は /guide/bosses・/guide/macro・/guide/beginner-heroes も包む。
// ここに BreadcrumbJsonLd を置くと、各サブページが出している3階層のパンくずと
// 二重になる（夜間レビューで検出）ため、置かない
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

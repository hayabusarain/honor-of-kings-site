import type { ReactNode } from 'react';
import { buildPageMetadata, withChildTitleTemplate } from '@/lib/buildMetadata';

// metadata をこの layout に置くのは、/guide/bosses などの子ルートへ
// タイトルのテンプレートを渡す必要があるため（withChildTitleTemplate）。
// page.tsx は 2026-08-31 にサーバーコンポーネントへ戻したが、
// この layout の役目は変わらないので動かさない
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return withChildTitleTemplate(buildPageMetadata({
    locale,
    path: '/guide',
    title: isJa ? "初心者ガイド（レーン・オブジェクト・用語集）" : "Beginner's Guide: Lanes, Objectives & Glossary",
    description: isJa ? "オナーオブキングス（HoK）初心者向けの基本ガイド。ゲームの流れ、レーンと役割、中立オブジェクト、用語集まで網羅。" : "Honor of Kings (HoK) basics: game flow roadmap, lane roles, map objectives, mechanics, and glossary.",
  }));
}

// 注意: この layout は /guide/bosses・/guide/beginner-heroes も包む。
// ここに BreadcrumbJsonLd や Article を置くと、各サブページが出している3階層の
// パンくず・Article と二重になる（夜間レビューで検出）ため、置かない。
// /guide 本体の Article は page.tsx 側で出している
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

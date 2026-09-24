import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/buildMetadata';

// metadata の置き場。パンくずの構造化データは置かない。この layout は版別ページ
// （/patches/[date]）も包むので、ここに置くと版別ページでは「ホーム＞パッチノート」と
// 「ホーム＞パッチノート＞日付」の2つが出ていた。一覧のパンくずは page.tsx にある
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

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

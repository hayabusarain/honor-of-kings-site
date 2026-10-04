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
    // 日本語の検索は「アプデ」「調整」（2026-10-04 の Google の検索候補）
    title: isJa ? "パッチノート｜アプデのキャラ調整まとめ" : "Patch Notes & Update History",
    description: isJa ? "オナーオブキングス（HoK）のアプデで入ったヒーロー（キャラ）と装備の調整を、公式パッチノートから版ごとにまとめています。変更が実戦で何を意味するかの解説つき。" : "Latest Honor of Kings (HoK) patch notes with full hero and item balance change history.",
    searchPrefix: true,
  });
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

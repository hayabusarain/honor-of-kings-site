import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { HomeClient } from "@/components/home/HomeClient";
import { buildPageMetadata } from '@/lib/buildMetadata';
import { getHomeFeatured } from '@/lib/homeFeatured';
import { ASIAN_GAMES_2026 } from '@/content/asianGames2026';

/**
 * トップページの canonical・hreflang・OGP。
 *
 * 以前はこれをルートレイアウトに置いていたが、レイアウトのメタデータは
 * 404 にも継承される。notFound() が投げられると Next.js はページ側の
 * generateMetadata を捨てるため、存在しないURLがすべて
 * 「noindex ＋ canonical=トップページ」を返していた。
 * title と description はレイアウトの既定値と同じ文字列を使う（Metadata 名前空間）。
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return buildPageMetadata({
    locale,
    path: '',
    title: t('defaultTitle'),
    description: t('description'),
    absoluteTitle: true,
  });
}

// アジア競技大会のバナーの表示期限。HomeClient は 'use client' なので、
// そちらで時刻を比べると生成済みHTMLとハイドレーション結果が食い違う。
// モジュールスコープに置くのは、render 内の Date.now() が React Compiler の
// 純粋性チェック（Cannot call impure function during render）に落ちるため。
// このページは完全な静的配信なので、評価はビルド時の1回きり。
// 期限後にデプロイが無い場合に備えて、HomeClient 側でもマウント後に1回だけ見直す。
const SHOW_ASIAN_GAMES_BANNER = Date.now() < Date.parse(ASIAN_GAMES_2026.bannerUntil);

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 「直近パッチで強化」の2枠はここで解決する。クライアント側で求めると
  // patches.json と hok_items.json（合わせて292KB）がトップのバンドルに載る
  const { featuredHeros } = getHomeFeatured(locale);
  return (
    <HomeClient
      featuredHeros={featuredHeros}
      showAsianGamesBanner={SHOW_ASIAN_GAMES_BANNER}
      asianGamesBannerUntil={ASIAN_GAMES_2026.bannerUntil}
    />
  );
}

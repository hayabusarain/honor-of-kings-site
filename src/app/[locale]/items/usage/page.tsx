import { getTranslations } from 'next-intl/server';
import dataFreshness from '@/data/data_freshness.json';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { getItemUsage } from '@/lib/itemUsage';
import { ItemUsageClient } from '@/components/items/ItemUsageClient';

/**
 * アイテム採用率ランキング。
 *
 * hero_item_builds.json（116体・226通り）の副産物。装備一覧は「何ができるか」を
 * 並べているだけで、「実際に何が組まれているか」はどこにも無かった。
 * 集計は itemUsage.ts のサーバー側で済ませ、切り替えだけをクライアントに渡す。
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  const usage = getItemUsage(locale);
  return buildPageMetadata({
    locale,
    path: '/items/usage',
    title: isJa
      ? 'アイテム採用率ランキング｜おすすめビルドの集計'
      : 'Item Pick Rate Rankings from Popular Builds',
    description: isJa
      ? `オナーオブキングス（HoK）のヒーロー${usage.heroCount}体・おすすめビルド${usage.totalSets}通りを集計し、実際に組まれている装備を採用率順に掲載。ロール別・レーン別に絞り込めます。`
      : `Honor of Kings (HoK) item pick rates from ${usage.totalSets} recommended builds across ${usage.heroCount} heroes, filterable by role and lane.`,
  });
}

export default async function ItemUsagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  const usage = getItemUsage(locale);

  // 切り口の表示名は messages の Role 名前空間を使う（サイト内で呼び方を揃える）。
  // レーン名は「クラッシュ (Clash)」のように併記されていて、絞り込みボタンには
  // 長すぎるので括弧と Lane を落とす
  const r = await getTranslations({ locale, namespace: 'Role' });
  const short = (s: string) => s.replace(/\s*\(.+\)$/, '').replace(/\s+Lane$/, '');
  const labels: Record<string, string> = {
    Fighter: r('fighter'),
    Tank: r('tank'),
    Mage: r('mage'),
    Assassin: r('assassin'),
    Marksman: r('marksman'),
    Support: r('support'),
    CLASH: short(r('clash')),
    JUNGLE: short(r('jungle')),
    MID: short(r('mid')),
    FARM: short(r('farm')),
    ROAM: short(r('roam')),
  };

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        trail={[
          { name: isJa ? 'アイテム一覧' : 'Items', path: '/items' },
          { name: isJa ? 'アイテム採用率' : 'Item Pick Rates', path: '/items/usage' },
        ]}
      />
      <ItemUsageClient
        usage={usage}
        labels={labels}
        itemsUpdatedAt={dataFreshness.staticData.items.updatedAt}
        buildsUpdatedAt={dataFreshness.staticData.itemBuilds.updatedAt}
      />
    </>
  );
}

import hokHeroes from '@/data/hok_heroes.json';
import campStatsRaw from '@/data/hero_stats_camp.json';
import { TierListClient } from '@/components/tier-list/TierListClient';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { getLatestPatchChanges } from '@/lib/patchBadges';
import { LANE_TIER_PAGES, LANE_COMMENTARY_STATS_DATE, findLanePage } from '@/content/laneTierPages';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

/**
 * レーン別のTier表。
 *
 * 総合の /tier-list はタブ切り替えで、初期HTMLには既定レーンの分しか出ない。
 * 残り4レーンの順位はどのURLにも無かったため、5レーン×2言語=10ページを静的生成して
 * 「HoK ジャングル 最強」のような複合検索の受け皿を作る。
 * 統計の更新は hero_stats_camp.json の差し替えだけで、ここに手作業は増えない。
 */

// LANE_TIER_PAGES に無いレーンは、ページ本体を実行せずに404へ落とす
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    LANE_TIER_PAGES.map(lane => ({ locale, lane: lane.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; lane: string }> }) {
  const { locale, lane } = await params;
  const page = findLanePage(lane);
  if (!page) return {};
  const isJa = locale === 'ja';
  // layout の title.template が「| Honor of Kings Hub」を付けるため、ここでは接尾辞を付けない
  const title = isJa ? `【オナーオブキングス】${page.title.ja}` : page.title.en;
  return buildPageMetadata({
    locale,
    path: `/tier-list/${page.slug}`,
    title,
    description: isJa ? page.description.ja : page.description.en,
  });
}

export default async function LaneTierListPage({ params }: { params: Promise<{ locale: string; lane: string }> }) {
  const { locale, lane } = await params;
  const page = findLanePage(lane);
  if (!page) notFound();

  const isJa = locale === 'ja';

  // camp のキーは公式 heroId そのもの（sync_camp_tier.js が heroId で書く）
  const stats = hokHeroes.map(h => {
    const campStats = (campStatsRaw as Record<string, any>)[h.id];

    return {
      ...campStats,
      id: h.id,
      key: h.id,
      image: (h as any).image,
      nameEn: h.name_en || h.name,
      winRate: campStats?.win_rate || 50,
      pickRate: campStats?.pick_rate || 0,
      banRate: campStats?.ban_rate || 0,
      tier: campStats?.tier || 'C',
      hero_name: isJa ? h.name : (h.name_en || h.name),
      role: h.role || ['Fighter'],
      lane: campStats?.lane || 'CLASH',
    };
  }).sort((a, b) => b.winRate - a.winRate);

  const laneName = isJa ? page.name.ja : page.name.en;
  const count = stats.filter(s => s.lane === page.id).length;

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        trail={[
          { name: isJa ? 'Tier表' : 'Tier List', path: '/tier-list' },
          { name: laneName, path: `/tier-list/${page.slug}` },
        ]}
      />
      <TierListClient
        stats={stats}
        patchChanges={getLatestPatchChanges()}
        lockedLane={page.id}
        heading={{
          title: isJa ? `${laneName}のTier表` : `${laneName} Tier List`,
          subtitle: isJa
            ? `${count}体を勝率順にランキング`
            : `${count} heroes ranked by win rate`,
        }}
        lead={isJa ? page.lead.ja : page.lead.en}
        commentary={{
          heading: isJa
            ? `${laneName}の現況（${LANE_COMMENTARY_STATS_DATE} 取得の統計から）`
            : `${laneName} snapshot (stats from ${LANE_COMMENTARY_STATS_DATE})`,
          paragraphs: isJa ? page.commentary.ja : page.commentary.en,
        }}
      />
    </>
  );
}

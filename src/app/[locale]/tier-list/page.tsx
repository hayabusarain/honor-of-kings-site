 
import { getTranslations } from "next-intl/server";
import hokHeroes from '@/data/hok_heroes.json';
import campStatsRaw from '@/data/hero_stats_camp.json';
import { TierListClient } from "@/components/tier-list/TierListClient";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // layout の title.template が「| Honor of Kings Hub」を付加するため、ここでは接尾辞を付けない
  const title = locale === 'ja'
    ? '【オナーオブキングス】最新Tier表・最強ヒーローランキング'
    : 'Honor of Kings Tier List - Best Meta Heroes Ranking (HoK)';
  const description = locale === 'ja'
    ? 'オナーオブキングス（HoK）の全レーン最新Tier表。公式の勝率・出現率データを基に最強ヒーローをランキング紹介！'
    // 「Updated daily」は事実に反する（取得は手動）。「Official」も、非公式サイトの
    // 検索結果として「公式Tier表」に読まれるため、係り先を統計側へ移した
    : 'Honor of Kings tier list for all five lanes (Clash, Farm, Mid, Jungle, Roam), based on the official HoK Camp win rate, pick rate and ban rate statistics. Each set of figures is shown with the date it was taken.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/tier-list`,
      languages: {
        'ja': '/ja/tier-list',
        'en': '/en/tier-list',
        'x-default': '/en/tier-list',
      },
    },
  };
}

export default async function TierListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TierList" });

  let stats = [];
  try {
    stats = hokHeroes.map(h => {
      let campStats = (campStatsRaw as any)[h.id];
      if (!campStats && typeof (h as any).key === 'number') {
        campStats = (campStatsRaw as any)[`hero_${String((h as any).key).padStart(3, '0')}`];
      }
      if (!campStats) {
        const skillKey = Object.keys(campStatsRaw).find(
          key => key.toLowerCase() === h.id.toLowerCase() || key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === h.id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        );
        if (skillKey) campStats = (campStatsRaw as any)[skillKey];
      }

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
        hero_name: locale === 'ja' ? h.name : (h.name_en || h.name),
        role: h.role || ['Fighter'],
        lane: campStats?.lane || 'CLASH'
      };
    }).sort((a, b) => b.winRate - a.winRate);
  } catch (err: any) {
    return (
      <div className="w-full p-4 bg-slate-50 min-h-screen">
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm">
          {t('error')}: {err.message}
        </div>
      </div>
    );
  }

  return <TierListClient stats={stats} />;
}

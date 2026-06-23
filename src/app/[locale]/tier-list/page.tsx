import { getTranslations } from "next-intl/server";
import hokHeroes from '@/data/hok_heroes.json';
import campStatsRaw from '@/data/hero_stats_camp.json';
import { TierListClient } from "@/components/tier-list/TierListClient";

export const revalidate = 3600;

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
        nameEn: h.name_en || h.name,
        winRate: campStats?.win_rate || 50,
        tier: campStats?.tier || 'C',
        hero_name: locale === 'en' && h.name_en ? h.name_en : h.name,
        role: h.role || ['Fighter'],
        lane: campStats?.lane || 'CLASH'
      };
    }).sort((a, b) => b.winRate - a.winRate);
  } catch (err: any) {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-slate-50 min-h-screen">
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm">
          {t('error')}: {err.message}
        </div>
      </div>
    );
  }

  return <TierListClient stats={stats} />;
}

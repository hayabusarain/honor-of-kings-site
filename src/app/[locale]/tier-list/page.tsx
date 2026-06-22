'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trophy } from 'lucide-react';
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import hokHeroes from '@/data/hok_heroes.json';
import campStatsRaw from '@/data/hero_stats_camp.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface HeroStat {
  id: number;
  hero_name: string;
  nameEn: string;
  winRate: number;
  pickRate: number;
  banRate: number;
  tier: string;
  role: string[];
  lane: string;
  updated_at: string;
}

export default function TierListPage() {
  const locale = useLocale();
  const t = useTranslations("TierList");
  const r = useTranslations("Role");
  const h = useTranslations("Home");
  const [stats, setStats] = useState<HeroStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('CLASH');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = sessionStorage.getItem('tierListActiveTab');
      if (savedTab) setActiveTab(savedTab);
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      sessionStorage.setItem('tierListActiveTab', activeTab);
    }
  }, [activeTab, isMounted]);

  const getRoleName = (role: string) => {
    switch(role) {
      case 'CLASH': return r('clash');
      case 'JUNGLE': return r('jungle');
      case 'MID': return r('mid');
      case 'FARM': return r('farm');
      case 'ROAM': return r('roam');
      default: return role;
    }
  };

  const roles = [
    { id: 'CLASH' },
    { id: 'JUNGLE' },
    { id: 'MID' },
    { id: 'FARM' },
    { id: 'ROAM' }
  ];

  useEffect(() => {
    async function fetchStats() {
      try {
        const localizedStats = hokHeroes.map(h => {
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

        setStats(localizedStats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [locale]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full max-w-md mx-auto bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-slate-50 min-h-screen">
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm">
          {t('error')}: {error}
        </div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-slate-50 min-h-screen p-4">
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-100">
          <Trophy className="mx-auto h-12 w-12 text-slate-200 mb-3" />
          <h3 className="text-lg font-black text-slate-800">{t('noData')}</h3>
          <p className="mt-2 text-xs font-bold text-slate-400">
            {t('noDataDesc')}
          </p>
        </div>
      </div>
    );
  }

  const filteredStats = stats.filter(c => c.lane === activeTab);
  const tiers = ['S', 'A', 'B', 'C'];
  const groupedStats = tiers.map(tier => ({
    tier,
    heros: filteredStats.filter(c => c.tier === tier)
  })).filter(g => g.heros.length > 0);

  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'S': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'A': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'B': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case 'C': return 'bg-slate-200 text-slate-600 border-slate-300';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const getWinRateColor = (wr: number) => {
    if (wr >= 52) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (wr >= 50) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-50 min-h-screen pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 pt-8 pb-4 px-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
            <p className="text-xs font-bold text-slate-500 mt-1">{t('subtitle')}</p>
          </div>
          <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-600 shadow-inner">
            <Trophy size={20} />
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
          {h('metaUpdated')}
        </p>
      </div>

      {/* Role Tabs - 3 Column Grid */}
      <div className="pt-4 pb-2 bg-slate-50 px-4">
        <div className="grid grid-cols-3 gap-2">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setActiveTab(role.id)}
              className={`py-2 px-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === role.id
                  ? 'bg-slate-900 text-white shadow-md scale-100'
                  : 'bg-white text-slate-600 border border-slate-200 scale-[0.98] active:scale-95'
              }`}
            >
              {getRoleName(role.id)}
            </button>
          ))}
        </div>
      </div>

      {/* Tier Sections - Vertical Stacking */}
      <div className="px-4 mt-4 space-y-8">
        {groupedStats.map(({ tier, heros }) => (
          <div key={tier} className="flex flex-col gap-3">
            {/* Tier Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-lg border ${getTierBadgeStyle(tier)}`}>
                  {tier}
                </div>
                <h2 className="text-base font-black text-slate-800">Tier {tier}</h2>
              </div>
              <span className="text-[10px] font-black text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg uppercase tracking-wider">
                {t('tier', { count: heros.length })}
              </span>
            </div>

            {/* Grid for Heros */}
            <div className="grid grid-cols-3 gap-3 pb-2">
              {heros.map((hero) => (
                <Link 
                  key={hero.id} 
                  href={`/heroes/${hero.id}`}
                  className="flex flex-col bg-white rounded-3xl p-3 shadow-sm border border-slate-100 active:scale-95 transition-transform"
                >
                  <div className="w-16 h-16 mx-auto bg-slate-100 rounded-[1.25rem] overflow-hidden mb-3 relative shadow-inner">
                    <img 
                      src={`/images/heroes/${(hero as any).key || hero.id}.jpg`}
                      alt={hero.id}
                      className="w-full h-full object-cover scale-[1.05]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `/images/heroes/default.png`;
                      }}
                    />
                  </div>
                  <h3 className="text-xs font-black text-slate-800 text-center truncate w-full mb-2">{hero.hero_name}</h3>
                  <div className={`rounded-xl py-1.5 px-2 flex items-center justify-between mt-auto border ${getWinRateColor(hero.winRate)}`}>
                    <span className="text-[9px] font-black opacity-60">WR</span>
                    <span className="text-xs font-black">{hero.winRate.toFixed(1)}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

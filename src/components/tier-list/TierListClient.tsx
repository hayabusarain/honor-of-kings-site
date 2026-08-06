'use client';

import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from 'next/image';
import HOK_HEROES from "@/data/hok_heroes.json";

interface HeroStat {
  id: number | string;
  hero_name: string;
  nameEn: string;
  winRate: number;
  pickRate: number;
  banRate: number;
  tier: string;
  role: string[];
  lane: string;
  updated_at: string;
  key?: string;
  image?: string;
}

interface TierListClientProps {
  stats: HeroStat[];
}

const getHeroSlug = (id: string) => {
  const hero = (HOK_HEROES as any[]).find((h: any) => h.id === id);
  return hero?.slug || id;
};

export function TierListClient({ stats }: TierListClientProps) {
  const t = useTranslations("TierList");
  const r = useTranslations("Role");
  const h = useTranslations("Home");
  const [activeTab, setActiveTab] = useState('CLASH');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTab = sessionStorage.getItem('tierListActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
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

  if (stats.length === 0) {
    return (
      <div className="w-full p-4 bg-slate-50 min-h-screen">
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
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-14 md:top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-4 sm:py-6 px-4 md:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400">
              {h('metaUpdated')}
            </span>
            <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-600 shadow-inner">
              <Trophy size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Role Navigation Bar */}
      <div className="py-4 bg-slate-50 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setActiveTab(role.id)}
              className={`py-2 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === role.id
                  ? 'bg-slate-900 text-white shadow-md scale-100'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 active:scale-95'
              }`}
            >
              {getRoleName(role.id)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tier Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-2 space-y-6">
        {groupedStats.map(({ tier, heros }) => (
          <div key={tier} className="flex flex-col gap-3 bg-white/60 p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-base border shadow-xs ${getTierBadgeStyle(tier)}`}>
                  {tier}
                </div>
                <h2 className="text-base font-black text-slate-800">Tier {tier}</h2>
              </div>
              <span className="text-[10px] font-black text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-xs">
                {t('tier', { count: heros.length })}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 pt-1">
              {heros.map((hero) => (
                <Link 
                  key={hero.id} 
                  href={`/heroes/${getHeroSlug(String(hero.id))}`}
                  className="flex flex-col bg-white rounded-2xl p-3 shadow-xs border border-slate-200/70 hover:border-slate-300 hover:shadow-md transition-all group"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-slate-100 rounded-2xl overflow-hidden mb-2 relative shadow-inner group-hover:scale-105 transition-transform duration-200">
                    <Image 
                      src={hero.image || `/images/heroes/${hero.key || hero.id}.jpg`}
                      alt={String(hero.id)}
                      fill
                      sizes="64px"
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.srcset = '';
                        e.currentTarget.src = '/images/heroes/default.png';
                      }}
                    />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 text-center truncate w-full mb-2 group-hover:text-indigo-600 transition-colors">
                    {hero.hero_name}
                  </h3>
                  <div className={`rounded-lg py-1 px-2 flex items-center justify-between mt-auto border ${getWinRateColor(hero.winRate)}`}>
                    <span className="text-[9px] font-bold opacity-60">WR</span>
                    <span className="text-xs font-bold">{hero.winRate.toFixed(1)}%</span>
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

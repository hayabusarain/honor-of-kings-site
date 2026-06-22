'use client';

import { Link } from "@/i18n/routing";
import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Users, Target, Shield, Zap, Crosshair, HeartPulse, Sparkles, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import hokHeroes from "@/data/hok_heroes.json";
import campStatsRaw from "@/data/hero_stats_camp.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface HeroData {
  id: string;
  key: string;
  name: string;
  name_en?: string;
  title: string;
  blurb: string;
  tags: string[];
  search_alias?: string;
  title_alias?: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
}

interface HeroStat {
  hero_name_en: string;
  tier: string;
  win_rate: number;
  role: string;
}

export default function HerosPage() {
  const t = useTranslations("Heros");
  const r = useTranslations("Role");
  const locale = useLocale();

  const initialTierData = useMemo(() => {
    return (hokHeroes as any[]).reduce((acc, curr) => {
      const champName = curr.id;
      if (!acc[champName]) acc[champName] = [];
      acc[champName].push({
        hero_name_en: curr.name,
        tier: curr.tier || 'A',
        win_rate: curr.winRate || 50,
        role: curr.role && curr.role.length > 0 ? curr.role[0] : 'Fighter'
      });
      return acc;
    }, {} as Record<string, HeroStat[]>);
  }, []);

  const initialHeros = useMemo(() => {
    const list: HeroData[] = [];
    
    for (const hero of hokHeroes as any[]) {
      list.push({
        id: hero.id,
        key: hero.id,
        name: locale === 'en' && hero.name_en ? hero.name_en : hero.name,
        name_en: hero.name_en,
        title: hero.title || 'Honor of Kings Hero',
        blurb: '',
        tags: hero.role || ['Fighter'],
        search_alias: hero.search_alias || '',
        info: { attack: 5, defense: 5, magic: 5, difficulty: 5 }
      });
    }
    
    return list;
  }, [locale]);

  const [heros, setHeros] = useState<HeroData[]>(initialHeros);
  const [tierData, setTierData] = useState<Record<string, HeroStat[]>>(initialTierData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFilter = sessionStorage.getItem('heroesActiveFilter');
      const savedSearch = sessionStorage.getItem('heroesSearchQuery');
      if (savedFilter) setActiveFilter(savedFilter);
      if (savedSearch) setSearchQuery(savedSearch);
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      sessionStorage.setItem('heroesActiveFilter', activeFilter);
      sessionStorage.setItem('heroesSearchQuery', searchQuery);
    }
  }, [activeFilter, searchQuery, isMounted]);

  useEffect(() => {
    // Already populated by mock data directly. No need to query Supabase or DataDragon right now.
    setLoading(false);
  }, [locale]);

  const roles = [
    { id: 'All', label: r('all'), icon: <Users size={16} /> },
    { id: 'Fighter', label: r('fighter'), icon: <Target size={16} /> },
    { id: 'Tank', label: r('tank'), icon: <Shield size={16} /> },
    { id: 'Mage', label: r('mage'), icon: <Sparkles size={16} /> },
    { id: 'Assassin', label: r('assassin'), icon: <Zap size={16} /> },
    { id: 'Marksman', label: r('marksman'), icon: <Crosshair size={16} /> },
    { id: 'Support', label: r('support'), icon: <HeartPulse size={16} /> },
  ];

  const filteredHeros = useMemo(() => {
    const result = heros.filter(champ => {
      const cleanStr = (s: string) => (s || '').replace(/[\s\u3000・]+/g, '').toLowerCase();
      const query = cleanStr(searchQuery);
      const matchesSearch = cleanStr(champ.name).includes(query) || 
                            cleanStr(champ.id).includes(query) ||
                            (champ.title && cleanStr(champ.title).includes(query)) ||
                            (champ.title_alias && cleanStr(champ.title_alias).includes(query)) ||
                            (champ.search_alias && cleanStr(champ.search_alias).includes(query));
      const matchesFilter = activeFilter === 'All' || champ.tags.includes(activeFilter);
      return matchesSearch && matchesFilter;
    }).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    
    return result;
  }, [heros, searchQuery, activeFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 w-full max-w-md mx-auto">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-slate-50 min-h-screen pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 pt-8 pb-4 px-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
            <p className="text-xs font-bold text-slate-500 mt-1">{t('subtitle')}</p>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-2xl text-slate-700 shadow-inner">
            <Users size={20} />
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-transparent rounded-2xl focus:border-slate-300 focus:bg-white outline-none text-slate-800 placeholder-slate-400 font-bold text-sm transition-all"
          />
        </div>
      </div>

      {/* Role Filters - 3 Column Grid */}
      <div className="pt-4 pb-2 bg-slate-50 px-4">
        <div className="grid grid-cols-3 gap-2">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setActiveFilter(role.id)}
              className={`flex items-center gap-1.5 justify-center py-2 px-2 rounded-xl font-bold text-xs transition-all ${
                role.id === 'All' ? 'col-span-3' : ''
              } ${
                activeFilter === role.id
                  ? 'bg-slate-900 text-white shadow-md scale-100'
                  : 'bg-white text-slate-600 border border-slate-200 scale-[0.98] active:scale-95'
              }`}
            >
              {role.icon}
              <span>{role.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Heros Grid */}
      <div className="px-4 mt-4 grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-5">
        {filteredHeros.map(hero => {
          let campStats = (campStatsRaw as any)[hero.id];
          if (!campStats && typeof hero.key === 'number') {
            campStats = (campStatsRaw as any)[`hero_${String(hero.key).padStart(3, '0')}`];
          }
          if (!campStats) {
            const skillKey = Object.keys(campStatsRaw).find(
              key => key.toLowerCase() === hero.id.toLowerCase() || key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === hero.id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
            );
            if (skillKey) campStats = (campStatsRaw as any)[skillKey];
          }
          const tier = campStats?.tier;

          return (
            <Link 
              key={hero.id} 
              href={`/heroes/${hero.id}`} 
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform relative group"
            >
              <div className="relative w-[76px] h-[76px] sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
                <img 
                  src={`/images/heroes/${hero.key}.jpg`}
                  alt={hero.name}
                  className="w-full h-full object-cover scale-[1.05]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/images/heroes/default.png`;
                    (e.target as HTMLImageElement).onerror = null;
                  }}
                />
                {tier && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-bl-lg">
                    {tier}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center w-full px-1">
                <span className="text-[11px] font-bold text-slate-800 text-center w-full truncate leading-tight group-hover:text-indigo-600 transition-colors">
                  {hero.name}
                </span>
                {locale !== 'en' && hero.title && hero.title !== 'Honor of Kings Hero' && (
                  <span className="text-[9px] font-medium text-slate-500 text-center w-full truncate leading-tight mt-0.5">
                    {hero.title}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        {filteredHeros.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200 mt-4 shadow-sm">
            <Users className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-black text-slate-800">{locale === 'en' ? 'Not Found' : '見つかりませんでした'}</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">{locale === 'en' ? 'No heroes match your search criteria.' : '検索条件に一致するヒーローがいません。'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Trophy, Users, Sparkles, Package, Hexagon, ArrowRight, TrendingUp, History, Calculator, Bell, BookOpen, ShoppingBag, FileText, Zap } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import itemsData from '@/data/hok_items.json';
import fallbackPatches from '@/data/patches.json';
import hokHeroes from '@/data/hok_heroes.json';
import campStatsRaw from '@/data/hero_stats_camp.json';
import { AmazonSupport } from "@/components/common/AmazonSupport";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface MetaPick {
  role: string;
  hero_id?: string;
  image?: string;
  hero_name_en?: string;
  hero_name: string;
  title?: string;
  winRate: number;
  tier: string;
}

import HOK_HEROES from "@/data/hok_heroes.json";
const getHeroSlug = (id: string) => {
  const hero = (HOK_HEROES as any[]).find((h: any) => h.id === id);
  return hero?.slug || id;
};

export function HomeClient() {
  const locale = useLocale();
  const t = useTranslations("Home");
  const r = useTranslations("Role");
  const [metaPicks, setMetaPicks] = useState<MetaPick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetaPicks() {
      const campStatsObj = (campStatsRaw as any) || {};
      const roles = ['CLASH', 'JUNGLE', 'MID', 'FARM', 'ROAM'];
      const picks: MetaPick[] = [];
      
      roles.forEach(role => {
        const champsInRole = (hokHeroes as any[]).map((champ: any) => {
          const stat = campStatsObj[champ.id] || Object.values(campStatsObj).find((s:any) => s.jpName === champ.name);
          return stat && stat.lane === role ? { ...champ, winRate: stat.win_rate, tier: stat.tier } : null;
        }).filter(Boolean);
        
        if (champsInRole.length > 0) {
          champsInRole.sort((a, b) => b.winRate - a.winRate);
          picks.push({
            role: role,
            hero_id: champsInRole[0].id,
            image: champsInRole[0].image,
            hero_name: locale === 'en' && champsInRole[0].name_en ? champsInRole[0].name_en : champsInRole[0].name,
            title: champsInRole[0].title,
            winRate: champsInRole[0].winRate,
            tier: champsInRole[0].tier,
          });
        }
      });
      
      setMetaPicks(picks);
      setLoading(false);
    }
    
    fetchMetaPicks();
  }, [locale]);

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CLASH': return 'bg-orange-500';
      case 'JUNGLE': return 'bg-emerald-500';
      case 'MID': return 'bg-blue-500';
      case 'FARM': return 'bg-rose-500';
      case 'ROAM': return 'bg-teal-500';
      default: return 'bg-slate-500';
    }
  };

  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [featuredHeros, setFeaturedHeros] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBuffedData() {
      // Helper function to sort patch versions numerically and suffix-sensitively
      const compareVersions = (a: string, b: string): number => {
        // Handle Japanese date strings like "7月16日アップデートのお知らせ"
        const jpDateRegex = /^(\d+)月(\d+)日/;
        const jpMatchA = a.match(jpDateRegex);
        const jpMatchB = b.match(jpDateRegex);

        if (jpMatchA && jpMatchB) {
          const monthA = parseInt(jpMatchA[1], 10);
          const dayA = parseInt(jpMatchA[2], 10);
          const monthB = parseInt(jpMatchB[1], 10);
          const dayB = parseInt(jpMatchB[2], 10);
          
          if (monthA !== monthB) return monthA - monthB;
          if (dayA !== dayB) return dayA - dayB;
        }

        const regex = /^(\d+)\.(\d+)([a-z])?$/i;
        const matchA = a.match(regex);
        const matchB = b.match(regex);

        if (!matchA && !matchB) return a.localeCompare(b);
        if (!matchA) return -1;
        if (!matchB) return 1;

        const majorA = parseInt(matchA[1], 10);
        const minorA = parseInt(matchA[2], 10);
        const suffixA = matchA[3] || '';

        const majorB = parseInt(matchB[1], 10);
        const minorB = parseInt(matchB[2], 10);
        const suffixB = matchB[3] || '';

        if (majorA !== majorB) return majorA - majorB;
        if (minorA !== minorB) return minorA - minorB;
        return suffixA.localeCompare(suffixB);
      };

      // Helper to check if two patches represent the same change
      const isDuplicatePatch = (a: any, b: any): boolean => {
        if ((a.version || '').toLowerCase().trim() !== (b.version || '').toLowerCase().trim()) return false;
        if ((a.change_type || '').toLowerCase().trim() !== (b.change_type || '').toLowerCase().trim()) return false;
        
        const normAJa = (a.hero_name || '').toLowerCase().replace(/[\s・_-]/g, '');
        const normAEn = (a.hero_name_en || '').toLowerCase().replace(/[\s・_-]/g, '');
        
        const normBJa = (b.hero_name || '').toLowerCase().replace(/[\s・_-]/g, '');
        const normBEn = (b.hero_name_en || '').toLowerCase().replace(/[\s・_-]/g, '');

        const matchJa = normAJa && normBJa && normAJa === normBJa;
        const matchEn = normAEn && normBEn && normAEn === normBEn;
        
        return matchJa || matchEn;
      };

      let patchesList: any[] = [];
      try {
        const { data, error } = await supabase
          .from('patches')
          .select('*')
          .eq('change_type', 'buff');

        const fallbackFiltered = fallbackPatches.filter(
          (p: any) => p.change_type === 'buff'
        );

        if (!error && data && data.length > 0) {
          const merged = [...data];
          fallbackFiltered.forEach((p: any) => {
            const isDup = merged.some(existing => isDuplicatePatch(existing, p));
            if (!isDup) {
              merged.push(p);
            }
          });
          patchesList = merged;
        } else {
          patchesList = fallbackFiltered;
        }
      } catch (e) {
        patchesList = fallbackPatches.filter(
          (p: any) => p.change_type === 'buff'
        );
      }

      const normalize = (name: string) => name.toLowerCase().replace(/[\s・_]/g, '');

      // 1. Process Items
      const itemPatches = patchesList.filter(p => !p.is_hero);
      const matchedItemPatches = itemPatches.filter((patch: any) => {
        const normPatchJa = normalize(patch.hero_name || '');
        const normPatchEn = normalize(patch.hero_name_en || '');
        return itemsData.some((item: any) => {
          const normItemName = normalize(item.name || '');
          return (normPatchJa && normItemName && normItemName === normPatchJa) ||
                 (normPatchEn && normItemName && normItemName === normPatchEn);
        });
      });

      if (matchedItemPatches.length > 0) {
        const itemVersions = Array.from(new Set(matchedItemPatches.map((p: any) => p.version)))
          .sort((a: any, b: any) => compareVersions(b, a));
        
        const latestItemVersion = itemVersions[0];
        const latestItemPatches = matchedItemPatches.filter((p: any) => p.version === latestItemVersion);

        const seenItemIds = new Set();
        const itemsMap = latestItemPatches.map((patch: any) => {
          const normPatchJa = normalize(patch.hero_name || '');
          const normPatchEn = normalize(patch.hero_name_en || '');
          const matchedItem = (itemsData as any[]).find((item: any) => {
            const normItemName = normalize(item.name || '');
            return (normPatchJa && normItemName && normItemName === normPatchJa) ||
                   (normPatchEn && normItemName && normItemName === normPatchEn);
          });
          
          if (matchedItem && !seenItemIds.has(matchedItem.id)) {
            seenItemIds.add(matchedItem.id);
            return {
              id: matchedItem.id,
              name_ja: matchedItem.name,
              name_en: matchedItem.name,
              image: matchedItem.icon,
              isCompleted: true,
              patchDescription: locale === 'ja' ? patch.description : patch.description_en,
              patchVersion: patch.version,
              isBuffed: true
            };
          }
          return null;
        }).filter(Boolean);
        setFeaturedItems(itemsMap);
      } else {
        setFeaturedItems([]);
      }

      // 2. Process Heros
      const champPatches = patchesList.filter(p => p.is_hero);
      if (champPatches.length > 0) {
        const champVersions = Array.from(new Set(champPatches.map((p: any) => p.version)))
          .sort((a: any, b: any) => compareVersions(b, a));
        
        const latestChampVersion = champVersions[0];
        const latestChampPatches = champPatches.filter((p: any) => p.version === latestChampVersion);

        const seenChampNames = new Set();
        const champsMap = latestChampPatches.map((patch: any) => {
          const nameKey = (patch.hero_name_en || patch.hero_name || '').toLowerCase().trim();
          if (seenChampNames.has(nameKey)) return null;
          seenChampNames.add(nameKey);
          
          const matchedHero = (hokHeroes as any[]).find(h => h.name === patch.hero_name_en || h.name === patch.hero_name);
          
          return {
            id: matchedHero ? matchedHero.id : patch.hero_name_en,
            hero_name: locale === 'en' && matchedHero?.name_en ? matchedHero.name_en : (locale === 'ja' ? patch.hero_name : (patch.hero_name_en || patch.hero_name)),
            hero_name_en: patch.hero_name_en,
            patchDescription: locale === 'ja' ? patch.description : patch.description_en,
            patchVersion: patch.version,
            isBuffed: true
          };
        }).filter(Boolean);
        setFeaturedHeros(champsMap);
      } else {
        setFeaturedHeros([]);
      }
    }

    fetchBuffedData();
  }, [locale]);

  const getItemSearchString = (item: any) => {
    let str = (item.stats || []).join(' ').toLowerCase();
    if (item.passives && Array.isArray(item.passives)) {
      item.passives.forEach((p: any) => {
        if (p.name) str += ' ' + p.name.toLowerCase();
        if (p.description) str += ' ' + p.description.toLowerCase();
      });
    }
    return str;
  };

  const getItemGlowClass = (item: any) => {
    if (item.isBuffed) {
      return 'from-emerald-500/10 via-slate-900 to-slate-900 hover:border-emerald-500/35 group-hover:shadow-emerald-500/5';
    }
    const searchStr = getItemSearchString(item);
    if (searchStr.includes('攻撃力') || searchStr.includes('ad')) return 'from-rose-500/10 via-slate-900 to-slate-900 hover:border-rose-500/30 group-hover:shadow-rose-500/5';
    if (searchStr.includes('魔力') || searchStr.includes('ap')) return 'from-purple-500/10 via-slate-900 to-slate-900 hover:border-purple-500/30 group-hover:shadow-purple-500/5';
    if (searchStr.includes('物理防御') || searchStr.includes('魔法防御') || searchStr.includes('防御') || searchStr.includes('mr') || searchStr.includes('armor')) return 'from-emerald-500/10 via-slate-900 to-slate-900 hover:border-emerald-500/30 group-hover:shadow-emerald-500/5';
    return 'from-indigo-500/10 via-slate-900 to-slate-900 hover:border-indigo-500/30 group-hover:shadow-indigo-500/5';
  };

  const getIconGlowColor = (item: any) => {
    if (item.isBuffed) {
      return 'bg-emerald-500/20';
    }
    const searchStr = getItemSearchString(item);
    if (searchStr.includes('攻撃力') || searchStr.includes('ad')) return 'bg-rose-500/20';
    if (searchStr.includes('魔力') || searchStr.includes('ap')) return 'bg-purple-500/20';
    if (searchStr.includes('物理防御') || searchStr.includes('魔法防御') || searchStr.includes('防御') || searchStr.includes('mr') || searchStr.includes('armor')) return 'bg-emerald-500/20';
    return 'bg-indigo-500/20';
  };

  return (
    <main className="pb-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
      
      {/* Hero Banner Section */}
      <header className="relative w-full h-[280px] mb-8 overflow-hidden rounded-b-[2.5rem] shadow-sm">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0">
          <Image 
            src="/images/hero_banner_bg_light.png" 
            alt="Hero Background" 
            fill
            priority
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent dark:from-slate-950 dark:via-slate-950/80"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end px-6 pb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md w-fit mb-3 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 tracking-wider">DATABASE ACTIVE</span>
          </div>
          
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-[1.2] mb-2">
            Honor of Kings <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-indigo-400 dark:to-blue-400">
              {locale === 'ja' ? '攻略データベース' : 'Strategy Database'}
            </span>
          </h1>
          
          <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed max-w-[90%]">
            {locale === 'ja' 
              ? '全122体のヒーロー詳細データと最新のTier表'
              : 'Detailed stats and tier list for all 122 heroes.'}
          </p>
        </div>
      </header>

      {/* Announcement Banner */}
      <section className="px-4 mb-6">
        <div className="w-full bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-4 flex items-start gap-3 shadow-sm border border-indigo-700 dark:border-indigo-600">
          <Bell size={18} className="text-white shrink-0 mt-0.5" />
          <p className="text-[13px] font-bold text-white leading-relaxed">
            {t('announcement')}
          </p>
        </div>
      </section>

      {/* Support Banner (運営支援のお願い) */}
      <section className="px-4 mb-8">
        <AmazonSupport defaultOpen={true} />
      </section>


      {/* Top Meta Picks Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-[17px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t('metaTitle')}
          </h2>
          <Link href="/tier-list" className="text-xs font-bold text-blue-600 dark:text-blue-400 active:text-blue-800 transition-colors">
            {locale === 'ja' ? 'すべて見る' : 'See all'}
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5 px-4 pb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-full aspect-[4/5] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5 px-4 pb-4">
            {metaPicks.map((pick, idx) => (
              <Link 
                href={`/heroes/${getHeroSlug(pick.hero_id as string)}`} 
                key={idx}
                className="w-full rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 active:scale-95 transition-transform flex flex-col"
              >
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden group">
                  <Image 
                    src={pick.image || `/images/heroes/${pick.hero_id}.jpg`}
                    alt={pick.hero_name}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[9px] font-bold text-slate-700 dark:text-slate-200 shadow-sm z-10">
                    {pick.role}
                  </div>
                </div>
                <div className="p-1.5 flex-1 flex flex-col justify-between">
                  <h3 className="text-[10px] font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
                    {locale !== 'en' && <span className="hidden text-[8px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">{pick.title || ''}</span>}
                    {pick.hero_name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[8px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1 py-0.5 rounded">
                      T{pick.tier}
                    </span>
                    <span className="text-[8px] font-bold text-slate-500">
                      {pick.winRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Heros Showcase Section (Carousel) */}
      {featuredHeros.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between px-4 mb-3">
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                {locale === 'ja' ? '最新パッチ バフ対象' : 'Recent Buffs'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Patch {featuredHeros[0]?.patchVersion || ''}</p>
            </div>
            <Link href="/heroes" className="text-xs font-bold text-blue-600 active:text-blue-800 transition-colors">
              {locale === 'ja' ? 'すべて見る' : 'See all'}
            </Link>
          </div>

          <div className="flex gap-3 px-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {featuredHeros.map((champ: any, idx) => (
              <Link
                key={idx}
                href={`/heroes/${getHeroSlug(champ.id)}`}
                className="flex-none w-[140px] snap-center bg-white rounded-[1.25rem] p-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 active:scale-95 transition-transform flex flex-col gap-2 relative"
              >
                <div className="absolute top-2 right-2 flex items-center justify-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 relative">
                  <Image
                    src={(hokHeroes as any[]).find(h => h.id === champ.id)?.image || `/images/heroes/${champ.id}.jpg`}
                    alt={champ.hero_name}
                    fill
                    sizes="40px"
                    className="object-cover scale-110"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">
                    <span className="block text-[9px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">{champ.title || ''}</span>
                    {champ.hero_name}
                  </h3>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium line-clamp-2 mt-1 leading-snug">
                    {champ.patchDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Items Showcase Section (Carousel) */}
      {featuredItems.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between px-4 mb-3">
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                {locale === 'ja' ? '注目アイテム' : 'Featured Items'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Patch {featuredItems[0]?.patchVersion || ''}</p>
            </div>
            <Link href="/items" className="text-xs font-bold text-blue-600 active:text-blue-800 transition-colors">
              {locale === 'ja' ? 'すべて見る' : 'See all'}
            </Link>
          </div>

          <div className="flex gap-3 px-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {featuredItems.map((item: any, idx) => (
              <Link
                key={idx}
                href={`/items/${item.id}`}
                className={`flex-none w-[140px] snap-center bg-gradient-to-br ${getItemGlowClass(item)} rounded-[1.25rem] p-3 shadow-sm border border-slate-100 dark:border-slate-800 active:scale-95 transition-all flex flex-col gap-2 relative group overflow-hidden`}
              >
                {item.isBuffed && (
                  <div className="absolute top-2 right-2 flex items-center justify-center z-10">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                )}
                
                {/* Background Decoration */}
                <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                  <Image
                    src={`/images/items/${item.id}.jpg`}
                    alt=""
                    width={80}
                    height={80}
                    className="object-cover blur-[2px] grayscale"
                  />
                </div>

                <div className={`w-10 h-10 rounded-[10px] overflow-hidden ${getIconGlowColor(item)} shrink-0 relative p-[2px]`}>
                  <div className="w-full h-full rounded-lg overflow-hidden bg-slate-900 relative">
                    <Image
                      src={`/images/items/${item.id}.jpg`}
                      alt={locale === 'en' && item.name_en ? item.name_en : item.name_ja}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">
                    {locale === 'en' && item.name_en ? item.name_en : item.name_ja}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-1 leading-snug">
                    {item.patchDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick Access Grid */}
      <section className="px-4">
        <h2 className="text-[17px] font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-3">
          {locale === 'ja' ? 'ショートカット' : 'Quick Access'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <Link href="/heroes" className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Users size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('qaHerosTitle')}</h3>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {locale === 'ja' ? `全${hokHeroes.length}体のヒーローデータ` : `Data for all ${hokHeroes.length} heroes`}
              </p>
            </div>
          </Link>

          <Link href="/patches" className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
              <FileText size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('qaPatchTitle')}</h3>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{t('qaPatchDesc')}</p>
            </div>
          </Link>

          <Link href="/guide" className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <BookOpen size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('qaGuideTitle')}</h3>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{t('qaGuideDesc')}</p>
            </div>
          </Link>
          
          <Link href="/tier-list" className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Trophy size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('qaTierTitle')}</h3>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{t('qaTierDesc')}</p>
            </div>
          </Link>

          <Link href="/items" className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShoppingBag size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{locale === 'ja' ? 'アイテム一覧' : 'Items'}</h3>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{locale === 'ja' ? '装備のステータスと効果' : 'Item stats and effects'}</p>
            </div>
          </Link>

          <Link href="/arcana" className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Hexagon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{locale === 'ja' ? 'アルカナ一覧' : 'Arcana'}</h3>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{locale === 'ja' ? 'アルカナのステータスと効果' : 'Arcana stats and effects'}</p>
            </div>
          </Link>
          </div>
        </section>
      </main>
  );
}

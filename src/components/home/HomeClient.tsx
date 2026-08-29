'use client';

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Trophy, Users, Hexagon, BookOpen, ShoppingBag, FileText, ChevronRight, Zap, BarChart3, ExternalLink } from "lucide-react";
import itemsData from '@/data/hok_items.json';
import patchesData from '@/data/patches.json';
import hokHeroes from '@/data/hok_heroes.json';
import campStatsRaw from '@/data/hero_stats_camp.json';
import dataFreshness from '@/data/data_freshness.json';
import { StatsFreshnessNote } from '@/components/common/StatsFreshnessNote';
import { normalizePatchText } from '@/lib/patchText';

/**
 * パッチ本文の見出しは Markdown の ** で囲まれている。パッチノートページは
 * 太字として描くが、トップの2行プレビューでは記号がそのまま出てしまうので落とす。
 * 改行も1行に畳んで、カードの高さを揃える
 */
const plainPatchText = (text: string | null | undefined, locale: string) =>
  normalizePatchText(text, locale).replace(/\*\*/g, '').replace(/\s*\n+\s*/g, ' ').trim();

interface MetaPick {
  role: string;
  hero_id?: string;
  image?: string;
  hero_name_en?: string;
  hero_name: string;
  title?: string;
  winRate: number;
  tier: string;
  /** 統計を取得した後にバランス調整が入ったヒーローか */
  isPrePatch: boolean;
}

import HOK_HEROES from "@/data/hok_heroes.json";
const getHeroSlug = (id: string) => {
  const hero = (HOK_HEROES as Record<string, any>[]).find((h: any) => h.id === id);
  return hero?.slug || id;
};

// 統計の取得後に調整が入ったヒーローのID。判定はヒーロー詳細（HeroDetailClient）と同じで、
// 名前や日付をコードに書かず data_freshness.json だけを見る。ピックが入れ替わっても、
// 統計を取り直して配列が空になっても、表示はこのファイルに追随する。
// 空配列になると推論が never[] に変わって .includes(string) が型エラーになるため string[] で扱う
const PRE_PATCH_HERO_IDS = dataFreshness.campStats.patchBasisHeroIds as string[];

export function HomeClient() {
  const locale = useLocale();
  const t = useTranslations("Home");
  // 静的にインポートした JSON だけで求まる値なので、描画時に同期的に計算する。
  // useEffect で後から埋めると初期HTMLがスケルトンのままになり、
  // クローラーや AdSense の審査ではローディング中の空箱しか見えない。
  const metaPicks = useMemo<MetaPick[]>(() => {
      const campStatsObj = (campStatsRaw as Record<string, any>) || {};
      const roles = ['CLASH', 'JUNGLE', 'MID', 'FARM', 'ROAM'];
      const picks: MetaPick[] = [];
      
      roles.forEach(role => {
        const champsInRole = (hokHeroes as Record<string, any>[]).map((champ: any) => {
          const stat = campStatsObj[champ.id] || Object.values(campStatsObj).find((s: any) => s.jpName === champ.name);
          return stat && stat.lane === role ? { ...champ, winRate: stat.win_rate, tier: stat.tier } : null;
        }).filter(Boolean);
        
        if (champsInRole.length > 0) {
          const tierRank = (t: string) => {
            if (t === 'S') return 3;
            if (t === 'A') return 2;
            if (t === 'B') return 1;
            return 0;
          };
          
          champsInRole.sort((a, b) => {
            const rankA = tierRank(a.tier);
            const rankB = tierRank(b.tier);
            if (rankA !== rankB) return rankB - rankA;
            return b.winRate - a.winRate;
          });
          
          picks.push({
            role: role,
            hero_id: champsInRole[0].id,
            image: champsInRole[0].image,
            hero_name: locale === 'en' && champsInRole[0].name_en ? champsInRole[0].name_en : champsInRole[0].name,
            title: champsInRole[0].title,
            winRate: champsInRole[0].winRate,
            tier: champsInRole[0].tier,
            isPrePatch: PRE_PATCH_HERO_IDS.includes(String(champsInRole[0].id)),
          });
        }
      });
      
      return picks;
  }, [locale]);

  // 「調整前」の帯と、その意味を説明する注記はセットで出す。片方だけ出ると読者が判断できない。
  // 統計を取り直して patchBasisHeroIds が空になれば両方消える
  // パッチ名は帯を出すヒーロー集合と同じ campStats から取る。
  // skillData.pendingPatch* は「スキルの書き起こしが未了のパッチ」という別の意味なので、
  // 書き起こしが終わっても値が残り、ここに使うと意味がずれる
  const pendingPatch = locale === 'en'
    ? dataFreshness.campStats.patchBasisPatchEn
    : dataFreshness.campStats.patchBasisPatchJa;
  const showPrePatchNote = Boolean(pendingPatch) && metaPicks.some(pick => pick.isPrePatch);

  // こちらも静的データのみで求まるので同期的に計算し、初期HTMLに含める。
  const { featuredItems, featuredHeros } = useMemo(() => {
    const result: { featuredItems: any[]; featuredHeros: any[] } = { featuredItems: [], featuredHeros: [] };
    {
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

      const patchesList: any[] = patchesData.filter(
        (p: any) => p.change_type === 'buff'
      );

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
          const matchedItem = (itemsData as Record<string, any>[]).find((item: any) => {
            const normItemName = normalize(item.name || '');
            return (normPatchJa && normItemName && normItemName === normPatchJa) ||
                   (normPatchEn && normItemName && normItemName === normPatchEn);
          });
          
          if (matchedItem && !seenItemIds.has(matchedItem.id)) {
            seenItemIds.add(matchedItem.id);
            return {
              id: matchedItem.id,
              name_ja: matchedItem.name,
              // 公式英名が無いアイテムだけ日本語名にフォールバックする。
              // 以前は常に日本語名を入れており、英語版トップに日本語が出ていた
              name_en: matchedItem.name_en || matchedItem.name,
              image: matchedItem.icon,
              isCompleted: true,
              patchDescription: locale === 'ja' ? patch.description : patch.description_en,
              patchVersion: locale === 'en' ? (patch.version_en || patch.version) : patch.version,
              isBuffed: true
            };
          }
          return null;
        }).filter(Boolean);
        result.featuredItems = itemsMap;
      } else {
        result.featuredItems = [];
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
          
          // name(日本語) と name_en(公式英名) の両方でパッチとヒーローを紐付ける
          const matchedHero = (hokHeroes as Record<string, any>[]).find(
            h => h.name === patch.hero_name || (patch.hero_name_en && h.name_en === patch.hero_name_en)
          );
          
          return {
            id: matchedHero ? matchedHero.id : patch.hero_name_en,
            hero_name: locale === 'en' && matchedHero?.name_en ? matchedHero.name_en : (locale === 'ja' ? patch.hero_name : (patch.hero_name_en || patch.hero_name)),
            hero_name_en: patch.hero_name_en,
            patchDescription: locale === 'ja' ? patch.description : patch.description_en,
            patchVersion: locale === 'en' ? (patch.version_en || patch.version) : patch.version,
            isBuffed: true
          };
        }).filter(Boolean);
        result.featuredHeros = champsMap;
      } else {
        result.featuredHeros = [];
      }
    }
    return result;
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
    return 'from-brand-500/10 via-slate-900 to-slate-900 hover:border-brand-500/30 group-hover:shadow-brand-500/5';
  };

  const getIconGlowColor = (item: any) => {
    if (item.isBuffed) {
      return 'bg-emerald-500/20';
    }
    const searchStr = getItemSearchString(item);
    if (searchStr.includes('攻撃力') || searchStr.includes('ad')) return 'bg-rose-500/20';
    if (searchStr.includes('魔力') || searchStr.includes('ap')) return 'bg-purple-500/20';
    if (searchStr.includes('物理防御') || searchStr.includes('魔法防御') || searchStr.includes('防御') || searchStr.includes('mr') || searchStr.includes('armor')) return 'bg-emerald-500/20';
    return 'bg-brand-500/20';
  };

  return (
    <main className="pb-8 bg-slate-50 text-slate-900 min-h-screen transition-colors">
      
      {/* Hero Banner Section */}
      <header className="relative w-full h-[280px] mb-8 overflow-hidden rounded-b-[2.5rem] shadow-sm">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0">
          <Image 
            src="/images/hero_banner_bg_light.jpg" 
            alt="Hero Background" 
            fill
            priority
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent"></div>
        </div>

        {/* 運営元のポータルへの導線。リンク集（noindex）にしか無く、トップからは
            辿れなかった。見出しが下寄せでバナー右上が空いているのでここに置く。
            見た目は最終更新バッジと揃え、サイト内ナビと混ざらないようにする */}
        <a
          href="https://hub-game.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-slate-200/50 bg-white/60 px-3.5 py-2 shadow-sm backdrop-blur-md transition-colors hover:bg-white/90"
        >
          <span className="text-[11px] font-black tracking-wider text-slate-700">HUB-GAME</span>
          <span className="hidden text-[10px] font-bold text-slate-500 sm:inline">
            {locale === 'ja' ? '同じ運営者のゲーム攻略ポータル' : 'Our other game guides'}
          </span>
          <ExternalLink size={13} className="shrink-0 text-slate-500" />
        </a>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end px-6 pb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-slate-200/50 backdrop-blur-md w-fit mb-3 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            {/* 初訪問者が最初に確かめるのは「このサイトは生きているか」。
                以前ここは DATABASE ACTIVE という飾りで、更新日はフッターの最下部にしかなかった。
                出すのはサイトの最終更新日。統計の取得日（campStats.updatedAt）を出していたが、
                解説を書き足した日とずれるうえ、すぐ下のお知らせの日付とも食い違って見えていた。
                統計の取得日は、その数字を出しているTier表・ヒーロー詳細・フッターに書いてある */}
            <span className="text-[10px] font-bold text-slate-600 tracking-wider">
              {locale === 'ja'
                ? `最終更新 ${dataFreshness.site.lastUpdated}`
                : `Updated ${dataFreshness.site.lastUpdated}`}
            </span>
          </div>
          
          <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-[1.2] mb-2">
            Honor of Kings <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
              {locale === 'ja' ? '攻略データベース' : 'Strategy Database'}
            </span>
          </h1>
          
          <p className="text-[13px] font-bold text-slate-500 leading-relaxed max-w-[90%]">
            {locale === 'ja' 
              ? `全${hokHeroes.length}体のヒーロー詳細データと最新のTier表`
              : `Detailed stats and tier list for all ${hokHeroes.length} heroes.`}
          </p>
        </div>
      </header>

      {/* お知らせバナーはここにあったが、手で書いた日付（8/20・8月14日版・9体）が
          9日間そのままになり、すぐ下の「2026-08-21取得」とも食い違っていた。
          伝えたい中身は「統計はいつのもので、どれが調整前か」の一点なので、
          数字を出している場所の真下（下の注記と各カードの帯）に移し、
          文言も data_freshness.json から組み立てて更新漏れが起きない形にした */}

      {/* Top Meta Picks Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
            {t('metaTitle')}
          </h2>
          <Link href="/tier-list" className="text-xs font-bold text-brand-600 active:text-brand-800 transition-colors">
            {locale === 'ja' ? 'すべて見る' : 'See all'}
          </Link>
        </div>

        {/* 勝率とTierを見せる以上、いつ取ったかを添える。トップは幅が狭いので
            取得日だけにし、調整対象を1体ずつ並べる注記全文はTier表とヒーロー詳細に任せる。
            ただし黙っていると、下のカードの調整前の勝率が最新の数字に見える。
            そこで該当カードに帯を出し、その意味だけをここで1行説明してTier表へ送る */}
        <StatsFreshnessNote locale={locale} showPatchBasis={false} className="px-4 -mt-2 mb-2" />

        {showPrePatchNote && (
          <div className="px-4 mb-3">
            <p className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed">
              {t('metaPrePatchNote', { patch: pendingPatch })}{' '}
              <Link
                href="/tier-list"
                className="text-amber-900 underline underline-offset-2 whitespace-nowrap"
              >
                {t('metaPrePatchLink', { count: PRE_PATCH_HERO_IDS.length })}
              </Link>
            </p>
          </div>
        )}

        {/* metaPicks は描画時に確定するため、ローディング表示は不要 */}
        {(
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5 px-4 pb-4">
            {metaPicks.map((pick, idx) => (
              <Link 
                href={`/heroes/${getHeroSlug(pick.hero_id as string)}`} 
                key={idx}
                className="w-full rounded-xl bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 active:scale-95 transition-transform flex flex-col"
              >
                <div className="aspect-square bg-slate-100 relative overflow-hidden group">
                  <Image 
                    src={pick.image || `/images/heroes/${pick.hero_id}.webp`}
                    alt={pick.hero_name}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-700 shadow-sm z-10">
                    {pick.role}
                  </div>
                  {/* カードは5列で1枚が60px前後しかない。左上はロール名で埋まっているため、
                      画像の下端いっぱいに帯で出す。カードの高さは変わらない */}
                  {showPrePatchNote && pick.isPrePatch && (
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-amber-500/95 py-0.5 text-center text-[9px] font-bold leading-tight text-white">
                      {t('metaPrePatchBadge')}
                    </div>
                  )}
                </div>
                <div className="p-1.5 flex-1 flex flex-col justify-between">
                  <h3 className="text-[10px] font-bold text-slate-800 leading-tight truncate">
                    {locale !== 'en' && <span className="hidden text-[10px] text-slate-500 font-medium mb-0.5">{pick.title || ''}</span>}
                    {pick.hero_name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1 py-0.5 rounded">
                      {String(pick.tier).startsWith('T') || String(pick.tier).startsWith('S') ? pick.tier : `T${pick.tier}`}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
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
            <Link href="/heroes" className="text-xs font-bold text-brand-600 active:text-brand-800 transition-colors">
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
                    src={(hokHeroes as Record<string, any>[]).find(h => h.id === champ.id)?.image || `/images/heroes/${champ.id}.webp`}
                    alt={champ.hero_name}
                    fill
                    sizes="40px"
                    className="object-cover scale-110"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xs truncate">
                    <span className="block text-[10px] text-slate-500 font-medium mb-0.5">{champ.title || ''}</span>
                    {champ.hero_name}
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-medium line-clamp-2 mt-1 leading-snug">
                    {plainPatchText(champ.patchDescription, locale)}
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
            <Link href="/items" className="text-xs font-bold text-brand-600 active:text-brand-800 transition-colors">
              {locale === 'ja' ? 'すべて見る' : 'See all'}
            </Link>
          </div>

          <div className="flex gap-3 px-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* アイテムの個別ページは存在しないので、一覧にクエリを渡して該当アイテムの詳細を開かせる。
                以前は /items/{id} を指しており、カードをタップすると全件404に落ちていた */}
            {featuredItems.map((item: any, idx) => (
              <Link
                key={idx}
                href={`/items?item=${item.id}`}
                className={`flex-none w-[140px] snap-center bg-gradient-to-br ${getItemGlowClass(item)} rounded-[1.25rem] p-3 shadow-sm border border-slate-100 active:scale-95 transition-all flex flex-col gap-2 relative group overflow-hidden`}
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
                  {/* 実ファイルは .png。拡張子を決め打ちしていたため全件404を出していた */}
                  <Image
                    src={item.image}
                    alt=""
                    width={80}
                    height={80}
                    className="object-cover blur-[2px] grayscale"
                  />
                </div>

                <div className={`w-10 h-10 rounded-[10px] overflow-hidden ${getIconGlowColor(item)} shrink-0 relative p-[2px]`}>
                  <div className="w-full h-full rounded-lg overflow-hidden bg-slate-900 relative">
                    <Image
                      src={item.image}
                      alt={locale === 'en' && item.name_en ? item.name_en : item.name_ja}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="font-bold text-slate-800 text-xs truncate">
                    {locale === 'en' && item.name_en ? item.name_en : item.name_ja}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mt-1 leading-snug">
                    {plainPatchText(item.patchDescription, locale)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* アジア競技大会は 2026-09-28 の1日だけ。国内開催で流入が集中する時期なので
          ショートカットの上に出す。大会が終わったらこのブロックごと外す */}
      <section className="px-4 mb-6">
        <Link
          href="/esports/asian-games-2026"
          className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 p-4 text-white shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
        >
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-100">
              {locale === 'ja' ? '愛知・名古屋で開催' : 'Held in Aichi-Nagoya'}
            </div>
            <div className="text-sm font-black leading-snug">
              {locale === 'ja'
                ? '🏆 アジア競技大会2026のHonor of Kings — 9月28日'
                : '🏆 Honor of Kings at the 2026 Asian Games — 28 Sept'}
            </div>
          </div>
          <ChevronRight size={18} className="shrink-0" />
        </Link>
      </section>

      {/* Quick Access Grid */}
      <section className="px-4">
        <h2 className="text-[17px] font-bold text-slate-900 tracking-tight mb-3">
          {locale === 'ja' ? 'ショートカット' : 'Quick Access'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <Link href="/heroes" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaHerosTitle')}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                {locale === 'ja' ? `全${hokHeroes.length}体のヒーローデータ` : `Data for all ${hokHeroes.length} heroes`}
              </p>
            </div>
          </Link>

          <Link href="/patches" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <FileText size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaPatchTitle')}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{t('qaPatchDesc')}</p>
            </div>
          </Link>

          <Link href="/guide" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <BookOpen size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaGuideTitle')}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{t('qaGuideDesc')}</p>
            </div>
          </Link>
          
          <Link href="/tier-list" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Trophy size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaTierTitle')}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{t('qaTierDesc')}</p>
            </div>
          </Link>

          <Link href="/items" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShoppingBag size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{locale === 'ja' ? 'アイテム一覧' : 'Items'}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{locale === 'ja' ? '装備のステータスと効果' : 'Item stats and effects'}</p>
            </div>
          </Link>

          <Link href="/arcana" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Hexagon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{locale === 'ja' ? 'アルカナ一覧' : 'Arcana'}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{locale === 'ja' ? 'アルカナのステータスと効果' : 'Arcana stats and effects'}</p>
            </div>
          </Link>

          {/* 全ヒーローの実測ステータスを並び替えて比べられる一覧。
              これまでヒーロー詳細からしか入口が無かった */}
          <Link href="/heroes/stats" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <BarChart3 size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{locale === 'ja' ? '基本ステータス比較' : 'Base Stat Rankings'}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{locale === 'ja' ? 'HP・攻撃・移動速度を並び替えて比べる' : 'Sort heroes by HP, attack and move speed'}</p>
            </div>
          </Link>

          {/* サイドバーではアイテム・アルカナと同格なのに、トップからの導線だけ無かった */}
          <Link href="/spells" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{locale === 'ja' ? 'サモナースペル' : 'Summoner Spells'}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{locale === 'ja' ? '全11種の効果と使いどころ' : 'All 11 spells and when to take them'}</p>
            </div>
          </Link>
          </div>
        </section>
      </main>
  );
}

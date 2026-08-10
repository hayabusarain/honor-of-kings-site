"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Sparkles, Search } from "lucide-react";
import fallbackPatches from "@/data/patches.json";
import fallbackPatchMetas from "@/data/patch_meta.json";
import hokHeroes from "@/data/hok_heroes.json";

type Patch = {
  id: string;
  version: string | null;
  hero_id?: string | null;
  hero_name?: string | null;
  hero_name_en?: string | null;
  change_type?: string | null;
  description?: string | null;
  description_en?: string | null;
  is_hero?: boolean | null;
  [key: string]: any;
};
type PatchMeta = {
  id: string;
  version: string;
  prediction_ja: string;
  prediction_en: string;
  created_at: string;
};

// dummyPatches removed

// パッチデータの version_en を正とし、無い場合のみ日付部分を機械変換するフォールバック
const versionEnMap: Record<string, string> = {};
(fallbackPatches as any[]).forEach((p: any) => {
  if (p.version && p.version_en && !versionEnMap[p.version]) {
    versionEnMap[p.version] = p.version_en;
  }
});

const formatVersionTitle = (version: string, locale: string): string => {
  if (!version) return version;
  if (locale === 'en') {
    if (versionEnMap[version]) return versionEnMap[version];
    let text = version.replace('アップデートのお知らせ', ' Update');
    text = text.replace(/(\d+)月(\d+)日/g, (m, month, day) => {
      const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return (monthNames[parseInt(month, 10)] || month) + ' ' + day;
    });
    return text;
  }
  return version;
};

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

  // Handle standard semantic versions like "1.24b"
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

export function PatchTable({ heroId }: { heroId?: string }) {
  const t = useTranslations("PatchTable");
  const locale = useLocale();
  const initialPatches = heroId
    ? (fallbackPatches as any as Patch[]).filter(p => p.hero_id === heroId || p.hero_name_en === heroId)
    : (fallbackPatches as any as Patch[]);

  const [patches] = useState<Patch[]>(initialPatches);
  const [patchMetas] = useState<PatchMeta[]>(fallbackPatchMetas as PatchMeta[]);
  
  // Derive unique versions from the loaded patches (only include standard numeric versions)
  const uniqueVersions = Array.from(new Set(patches.map(p => p.version)))
    .filter(v => v && /^\d/.test(v))
    .sort((a, b) => compareVersions(b || "", a || ""));

  const [selectedVersion, setSelectedVersion] = useState<string | null>(uniqueVersions[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "buff" | "nerf" | "adjust">("all");
  const [iconMap] = useState<Record<string, string>>({});

  const selectedPatchMeta = patchMetas.find(m => m.version === selectedVersion);

  const renderDescription = (text: string) => {
    if (!text) return null;
    return <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed space-y-1">{text}</div>;
  };

  // フィルタリングロジック
  const filteredPatches = patches.filter(p => {
    // 1. テキスト検索
    const query = searchQuery.toLowerCase();
    const matchText = !query || 
      (p.hero_name && p.hero_name.toLowerCase().includes(query)) || 
      (p.hero_name_en && p.hero_name_en.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.description_en && p.description_en.toLowerCase().includes(query));

    // 2. タイプフィルター
    const matchType = filterType === "all" || p.change_type === filterType;

    // 3. バージョンフィルター
    // 検索入力があるか、フィルターがall以外の場合は、全バージョンを串刺し検索する
    const isSearching = query.length > 0 || filterType !== "all";
    const matchVersion = isSearching || p.version === selectedVersion;

    return matchText && matchType && matchVersion;
  });



  return (
    <div className="space-y-6">

      {/* 検索・フィルター UI (ヒーロー指定時は非表示) */}
      {!heroId && (
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white text-xs font-bold shadow-inner transition-all"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 w-full">
            <button 
              onClick={() => setFilterType('all')}
              className={`py-2 text-[10px] font-black rounded-lg border transition-all ${filterType === 'all' ? 'bg-slate-800 text-white border-slate-800 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
            >
              {t("filterAll")}
            </button>
            <button 
              onClick={() => setFilterType('buff')}
              className={`py-2 text-[10px] font-black rounded-lg border transition-all ${filterType === 'buff' ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-white text-emerald-600 border-slate-200 hover:bg-emerald-50'}`}
            >
              {t("filterBuff")}
            </button>
            <button 
              onClick={() => setFilterType('nerf')}
              className={`py-2 text-[10px] font-black rounded-lg border transition-all ${filterType === 'nerf' ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-white text-rose-600 border-slate-200 hover:bg-rose-50'}`}
            >
              {t("filterNerf")}
            </button>
            <button 
              onClick={() => setFilterType('adjust')}
              className={`py-2 text-[10px] font-black rounded-lg border transition-all ${filterType === 'adjust' ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-white text-amber-600 border-slate-200 hover:bg-amber-50'}`}
            >
              {t("filterAdjust")}
            </button>
          </div>
        </div>
        
        {/* 検索中（串刺しモード）のインジケーター */}
        {(searchQuery.length > 0 || filterType !== 'all') && (
          <div className="mt-3 text-[10px] font-bold text-brand-600 flex items-center gap-1 bg-brand-50 px-2 py-1.5 rounded-md inline-flex border border-brand-100">
            <Sparkles size={12} />
            {t("crossSearchActive")}
          </div>
        )}
      </div>
      )}

      {!heroId && uniqueVersions.length > 0 && searchQuery.length === 0 && filterType === 'all' && (
        <div className="mb-4 flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm">
          <label htmlFor="version-select" className="text-xs font-bold text-slate-500 shrink-0">
            {t("displayVersion")}
          </label>
          <select
            id="version-select"
            value={selectedVersion || ""}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-black text-slate-800 focus:ring-0 w-full pl-1"
          >
            {uniqueVersions.map(v => {
              const meta = (patches as any[]).find((p: any) => p.version === v);
              const title = meta && meta.title ? String(meta.title) : (/^[\d.]+$/.test(v || '') ? `Patch ${v}` : (v || ''));
              return <option key={v || ''} value={v || ''}>{formatVersionTitle(title || '', locale)}</option>
            })}
          </select>
        </div>
      )}

      {!heroId && selectedPatchMeta && !searchQuery && filterType === 'all' && (
        <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-100 p-4 rounded-2xl shadow-sm relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-50" />
          <h3 className="text-xs font-black text-brand-900 mb-2 flex items-center gap-1.5 relative z-10">
            <Sparkles size={14} className="text-brand-500" />
            {locale === 'en' ? 'AI Meta Prediction' : 'AI メタ予想'}
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed font-medium relative z-10">
            {locale === 'en' ? selectedPatchMeta.prediction_en : selectedPatchMeta.prediction_ja}
          </p>
        </div>
      )}

      {/* Error message removed */}
      
      <div>
        {filteredPatches.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium">
            {t("noResults")}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPatches.map((patch) => (
              <div 
                key={patch.id} 
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center border border-slate-300">
                      {(() => {
                        if (patch.is_hero === false) {
                          if (iconMap[patch.hero_name_en?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '']) {
                            return <Image src={iconMap[patch.hero_name_en?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '']} alt={patch.hero_name_en || patch.hero_name || ''} fill sizes="40px" className="object-cover" />;
                          }
                          return <span className="text-lg">⚔️</span>;
                        }
                        
                        // Try to find the hero ID (e.g. hero_004) to load the local image
                        const matchedHero = (hokHeroes as Record<string, any>[]).find(h => 
                          h.id === patch.hero_name_en || 
                          h.name === patch.hero_name ||
                          h.name === patch.hero_name_en
                        );
                        
                        if (matchedHero) {
                          return (
                            <Image 
                              src={matchedHero.image}
                              alt={patch.hero_name_en || patch.hero_name || ''}
                              fill
                              sizes="40px"
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent && !parent.querySelector('.fallback-icon')) {
                                  const fallback = document.createElement('div');
                                  fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-purple-600 text-white font-black text-sm shadow-inner absolute inset-0';
                                  fallback.innerText = patch.hero_name?.substring(0, 1) || '?';
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          );
                        }
                        
                        // Fallback icon if no local image mapping is found
                        return (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-purple-600 text-white font-black text-sm shadow-inner">
                            {patch.hero_name?.substring(0, 1) || '?'}
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">
                        {locale === 'en' ? (patch.hero_name_en || patch.hero_name) : patch.hero_name}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {/^[\d.]+$/.test(patch.version || "") ? `Patch ${patch.version}` : formatVersionTitle(patch.version || "", locale)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                      patch.change_type === "buff"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : patch.change_type === "nerf"
                        ? "bg-rose-100 text-rose-700 border border-rose-200"
                        : patch.change_type === "adjust"
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : patch.change_type === "new"
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {patch.change_type}
                  </span>
                </div>
                <div className="text-sm text-slate-700">
                  {renderDescription(locale === 'en' ? (patch.description_en || patch.description || "") : (patch.description || ""))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

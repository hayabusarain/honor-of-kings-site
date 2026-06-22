"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";
import { useTranslations, useLocale } from "next-intl";
import { Sparkles, Search, Filter } from "lucide-react";
import fallbackPatches from "@/data/patches.json";
import fallbackPatchMetas from "@/data/patch_meta.json";
import hokHeroes from "@/data/hok_heroes.json";

type Patch = Database["public"]["Tables"]["patches"]["Row"];
type PatchMeta = {
  id: string;
  version: string;
  prediction_ja: string;
  prediction_en: string;
  created_at: string;
};

// dummyPatches removed

// Helper function to sort patch versions numerically and suffix-sensitively
const compareVersions = (a: string, b: string): number => {
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
    ? (fallbackPatches as unknown as Patch[]).filter(p => (p as any).hero_id === heroId || p.hero_name_en === heroId)
    : (fallbackPatches as unknown as Patch[]);

  const [patches, setPatches] = useState<Patch[]>(initialPatches);
  const [patchMetas, setPatchMetas] = useState<PatchMeta[]>(fallbackPatchMetas as PatchMeta[]);
  const [loading, setLoading] = useState(false);
  
  // Derive unique versions from the loaded patches (only include standard numeric versions)
  const uniqueVersions = Array.from(new Set(patches.map(p => p.version)))
    .filter(v => v && /^\d/.test(v))
    .sort((a, b) => compareVersions(b, a));

  const [selectedVersion, setSelectedVersion] = useState<string | null>(uniqueVersions[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "buff" | "nerf" | "adjust">("all");
  const [iconMap, setIconMap] = useState<Record<string, string>>({});

  // Set default selected version when patches load
  useEffect(() => {
    if (patches.length > 0 && !selectedVersion) {
      setSelectedVersion(uniqueVersions[0]);
    }
  }, [patches, selectedVersion, uniqueVersions]);

  const fetchPatches = async () => {
    setLoading(false);
    // Disabled Supabase fetches for local JSON project
    const filteredFallback = heroId
      ? (fallbackPatches as unknown as Patch[]).filter(p => (p as any).hero_id === heroId || p.hero_name_en === heroId)
      : (fallbackPatches as unknown as Patch[]);
    setPatches(filteredFallback);
    return;
    /*
    try {
      const supabase = createClient();
      
      let query = supabase
        .from("patches")
        .select("*")
        .order("version", { ascending: false })
        .order("created_at", { ascending: true });

      if (heroId) {
        query = query.eq('hero_id', heroId);
      }

      const { data: patchesData, error: patchesError } = await query;

      if (patchesError) {
        console.warn('Supabase Fetch Patches Error:', patchesError);
        throw patchesError;
      }

      const { data: metaData, error: metaError } = await supabase
        .from("patch_meta")
        .select("*");

      if (metaError) {
        console.warn('Supabase Fetch Meta Error:', metaError);
      }

      if (patchesData && patchesData.length > 0) {
        const typedData = patchesData as Patch[];
        const merged = [...typedData];
        
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

        const filteredFallback = heroId
          ? (fallbackPatches as Patch[]).filter(p => p.hero_id === heroId || p.hero_name_en === heroId)
          : (fallbackPatches as Patch[]);
        
        filteredFallback.forEach((p: any) => {
          const isDup = merged.some(existing => isDuplicatePatch(existing, p));
          if (!isDup) {
            merged.push(p);
          }
        });
        setPatches(merged);
        setPatchMetas(metaData || []);
      } else {
        const filteredFallback = heroId
          ? (fallbackPatches as Patch[]).filter(p => p.hero_id === heroId || p.hero_name_en === heroId)
          : (fallbackPatches as Patch[]);
        setPatches(filteredFallback);
      }
    } catch (err: any) {
      console.warn("Supabase fetch error:", err);
      // Keep fallback data on error
    } finally {
      setLoading(false);
    }
    */
  };

  useEffect(() => {
    fetchPatches();
  }, []);

  useEffect(() => {
    // Icons are handled locally now.
    setIconMap({});
  }, []);

  if (loading && patches.length === 0) {
    return <div className="p-4 text-center text-slate-500">{t("loading")}</div>;
  }

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
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-xs font-bold shadow-inner transition-all"
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
          <div className="mt-3 text-[10px] font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 px-2 py-1.5 rounded-md inline-flex border border-indigo-100">
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
            {uniqueVersions.map(v => (
              <option key={v} value={v}>Patch {v}</option>
            ))}
          </select>
        </div>
      )}

      {!heroId && selectedPatchMeta && !searchQuery && filterType === 'all' && (
        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-4 rounded-2xl shadow-sm relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-50" />
          <h3 className="text-xs font-black text-indigo-900 mb-2 flex items-center gap-1.5 relative z-10">
            <Sparkles size={14} className="text-indigo-500" />
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
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center border border-slate-300">
                      {(() => {
                        if ((patch as any).is_hero === false) {
                          if (iconMap[patch.hero_name_en?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '']) {
                            return <img src={iconMap[patch.hero_name_en?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '']} alt={patch.hero_name_en || patch.hero_name} className="w-full h-full object-cover" />;
                          }
                          return <span className="text-lg">⚔️</span>;
                        }
                        
                        // Try to find the hero ID (e.g. hero_004) to load the local image
                        const matchedHero = (hokHeroes as any[]).find(h => 
                          h.id === patch.hero_name_en || 
                          h.name === patch.hero_name ||
                          h.name === patch.hero_name_en
                        );
                        
                        if (matchedHero) {
                          return (
                            <img 
                              src={`/images/heroes/${matchedHero.id}.jpg`}
                              alt={patch.hero_name_en || patch.hero_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent && !parent.querySelector('.fallback-icon')) {
                                  const fallback = document.createElement('div');
                                  fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm shadow-inner';
                                  fallback.innerText = patch.hero_name?.substring(0, 1) || '?';
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          );
                        }
                        
                        // Fallback icon if no local image mapping is found
                        return (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm shadow-inner">
                            {patch.hero_name?.substring(0, 1) || '?'}
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">
                        {locale === 'en' ? (patch.hero_name_en || patch.hero_name) : patch.hero_name}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">Patch {patch.version}</span>
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
                  {renderDescription(locale === 'en' ? (patch.description_en || patch.description) : patch.description)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

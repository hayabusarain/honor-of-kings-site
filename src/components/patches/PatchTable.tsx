"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Sparkles, Search } from "lucide-react";
import hokHeroes from "@/data/hok_heroes.json";
import { normalizePatchText } from '@/lib/patchText';
import { searchNormalize } from '@/utils/searchNormalize';
import type { PatchEntry } from '@/lib/patchData';

// patches.json / patch_meta.json は import しない（合わせて216KBがバンドルに載り、
// しかも共有チャンクに入るのでトップやヒーロー詳細でも読み込まれていた）。
// 表示に必要な分だけをサーバー側から props で受け取る
export type PatchMeta = {
  id: string;
  version: string;
  prediction_ja: string;
  prediction_en: string;
  created_at: string;
};

// パッチデータの version_en を正とし、無い場合のみ日付部分を機械変換するフォールバック
const buildVersionEnMap = (patches: PatchEntry[]): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const p of patches) {
    if (p.version && p.version_en && !map[p.version]) map[p.version] = p.version_en;
  }
  return map;
};

const formatVersionTitle = (version: string, locale: string, versionEnMap: Record<string, string>): string => {
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

export function PatchTable({ patches, patchMetas = [], compact = false }: {
  /** 表示するパッチ。サーバー側（patchData.ts）で読み、必要な分だけ渡す */
  patches: PatchEntry[];
  /** バージョンごとのメタ分析。畳んだ表示（compact）では使わないので既定は空 */
  patchMetas?: PatchMeta[];
  /** ヒーロー詳細に埋め込む短い表示。検索・フィルタ・過去分の一覧を出さない */
  compact?: boolean;
}) {
  const t = useTranslations("PatchTable");
  const locale = useLocale();
  const versionEnMap = useMemo(() => buildVersionEnMap(patches), [patches]);

  // Derive unique versions from the loaded patches (only include standard numeric versions)
  const uniqueVersions = Array.from(new Set(patches.map(p => p.version)))
    .filter(v => v && /^\d/.test(v))
    .sort((a, b) => compareVersions(b || "", a || ""));

  const [selectedVersion, setSelectedVersion] = useState<string | null>(uniqueVersions[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "buff" | "nerf" | "adjust">("all");
  const [iconMap] = useState<Record<string, string>>({});

  // 横断検索からは /patches?q=<入力> で着地する。過去バージョンは閉じた
  // <details> の中にあるのでアンカーでは飛べず、代わりに検索語を渡して
  // 既存の横断検索モードで絞り込ませている。
  // useSearchParams ではなく location を読むのは、静的生成を
  // Suspense 境界なしで維持するため（items/page.tsx と同じ理由）
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (!q) return;
    // サーバー側では location を読めないため、初期stateではなくマウント後に入れる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(q);
  }, []);

  const selectedPatchMeta = patchMetas.find(m => m.version === selectedVersion);
  // version → 版ページのスラッグ（created_at の YYYY-MM-DD）。
  // 版ページ側は1件しか渡さないので、そこでは対応表が空になり入口も出ない
  const versionDate: Record<string, string> = useMemo(
    () => Object.fromEntries(patchMetas.map(m => [m.version, String(m.created_at).slice(0, 10)])),
    [patchMetas],
  );

  // 解説文の **強調** を見出しとして描画する（生の ** が表示されていた）
  const renderDescription = (raw: string) => {
    const text = normalizePatchText(raw, locale);
    if (!text) return null;
    return (
      <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed space-y-1">
        {text.split(/\*\*([^*]+)\*\*/g).map((part, i) =>
          i % 2 === 1
            ? <strong key={i} className="font-black text-slate-900">{part}</strong>
            : part
        )}
      </div>
    );
  };

  // フィルタリングロジック
  const filteredPatches = patches.filter(p => {
    // 1. テキスト検索
    // 正規化は横断検索・ヒーロー一覧と共有する（src/utils/searchNormalize.ts）。
    // ここを素の lowercase includes のままにすると、横断検索が正規化で拾った
    // クエリを ?q= で渡した瞬間に0件になる
    const query = searchNormalize(searchQuery);
    const matchText = !query ||
      searchNormalize(p.hero_name || '').includes(query) ||
      searchNormalize(p.hero_name_en || '').includes(query) ||
      searchNormalize(p.description || '').includes(query) ||
      searchNormalize(p.description_en || '').includes(query);

    // 2. タイプフィルター
    const matchType = filterType === "all" || p.change_type === filterType;

    // 3. バージョンフィルター
    // 検索入力があるか、フィルターがall以外の場合は、全バージョンを横断検索する
    const isSearching = query.length > 0 || filterType !== "all";
    const matchVersion = isSearching || p.version === selectedVersion;

    return matchText && matchType && matchVersion;
  });



  return (
    <div className="space-y-6">

      {/* 検索・フィルター UI (ヒーロー指定時は非表示) */}
      {!compact && (
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
              aria-pressed={filterType === 'all'}
              className={`py-2 text-[10px] font-black rounded-lg border transition-all ${filterType === 'all' ? 'bg-slate-900 text-white border-slate-800 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
            >
              {t("filterAll")}
            </button>
            <button 
              onClick={() => setFilterType('buff')}
              aria-pressed={filterType === 'buff'}
              className={`py-2 text-[10px] font-black rounded-lg border transition-all ${filterType === 'buff' ? 'bg-slate-900 text-white border-slate-800 shadow-sm' : 'bg-white text-emerald-600 border-slate-200 hover:bg-emerald-50'}`}
            >
              {t("filterBuff")}
            </button>
            <button 
              onClick={() => setFilterType('nerf')}
              aria-pressed={filterType === 'nerf'}
              className={`py-2 text-[10px] font-black rounded-lg border transition-all ${filterType === 'nerf' ? 'bg-slate-900 text-white border-slate-800 shadow-sm' : 'bg-white text-rose-600 border-slate-200 hover:bg-rose-50'}`}
            >
              {t("filterNerf")}
            </button>
            <button 
              onClick={() => setFilterType('adjust')}
              aria-pressed={filterType === 'adjust'}
              className={`py-2 text-[10px] font-black rounded-lg border transition-all ${filterType === 'adjust' ? 'bg-slate-900 text-white border-slate-800 shadow-sm' : 'bg-white text-amber-600 border-slate-200 hover:bg-amber-50'}`}
            >
              {t("filterAdjust")}
            </button>
          </div>
        </div>
        
        {/* 検索中（横断モード）のインジケーター */}
        {(searchQuery.length > 0 || filterType !== 'all') && (
          <div className="mt-3 text-[10px] font-bold text-brand-700 flex items-center gap-1 bg-brand-50 px-2 py-1.5 rounded-md inline-flex border border-brand-100">
            <Sparkles size={12} />
            {t("crossSearchActive")}
          </div>
        )}
      </div>
      )}

      {/* 版が1つだけのとき（/patches/[date]）は選ばせる意味が無いので出さない */}
      {!compact && uniqueVersions.length > 1 && searchQuery.length === 0 && filterType === 'all' && (
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
              const title = /^[\d.]+$/.test(v || '') ? `Patch ${v}` : (v || '');
              return <option key={v || ''} value={v || ''}>{formatVersionTitle(title, locale, versionEnMap)}</option>
            })}
          </select>
        </div>
      )}

      {!compact && selectedPatchMeta && !searchQuery && filterType === 'all' && (
        <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-100 p-4 rounded-2xl shadow-sm relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-50" />
          <h3 className="text-xs font-black text-brand-900 mb-2 flex items-center gap-1.5 relative z-10">
            <Sparkles size={14} className="text-brand-500" />
            {locale === 'en' ? 'Meta Analysis' : 'メタ分析'}
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed font-medium relative z-10">
            {/* 予想文中の **強調** を解釈する（生の ** が表示されていた） */}
            {(locale === 'en' ? selectedPatchMeta.prediction_en : selectedPatchMeta.prediction_ja)
              ?.split(/\*\*([^*]+)\*\*/g)
              .map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-brand-800">{part}</strong> : part))}
          </p>
        </div>
      )}

      {/* Error message removed */}
      
      <div>
        {filteredPatches.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-medium">
            {t("noResults")}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPatches.map((patch) => (
              <div
                key={patch.id}
                /* 1件を指せるようにする。横断検索から
                   /patches/2026-08-27#patch_8_27_1 で着地する。
                   scroll-mt は固定ヘッダー（AppBar 56px）ぶんの逃げ */
                id={patch.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 scroll-mt-20"
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
                      <span className="text-xs font-semibold text-slate-500">
                        {/^[\d.]+$/.test(patch.version || "") ? `Patch ${patch.version}` : formatVersionTitle(patch.version || "", locale, versionEnMap)}
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

      {/* 過去バージョンの全文。従来はセレクタで選んだ1バージョンしかDOMに無く、
          日本語29,000字のうち初期HTMLに出ていたのは最新版の7,400字だけだった。
          details にしておけば、畳んだままでも中身は読み取られる */}
      {!compact && !searchQuery && filterType === 'all' && uniqueVersions.length > 1 && (
        <section className="pt-2">
          <h2 className="text-sm font-black text-slate-500 mb-3 uppercase tracking-wider">
            {locale === 'en' ? 'Past Updates' : '過去のアップデート'}
          </h2>
          <div className="space-y-3">
            {uniqueVersions.filter(v => v !== selectedVersion).map(v => {
              const entries = patches.filter(p => p.version === v);
              if (entries.length === 0) return null;
              const heading = formatVersionTitle(v || '', locale, versionEnMap);
              return (
                <details key={v || ''} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden group">
                  <summary className="px-4 py-3 cursor-pointer font-black text-sm text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <span>{heading}</span>
                    <span className="text-[10px] font-bold text-slate-500 shrink-0 ml-3">
                      {locale === 'en' ? `${entries.length} changes` : `${entries.length}件`}
                    </span>
                  </summary>
                  <div className="px-4 pb-4 pt-1 space-y-4 border-t border-slate-100">
                    {/* この版だけのページへの入口。details の中身は残す
                        （畳んだままでもクローラは読み取るので、初期HTMLの本文量は減らない） */}
                    {versionDate[v || ''] && (
                      <Link
                        href={`/patches/${versionDate[v || '']}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 underline underline-offset-2"
                      >
                        {locale === 'en' ? 'Open this update on its own page' : 'この回だけのページを開く'}
                      </Link>
                    )}
                    {entries.map(patch => (
                      <article key={patch.id}>
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1">
                          {locale === 'en' ? (patch.hero_name_en || patch.hero_name) : patch.hero_name}
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            {patch.change_type}
                          </span>
                        </h3>
                        {renderDescription(locale === 'en' ? (patch.description_en || patch.description || '') : (patch.description || ''))}
                      </article>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

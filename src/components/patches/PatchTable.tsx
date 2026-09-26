"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  Sparkles, Search, History, ChevronDown,
  PartyPopper, Wrench, Gamepad2, Trophy, UserPlus, Package, Gem, MapIcon, SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { normalizePatchText, patchShortLabel } from '@/lib/patchText';
import { searchNormalize } from '@/utils/searchNormalize';
import { Dropdown } from '@/components/common/Dropdown';
import { patchChangeDef } from '@/components/common/PatchChangeBadge';
import { SELECTED } from '@/components/common/tones';
import type { PatchEntry } from '@/lib/patchData';
import type { PatchIconKind } from '@/lib/patchIconKind';

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

type FilterType = "all" | "buff" | "nerf" | "adjust";

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

  if (!matchA && !matchB) return a.localeCompare(b, 'ja');
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
  return suffixA.localeCompare(suffixB, 'en');
};

/**
 * ヒーロー以外の行の図柄。種類はサーバー（patchData.ts → patchIconKind.ts）が行の英語名から決める。
 * 以前は一律に「⚔️」で、イベントも装備の調整も同じ剣だった（2026-09-26、Wild Rift Hub からの申し送り）
 */
const KIND_ICON: Record<PatchIconKind, LucideIcon> = {
  event: PartyPopper,
  fix: Wrench,
  mode: Gamepad2,
  season: Trophy,
  hero: UserPlus,
  item: Package,
  arcana: Gem,
  map: MapIcon,
  system: SlidersHorizontal,
};

/**
 * 項目の顔。ヒーローは顔アイコン（パスはサーバーの patchData.ts が入れる）、
 * ヒーロー以外は行の中身に合った図柄。画像が読めなければ頭文字を出す。
 * 名前は隣に文字で出ているので、画像の alt は空にし、図柄も読ませない。
 * 図柄は中立の面に金で描く。金の線と淡い金の塗りは「選択中」の表示（tones.ts の SELECTED）なので使わない
 */
function PatchIcon({ patch, size }: { patch: PatchEntry; size: 36 | 40 }) {
  const [broken, setBroken] = useState(false);
  const box = size === 36 ? 'h-9 w-9' : 'h-10 w-10';
  let inner;
  if (patch.is_hero === false) {
    const Icon = KIND_ICON[patch.icon_kind ?? 'system'];
    inner = <Icon size={size === 36 ? 18 : 20} strokeWidth={2.25} className="text-brand-700" aria-hidden="true" />;
  } else if (patch.hero_image && !broken) {
    inner = <Image src={patch.hero_image} alt="" fill sizes={`${size}px`} className="object-cover" onError={() => setBroken(true)} />;
  } else {
    // 頭文字の地は金と紫のグラデーションに text-white だった。夜の配色では text-white が
    // 暗い色になり、明るい金の上に暗い字が載る。面と本文の色に替える
    inner = (
      <span aria-hidden="true" className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-700 font-black text-sm">
        {patch.hero_name?.substring(0, 1) || '?'}
      </span>
    );
  }
  return (
    <span className={`relative ${box} shrink-0 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center border border-slate-300`}>
      {inner}
    </span>
  );
}

/** 変更の種類の札。語と色はヒーロー一覧の↑↓バッジと共通（PatchChangeBadge.tsx の PATCH_CHANGE） */
function ChangeTag({ type, locale, className }: { type: string | null | undefined; locale: string; className: string }) {
  const def = patchChangeDef(type);
  const en = locale === 'en';
  return (
    <span className={`shrink-0 rounded-full border font-black leading-none ${def.cls} ${en ? 'uppercase tracking-wider' : ''} ${className}`}>
      {en ? def.en : def.ja}
    </span>
  );
}

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
  const en = locale === 'en';
  const versionEnMap = useMemo(() => buildVersionEnMap(patches), [patches]);

  // Derive unique versions from the loaded patches (only include standard numeric versions)
  const uniqueVersions = Array.from(new Set(patches.map(p => p.version)))
    .filter((v): v is string => !!v && /^\d/.test(v))
    .sort((a, b) => compareVersions(b, a));

  const [selectedVersion, setSelectedVersion] = useState<string | null>(uniqueVersions[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  // メタ分析を開いている版。版を選び直したら畳んだ状態に戻る
  const [metaOpenFor, setMetaOpenFor] = useState<string | null>(null);
  // 6行に収まっていて畳む必要が無いか。PC幅（本文910px）の6/19版は5行で切れず、
  // 押しても何も変わらない「続きを読む」が出ていた。初期HTMLではボタンを出しておき、描画後に測って消す
  const [metaFits, setMetaFits] = useState(false);
  const metaRef = useRef<HTMLParagraphElement>(null);

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
  const metaOpen = metaOpenFor !== null && metaOpenFor === selectedVersion;
  // version → 版ページのスラッグ（created_at の YYYY-MM-DD）。
  // 版ページ側は1件しか渡さないので、そこでは対応表が空になり入口も出ない
  const versionDate: Record<string, string> = useMemo(
    () => Object.fromEntries(patchMetas.map(m => [m.version, String(m.created_at).slice(0, 10)])),
    [patchMetas],
  );

  /** 版の短い呼び名（9月23日パッチ（S16））。日付の読めない版名は従来の表記に戻す */
  const versionLabel = (v: string | null | undefined) =>
    /^\d+月\d+日/.test(v || '') ? patchShortLabel(v, locale, true) : formatVersionTitle(v || '', locale, versionEnMap);
  const heroName = (p: PatchEntry) => (en ? (p.hero_name_en || p.hero_name) : p.hero_name) || '';
  // 目次の名前は、折るなら括弧の前だけで折る。「元流の子（メイ／ジ）」のように括弧の中で切れていた。
  // 日本語は本体と括弧書きをそれぞれ折らない塊にし、間に <wbr> を置く。
  // 英語は空白で折れるので、そのまま返す（塊にすると "Flowborn(Mage)" と空白が消える）
  const tocName = (name: string) => {
    const at = name.search(/（/);
    if (en || at <= 0) return <span className={en ? undefined : 'whitespace-nowrap'}>{name}</span>;
    return (
      <>
        <span className="whitespace-nowrap">{name.slice(0, at)}</span>
        <wbr />
        <span className="whitespace-nowrap">{name.slice(at)}</span>
      </>
    );
  };
  // 項目カードの名前（16px で札と横に並ぶ）。括弧のある名前は括弧の前だけで折り、括弧の無い名前は
  // 呼ぶ側の auto-phrase で文節で折る。どちらも無いと 360px で「元流の子（マークス／マン）」
  // 「シーズンと新ヒーロ／ー」「最適／化」と語の途中で切れていた（390px でも「マークスマ／ン」）。
  // 塊を whitespace-nowrap でなく break-keep にするのは、320px のように塊が1行に入らない幅で
  // 札に重ならないようにするため（そのときだけ呼ぶ側の overflow-wrap:anywhere が塊の中で折る）
  const cardName = (name: string) => {
    const at = en ? -1 : name.search(/（/);
    if (at <= 0) return name;
    return (
      <>
        <span className="break-keep">{name.slice(0, at)}</span>
        <wbr />
        <span className="break-keep">{name.slice(at)}</span>
      </>
    );
  };

  // 解説文の **強調** を見出しとして描画する（生の ** が表示されていた）。
  // 見出しは 390px で「強化通常攻撃が倍にな／り」と語の途中で折れていたので、文節で折る（auto-phrase）。
  // 本文の地の文はふつうの組み方のまま（文節で折ると行末の空きが目立つ）
  const renderDescription = (raw: string) => {
    const text = normalizePatchText(raw, locale);
    if (!text) return null;
    return (
      <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed space-y-1">
        {text.split(/\*\*([^*]+)\*\*/g).map((part, i) =>
          i % 2 === 1
            ? <strong key={i} className="font-black text-slate-900 [word-break:auto-phrase]">{part}</strong>
            : part
        )}
      </div>
    );
  };

  // 正規化は横断検索・ヒーロー一覧と共有する（src/utils/searchNormalize.ts）。
  // ここを素の lowercase includes のままにすると、横断検索が正規化で拾った
  // クエリを ?q= で渡した瞬間に0件になる
  const query = searchNormalize(searchQuery);
  // 検索入力があるか、フィルターがall以外の場合は、全バージョンを横断検索する
  const isSearching = query.length > 0 || filterType !== "all";

  // 畳んだ状態で本文が切れているかを測る。ResizeObserver は observe の直後にも1回呼ぶので、
  // 版を選び直したときや横断検索から戻ったときも、ここで測り直す
  useEffect(() => {
    const el = metaRef.current;
    if (!el || metaOpen) return;
    const ro = new ResizeObserver(() => setMetaFits(el.scrollHeight <= el.clientHeight + 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, [selectedPatchMeta, metaOpen, isSearching]);

  const filteredPatches = patches.filter(p => {
    // 1. テキスト検索
    const matchText = !query ||
      searchNormalize(p.hero_name || '').includes(query) ||
      searchNormalize(p.hero_name_en || '').includes(query) ||
      searchNormalize(p.description || '').includes(query) ||
      searchNormalize(p.description_en || '').includes(query);

    // 2. タイプフィルター
    const matchType = filterType === "all" || p.change_type === filterType;

    // 3. バージョンフィルター。ヒーロー詳細（compact）は「パッチ履歴」なので版で絞らない。
    // 以前は compact でも最新の版だけに絞っていて、廉頗は2件のうち7/30の1件しか出ていなかった
    const matchVersion = compact || isSearching || p.version === selectedVersion;

    return matchText && matchType && matchVersion;
  });
  // 表示に版が混ざるか。版別ページ（/patches/[date]）は1版しか受け取らないので、絞り込んでも混ざらない
  const mixedVersions = compact || (isSearching && uniqueVersions.length > 1);
  // 版が混ざるときは新しい版から並べる。patches.json は 7/2 が 7/16 より前にあるなど、
  // 並びが日付順とは限らない（sort は安定なので、同じ版の中の順は変わらない）
  if (mixedVersions) {
    filteredPatches.sort((a, b) => compareVersions(b.version || '', a.version || ''));
  }

  // この回の目次。9/23版は14件のうちヒーロー以外の6件が先に並び、最初のヒーローは
  // 390px幅で約10画面目だった。自分のヒーローが変わったかを冒頭で見られるようにする。
  // 3件以下の回（6/19版）は一覧がすぐ見えるので出さない
  const showToc = !compact && !isSearching && filteredPatches.length >= 4;
  // 同じヒーローが1つの版に2件あれば顔は1つにまとめ、記号はヒーロー一覧の↑↓（getLatestPatchChanges）と
  // 同じ考え方で決める。調整より強化・弱体化を優先し、強化と弱体化が両方なら「調整」。
  // 最初の1件の種類だけを出すと、弱体化も入っているのに↑だけが付く（今のデータには該当なし）
  const tocByHero = new Map<string, { patch: PatchEntry; types: Set<string> }>();
  if (showToc) {
    for (const p of filteredPatches) {
      if (p.is_hero === false) continue;
      const k = p.hero_id || p.hero_name || p.id;
      const hit = tocByHero.get(k);
      if (hit) hit.types.add(p.change_type || '');
      else tocByHero.set(k, { patch: p, types: new Set([p.change_type || '']) });
    }
  }
  const tocHeroes = [...tocByHero.values()].map(({ patch, types }) => ({
    patch,
    type: types.has('buff') && types.has('nerf') ? 'adjust'
      : types.has('buff') ? 'buff'
      : types.has('nerf') ? 'nerf'
      : patch.change_type || '',
  }));
  const tocOthers = showToc ? filteredPatches.filter(p => p.is_hero === false) : [];

  // 語はヒーロー一覧の↑↓バッジ（PatchChangeBadge.tsx の PATCH_CHANGE）と同じ「強化／弱体化／調整」。
  // messages の filterBuff / filterNerf も 2026-09-25 に「バフ／ナーフ」から揃えた
  const filters: { key: FilterType; label: string; tone: string }[] = [
    { key: 'all', label: t("filterAll"), tone: 'text-slate-600' },
    { key: 'buff', label: t("filterBuff"), tone: 'text-emerald-700' },
    { key: 'nerf', label: t("filterNerf"), tone: 'text-rose-700' },
    { key: 'adjust', label: t("filterAdjust"), tone: 'text-slate-600' },
  ];

  return (
    <div className="space-y-6">

      {/* 検索・フィルター UI (ヒーロー指定時は非表示) */}
      {!compact && (
      // 影（shadow-*）は墨の地ではほとんど見えないので、区切りは枠線だけで出す。
      // 絞り込みを1枚のカードにまとめる組み方はヒーロー一覧と同じ
      <div className="bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex flex-col gap-2.5">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              aria-label={t("searchPlaceholder")}
              className="block h-11 w-full pl-9 pr-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white text-sm font-bold transition-all"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* 以前は文字10px・高さ33px。指で押す的として 44px にする。
              選択中は墨の塗り（slate-900 の地に白い字）だったが、夜の配色では白く光るピルになる。
              ほかのページと同じ金の線と淡い塗り（tones.ts の SELECTED）にする */}
          <div role="group" aria-label={en ? 'Change type' : '変更の種類'} className="grid grid-cols-4 gap-2 w-full">
            {filters.map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilterType(f.key)}
                aria-pressed={filterType === f.key}
                className={`h-11 text-sm font-black rounded-lg border transition-colors ${filterType === f.key ? SELECTED : `bg-white border-slate-200 hover:bg-slate-50 ${f.tone}`}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {/* 版の選択。標準の select は高さ22pxで、公式の記事名が390px幅で途中から切れていた。
              共通のプルダウンに替え、名前は日付＋シーズンに縮める。
              版が1つだけのとき（/patches/[date]）と横断検索中は、選ぶ意味が無いので出さない */}
          {/* 選択肢10件の一覧は456pxあり、390px幅の初期位置では上にも下にも収まらず下に開く。
              開くと一覧に焦点が移って画面がずれるが、ずれ幅は画面の下端までで、
              最後の2件が TabBar（66px＋セーフエリア）の裏に残っていた。
              一覧に下の余白（scroll-margin）を持たせ、TabBar の上まで引き上げる。TabBar の無い md 以上は不要 */}
          {uniqueVersions.length > 1 && !isSearching && (
            <Dropdown
              label={t("displayVersion").replace(/[:：]\s*$/, '')}
              icon={<History className="h-5 w-5 text-slate-500" />}
              options={uniqueVersions.map(v => ({ value: v, label: versionLabel(v) }))}
              value={selectedVersion ?? uniqueVersions[0]}
              defaultValue={uniqueVersions[0]}
              onChange={setSelectedVersion}
              className="md:max-w-sm max-md:[&_[role=listbox]]:scroll-mb-[calc(80px+env(safe-area-inset-bottom))]"
            />
          )}
        </div>

        {/* 検索中（横断モード）のインジケーター。版別ページでは横断しないので出さない。
            14px では 390px で2行になり「横断検／索」と折れたので、文節で折る（auto-phrase。ガイドと同じ指定） */}
        {isSearching && uniqueVersions.length > 1 && (
          <div className="mt-3 text-sm font-bold text-brand-700 inline-flex items-center gap-1.5 bg-brand-50 px-2.5 py-1.5 rounded-md border border-brand-200 [word-break:auto-phrase]">
            <Sparkles size={14} aria-hidden="true" className="shrink-0" />
            {t("crossSearchActive")}
          </div>
        )}
      </div>
      )}

      {/* この回の目次。各項目の id（下の一覧）へ飛ぶ */}
      {showToc && (
        <nav
          aria-label={en ? 'Changes in this update' : 'この回の変更の目次'}
          className="bg-white p-4 rounded-2xl border border-slate-200 space-y-4"
        >
          {tocHeroes.length > 0 && (
            <div>
              <h2 className="text-base font-black text-slate-900">
                {en ? `Heroes changed in this update (${tocHeroes.length})` : `この回で変わったヒーロー（${tocHeroes.length}体）`}
              </h2>
              {/* 顔の下に名前を置く4列の格子だった。12px のときから「フロレン／ティーノ」「（マークス／マン）」と
                  語の途中で折れていて、14px では名前の幅が 390px で70px（5字）、360px で62px（4字）に減る。
                  3列（360px で87px）にしても、14px の「フロレンティーノ」（約114px）は1行に入らない。
                  顔・名前・↑↓を横に並べたチップにして、幅は名前に合わせる。実測で最長の
                  「元流の子（マークスマン）」が262pxで、360px の枠（270px）に1行で収まる */}
              <ul className="mt-3 flex flex-wrap gap-2">
                {tocHeroes.map(({ patch: p, type }) => {
                  const def = patchChangeDef(type);
                  return (
                    <li key={p.id} className="max-w-full">
                      <a
                        href={`#${p.id}`}
                        className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-2 text-sm font-bold leading-snug text-slate-800 hover:bg-slate-50"
                      >
                        <PatchIcon patch={p} size={36} />
                        <span className="min-w-0">{tocName(heroName(p))}</span>
                        <span
                          aria-hidden="true"
                          className={`shrink-0 rounded-md border px-1.5 py-1 text-sm font-black leading-none ${def.cls}`}
                        >
                          {en ? def.symbolEn : def.symbol}
                        </span>
                        <span className="sr-only">{en ? def.en : def.ja}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {tocOthers.length > 0 && (
            <div>
              <h2 className="text-base font-black text-slate-900">
                {en ? `Other changes (${tocOthers.length})` : `ヒーロー以外の変更（${tocOthers.length}件）`}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {/* ヒーローのチップと同じく、先頭に本文のカードと同じ図柄を置く（以前は文字だけ） */}
                {tocOthers.map(p => (
                  <li key={p.id} className="max-w-full">
                    <a
                      href={`#${p.id}`}
                      className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-3 text-sm font-bold leading-snug text-slate-700 hover:bg-slate-50"
                    >
                      <PatchIcon patch={p} size={36} />
                      <span className="min-w-0">{heroName(p)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      )}

      {!compact && selectedPatchMeta && !isSearching && (
        <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-200 p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-50" />
          <h2 className="text-base font-black text-brand-900 mb-2 flex items-center gap-1.5 relative z-10">
            <Sparkles size={16} aria-hidden="true" className="shrink-0 text-brand-500" />
            {en ? 'Meta Analysis' : 'メタ分析'}
          </h2>
          {/* 開いたままだと390px幅で682px（ほぼ1画面）あった。6行で畳み、本文は初期HTMLに残す */}
          <p
            ref={metaRef}
            id="patch-meta-text"
            className={`text-sm text-slate-700 leading-relaxed font-medium relative z-10 ${metaOpen ? '' : 'line-clamp-6'}`}
          >
            {/* 予想文中の **強調** を解釈する（生の ** が表示されていた） */}
            {(en ? selectedPatchMeta.prediction_en : selectedPatchMeta.prediction_ja)
              ?.split(/\*\*([^*]+)\*\*/g)
              .map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-brand-800">{part}</strong> : part))}
          </p>
          {!(metaFits && !metaOpen) && (
            <button
              type="button"
              aria-expanded={metaOpen}
              aria-controls="patch-meta-text"
              onClick={() => setMetaOpenFor(metaOpen ? null : selectedVersion)}
              className="relative z-10 mt-1 -mx-1 inline-flex h-11 items-center gap-1 px-1 text-sm font-bold text-brand-700"
            >
              {metaOpen ? (en ? 'Show less' : '閉じる') : (en ? 'Read more' : '続きを読む')}
              <ChevronDown size={16} aria-hidden="true" className={`transition-transform ${metaOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      )}

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
                   /patches/2026-08-27#patch_8_27_1 で、目次からも #id で着地する。
                   scroll-mt はスマホが AppBar（56px）、PC は /patches の固定見出し（2026-09-26 の実測で98px）ぶんの逃げ */
                id={patch.id}
                className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 scroll-mt-20 md:scroll-mt-28"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <PatchIcon patch={patch} size={40} />
                    <div className="flex min-w-0 flex-col">
                      {/* 項目の名前。本文（14px）と同じ大きさだと見出しに見えないので 16px の太字にする */}
                      <span className="text-base font-black leading-snug text-slate-900 [word-break:auto-phrase] [overflow-wrap:anywhere]">
                        {cardName(heroName(patch))}
                      </span>
                      {/* 版名は、版が混ざるとき（横断検索・ヒーロー詳細）だけ出す。
                          1つの版を読んでいるときは14件すべてに同じ2行が付いていた */}
                      {mixedVersions && (
                        <span className="text-sm font-semibold text-slate-500">
                          {versionLabel(patch.version)}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChangeTag type={patch.change_type} locale={locale} className="px-2.5 py-1.5 text-sm" />
                </div>
                <div className="text-sm text-slate-700">
                  {renderDescription(en ? (patch.description_en || patch.description || "") : (patch.description || ""))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 過去バージョンの全文。従来はセレクタで選んだ1バージョンしかDOMに無く、
          日本語29,000字のうち初期HTMLに出ていたのは最新版の7,400字だけだった。
          details にしておけば、畳んだままでも中身は読み取られる */}
      {!compact && !isSearching && uniqueVersions.length > 1 && (
        <section className="pt-2">
          {/* 節の見出しは、ほかのページと同じ左に金の縦線を付けた形（globals.css の section-title） */}
          <h2 className="section-title mb-3">
            {en ? 'Past Updates' : '過去のアップデート'}
          </h2>
          <div className="space-y-3">
            {uniqueVersions.filter(v => v !== selectedVersion).map(v => {
              const entries = patches.filter(p => p.version === v);
              if (entries.length === 0) return null;
              const heading = formatVersionTitle(v, locale, versionEnMap);
              return (
                <details key={v} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group">
                  {/* summary を flex にすると標準の三角が消え、開けることが画面から読めなかった。
                      右端に矢印を置き、開いたら向きを変える。Safari は ::-webkit-details-marker で三角を出すので消す */}
                  <summary className="min-h-11 px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-black text-sm text-slate-800 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                    <span className="min-w-0 flex-1 [word-break:auto-phrase]">{heading}</span>
                    <span className="text-sm font-bold text-slate-500 shrink-0">
                      {en ? `${entries.length} changes` : `${entries.length}件`}
                    </span>
                    <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-4 pb-4 pt-1 space-y-4 border-t border-slate-200">
                    {/* この版だけのページへの入口。details の中身は残す
                        （畳んだままでもクローラは読み取るので、初期HTMLの本文量は減らない） */}
                    {versionDate[v] && (
                      <Link
                        href={`/patches/${versionDate[v]}`}
                        className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2"
                      >
                        {en ? 'Open this update on its own page' : 'この回だけのページを開く'}
                      </Link>
                    )}
                    {entries.map(patch => (
                      <article key={patch.id}>
                        <h3 className="text-base font-black text-slate-900 flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                          {heroName(patch)}
                          <ChangeTag type={patch.change_type} locale={locale} className="px-2 py-1 text-sm" />
                        </h3>
                        {renderDescription(en ? (patch.description_en || patch.description || '') : (patch.description || ''))}
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

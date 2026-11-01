
'use client';

import { Fragment, useState, useEffect, useRef, useSyncExternalStore, type MouseEvent } from 'react';
import { DEFAULT_HERO_IMAGE, SITE_LABEL } from '@/lib/basePath';
import { Trophy, ArrowDownWideNarrow, Camera, ArrowRight, X, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ListNotes } from "@/components/ListNotes";
import { ShareButton } from "@/components/common/ShareButton";
import { StatsFreshnessNote } from "@/components/common/StatsFreshnessNote";
import Image from '@/components/common/Image';
import HOK_HEROES from "@/data/hok_heroes.json";
import dataFreshness from "@/data/data_freshness.json";
import { PatchChangeBadge, patchIsAfterStats, formatPatchDateJa, patchBadgeLegend } from '@/components/common/PatchChangeBadge';
// type-only import なので patches.json はクライアントバンドルに載らない
import type { LatestPatchChanges } from '@/lib/patchBadges';
// 前回の統計との差は page.tsx（サーバー）で組み立てて行ごとに渡す。ここは型だけ
import type { StatsDiffEntry } from '@/lib/statsDiff';
import { LANE_TIER_PAGES } from '@/content/laneTierPages';
import { getTierBadgeStyle } from '@/lib/tierBadge';
import { LaneIcon } from '@/components/icons/GameIcons';
import { SELECTED } from '@/components/common/tones';
// siteTier.ts は JSON を読まないので、値を import しても統計はバンドルに載らない
import { OFFICIAL_TIER_ORDER, SITE_TIER_ORDER, officialTierRuleText, siteTierRuleText, type SiteTier } from '@/lib/siteTier';
import { readQuery, replaceQuery, pickEnum } from '@/lib/urlState';

/**
 * 最初のハイドレーションが済んだか。済んだあと（レーンのタブでの移動）は、初期値を URL から同期で読む。
 * useEffect で読み直すと、移った先で公式の表と勝率順が1〜3フレーム出てから戻り、タブを押すたびにちらついた（2026-11-02）。
 * 最初のハイドレーションだけは静的HTMLと同じ既定値で描く必要がある（違うとハイドレーションが合わない）
 */
let hydratedOnce = false;

/**
 * どの Tier で並べるか。公式「HoK Camp」の Tier（S〜C）と、当サイトの Tier（OP〜D、勝率込み）。
 * 既定は公式。URL の ?tier=site で当サイトの表を開く（既定値はクエリに書かない）
 */
const TIER_VIEWS = ['official', 'site'] as const;
type TierView = (typeof TIER_VIEWS)[number];

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
  /** 前回の統計との差。今回の統計に無い体は null（そもそも表に並ばない） */
  diff?: StatsDiffEntry | null;
  /** 当サイトの Tier（OP〜D）。page.tsx が src/lib/siteTier.ts の規則で付ける */
  siteTier?: SiteTier | null;
}

interface TierListClientProps {
  stats: HeroStat[];
  /** 直近パッチの調整ヒーロー。サーバー側（page.tsx）で patches.json から導出して渡される */
  patchChanges: LatestPatchChanges;
  /**
   * レーン別ページ（/tier-list/[lane]）から渡す。指定するとそのレーンに固定する。
   * 総合ページ（/tier-list）は未指定で、5レーンをまとめた1つの表を出す
   */
  lockedLane?: string;
  /** レーン別ページの見出し。未指定なら共通の「Tier表」を出す */
  heading?: { title: string; subtitle: string };
  /** 見出し直下に出す本文（レーン別ページの導入文） */
  lead?: string;
  /** 表の下に出すレーン別の講評。総合ページでは未指定 */
  commentary?: { heading: string; paragraphs: string[] };
}

type HeroEntry = { id: string; name: string; name_en?: string; slug?: string };

const getHeroSlug = (id: string) => {
  const hero = (HOK_HEROES as HeroEntry[]).find((h) => h.id === id);
  return hero?.slug || id;
};

/**
 * 名前を本体と括弧書きに分ける（「元流の子（メイジ）」「Flowborn (Mage)」）。
 * ヒーロー一覧・ロール別と同じ規則。共有用表示で括弧の前から改行するのに使う
 */
const splitName = (name: string): [string, string | null] => {
  const m = name.match(/^(.+?)\s*([（(][^（()）]+[）)])$/);
  return m ? [m[1], m[2]] : [name, null];
};

/** 5レーンをまとめて出すタブのID。レーンIDと衝突しない値にする */
const ALL_LANES = 'ALL';

type SortKey = 'winRate' | 'pickRate' | 'banRate';

/** URL の ?sort= に載せる値。表示ラベルやキー名を流用しない（urlState.ts の方針） */
const SORT_SLUGS = ['win', 'pick', 'ban'] as const;
type SortSlug = (typeof SORT_SLUGS)[number];
const SLUG_TO_SORT: Record<SortSlug, SortKey> = { win: 'winRate', pick: 'pickRate', ban: 'banRate' };
const SORT_TO_SLUG: Record<SortKey, SortSlug> = { winRate: 'win', pickRate: 'pick', banRate: 'ban' };

/**
 * 格子の列数。下の grid-cols の段（4 / sm:6 / md:5 / lg:8 / xl:10）と必ず揃える。
 * 押した顔の「行の終わり」に詳細の枠を差し込む位置を決めるのに使う。
 * md で列が減るのは、md から左に 256px のサイドバーが出て本文が狭くなるため
 * （768px で本文 360px。8列だと1マス 45px で 64px の顔が入らない）
 */
const COLUMN_STEPS: [string, number][] = [
  ['(min-width: 1280px)', 10],
  ['(min-width: 1024px)', 8],
  ['(min-width: 768px)', 5],
  ['(min-width: 640px)', 6],
];
function subscribeColumns(onChange: () => void) {
  const lists = COLUMN_STEPS.map(([q]) => window.matchMedia(q));
  lists.forEach((m) => m.addEventListener('change', onChange));
  return () => lists.forEach((m) => m.removeEventListener('change', onChange));
}
function readColumns(): number {
  return COLUMN_STEPS.find(([q]) => window.matchMedia(q).matches)?.[1] ?? 4;
}
/** サーバーとハイドレーション中は 4 列として扱う。詳細の枠は押すまで出ないので、ずれは起きない */
function useColumns(): number {
  return useSyncExternalStore(subscribeColumns, readColumns, () => 4);
}

/** 顔のマスと詳細の枠の id。閉じたときに押した顔へフォーカスを戻すのに使う */
const cellId = (block: string, id: string) => `tier-cell-${block}-${id}`;
const panelId = (block: string) => `tier-detail-${block}`;

/** 勝率の文字色。50%を境に上下が読めるようにする。600 は白地で 4.5:1 に届かないので 700 */
function winTone(wr: number): string {
  if (wr >= 52) return 'text-emerald-700';
  if (wr >= 50) return 'text-slate-800';
  return 'text-rose-700';
}

export function TierListClient({ stats, patchChanges, lockedLane, heading, lead, commentary }: TierListClientProps) {
  const t = useTranslations("TierList");
  const r = useTranslations("Role");
  const h = useTranslations("Home");
  const locale = useLocale();
  const ja = locale === 'ja';
  const cols = useColumns();
  // 総合ページは全レーンのまとめ表だけを出す。レーンを選ぶとレーン別ページへ移る（2026-09-25）。
  // 以前は総合ページの中でもタブで1レーンに切り替えられ、同じ表が2つのURLにあった
  const activeTab = lockedLane ?? ALL_LANES;
  const [sortKey, setSortKey] = useState<SortKey>(() =>
    hydratedOnce ? SLUG_TO_SORT[pickEnum(readQuery()?.get('sort'), SORT_SLUGS, 'win')] : 'winRate');
  const [tierView, setTierView] = useState<TierView>(() =>
    hydratedOnce ? pickEnum(readQuery()?.get('tier'), TIER_VIEWS, 'official') : 'official');
  const isSiteView = tierView === 'site';
  /** 表示中の表での Tier と、その段の並び（上から） */
  const tierOrder: string[] = isSiteView ? SITE_TIER_ORDER : OFFICIAL_TIER_ORDER;
  // 勝率込みの Tier が無い体（統計が無い体。今は表に並ばないので起きない）は、どの段にも入れない
  const tierOf = (hero: HeroStat): string => (isSiteView ? hero.siteTier ?? '' : hero.tier);
  const [isMounted, setIsMounted] = useState(false);
  // スクショ用の「共有用表示」。ONの間はフィルタ・ソート・注記を隠し、
  // 選択中レーンだけをアイコン+名前の縦長グリッドに切り替える（CSS/条件描画のみ）
  const [shareMode, setShareMode] = useState(false);
  /** 詳細を開いている顔。段のキー（レーン＋Tier）とヒーローID */
  const [open, setOpen] = useState<{ block: string; id: string } | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  /** 格子の外枠。Esc を拾うのは、フォーカスがこの中（か、どこにも無い）ときだけにする */
  const gridRef = useRef<HTMLDivElement>(null);
  // 統計の無い新ヒーロー（page.tsx 側で表から外している）の表示名
  const unrankedNames = (dataFreshness.campStats.unrankedHeroIds as string[])
    .map((id) => (HOK_HEROES as HeroEntry[]).find((h) => h.id === id))
    .filter((h): h is HeroEntry => Boolean(h))
    .map((h) => (locale === 'en' ? h.name_en || h.name : h.name));

  // 前回の統計の取得日。差そのものは page.tsx が行ごとに diff として渡している
  const prevDate = dataFreshness.campStats.prevUpdatedAt;
  /** 表示中の表での前回の Tier（前回の統計と比べられる体だけ） */
  const prevTierInView = (hero: HeroStat): string | null =>
    hero.diff?.kind === 'diff' ? (isSiteView ? hero.diff.prevSiteTier : hero.diff.prevTier) : null;
  /** 前回と Tier が違う体だけ、前回の Tier を返す。格子の顔に矢印の印を付けるのに使う */
  const prevTierOf = (hero: HeroStat) => {
    const prev = prevTierInView(hero);
    return prev && prev !== tierOf(hero) ? prev : null;
  };
  // 印の凡例。印は日付を持てない大きさなので、取得日はここと詳細の枠で示す。
  // 表示中の表に印が1つも無ければ出さない
  const hasPrevTierTags = stats.some(s => (!lockedLane || s.lane === lockedLane) && prevTierOf(s));
  // 凡例は注記の枠で折り返す。360px では「2026-」と「09-04」の間で改行されていたので、
  // ハイフンの後ろに WORD JOINER（U+2060、幅0で表示されない）を挟んで日付の途中で切らせない
  const prevDateNoBreak = prevDate.replace(/-/g, '-\u2060');
  // 以前の文は「前回B」などの文字の札を指していたが、札は 2026-09-26 に矢印の図柄に替わっていた
  const prevTierLegend = hasPrevTierTags
    ? ja
      ? `顔の左下の矢印は、前回（${prevDateNoBreak} 取得）からのTierの上下を示します。`
      : `Bottom-left arrows mark tier changes since the previous stats (taken ${prevDateNoBreak}).`
    : '';

  // 並び替えは URL に載せる。レーンのタブはページ遷移なので、載せないと
  // レーンを替えるたびに勝率順へ戻る。サーバーでは location を読めないのでマウント後に入れる
  useEffect(() => {
    const q = readQuery();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSortKey(SLUG_TO_SORT[pickEnum(q?.get('sort'), SORT_SLUGS, 'win')]);
    setTierView(pickEnum(q?.get('tier'), TIER_VIEWS, 'official'));
    hydratedOnce = true;
    setIsMounted(true);
  }, []);

  // layout.tsx が ?tier=site・?sort= のときに足した「格子を隠す」style は、URL の状態で描き直したあとに外す。
  // 上の useEffect の中で外すと、描き直しの前に1〜2フレーム既定の表が見えた（2026-11-02 実測）
  useEffect(() => {
    if (isMounted) document.getElementById('tier-pending')?.remove();
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    replaceQuery({
      sort: sortKey === 'winRate' ? null : SORT_TO_SLUG[sortKey],
      tier: tierView === 'official' ? null : tierView,
    });
  }, [sortKey, tierView, isMounted]);

  // スマホではタブが1段で横に流れる。ミッドより右のページを開いたとき、
  // 選択中のタブが右端のぼかしの下に隠れないよう、列の中央まで送っておく
  useEffect(() => {
    const row = tabsRef.current;
    const active = row?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!row || !active) return;
    const rowBox = row.getBoundingClientRect();
    const box = active.getBoundingClientRect();
    const left = box.left - rowBox.left + row.scrollLeft;
    if (left + box.width > row.clientWidth - 24) {
      row.scrollLeft = left - (row.clientWidth - box.width) / 2;
    }
  }, [activeTab]);

  // 詳細の枠を開いたら画面内に入れる（下端の顔を押すと枠が TabBar の下に出るため）。
  // Esc で閉じて、押した顔へフォーカスを戻す
  useEffect(() => {
    if (!open) return;
    const panel = document.getElementById(panelId(open.block));
    if (panel) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      panel.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      // 検索・メニューのモーダルや共有の選択肢が開いているときの Esc は、その部品のもの。
      // ここで拾うと、そちらを閉じたついでに枠も閉じ、フォーカスを顔へ奪ってしまう
      if (document.querySelector('[aria-modal="true"]')) return;
      const active = document.activeElement;
      if (active && active !== document.body && !gridRef.current?.contains(active)) return;
      setOpen(null);
      document.getElementById(cellId(open.block, open.id))?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const getRoleName = (role: string) => {
    switch(role) {
      case ALL_LANES: return ja ? '全レーン' : 'All Lanes';
      case 'CLASH': return r('clash');
      case 'JUNGLE': return r('jungle');
      case 'MID': return r('mid');
      case 'FARM': return r('farm');
      case 'ROAM': return r('roam');
      default: return role;
    }
  };

  /** タブと顔の下に載せる短い表記。「クラッシュ (Clash)」「Clash Lane」だと横幅を食う */
  const getShortRoleName = (role: string) =>
    getRoleName(role).replace(/\s*\(.+\)$/, '').replace(/\s+Lane$/, '');

  const roles = [
    { id: 'CLASH' },
    { id: 'JUNGLE' },
    { id: 'MID' },
    { id: 'FARM' },
    { id: 'ROAM' }
  ];

  if (stats.length === 0) {
    return (
      <div className="w-full p-4 bg-background">
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Trophy className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-black text-slate-800">{t('noData')}</h3>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {t('noDataDesc')}
          </p>
        </div>
      </div>
    );
  }

  // Tier のグルーピングは維持しつつ、各 Tier 内を選択中の指標で降順ソートする。
  // 段は表示中の表（公式 S〜C／当サイト OP〜D）で決まる
  const groupedStatsFor = (laneId: string) => tierOrder.map(tier => ({
    tier,
    heros: stats
      .filter(c => c.lane === laneId && tierOf(c) === tier)
      .sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0))
  })).filter(g => g.heros.length > 0);

  const isAllLanes = activeTab === ALL_LANES;

  // 「全レーン」はレーンで区切らず1つの表にする。公式データではヒーロー1体につき
  // レーンが1つなので、S〜Cにまとめても同じヒーローが二重に出ることはない。
  // どのレーンでの評価かは顔の下と詳細の枠で示す
  const groupedAllLanes = tierOrder.map(tier => ({
    tier,
    heros: stats
      .filter(c => tierOf(c) === tier)
      .sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0))
  })).filter(g => g.heros.length > 0);

  // タブは「全レーン」＋5レーン。どれも固定URL（/tier-list と /tier-list/[slug]）へのリンクで、
  // クローラが5レーン分のページを辿る経路にもなる。並び替えはクエリごと持って移る
  const tabs = [ALL_LANES, ...roles.map(r => r.id)];
  // 並び替えと表の種類はクエリごと持って移る（既定値は書かない）
  const tabQueryParams = new URLSearchParams();
  if (sortKey !== 'winRate') tabQueryParams.set('sort', SORT_TO_SLUG[sortKey]);
  if (tierView !== 'official') tabQueryParams.set('tier', tierView);
  // URLSearchParams.size は古い Safari（16 以前）に無いので、文字列にしてから見る
  const tabQueryString = tabQueryParams.toString();
  const sortQuery = tabQueryString ? `?${tabQueryString}` : '';

  // 共有用表示に出すレーン。「全レーン」のときは5枚を縦に並べる
  const shareLanes = lockedLane ? [lockedLane] : roles.map(r => r.id);

  // 用語はヒーロー詳細ページに合わせて「出現率」に統一する（旧: ピック率／採用率）
  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'winRate', label: ja ? '勝率' : 'Win Rate' },
    { key: 'pickRate', label: ja ? '出現率' : 'Pick Rate' },
    { key: 'banRate', label: ja ? 'BAN率' : 'Ban Rate' },
  ];
  const sortLabel = sortOptions.find(o => o.key === sortKey)!.label;
  // 表の種類。「当サイト」だと何が違うのか分からないので、違い（勝率を加えている）を名前にする
  const tierViewOptions: { key: TierView; label: string }[] = [
    { key: 'official', label: ja ? '公式' : 'Official' },
    { key: 'site', label: ja ? '勝率込み' : 'With win rate' },
  ];
  const pct = (v: number) => `${(v || 0).toFixed(1)}%`;

  // バッジの配色は @/lib/tierBadge に一本化した。ここに複製があったせいで、
  // lib 側だけ C を直しても Tier表には反映されないままだった

  // 直近パッチの調整バッジ。統計に反映されているかを凡例で明示する（取得日より後なら未反映、
  // 以前なら未確認。判定は PatchChangeBadge の patchIsAfterStats）。描画も共通部品に任せる
  const hasPatchBadges = Object.keys(patchChanges.changes).length > 0;
  // 表の下に置く凡例。以前は表の上の StatsFreshnessNote に入れていた（2026-11-02 に下へ移した）
  const belowTableNotes = [
    unrankedNames.length > 0 ? t('unrankedNote', { names: unrankedNames.join(ja ? '・' : ', ') }) : '',
    prevTierLegend,
    hasPatchBadges ? patchBadgeLegend(patchChanges, locale) : '',
  ].filter(Boolean);
  // 統計が調整前だという注意。数字の読み方に関わるので、これだけは表の上に1行で残す
  const hasPatchBasisNote = Boolean(ja ? dataFreshness.campStats.patchBasisJa : dataFreshness.campStats.patchBasisEn);

  const toggle = (block: string, id: string) =>
    setOpen(cur => (cur && cur.block === block && cur.id === id ? null : { block, id }));

  /**
   * 顔1つぶんのマス。顔・名前・並べ替え中の指標の値だけを出す（2026-09-25）。
   * 以前は1体 144×204px のカードに3指標を並べ、スマホで2列・画面18.6枚ぶんあった。
   * マスは <a> のままにして、クローラが全ヒーローへのリンクを辿れるようにする。
   * 普通のクリック（Enter を含む）だけ横取りして詳細の枠を開閉し、
   * Ctrl／中ボタンで新しいタブに開く操作はそのまま通す
   */
  const renderCell = (block: string, hero: HeroStat, showLane: boolean) => {
    const id = String(hero.id);
    const isOpen = open?.block === block && open.id === id;
    const prevTier = prevTierOf(hero);
    const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      toggle(block, id);
    };
    return (
      <Link
        key={id}
        id={cellId(block, id)}
        href={`/heroes/${getHeroSlug(id)}`}
        prefetch={false}
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId(block) : undefined}
        className="group flex min-w-0 flex-col items-center rounded-2xl py-1.5 transition-colors hover:bg-slate-50"
      >
        {/* バッジは顔の overflow-hidden で切れないよう、1段外に置く */}
        <span className="relative">
          <span
            className={`relative block h-14 w-14 overflow-hidden rounded-2xl bg-slate-100 transition-shadow sm:h-16 sm:w-16 ${
              isOpen ? 'ring-2 ring-brand-700' : 'ring-1 ring-slate-200 group-hover:ring-slate-300'
            }`}
          >
            {/* 名前は下に文字で出すので、画像は読み上げない */}
            <Image
              src={hero.image || `/images/heroes/${hero.key || hero.id}.webp`}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.srcset = '';
                e.currentTarget.src = DEFAULT_HERO_IMAGE;
              }}
            />
          </span>
          {/* 直近パッチで調整されたヒーローに ↑↓/調整 の小バッジを出す */}
          <PatchChangeBadge
            patch={patchChanges}
            heroId={id}
            locale={locale}
            className="absolute -top-1 -right-1 z-10 text-sm leading-none px-1 py-0.5"
          />
          {/* 前回の統計から Tier が動いた体の印。パッチの↑↓（右上の緑と赤の札）と取り違えないよう、
              左下に置き、色を付けない矢印の図柄にする。文字の札（「前回B」10px）は14pxにすると顔を
              半分覆うので、図柄だけにして、前回の Tier は詳細の枠と読み上げで出す */}
          {prevTier && (
            <span
              title={ja ? `前回（${prevDate}）は Tier ${prevTier}` : `Tier ${prevTier} on ${prevDate}`}
              className="absolute -bottom-1 -left-1 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700"
            >
              {tierOrder.indexOf(tierOf(hero)) < tierOrder.indexOf(prevTier)
                ? <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                : <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />}
              <span className="sr-only">{ja ? `前回（${prevDate}）は Tier ${prevTier}` : `Tier ${prevTier} on ${prevDate}`}</span>
            </span>
          )}
        </span>
        {/* 「元流の子（マークスマン）」は390pxの1マス（約75px）で1行に入らない。
            1行で切ると3体の元流の子が同じ「元流の子（…」に見えるので、2行まで折り返す。
            文字は14px（運営者の方針「補足でも text-sm まで」、2026-09-26）。以前は md で 12px に落としていた。
            英語の名前は1語がマスより長いと語の途中で折れ、360px で「Kongmin／g」「Florentin／o」になっていた。
            hyphens-auto で辞書のある端末（iPhone の Safari、Android の Chrome）はハイフン付きで折る（2026-10-04）。
            Windows の Chrome は辞書が無く、今までどおりの折れ方のまま。
            line-break:strict は「マルコ・ポ／ーロ」のように長音や小さい仮名が行頭に来るのを止める（装備一覧と同じ） */}
        <span className="mt-1 line-clamp-2 w-full break-words hyphens-auto [line-break:strict] text-center text-sm font-bold leading-tight text-slate-800 group-hover:text-brand-700">
          {hero.hero_name}
        </span>
        {/* 行の中で名前が1行と2行のマスが混ざっても、数値の高さは揃える。
            まとめ表示では、どのレーンでの評価かをレーンの図柄で数値の前に示す（文字にすると1行増える） */}
        <span className={`mt-auto flex items-center gap-0.5 pt-0.5 text-sm font-black tabular-nums ${sortKey === 'winRate' ? winTone(hero.winRate) : 'text-slate-700'}`}>
          {showLane && (
            <>
              <LaneIcon lane={hero.lane} className="h-3.5 w-3.5 shrink-0 text-slate-500" />
              <span className="sr-only">{getShortRoleName(hero.lane)} </span>
            </>
          )}
          <span className="sr-only">{sortLabel} </span>
          {pct(hero[sortKey])}
        </span>
      </Link>
    );
  };

  /**
   * 前回の統計との差。数値の枠とは分けて1つの枠にまとめ、見出しに前回の取得日を出す。
   * 色は付けない（緑と赤はパッチの↑↓の札が使っている）。符号と「B → A」の文字で読ませる。
   * 出現率・BAN率の差は出さない（ほぼ全員が ±0.0pt になる。statsDiff.ts の winRate の注記）
   */
  const renderDiff = (hero: HeroStat) => {
    const d = hero.diff;
    if (!d) return null;
    if (d.kind === 'skip') {
      return <p className="mt-2 text-pretty text-sm font-bold leading-relaxed text-slate-600">{d.note}</p>;
    }
    const prevInView = isSiteView ? d.prevSiteTier : d.prevTier;
    const curInView = tierOf(hero);
    const items = [
      {
        key: 'tier',
        label: isSiteView ? (ja ? '勝率込みTier' : 'Tier (with win rate)') : 'Tier',
        value: prevInView === curInView ? (ja ? '変動なし' : 'unchanged') : `${prevInView} → ${curInView}`,
      },
      { key: 'win', label: ja ? '勝率' : 'Win Rate', value: d.winRate },
    ];
    return (
      <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
        <p className="text-sm font-bold text-slate-600">{ja ? `前回（${prevDate}）比` : `Change vs ${prevDate}`}</p>
        <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
          {items.map(item => (
            <div key={item.key} className="flex items-baseline gap-1.5">
              <dt className="whitespace-nowrap text-sm font-bold text-slate-600">{item.label}</dt>
              <dd className="whitespace-nowrap text-sm font-black tabular-nums text-slate-800">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  };

  /** 押した顔の詳細。その行のすぐ下に、格子の横幅いっぱいで差し込む */
  const renderPanel = (block: string, hero: HeroStat) => {
    const id = String(hero.id);
    const close = () => {
      setOpen(null);
      // 閉じるボタンは消えるので、押した顔へフォーカスを戻す
      document.getElementById(cellId(block, id))?.focus();
    };
    return (
      <div
        key={`panel-${id}`}
        id={panelId(block)}
        className="col-span-full scroll-mt-32 scroll-mb-20 rounded-2xl border border-brand-300 bg-slate-50 p-3 sm:p-4 md:scroll-mb-4"
      >
        <div className="flex items-center gap-3">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
            <Image
              src={hero.image || `/images/heroes/${hero.key || hero.id}.webp`}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.srcset = '';
                e.currentTarget.src = DEFAULT_HERO_IMAGE;
              }}
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-black text-slate-900">{hero.hero_name}</p>
            {/* 2つの表のどちらを見ていても、公式と当サイトの両方の Tier を出す。
                375px で「ロ／ーム」と語の途中で折れたので、区切りごとに折らない塊にして、塊の間でだけ折る */}
            <p className="text-sm font-bold text-slate-600">
              {(ja
                ? [`公式 ${hero.tier}`, `勝率込み ${hero.siteTier ?? '—'}`, getShortRoleName(hero.lane)]
                : [`Official ${hero.tier}`, `With win rate ${hero.siteTier ?? '—'}`, getShortRoleName(hero.lane)]
              ).map((part, i) => (
                <Fragment key={i}>
                  {i > 0 && (ja ? '・' : ' · ')}
                  <span className="whitespace-nowrap">{part}</span>
                </Fragment>
              ))}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={ja ? '閉じる' : 'Close'}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {/* 3指標は枠の中でだけ並べる。格子には並べ替え中の1つしか出していないため */}
        <dl className="mt-3 grid grid-cols-3 gap-2">
          {sortOptions.map(opt => (
            <div
              key={opt.key}
              className={`rounded-xl border bg-white px-2 py-2 text-center ${
                opt.key === sortKey ? 'border-brand-700' : 'border-slate-200'
              }`}
            >
              <dt className="text-sm font-bold text-slate-600">{opt.label}</dt>
              <dd className={`text-lg font-black tabular-nums ${opt.key === 'winRate' ? winTone(hero.winRate) : 'text-slate-800'}`}>
                {pct(hero[opt.key])}
              </dd>
            </div>
          ))}
        </dl>
        {renderDiff(hero)}
        <Link
          href={`/heroes/${getHeroSlug(id)}`}
          prefetch={false}
          className="mt-3 flex h-11 items-center justify-center gap-1.5 rounded-xl border border-brand-700 bg-white text-sm font-black text-brand-700 transition-colors hover:bg-brand-50"
        >
          {ja ? `${hero.hero_name}のページを開く` : `Open the ${hero.hero_name} page`}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  };

  /**
   * Tier1つぶんの塊。レーン別表示とまとめ表示で同じものを使う。
   * showLane は、まとめ表示でどのレーンでの評価か分かるようにするための切り替え
   */
  const renderTierBlock = (laneKey: string, { tier, heros }: { tier: string; heros: HeroStat[] }, showLane: boolean) => {
    const block = `${laneKey}-${tier}`;
    const openIndex = open?.block === block ? heros.findIndex(x => String(x.id) === open.id) : -1;
    // 開いた顔の行の最後。最後の行が埋まっていなければ、その行の最後の体
    const insertAfter = openIndex < 0 ? -1 : Math.min(heros.length - 1, Math.floor(openIndex / cols) * cols + cols - 1);
    // 最上位の段だけ金の線と淡い光で分ける。金の塗りは最上位のバッジ1つに留める（公式の表は S、当サイトの表は OP）
    const top = tier === tierOrder[0];
    // スマホ幅の枠の内側は p-1。p-2 のころは 360px で1マスが68.5pxしかなく、14px の5字の名前（70px）が
    // 「アンジェ／ラ」「シャルロ／ット」と語の途中で割れていた。p-1 で72pxになり、5字までは1行に入る（2026-10-04）
    return (
      <section
        key={tier}
        aria-label={isSiteView ? (ja ? `勝率込み Tier ${tier}` : `Tier ${tier} (with win rate)`) : `Tier ${tier}`}
        className={`rounded-3xl border bg-white p-1 sm:p-5 ${
          top ? 'border-brand-300 shadow-[0_0_40px_-16px_rgb(201_163_92/0.55)]' : 'border-slate-200/80 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-1 pb-2 pt-1 sm:pt-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-base border shadow-xs ${getTierBadgeStyle(tier, isSiteView ? 'site' : 'official')}`}>
              {tier}
            </div>
            <h2 className="text-base font-black text-slate-800 sm:text-lg">Tier {tier}</h2>
          </div>
          {/* 「Tier S」の見出しと重なるので、札は件数だけにする。
              英語は messages の「Tier ({count} Heroes)」だと1体でも複数形になっていた */}
          <span className="text-sm font-bold text-slate-500">
            {ja ? `${heros.length}体` : `${heros.length} ${heros.length === 1 ? 'hero' : 'heroes'}`}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-x-1 gap-y-1.5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
          {/* flatMap で平らな1列にする。map で [顔, 枠] の入れ子を返すと、行末の顔だけ
              別の親に移ったとみなされて作り直され、押した顔からフォーカスが消える */}
          {heros.flatMap((hero, i) =>
            i === insertAfter
              ? [renderCell(block, hero, showLane), renderPanel(block, heros[openIndex])]
              : [renderCell(block, hero, showLane)],
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="w-full bg-background">
      {/* Header。スマホでは固定しない（操作を持たないまま画面の3割を取っていた）。
          固定するのは下のレーンのタブ。PC は今までどおり見出しを上端に固定する。
          共有用表示中はスクショに他要素が被らないよう、PC でも固定しない */}
      {/* page-hero は夜の配色の冒頭の帯（globals.css）。淡い金の光を右上から差す。
          2026-11-02 にスマホで詰めた（運営者「スクロールしないとティア表見れないの普通に不便」）。
          390px で帯が 197〜217px あり、レーン別ページでは1画面目に顔が1つも出ていなかった。
          題名と共有の2つのボタンを1行に並べ、題名を一回り小さくし、副題はスマホでは出さず、取得日は短い1行にした */}
      <div className={`${shareMode ? '' : 'md:sticky md:top-0 md:z-20'} page-hero border-b border-slate-200 py-3 sm:py-6 px-4 md:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-3">
            <h1 className="min-w-0 text-xl font-black text-slate-900 tracking-tight text-balance sm:text-2xl">{heading?.title ?? t('title')}</h1>
            {/* 共有は右に置く。ShareButton の選択肢（Xに投稿・URLをコピー）は右端揃えで
                左へ開くので、左端に置くと画面の外へはみ出す */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {/* スクショ用の表示切替。ONの間はUIを隠したコンパクト表示になる。
                  文字は lg から出す（それより狭いと題名を押して折る）。戻すボタンは文字が無いと分からないので常に出す */}
              <button
                type="button"
                onClick={() => { setOpen(null); setShareMode(v => !v); }}
                aria-pressed={shareMode}
                className={`flex h-11 items-center justify-center gap-1.5 rounded-xl border text-sm font-bold transition-colors ${
                  shareMode ? 'px-3' : 'w-11 lg:w-auto lg:px-3'
                } ${
                  shareMode
                    ? SELECTED
                    : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Camera size={14} aria-hidden="true" />
                <span className={shareMode ? '' : 'sr-only lg:not-sr-only'}>
                  {shareMode
                    ? ja ? '通常表示に戻す' : 'Exit share view'
                    : ja ? '共有用表示' : 'Share view'}
                </span>
              </button>
              {!shareMode && (
                <ShareButton title={ja ? '【オナーオブキングス】最新Tier表' : 'Honor of Kings Tier List'} />
              )}
              {/* 狭い画面では装飾アイコンを畳んで横幅を確保する */}
              <div className="hidden lg:block bg-amber-100 p-2.5 rounded-2xl text-amber-600 shadow-inner">
                <Trophy size={20} />
              </div>
            </div>
          </div>
          <p className="hidden text-sm font-bold text-slate-600 mt-1 sm:block">{heading?.subtitle ?? t('subtitle')}</p>
          {/* 取得日は data_freshness.json を正とする。文言に日付を直書きすると更新漏れが起きるため。
              スマホは1行に収まる短い形（長い形は 390px で2行に折れていた） */}
          <p className="text-sm font-bold text-slate-500 mt-1">
            <span className="sm:hidden">
              {ja
                ? `統計 ${dataFreshness.campStats.updatedAt} 取得・公式HoK Camp`
                : `Stats: official HoK Camp, ${dataFreshness.campStats.updatedAt}`}
            </span>
            <span className="hidden sm:inline">{h('metaUpdated', { date: dataFreshness.campStats.updatedAt })}</span>
          </p>
        </div>
      </div>

      {/* 統計が調整前のときの注意だけは、数字の読み方に関わるので表の上に残す（1行に畳んだ形）。
          未掲載の新ヒーロー・矢印と↑↓の凡例・レーンの導入文は 2026-11-02 に表の下へ移した */}
      {!shareMode && hasPatchBasisNote && (
        <div className="px-4 md:px-8 pt-3">
          <StatsFreshnessNote locale={locale} showDate={false} className="max-w-7xl mx-auto" />
        </div>
      )}

      {/* レーンのタブと並び替え（共有用表示中は隠す）。
          スマホではタブの列だけを AppBar の下に固定する。見出しの帯を固定していたときは、
          レーンを替えるのに先頭まで戻る必要があった。
          外側2段は md 未満で display: contents にして、タブの sticky の効く範囲を
          この部品の外枠（表の最後まで）に広げている。タブと並び替えを1行に並べるのは xl から
          （サイドバーを除いた本文が 1024px で 656px。1行だと約770px 要り、タブが縦に折れた） */}
      {!shareMode && (
      <div className="max-md:contents md:px-8 md:pt-4 md:pb-2">
        <div className="max-md:contents md:max-w-7xl md:mx-auto md:flex md:flex-col md:items-start md:gap-3 xl:flex-row xl:items-center xl:justify-between">
          <nav
            aria-label={ja ? 'レーン' : 'Lanes'}
            className="max-md:sticky max-md:top-14 max-md:z-20 max-md:bg-background/95 max-md:backdrop-blur-sm max-md:px-4 max-md:py-2 md:min-w-0 md:shrink-0"
          >
            {/* 6つを1枚のカードに並べ、図柄の下に短い名前を置く（MLBB Hub と同じ組み方、2026-09-26）。
                ラベルは短い表記（「クラッシュ (Clash)」では3段に折れていた）。14px の名前では
                390px に6つ入りきらない（ロームが切れる）ので、横に送れるようにして、右端をぼかして続きを見せる。
                ぼかすのはカードの中の並びだけで、カードの枠は切らない。末尾の余白で最後のタブはぼかしの外に出る */}
            <div className="rounded-2xl border border-slate-200 bg-white p-1">
            <div
              ref={tabsRef}
              className="flex gap-0.5 overflow-x-auto pr-6 [mask-image:linear-gradient(to_right,black_calc(100%-1.5rem),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:pr-0 md:[mask-image:none]"
            >
              {tabs.map(tabId => {
                const active = activeTab === tabId;
                const laneSlug = LANE_TIER_PAGES.find(l => l.id === tabId)?.slug;
                const href = tabId === ALL_LANES ? '/tier-list' : laneSlug ? `/tier-list/${laneSlug}` : null;
                if (!href) return null;
                return (
                  <Link
                    key={tabId}
                    href={`${href}${sortQuery}`}
                    aria-current={active ? 'page' : undefined}
                    // 縮めない（shrink-0）。HoK のレーン名は MLBB より長く（クラッシュ・ジャングルが5字）、
                    // 390px の6等分では14pxの名前が隣と重なった。字間を詰めて収め、はみ出す幅では横に送る
                    className={`flex min-h-14 flex-auto shrink-0 flex-col items-center justify-center gap-0.5 whitespace-nowrap rounded-xl border px-1 text-sm font-bold tracking-tighter transition-colors md:flex-none md:px-3 md:tracking-tight ${
                      active
                        ? SELECTED
                        : 'border-transparent text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <LaneIcon lane={tabId === ALL_LANES ? 'ALL' : tabId} className="h-5 w-5" />
                    {tabId === ALL_LANES ? (ja ? '全体' : 'All') : getShortRoleName(tabId)}
                  </Link>
                );
              })}
            </div>
            </div>
          </nav>

          {/* 表の種類（公式／勝率込み）と、Tier内の並び替え（勝率 / 出現率 / BAN率）。表の種類は 2026-11-02 に足した。
              スマホの日本語は2つの組を1行に並べる（2段にすると表が58px下がり、1列目の顔がタブバーに隠れた）。
              ボタンの横の余白を詰め、「Tier」の文字と並び替えの図柄はスマホでは出さない（組の名前は aria-label で読む）。
              ボタンの左右の余白は 6px。8px だと Windows のメイリオで 360px に4px 足りず2段に折れた（2026-11-02 実測）。英語は入らないので2段に折れる。
              押す部分はスマホで 44px。md 以上は横に並べ、タブを縮めないよう、入りきらない幅ではこちらが折れる */}
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 max-md:px-4 max-md:pb-2 max-md:pt-1 md:min-w-0 md:gap-x-3">
            <div className="flex flex-auto items-center gap-1.5 md:flex-none">
              <span className="w-8 shrink-0 text-sm font-bold text-slate-500 max-md:hidden" aria-hidden="true">Tier</span>
              <div
                role="group"
                aria-label={ja ? 'Tierの種類' : 'Tier type'}
                className="flex flex-1 items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-xs md:flex-none"
              >
                {tierViewOptions.map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    aria-pressed={tierView === opt.key}
                    onClick={() => { setOpen(null); setTierView(opt.key); }}
                    className={`h-11 flex-1 px-1.5 rounded-[10px] border font-bold text-sm whitespace-nowrap transition-colors md:h-9 md:flex-none md:px-3 ${
                      tierView === opt.key
                        ? SELECTED
                        : 'border-transparent text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {/* スマホでは押す部分そのものを 44px にする（h-10 だと枠込みで44px、押せるのは40pxだった） */}
            <div className="flex min-w-0 flex-[2_1_auto] items-center gap-1.5 md:flex-none">
              <span className="flex w-8 shrink-0 justify-center max-md:hidden" aria-hidden="true">
                <ArrowDownWideNarrow size={16} className="text-slate-400" />
              </span>
              <div
                role="group"
                aria-label={ja ? '並び順と表示する数値' : 'Sort order and value shown'}
                className="flex flex-1 items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-xs md:flex-none"
              >
                {sortOptions.map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    aria-pressed={sortKey === opt.key}
                    onClick={() => setSortKey(opt.key)}
                    className={`h-11 flex-1 px-1.5 rounded-[10px] border font-bold text-sm whitespace-nowrap transition-colors md:h-9 md:flex-none md:px-3 ${
                      sortKey === opt.key
                        // 選択中は金の線と淡い塗り。金の「塗り」は Tier の最上位のバッジだけに残す
                        ? SELECTED
                        : 'border-transparent text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 共有用表示: 表示中レーンのS〜Cをアイコン+名前だけの縦長グリッドに畳み、
          最下部に出典（サイトURLと統計取得日）を焼き込む。
          出典は各レーンの枠に入れる。1レーンだけ切り出して貼っても出所が残るように。
          画像にして貼られる画面なので、文字は通常表示と同じ14px（2026-09-26、夜の配色）。
          以前は5列・顔40px・名前9pxで、名前の枠は1マス48px（390px）しかなかった。
          4列にして、左右の余白（px-0.5、枠 p-1）とマスの間隔（gap-x-0）を詰め、Tier の札は左の列ではなく
          段の頭に置く（通常表示の段と同じ並べ方）。1マスは390pxで88px・360pxで80.5px。sm 以上は5列で、
          640px・1280px は90.8px。サイドバーが出る768px がいちばん狭く81.2px（6字の名前79.8pxはまだ入る）。
          札を左の列（38px）に置いていたときは76.5px／69pxで、「Donghuan／g」「(Marksman／)」のように
          英語名が語の途中で折れ、日本語も6字の名前（シャルロット・ファーティフ）が折れた。
          いまも折れるのは8字の「フロレンティーノ」と「（マークスマン）」（112px）だけ。
          札を段の頭に置いた分、1レーンの高さは約120px伸びる */}
      {shareMode ? (
        <div className="max-w-md sm:max-w-lg mx-auto px-0.5 sm:px-4 mt-4 space-y-3">
          {shareLanes.map(laneId => (
          <section key={laneId} aria-label={getRoleName(laneId)} className="rounded-3xl border border-slate-200 bg-white p-1 sm:p-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-2 pt-1.5 pb-2">
              <span className="flex min-w-0 items-center gap-1.5 text-base font-black text-slate-900">
                <LaneIcon lane={laneId} className="h-5 w-5 shrink-0 text-brand-700" />
                {getRoleName(laneId)}
              </span>
              {/* 画像にして貼られるので、どちらの Tier かを見出しに残す */}
              <span className="shrink-0 text-sm font-bold text-slate-500">
                {isSiteView ? (ja ? '勝率込みTier' : 'Tiers with win rate') : ja ? 'Tier表' : 'Tier List'}
              </span>
            </div>
            {/* 段の頭に Tier の札を置き、右へ線を引いて段を区切る。貼られた画像でも Tier表と分かる並べ方 */}
            {groupedStatsFor(laneId).map(({ tier, heros }) => (
              <div key={tier} className="pt-2.5 pb-1">
                <div className="flex items-center gap-2 px-1">
                  <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-black text-base border ${getTierBadgeStyle(tier, isSiteView ? 'site' : 'official')}`}>
                    {tier}
                  </div>
                  <span aria-hidden="true" className="h-px flex-1 bg-slate-200" />
                </div>
                <div className="mt-2 grid grid-cols-4 items-start gap-y-2.5 sm:grid-cols-5">
                  {heros.map((hero) => {
                    const [nameBase, nameQualifier] = splitName(hero.hero_name);
                    return (
                      <div key={hero.id} className="flex min-w-0 flex-col items-center">
                        {/* バッジはアイコン枠の overflow-hidden で切れないよう、1段外に置く */}
                        <div className="relative">
                          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                            {/* 名前は下に文字で出すので、画像は読み上げない */}
                            <Image
                              src={hero.image || `/images/heroes/${hero.key || hero.id}.webp`}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.srcset = '';
                                e.currentTarget.src = DEFAULT_HERO_IMAGE;
                              }}
                            />
                          </div>
                          <PatchChangeBadge
                            patch={patchChanges}
                            heroId={String(hero.id)}
                            locale={locale}
                            className="absolute -top-1 -right-1 z-10 text-sm leading-none px-1 py-0.5"
                          />
                        </div>
                        {/* 画像には title も省略記号の続きも残らないので、名前は切らずに折る。
                            「元流の子（メイジ）」は括弧の前で改行し、どの元流の子か2行目で読めるようにする。
                            折るときは text-balance で行の長さを揃える（「フロレンティー／ノ」のように1字だけ落ちない）。
                            日本語は字間を一段詰める（6字で81.9px → 79.8px）。360pxの1マス80.5pxに6字の名前を収めるため */}
                        <span className={`mt-1 flex w-full flex-col items-center text-center text-sm font-bold leading-tight text-slate-800 ${ja ? 'tracking-tighter' : 'tracking-tight'}`}>
                          <span className="w-full text-balance break-words">{nameBase}</span>
                          {nameQualifier && <span className="w-full text-balance break-words">{nameQualifier}</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {/* 出典は2つの塊に分け、折るときは塊の間で折る（URLや日付の途中で切らない） */}
            <div className="border-t border-slate-200 px-1.5 pt-2 pb-1 text-center text-sm font-bold leading-snug text-slate-500">
              <p>
                <span className="inline-block">{SITE_LABEL} {ja ? '／' : '/'}</span>{' '}
                <span className="inline-block">
                  {ja
                    ? `HoK Camp統計 ${dataFreshness.campStats.updatedAt}取得`
                    : `HoK Camp stats as of ${dataFreshness.campStats.updatedAt}`}
                </span>
              </p>
              {/* 当サイトの Tier は公式の評価ではないことを、画像の中にも残す */}
              {isSiteView && (
                <p className="mt-0.5 text-balance font-medium">
                  {ja ? 'Tierは勝率込みで当サイトが計算（公式のTierではありません）' : 'Tiers with win rate, calculated by this site (not the official tiers)'}
                </p>
              )}
              {/* スクショ単体で見ても ↑↓ の意味が分かるよう、バッジがあるときだけ凡例を焼き込む */}
              {hasPatchBadges && (
                <p className="mt-0.5 text-balance font-medium">
                  {ja
                    ? `↑↓＝${formatPatchDateJa(patchChanges.date)}パッチ調整（${patchIsAfterStats(patchChanges) ? '統計未反映' : '統計への反映は未確認'}）`
                    : `↑↓ = changed in the ${patchChanges.versionEn} (${patchIsAfterStats(patchChanges) ? 'not yet in the stats' : 'unconfirmed whether the stats include it'})`}
                </p>
              )}
            </div>
          </section>
          ))}
        </div>
      ) : (

      // data-tier-grid は、?tier=site で直接開いたときにハイドレーションまで隠す目印（layout.tsx の早い script）
      <div ref={gridRef} data-tier-grid className="max-w-7xl mx-auto px-4 md:px-8 mt-2 space-y-4">
        {isAllLanes ? (
          <section aria-label={getRoleName(ALL_LANES)} className="space-y-4">
            {groupedAllLanes.map(group => renderTierBlock(ALL_LANES, group, true))}
          </section>
        ) : (
          // レーン別ページは h1 がレーン名なので、レーンの見出しを重ねない
          <section aria-label={getRoleName(activeTab)} className="space-y-4">
            {groupedStatsFor(activeTab).map(group => renderTierBlock(activeTab, group, false))}
          </section>
        )}
      </div>
      )}

      {/* 表の下の凡例（未掲載の新ヒーロー・顔の矢印・↑↓の札）と、レーン別ページの導入文。
          2026-11-02 まで表の上にあり、390px で約200px を取って、1画面目に表が出ていなかった。
          凡例は顔の印の意味なので、表を見終えたすぐ下に置く */}
      {!shareMode && (belowTableNotes.length > 0 || lead) && (
        <div className="px-4 md:px-8 pt-4">
          <div className="max-w-7xl mx-auto space-y-2 [word-break:auto-phrase]">
            {belowTableNotes.map((n, i) => (
              <p key={i} className="text-sm font-bold text-slate-500 leading-relaxed">{n}</p>
            ))}
            {/* レーンで何が求められるかの導入。総合ページと本文が同じにならないよう、レーン別ページだけに出す
                （内容はマクロガイドと揃えている） */}
            {lead && <p className="pt-2 text-sm font-medium text-slate-600 leading-relaxed">{lead}</p>}
          </div>
        </div>
      )}

      {/* レーン別の講評。順位表だけでは伝わらない「勝率と評価のねじれ」等を
          そのレーンの実数で解説する（本文は laneTierPages.ts、日付整合は audit が確認）。
          講評は公式の Tier で書いているので、勝率込みの表を見ているときは見出しでそう断る */}
      {!shareMode && commentary && (
        <div className="px-4 md:px-8 pt-6">
          {/* 枠の線は slate-200。slate-100 だと地との比が 1.29 で、夜の配色では枠がほぼ見えなかった（slate-200 は 1.57） */}
          <div className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
            {/* 見出しは「ロームの現況（2026-10-30 取得の統計から）」の形。括弧を2つ並べず、同じ括弧の中に足す */}
            <h2 className="section-title mb-3">
              {isSiteView
                ? commentary.heading.replace(/([）)])$/, ja ? '。Tierは公式の評価$1' : '; tiers are the official ones$1')
                : commentary.heading}
            </h2>
            <div className="space-y-3">
              {commentary.paragraphs.map((p, i) => (
                <p key={i} className="text-sm font-medium text-slate-700 leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tier の付け方。公式の Tier の基準（当サイトの推定）と、勝率込みの Tier の計算（2026-11-02）。
          表より上には文を足さない（検索から来た人が最初に見る場所なので、1画面目は表に使う）。
          レーン別ページでは、そのレーンにしかない講評を先に置き、6ページ共通のこの枠はその後ろにする。
          どちらの表を見ていても両方を出す。文は src/lib/siteTier.ts、公式の基準は監査の検査33が統計を取り直すたびに確かめる */}
      {!shareMode && (
        <div className="px-4 md:px-8 pt-6">
          <section className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
            <h2 className="section-title mb-3">{ja ? 'Tierの付け方' : 'How the tiers are set'}</h2>
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {officialTierRuleText(locale, dataFreshness.campStats.updatedAt, stats.length)}
              </p>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {siteTierRuleText(locale)}
              </p>
            </div>
          </section>
        </div>
      )}

      {!shareMode && <ListNotes page="tierList" locale={locale} />}
    </div>
  );
}

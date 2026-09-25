
'use client';

import { useState, useEffect, useRef, useSyncExternalStore, type MouseEvent } from 'react';
import { Trophy, ArrowDownWideNarrow, Camera, ArrowRight, X, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ListNotes } from "@/components/ListNotes";
import { ShareButton } from "@/components/common/ShareButton";
import { StatsFreshnessNote } from "@/components/common/StatsFreshnessNote";
import Image from 'next/image';
import HOK_HEROES from "@/data/hok_heroes.json";
import dataFreshness from "@/data/data_freshness.json";
import { PatchChangeBadge, patchIsAfterStats, formatPatchDateJa } from '@/components/common/PatchChangeBadge';
// type-only import なので patches.json はクライアントバンドルに載らない
import type { LatestPatchChanges } from '@/lib/patchBadges';
// 前回の統計との差は page.tsx（サーバー）で組み立てて行ごとに渡す。ここは型だけ
import type { StatsDiffEntry } from '@/lib/statsDiff';
import { LANE_TIER_PAGES } from '@/content/laneTierPages';
import { getTierBadgeStyle } from '@/lib/tierBadge';
import { LaneIcon } from '@/components/icons/GameIcons';
import { SELECTED } from '@/components/common/tones';

// 上の段ほど前。前回の統計から段が上がったか下がったかを決めるのに使う
const TIER_ORDER = ['S', 'A', 'B', 'C'];
import { readQuery, replaceQuery, pickEnum } from '@/lib/urlState';

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
  const [sortKey, setSortKey] = useState<SortKey>('winRate');
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
  /** 前回と Tier が違う体だけ、前回の Tier を返す。格子の顔に札を付けるのに使う */
  const prevTierOf = (hero: HeroStat) =>
    hero.diff?.kind === 'diff' && hero.diff.prevTier !== hero.tier ? hero.diff.prevTier : null;
  // 札の凡例。札は日付を持てない大きさなので、取得日はここと詳細の枠で示す。
  // 表示中の表に札が1枚も無ければ出さない
  const hasPrevTierTags = stats.some(s => (!lockedLane || s.lane === lockedLane) && prevTierOf(s));
  // 凡例は注記の枠で折り返す。360px では「2026-」と「09-04」の間で改行されていたので、
  // ハイフンの後ろに WORD JOINER（U+2060、幅0で表示されない）を挟んで日付の途中で切らせない
  const prevDateNoBreak = prevDate.replace(/-/g, '-\u2060');
  const prevTierLegend = hasPrevTierTags
    ? ja
      ? `顔に付いた「前回B」などの札は、前回（${prevDateNoBreak} 取得）の統計での Tier です。`
      : `Tags such as “was B” give the tier in the previous stats (taken ${prevDateNoBreak}).`
    : '';

  // 並び替えは URL に載せる。レーンのタブはページ遷移なので、載せないと
  // レーンを替えるたびに勝率順へ戻る。サーバーでは location を読めないのでマウント後に入れる
  useEffect(() => {
    const q = readQuery();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSortKey(SLUG_TO_SORT[pickEnum(q?.get('sort'), SORT_SLUGS, 'win')]);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    replaceQuery({ sort: sortKey === 'winRate' ? null : SORT_TO_SLUG[sortKey] });
  }, [sortKey, isMounted]);

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
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-100">
          <Trophy className="mx-auto h-12 w-12 text-slate-200 mb-3" />
          <h3 className="text-lg font-black text-slate-800">{t('noData')}</h3>
          <p className="mt-2 text-xs font-bold text-slate-500">
            {t('noDataDesc')}
          </p>
        </div>
      </div>
    );
  }

  // Tier のグルーピングは維持しつつ、各 Tier 内を選択中の指標で降順ソートする
  const tiers = ['S', 'A', 'B', 'C'];
  const groupedStatsFor = (laneId: string) => tiers.map(tier => ({
    tier,
    heros: stats
      .filter(c => c.lane === laneId && c.tier === tier)
      .sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0))
  })).filter(g => g.heros.length > 0);

  const isAllLanes = activeTab === ALL_LANES;

  // 「全レーン」はレーンで区切らず1つの表にする。公式データではヒーロー1体につき
  // レーンが1つなので、S〜Cにまとめても同じヒーローが二重に出ることはない。
  // どのレーンでの評価かは顔の下と詳細の枠で示す
  const groupedAllLanes = tiers.map(tier => ({
    tier,
    heros: stats
      .filter(c => c.tier === tier)
      .sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0))
  })).filter(g => g.heros.length > 0);

  // タブは「全レーン」＋5レーン。どれも固定URL（/tier-list と /tier-list/[slug]）へのリンクで、
  // クローラが5レーン分のページを辿る経路にもなる。並び替えはクエリごと持って移る
  const tabs = [ALL_LANES, ...roles.map(r => r.id)];
  const sortQuery = sortKey === 'winRate' ? '' : `?sort=${SORT_TO_SLUG[sortKey]}`;

  // 共有用表示に出すレーン。「全レーン」のときは5枚を縦に並べる
  const shareLanes = lockedLane ? [lockedLane] : roles.map(r => r.id);

  // 用語はヒーロー詳細ページに合わせて「出現率」に統一する（旧: ピック率／採用率）
  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'winRate', label: ja ? '勝率' : 'Win Rate' },
    { key: 'pickRate', label: ja ? '出現率' : 'Pick Rate' },
    { key: 'banRate', label: ja ? 'BAN率' : 'Ban Rate' },
  ];
  const sortLabel = sortOptions.find(o => o.key === sortKey)!.label;
  const pct = (v: number) => `${(v || 0).toFixed(1)}%`;

  // バッジの配色は @/lib/tierBadge に一本化した。ここに複製があったせいで、
  // lib 側だけ C を直しても Tier表には反映されないままだった

  // 直近パッチの調整バッジ。統計に反映されているかを凡例で明示する（取得日より後なら未反映、
  // 以前なら未確認。判定は PatchChangeBadge の patchIsAfterStats）。描画も共通部品に任せる
  const hasPatchBadges = Object.keys(patchChanges.changes).length > 0;

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
                e.currentTarget.src = '/images/heroes/default.webp';
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
              {TIER_ORDER.indexOf(hero.tier) < TIER_ORDER.indexOf(prevTier)
                ? <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                : <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />}
              <span className="sr-only">{ja ? `前回（${prevDate}）は Tier ${prevTier}` : `Tier ${prevTier} on ${prevDate}`}</span>
            </span>
          )}
        </span>
        {/* 「元流の子（マークスマン）」は390pxの1マス（約75px）で1行に入らない。
            1行で切ると3体の元流の子が同じ「元流の子（…」に見えるので、2行まで折り返す。
            文字は14px（運営者の方針「補足でも text-sm まで」、2026-09-26）。以前は md で 12px に落としていた */}
        <span className="mt-1 line-clamp-2 w-full break-words text-center text-sm font-bold leading-tight text-slate-800 group-hover:text-brand-700">
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
    const items = [
      {
        key: 'tier',
        label: 'Tier',
        value: d.prevTier === hero.tier ? (ja ? '変動なし' : 'unchanged') : `${d.prevTier} → ${hero.tier}`,
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
                e.currentTarget.src = '/images/heroes/default.webp';
              }}
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-black text-slate-900">{hero.hero_name}</p>
            <p className="text-sm font-bold text-slate-600">
              Tier {hero.tier}・{getShortRoleName(hero.lane)}
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
    // 最上位の段だけ金の線と淡い光で分ける。金の塗りは S のバッジ1つに留める
    const top = tier === 'S';
    return (
      <section
        key={tier}
        aria-label={`Tier ${tier}`}
        className={`rounded-3xl border bg-white p-2 sm:p-5 ${
          top ? 'border-brand-300 shadow-[0_0_40px_-16px_rgb(201_163_92/0.55)]' : 'border-slate-200/80 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-1 pb-2 pt-1 sm:pt-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-base border shadow-xs ${getTierBadgeStyle(tier)}`}>
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
      {/* page-hero は夜の配色の冒頭の帯（globals.css）。淡い金の光を右上から差す */}
      <div className={`${shareMode ? '' : 'md:sticky md:top-0 md:z-20'} page-hero border-b border-slate-200 py-5 sm:py-6 px-4 md:px-8`}>
        {/* 縦積みにして、横並びは lg から。横並びのままだと右の取得日とボタンに押されて、
            「ジャングルのTier表」が390pxで3行、360pxで4行に折れていた。
            md〜lg はサイドバーが出て本文が400px前後しかないので、そこも縦積みにする */}
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight text-balance">{heading?.title ?? t('title')}</h1>
            <p className="text-sm font-bold text-slate-600 mt-1">{heading?.subtitle ?? t('subtitle')}</p>
            {/* 取得日は data_freshness.json を正とする。文言に日付を直書きすると更新漏れが起きるため */}
            <p className="text-sm font-bold text-slate-500 mt-1">
              {h('metaUpdated', { date: dataFreshness.campStats.updatedAt })}
            </p>
          </div>
          {/* 共有は右に置く。ShareButton の選択肢（Xに投稿・URLをコピー）は右端揃えで
              左へ開くので、左端に置くと画面の外へはみ出す。高さは ShareButton（36px）に揃える */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* スクショ用の表示切替。ONの間はUIを隠したコンパクト表示になる */}
            <button
              type="button"
              onClick={() => { setOpen(null); setShareMode(v => !v); }}
              aria-pressed={shareMode}
              className={`flex h-11 items-center gap-1.5 px-3 rounded-xl text-sm font-bold border transition-colors ${
                shareMode
                  ? SELECTED
                  : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Camera size={14} aria-hidden="true" />
              <span>
                {shareMode
                  ? ja ? '通常表示に戻す' : 'Exit share view'
                  : ja ? '共有用表示' : 'Share view'}
              </span>
            </button>
            {!shareMode && (
              <ShareButton title={ja ? '【オナーオブキングス】最新Tier表' : 'Honor of Kings Tier List'} />
            )}
            {/* 狭い画面では装飾アイコンを畳んで横幅を確保する */}
            <div className="hidden sm:block bg-amber-100 p-2.5 rounded-2xl text-amber-600 shadow-inner">
              <Trophy size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* レーン別ページの導入文。総合ページと本文が同じにならないよう、
          そのレーンで何が求められるかを最初に置く（内容はマクロガイドと揃えている） */}
      {!shareMode && lead && (
        <div className="px-4 md:px-8 pt-4">
          <p className="max-w-7xl mx-auto text-sm font-medium text-slate-600 leading-relaxed">{lead}</p>
        </div>
      )}

      {/* 統計の注記（調整前の統計・未掲載の新ヒーロー・↑↓の凡例）。
          3つ合わせてスマホで約200pxあり、Tier S が2画面目から始まっていた。
          1行の要約に畳み、開くと全文が出る。組み立ては StatsFreshnessNote に寄せ、
          ヒーロー一覧と同じ部品を使う。取得日は見出しの下に出しているので、ここでは出さない */}
      {!shareMode && (
        <div className="px-4 md:px-8 pt-3">
          <StatsFreshnessNote
            locale={locale}
            showDate={false}
            patchChanges={patchChanges}
            notes={[
              unrankedNames.length > 0 ? t('unrankedNote', { names: unrankedNames.join(ja ? '・' : ', ') }) : '',
              prevTierLegend,
            ].filter(Boolean)}
            className="max-w-7xl mx-auto"
          />
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
            className="max-md:sticky max-md:top-14 max-md:z-20 max-md:bg-background/95 max-md:backdrop-blur-sm max-md:px-4 max-md:py-2 md:min-w-0"
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

          {/* Tier内の並び替え（勝率 / 出現率 / BAN率）。格子に出す数値もこれで決まる。
              スマホでは押す部分そのものを 44px にする（h-10 だと枠込みで44px、押せるのは40pxだった） */}
          <div className="flex items-center gap-1.5 max-md:px-4 max-md:pb-2 max-md:pt-1 md:shrink-0">
            <ArrowDownWideNarrow size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
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
                  className={`h-11 flex-1 px-3 rounded-[10px] border font-bold text-sm transition-colors md:h-9 md:flex-none ${
                    sortKey === opt.key
                      // 選択中は金の線と淡い塗り。金の「塗り」は Tier S のバッジだけに残す
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
      )}

      {/* 共有用表示: 表示中レーンのS〜Cをアイコン+名前だけの縦長グリッドに畳み、
          最下部に出典（サイトURLと統計取得日）を焼き込む。
          出典は各レーンの枠に入れる。1レーンだけ切り出して貼っても出所が残るように */}
      {shareMode ? (
        <div className="max-w-md mx-auto px-4 mt-4 space-y-3">
          {shareLanes.map(laneId => (
          <div key={laneId} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-baseline justify-between pb-1 border-b border-slate-100">
              <span className="text-sm font-black text-slate-900">{getRoleName(laneId)}</span>
              <span className="text-[10px] font-bold text-slate-500">
                {ja ? 'Tier表' : 'Tier List'}
              </span>
            </div>
            {groupedStatsFor(laneId).map(({ tier, heros }) => (
              <div key={tier} className="flex gap-2.5">
                <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-black text-sm border shadow-xs ${getTierBadgeStyle(tier)}`}>
                  {tier}
                </div>
                <div className="flex-1 grid grid-cols-5 gap-x-1.5 gap-y-2 pt-0.5">
                  {heros.map((hero) => (
                    <div key={hero.id} className="flex flex-col items-center min-w-0">
                      {/* バッジはアイコン枠の overflow-hidden で切れないよう、1段外に置く */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl overflow-hidden relative bg-slate-100 shadow-inner">
                          <Image
                            src={hero.image || `/images/heroes/${hero.key || hero.id}.webp`}
                            alt={hero.hero_name || String(hero.id)}
                            fill
                            sizes="40px"
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.srcset = '';
                              e.currentTarget.src = '/images/heroes/default.webp';
                            }}
                          />
                        </div>
                        <PatchChangeBadge
                          patch={patchChanges}
                          heroId={String(hero.id)}
                          locale={locale}
                          /* 8px だと「調整」の2文字がほぼ読めない。バッジは既定の10pxに合わせる */
                          className="absolute -top-1 -right-1 z-10 text-[10px] px-1 py-0.5"
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 truncate w-full text-center mt-0.5">
                        {hero.hero_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-100 text-center text-[10px] font-bold text-slate-500">
              {ja
                ? `hok.hub-game.com ／ HoK Camp統計 ${dataFreshness.campStats.updatedAt}取得`
                : `hok.hub-game.com / HoK Camp stats as of ${dataFreshness.campStats.updatedAt}`}
              {/* スクショ単体で見ても ↑↓ の意味が分かるよう、バッジがあるときだけ凡例を焼き込む */}
              {hasPatchBadges && (
                <div className="mt-0.5 font-medium">
                  {ja
                    ? `↑↓＝${formatPatchDateJa(patchChanges.date)}パッチ調整（${patchIsAfterStats(patchChanges) ? '統計未反映' : '統計への反映は未確認'}）`
                    : `↑↓ = changed in the ${patchChanges.versionEn} (${patchIsAfterStats(patchChanges) ? 'not yet in the stats' : 'unconfirmed whether the stats include it'})`}
                </div>
              )}
            </div>
          </div>
          ))}
        </div>
      ) : (

      <div ref={gridRef} className="max-w-7xl mx-auto px-4 md:px-8 mt-2 space-y-4">
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

      {/* レーン別の講評。順位表だけでは伝わらない「勝率と評価のねじれ」等を
          そのレーンの実数で解説する（本文は laneTierPages.ts、日付整合は audit が確認） */}
      {!shareMode && commentary && (
        <div className="px-4 md:px-8 pt-6">
          <div className="max-w-7xl mx-auto bg-white border border-slate-100 rounded-2xl p-5 sm:p-6">
            <h2 className="text-sm font-black text-slate-800 mb-3">{commentary.heading}</h2>
            <div className="space-y-3">
              {commentary.paragraphs.map((p, i) => (
                <p key={i} className="text-[13px] font-medium text-slate-600 leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {!shareMode && <ListNotes page="tierList" locale={locale} />}
    </div>
  );
}

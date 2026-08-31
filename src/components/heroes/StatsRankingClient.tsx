'use client';

import { useEffect, useState } from 'react';
import { ShareButton } from '@/components/common/ShareButton';
import { readQuery, replaceQuery, pickEnum } from '@/lib/urlState';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { BarChart3, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

/**
 * 基本ステータス一覧・ランキングの表示部。
 *
 * データの読み込みとロケール別の名前解決はサーバー側（heroes/stats/page.tsx）で
 * 済ませ、ここは並び替え・ロール絞り込みという操作だけを持つ。
 * 表のレイアウトはモバイルで崩れやすいため、コンテナに overflow-x-auto を敷き、
 * セルは折り返さない（ページ全体は横スクロールさせない）。
 */

export type HeroStatRow = {
  id: string;
  slug: string;
  name: string;
  image: string;
  roles: string[];
  hp: number;
  attack: number;
  moveSpeed: number;
  hpRegen: number;
};

type Props = {
  rows: HeroStatRow[];
  /** hok_heroes.json の総数。未実測数の算出に使う */
  totalHeroes: number;
  /** 実測データの取得日（git 履歴由来）。表示にのみ使う */
  measuredAt: string;
};

type SortKey = 'hp' | 'attack' | 'moveSpeed' | 'hpRegen';

const numericOf = (row: HeroStatRow, key: SortKey): number => row[key];
const cellText = (row: HeroStatRow, key: SortKey): string => String(row[key]);

// ロールの表示名は messages の Role 名前空間に既存のものを使う（新規キーは追加しない）
const ROLE_FILTERS = [
  { key: 'all', match: null },
  { key: 'tank', match: 'Tank' },
  { key: 'fighter', match: 'Fighter' },
  { key: 'assassin', match: 'Assassin' },
  { key: 'mage', match: 'Mage' },
  { key: 'marksman', match: 'Marksman' },
  { key: 'support', match: 'Support' },
] as const;

// URLに載せる値。一度貼られたURLは壊せないので、表示ラベルとは切り離して固定する
const SORT_KEYS = ['hp', 'attack', 'moveSpeed', 'hpRegen'] as const;
const URL_ROLES: string[] = ROLE_FILTERS.map(f => f.match).filter(Boolean) as string[];

export function StatsRankingClient({ rows, totalHeroes, measuredAt }: Props) {
  const locale = useLocale();
  const isJa = locale === 'ja';
  const r = useTranslations('Role');

  const [sortKey, setSortKey] = useState<SortKey>('hp');
  const [sortDesc, setSortDesc] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 並び替えと絞り込みをURLに載せる。共有ボタンは location.href を読むので、
  // 書き戻した状態が共有・コピー・Xへの投稿にそのまま乗る。
  // 復元値は列挙にある値だけを通す
  useEffect(() => {
    const q = readQuery();
    /* eslint-disable react-hooks/set-state-in-effect --
     * サーバー側では location を読めないので、初期 state ではなくマウント後に入れる */
    setSortKey(pickEnum(q?.get('sort'), SORT_KEYS, 'hp'));
    if (q?.get('order') === 'asc') setSortDesc(false);
    const role = q?.get('role');
    if (role && URL_ROLES.includes(role)) setRoleFilter(role);
    /* eslint-enable react-hooks/set-state-in-effect */
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    replaceQuery({
      sort: sortKey === 'hp' ? null : sortKey,
      order: sortDesc ? null : 'asc',
      role: roleFilter,
    });
  }, [sortKey, sortDesc, roleFilter, isMounted]);

  const columns: { key: SortKey; label: string }[] = [
    { key: 'hp', label: isJa ? '最大HP' : 'Max HP' },
    { key: 'attack', label: isJa ? '物理攻撃' : 'Phys. Attack' },
    { key: 'moveSpeed', label: isJa ? '移動速度' : 'Move Speed' },
    { key: 'hpRegen', label: isJa ? 'HP回復/秒' : 'HP Regen /s' },
  ];

  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDesc((d) => !d);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const filtered = roleFilter ? rows.filter((row) => row.roles.includes(roleFilter)) : rows;
  const sorted = [...filtered].sort((a, b) => {
    const diff = numericOf(b, sortKey) - numericOf(a, sortKey);
    const base = sortDesc ? diff : -diff;
    // 同値はヒーロー名で安定させる（クリックのたびに順序が揺れないように）
    return base !== 0 ? base : a.name.localeCompare(b.name, isJa ? 'ja' : 'en');
  });

  const missing = totalHeroes - rows.length;

  return (
    <div className="w-full bg-slate-50">
      {/* Header（Tier表と同じ構成） */}
      <div className="sticky top-14 md:top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4 sm:py-6 px-4 md:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isJa ? '全ヒーロー基本ステータス一覧' : 'Hero Base Stats'}
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              {isJa ? 'ゲーム内表示の実測値・列見出しで並び替え' : 'Measured in-game values, sortable by column'}
            </p>
            {/* 並び替えと絞り込みは replaceState でURLに載っている。
                ShareButton は location.href を読むので、そのまま共有に乗る */}
            <ShareButton
              title={isJa ? '【オナーオブキングス】全ヒーロー基本ステータス一覧' : 'Honor of Kings Hero Base Stats'}
              className="mt-3"
            />
          </div>
          <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-600 shadow-inner">
            <BarChart3 size={20} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* 収録範囲の注記。探しているヒーローが表に無い理由になるので件数は出すが、
            「推定値で埋めない方針」といった運営側の事情までは書かない */}
        <p className="mt-4 text-[11px] font-bold text-slate-500 leading-relaxed">
          {isJa
            ? `ゲーム内ステータス画面から実測した${rows.length}体分です（${measuredAt}取得）。残り${missing}体はまだ掲載していません。`
            : `Measured from the in-game stats screen for ${rows.length} heroes (taken ${measuredAt}). The remaining ${missing} are not listed yet.`}
        </p>

        {/* 上位ランキング2枠。見出しにアンカーを付け、ページ内リンクで直接飛べるようにする */}
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <RankingBlock
            anchorId="top-hp"
            title={isJa ? '最大HP上位5体' : 'Top 5: Max HP'}
            rows={rows}
            valueOf={(row) => row.hp}
            isJa={isJa}
            statLabel={isJa ? '最大HP' : 'max HP'}
          />
          <RankingBlock
            anchorId="top-speed"
            title={isJa ? '移動速度上位5体' : 'Top 5: Move Speed'}
            rows={rows}
            valueOf={(row) => row.moveSpeed}
            isJa={isJa}
            statLabel={isJa ? '移動速度' : 'move speed'}
          />
        </div>

        {/* ロール絞り込み（Tier表のレーンタブと同じ見た目） */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {ROLE_FILTERS.map(({ key, match }) => (
            <button
              key={key}
              type="button"
              onClick={() => setRoleFilter(match)}
              aria-pressed={roleFilter === match}
              className={`py-2 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                roleFilter === match
                  ? 'bg-slate-900 text-white shadow-md scale-100'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 active:scale-95'
              }`}
            >
              {r(key)}
            </button>
          ))}
        </div>

        {/* 一覧表。表だけを横スクロールさせ、ページ全体は横に伸ばさない。
            min-w-[720px] で必ず溢れるので、マウスを使わない読者のために
            コンテナ自体をタブで掴んで矢印キーで送れるようにする */}
        <div
          role="region"
          tabIndex={0}
          aria-label={isJa ? '全ヒーロー基本ステータス一覧' : 'Hero base stats'}
          className="mt-4 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xs"
        >
          <table
            aria-label={isJa ? '全ヒーロー基本ステータス一覧' : 'Hero base stats'}
            className="w-full min-w-[720px] text-sm"
          >
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th scope="col" className="px-2 py-3 text-center text-[11px] font-black text-slate-500 w-10">#</th>
                <th scope="col" className="px-3 py-3 text-left text-[11px] font-black text-slate-500">
                  {isJa ? 'ヒーロー' : 'Hero'}
                </th>
                {columns.map((col) => {
                  const active = sortKey === col.key;
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      aria-sort={active ? (sortDesc ? 'descending' : 'ascending') : 'none'}
                      className="px-1 py-2 text-right"
                    >
                      <button
                        onClick={() => onSort(col.key)}
                        className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-black whitespace-nowrap transition-colors ${
                          active ? 'text-brand-700 bg-brand-50' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {col.label}
                        {active ? (
                          sortDesc ? <ChevronDown size={12} /> : <ChevronUp size={12} />
                        ) : (
                          <ChevronsUpDown size={12} className="text-slate-300" />
                        )}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                  <td className="px-2 py-2 text-center text-xs font-bold text-slate-500 tabular-nums">{i + 1}</td>
                  <th scope="row" className="px-3 py-2 text-left">
                    <Link href={`/heroes/${row.slug}`} className="flex items-center gap-2.5 group">
                      <span className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 shadow-inner">
                        <Image
                          src={row.image}
                          alt={row.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.srcset = '';
                            e.currentTarget.src = '/images/heroes/default.webp';
                          }}
                        />
                      </span>
                      <span className="text-xs font-bold text-slate-800 whitespace-nowrap group-hover:text-brand-700 transition-colors">
                        {row.name}
                      </span>
                    </Link>
                  </th>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2 text-right tabular-nums whitespace-nowrap text-xs ${
                        sortKey === col.key ? 'font-bold text-slate-900 bg-brand-50/40' : 'font-medium text-slate-600'
                      }`}
                    >
                      {cellText(row, col.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

{/* 防御を比べに来た読者が「無い」で終わらないよう、値そのものを添えておく */}
        <p className="mt-3 text-[11px] font-bold text-slate-500">
          {isJa
            ? `物理防御・魔法防御は載せていません。レベル1では${rows.length}体すべて物理150／魔法75で同じです。`
            : `Physical and magic defense are not listed. At level 1 all ${rows.length} heroes share the same 150 / 75.`}
        </p>
      </div>
    </div>
  );
}

/**
 * 上位5体の小さなランキング。移動速度のように同値が多いステータスでは
 * 「上位5体」の切り方が恣意的になるため、同値は同順位で数え、
 * 枠から漏れた同値のヒーローがいる場合はその旨を注記する。
 */
function RankingBlock({
  anchorId,
  title,
  rows,
  valueOf,
  isJa,
  statLabel,
}: {
  anchorId: string;
  title: string;
  rows: HeroStatRow[];
  valueOf: (row: HeroStatRow) => number;
  isJa: boolean;
  statLabel: string;
}) {
  const ordered = [...rows].sort(
    (a, b) => valueOf(b) - valueOf(a) || a.name.localeCompare(b.name, isJa ? 'ja' : 'en')
  );
  const top = ordered.slice(0, 5);

  // 5位と同値のまま枠外に漏れた体数（移動速度385が15体、のようなケース）
  const lastValue = top.length > 0 ? valueOf(top[top.length - 1]) : 0;
  const totalAtLastValue = ordered.filter((row) => valueOf(row) === lastValue).length;
  const shownAtLastValue = top.filter((row) => valueOf(row) === lastValue).length;
  const overflow = totalAtLastValue - shownAtLastValue;

  return (
    <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4">
      {/* scroll-mt はヘッダー（sticky）に隠れないための余白 */}
      <h2 id={anchorId} className="scroll-mt-24 text-sm font-black text-slate-800 mb-3">
        <a href={`#${anchorId}`} className="hover:text-brand-700 transition-colors">
          {title}
        </a>
      </h2>
      <ol className="space-y-1.5">
        {top.map((row) => {
          // 同値は同順位（standard competition ranking）
          const rank = ordered.findIndex((o) => valueOf(o) === valueOf(row)) + 1;
          return (
            <li key={row.id}>
              <Link
                href={`/heroes/${row.slug}`}
                className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-slate-50 transition-colors group"
              >
                <span className="w-5 text-center text-xs font-black text-slate-500 tabular-nums shrink-0">
                  {rank}
                </span>
                <span className="relative w-7 h-7 rounded-lg overflow-hidden bg-slate-100 shrink-0 shadow-inner">
                  <Image
                    src={row.image}
                    alt={row.name}
                    fill
                    sizes="28px"
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.srcset = '';
                      e.currentTarget.src = '/images/heroes/default.webp';
                    }}
                  />
                </span>
                <span className="flex-1 text-xs font-bold text-slate-800 truncate group-hover:text-brand-700 transition-colors">
                  {row.name}
                </span>
                <span className="text-xs font-black text-slate-900 tabular-nums">{valueOf(row)}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      {overflow > 0 && (
        <p className="mt-2 text-[11px] font-bold text-slate-500 leading-relaxed">
          {isJa
            ? `${statLabel}${lastValue}は全${totalAtLastValue}体が同値。下の表を${statLabel}で並び替えると全員を確認できます。`
            : `${totalAtLastValue} heroes share ${lastValue} ${statLabel}; sort the table below to see them all.`}
        </p>
      )}
    </section>
  );
}

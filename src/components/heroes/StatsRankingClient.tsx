'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ShareButton } from '@/components/common/ShareButton';
import { Dropdown } from '@/components/common/Dropdown';
import { readQuery, replaceQuery, pickEnum } from '@/lib/urlState';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from 'lucide-react';

/**
 * 基本ステータス一覧・ランキングの表示部。
 *
 * データの読み込みとロケール別の名前解決はサーバー側（heroes/stats/page.tsx）で
 * 済ませ、ここは並び替え・ロール絞り込みという操作だけを持つ。
 *
 * 一覧は lg 以上では表、lg 未満では1体2行のリストとして出す。HTML は同じ <table> で、
 * lg 未満だけ行（tr）を CSS grid にして組み替える。以前は min-w-[720px] の表を
 * 横スクロールさせていたが、390px では名前の列が幅を吸い、数値の列が1つも見えなかった
 * （2026-09-25 実測。最大HPの列が枠の右端 332px から始まっていた）。
 * lg で切るのは、md〜lg はサイドバー（256px）があって本文が 400〜650px しかないため。
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
type RoleKey = (typeof ROLE_FILTERS)[number]['key'];

// URLに載せる値。一度貼られたURLは壊せないので、表示ラベルとは切り離して固定する
const SORT_KEYS = ['hp', 'attack', 'moveSpeed', 'hpRegen'] as const;
const URL_ROLES: string[] = ROLE_FILTERS.map(f => f.match).filter(Boolean) as string[];

/**
 * lg 未満の行の組み方。列は [順位][顔][a][b][c][並べ替え中の値]。
 * 1行目は名前（a〜c）と並べ替え中の値、2行目に残り3項目をラベル付きで並べる。
 * a・b は中身の幅、c は残り。3項目めは c から右端まで使う（360px でも3つが1行に収まる）
 */
const SECOND_LINE = [
  'max-lg:col-start-3 max-lg:row-start-2',
  'max-lg:col-start-4 max-lg:row-start-2',
  'max-lg:col-[5/span_2] max-lg:row-start-2',
] as const;

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
  // lg 未満の2行目で数値の前に付ける短い名前。列見出しを出さない幅で使う
  const shortLabel: Record<SortKey, string> = isJa
    ? { hp: 'HP', attack: '攻撃', moveSpeed: '移速', hpRegen: 'HP回復' }
    : { hp: 'HP', attack: 'ATK', moveSpeed: 'Speed', hpRegen: 'Regen' };

  // 列見出しは同じ列をもう一度押すと昇順・降順が入れ替わる
  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDesc((d) => !d);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };
  // 帯（lg 未満）から並び替え・絞り込みを替えたら、一覧の先頭を帯のすぐ下に出す。
  // 帯は一覧の奥でも貼り付いているので、替えた位置のままだと新しい順の61位あたりが出て、
  // 1位を見るには約4000px 戻る必要があった（390px・2026-09-25 実測）
  const bandRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listTopTarget = useRef<number | null>(null);
  // 戻す先は、替える前（操作の時点）に決める。替えた後に測ると、ブラウザのスクロール位置の
  // 自動補正（scroll anchoring）で既に動いていて、一覧の中にいたかどうかを判定できない
  // （800px で帯が貼り付いた状態からサポートに絞ると、637px → 34px に跳んだ）
  const markListTop = () => {
    const band = bandRef.current;
    const list = listRef.current;
    if (!band || !list) return;
    // 貼り付いた帯の下端（AppBar 56px ＋ 帯の高さ）と、帯と一覧の間（mt-3 = 12px）。
    // 一覧の上端がそこまで来ていれば帯は貼り付いている。一覧より上を見ているときは動かさない
    const offset = parseFloat(getComputedStyle(band).top) + band.offsetHeight + 12;
    const top = list.getBoundingClientRect().top;
    listTopTarget.current = top <= offset + 1 ? window.scrollY + top - offset : null;
  };
  // 描く前に戻す（useEffect だと、自動補正で動いた位置が1コマ見える）
  useLayoutEffect(() => {
    const y = listTopTarget.current;
    if (y === null) return;
    listTopTarget.current = null;
    window.scrollTo({ top: y });
  }, [sortKey, sortDesc, roleFilter]);

  // プルダウンは同じ項目を選び直しても向きを変えない。向きは隣のボタンで替える
  const onPickSort = (key: SortKey) => {
    if (key === sortKey) return;
    markListTop();
    setSortKey(key);
    setSortDesc(true);
  };
  const onPickRole = (key: RoleKey) => {
    const next = ROLE_FILTERS.find((f) => f.key === key)?.match ?? null;
    if (next === roleFilter) return;
    markListTop();
    setRoleFilter(next);
  };
  const onToggleOrder = () => {
    markListTop();
    setSortDesc((d) => !d);
  };

  const roleKey: RoleKey = ROLE_FILTERS.find((f) => f.match === roleFilter)?.key ?? 'all';
  const roleOptions = ROLE_FILTERS.map(({ key }) => ({
    value: key,
    // Role.all は「すべて」。プルダウンのボタンに単独で出ると何のすべてか読めないので言い換える
    label: key === 'all' ? (isJa ? '全ロール' : 'All roles') : r(key),
  }));

  const filtered = roleFilter ? rows.filter((row) => row.roles.includes(roleFilter)) : rows;
  const sorted = [...filtered].sort((a, b) => {
    const diff = numericOf(b, sortKey) - numericOf(a, sortKey);
    const base = sortDesc ? diff : -diff;
    // 同値はヒーロー名で安定させる（クリックのたびに順序が揺れないように）
    return base !== 0 ? base : a.name.localeCompare(b.name, isJa ? 'ja' : 'en');
  });
  // 並べ替え中でない3項目を、lg 未満の2行目のどこに置くか
  const secondLine = new Map(
    columns.filter((c) => c.key !== sortKey).map((c, j) => [c.key, SECOND_LINE[j]] as const)
  );
  const orderLabel = sortDesc ? (isJa ? '高い順' : 'High to low') : isJa ? '低い順' : 'Low to high';

  const missing = totalHeroes - rows.length;

  return (
    <div className="w-full bg-background">
      {/* 見出しの帯（Tier表と同じ構成）。固定するのは lg 以上だけ。
          スマホで固定すると AppBar 56px・下のタブ 66px にこの帯 125px が加わり、
          844px の画面の29%が動かなかった（2026-09-25 実測）。lg 未満では代わりに、
          下の絞り込みと並び替えの帯を固定する */}
      <div className="lg:sticky lg:top-0 lg:z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4 sm:py-6 px-4 md:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-balance">
              {isJa ? '全ヒーロー基本ステータス一覧' : 'Hero Base Stats'}
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              {isJa ? 'ゲーム内表示の実測値・項目ごとに並び替え' : 'Measured in-game values, sortable by stat'}
            </p>
            {/* 並び替えと絞り込みは replaceState でURLに載っている。
                ShareButton は location.href を読むので、そのまま共有に乗る */}
            <ShareButton
              title={isJa ? '【オナーオブキングス】全ヒーロー基本ステータス一覧' : 'Honor of Kings Hero Base Stats'}
              className="mt-3"
            />
          </div>
          {/* 飾り。スマホでは見出しの幅を空けるために出さない。
              出すと 360px で「一覧」の「覧」だけが次の行に落ちた */}
          <div className="max-md:hidden shrink-0 bg-amber-100 p-2.5 rounded-2xl text-amber-600 shadow-inner" aria-hidden="true">
            <BarChart3 size={20} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* 収録範囲の注記。探しているヒーローが表に無い理由になるので件数は出すが、
            「推定値で埋めない方針」といった運営側の事情までは書かない */}
        <p className="mt-4 text-xs font-bold text-slate-500 leading-relaxed">
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

        {/* 絞り込みと並び替え（lg 未満）。列見出しを出さない幅では、ここで並び替える。
            113体の長い一覧のどこからでも替えられるよう、画面の上（AppBar の下）に貼り付ける。
            sm 未満は画面の端まで広げる（-mx-7 = シェルの px-3 ＋ ここの px-4）。本文の幅のままだと
            360px でプルダウンの文字枠が 72px しかなく、「マークスマン」(84px)「Phys. Attack」(85px) が
            省略された。間隔 gap-1.5 と向きのボタン w-10 も、その数px を空けるため（枠は 88px になる） */}
        <div
          ref={bandRef}
          className="lg:hidden sticky top-14 md:top-0 z-20 -mx-7 sm:-mx-4 md:-mx-8 mt-5 px-4 md:px-8 py-2 bg-background/95 backdrop-blur border-b border-slate-200"
        >
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-1.5">
            <Dropdown
              label={isJa ? 'ロール' : 'Role'}
              options={roleOptions}
              value={roleKey}
              onChange={onPickRole}
              defaultValue="all"
            />
            <Dropdown
              label={isJa ? '並び替え' : 'Sort by'}
              options={columns.map((c) => ({ value: c.key, label: c.label }))}
              value={sortKey}
              onChange={onPickSort}
              defaultValue="hp"
            />
            {/* 昇順・降順の切り替え。既定（高い順）から変えたときはプルダウンと同じく金の線で示す */}
            <button
              type="button"
              onClick={onToggleOrder}
              aria-label={`${isJa ? '並び順' : 'Order'}: ${orderLabel}`}
              title={orderLabel}
              className={`flex h-11 w-10 items-center justify-center rounded-xl border bg-white transition-colors ${
                sortDesc ? 'border-slate-200 text-slate-700 hover:border-slate-300' : 'border-brand-700 text-slate-900'
              }`}
            >
              {sortDesc ? <ArrowDownWideNarrow size={20} aria-hidden="true" /> : <ArrowUpNarrowWide size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* ロール絞り込み（lg 以上。Tier表のレーンタブと同じ見た目） */}
        <div className="mt-5 hidden lg:flex flex-wrap items-center gap-2">
          {ROLE_FILTERS.map(({ key, match }) => (
            <button
              key={key}
              type="button"
              onClick={() => setRoleFilter(match)}
              aria-pressed={roleFilter === match}
              className={`py-2 px-4 rounded-xl font-bold text-sm transition-all ${
                roleFilter === match
                  ? 'bg-slate-900 text-white shadow-md scale-100'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 active:scale-95'
              }`}
            >
              {r(key)}
            </button>
          ))}
        </div>

        {/* 一覧。lg 以上は表、lg 未満は tr を grid にして1体2行で出す（冒頭のコメント）。
            行のどこを押してもヒーローのページへ行けるよう、名前のリンクを行いっぱいに広げている。
            ここの relative は保険。行（tr）を位置の基準にできないブラウザでも、広げたリンクが表の外へ出ない */}
        <div ref={listRef} className="relative mt-3 lg:mt-4 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xs">
          <table
            aria-label={isJa ? '全ヒーロー基本ステータス一覧' : 'Hero base stats'}
            className="w-full text-sm max-lg:block"
          >
            <thead className="max-lg:hidden">
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th scope="col" className="px-2 py-3 text-center text-xs font-black text-slate-500 w-10">#</th>
                <th scope="col" colSpan={2} className="px-3 py-3 text-left text-xs font-black text-slate-500">
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
                        type="button"
                        onClick={() => onSort(col.key)}
                        className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-black whitespace-nowrap transition-colors ${
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
            <tbody className="max-lg:block">
              {sorted.map((row, i) => (
                <tr
                  key={row.id}
                  className="relative border-b border-slate-100 last:border-0 hover:bg-slate-50/70 max-lg:grid max-lg:grid-cols-[1.5rem_2.25rem_auto_auto_minmax(0,1fr)_auto] max-lg:items-center max-lg:gap-x-2 max-lg:gap-y-0.5 max-lg:px-3 max-lg:py-2.5"
                >
                  <td className="max-lg:col-start-1 max-lg:row-[1/span_2] text-center text-xs font-bold text-slate-500 tabular-nums lg:px-2 lg:py-2">
                    {i + 1}
                  </td>
                  <td className="max-lg:col-start-2 max-lg:row-[1/span_2] lg:w-11 lg:pl-3 lg:py-2">
                    <span className="relative block w-9 h-9 lg:w-8 lg:h-8 rounded-lg overflow-hidden bg-slate-100 shadow-inner">
                      <Image
                        src={row.image}
                        alt=""
                        fill
                        sizes="36px"
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.srcset = '';
                          e.currentTarget.src = '/images/heroes/default.webp';
                        }}
                      />
                    </span>
                  </td>
                  {/* min-w-0 が無いと、長い名前が a・b 列（auto）を押し広げて行が右へ溢れる。
                      lg:py-1.5 はリンクの箱を顔と同じ32pxにするため（行の高さは以前の48pxのまま）。
                      lg でも折り返しを許す。1024px の英語は名前を1行に保つと表が枠を18px越えた */}
                  <th scope="row" className="min-w-0 text-left max-lg:col-[3/span_3] max-lg:row-start-1 lg:pl-2.5 lg:pr-3 lg:py-2">
                    <Link
                      href={`/heroes/${row.slug}`}
                      className="block break-words lg:py-1.5 text-base lg:text-sm font-bold text-slate-800 hover:text-brand-700 transition-colors after:absolute after:inset-0"
                    >
                      <HeroName name={row.name} />
                    </Link>
                  </th>
                  {columns.map((col) => {
                    const active = sortKey === col.key;
                    return (
                      <td
                        key={col.key}
                        className={`whitespace-nowrap tabular-nums lg:px-3 lg:py-2 lg:text-right ${
                          active
                            ? 'max-lg:col-start-6 max-lg:row-start-1 max-lg:text-right text-base lg:text-sm font-black lg:font-bold text-slate-900 lg:bg-brand-50/40'
                            : `${secondLine.get(col.key)} text-sm font-bold lg:font-medium text-slate-700 lg:text-slate-600`
                        }`}
                      >
                        {/* lg 以上は列見出しがあるので出さない。並べ替え中の値は帯のプルダウンが名前を示す。
                            間は余白（mr）ではなく空白で空ける。読み上げで「攻撃191」とつながらないように */}
                        <span className={active ? 'sr-only lg:hidden' : 'text-xs font-medium text-slate-500 lg:hidden'}>
                          {active ? col.label : shortLabel[col.key]}{' '}
                        </span>
                        {cellText(row, col.key)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 防御を比べに来た読者が「無い」で終わらないよう、値そのものを添えておく */}
        <p className="mt-3 text-xs font-bold text-slate-500 leading-relaxed">
          {isJa
            ? `物理防御・魔法防御は載せていません。レベル1では${rows.length}体すべて物理150／魔法75で同じです。`
            : `Physical and magic defense are not listed. At level 1 all ${rows.length} heroes share the same 150 / 75.`}
        </p>
      </div>
    </div>
  );
}

/**
 * 名前の末尾の括弧書きを1つの塊にして、折り返すなら括弧の前で折る。
 * 「元流の子（マークスマン）」は 390px の名前の枠（181px）に 11px 足りず、
 * 省略すると「元流の子（マークス…」になって、どの元流の子か読めなかった
 */
function HeroName({ name }: { name: string }) {
  const m = name.match(/^(.+?)([（(][^（()）]+[)）])$/);
  if (!m) return <>{name}</>;
  return (
    <>
      {m[1]}
      <span className="inline-block">{m[2]}</span>
    </>
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
      {/* scroll-mt は上に貼り付いた帯に隠れないための余白。
          lg 未満は AppBar（56px）、lg 以上は見出しの帯（約145px）が上にある */}
      <h2 id={anchorId} className="scroll-mt-20 lg:scroll-mt-40 text-sm font-black text-slate-800 mb-3">
        {/* 押せる高さを 21px → 28px にする。-my-1 で見出しの高さは変えない */}
        <a href={`#${anchorId}`} className="inline-block -my-1 py-1 hover:text-brand-700 transition-colors">
          {title}
        </a>
      </h2>
      <ol className="space-y-1">
        {top.map((row) => {
          // 同値は同順位（standard competition ranking）
          const rank = ordered.findIndex((o) => valueOf(o) === valueOf(row)) + 1;
          return (
            <li key={row.id}>
              {/* 高さ44px（顔28px＋上下8px）。スマホで指で押せる大きさにする */}
              <Link
                href={`/heroes/${row.slug}`}
                className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-slate-50 transition-colors group"
              >
                <span className="w-5 text-center text-xs font-black text-slate-500 tabular-nums shrink-0">
                  {rank}
                </span>
                <span className="relative w-7 h-7 rounded-lg overflow-hidden bg-slate-100 shrink-0 shadow-inner">
                  <Image
                    src={row.image}
                    alt=""
                    fill
                    sizes="28px"
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.srcset = '';
                      e.currentTarget.src = '/images/heroes/default.webp';
                    }}
                  />
                </span>
                <span className="flex-1 text-sm font-bold text-slate-800 truncate group-hover:text-brand-700 transition-colors">
                  {row.name}
                </span>
                <span className="text-sm font-black text-slate-900 tabular-nums">{valueOf(row)}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      {overflow > 0 && (
        <p className="mt-2 text-xs font-bold text-slate-500 leading-relaxed">
          {isJa
            ? `${statLabel}${lastValue}は全${totalAtLastValue}体が同値。下の表を${statLabel}で並び替えると全員を確認できます。`
            : `${totalAtLastValue} heroes share ${lastValue} ${statLabel}; sort the table below to see them all.`}
        </p>
      )}
    </section>
  );
}

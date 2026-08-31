'use client';

import { useEffect, useMemo, useState } from 'react';
import { ShareButton } from '@/components/common/ShareButton';
import { readQuery, replaceQuery } from '@/lib/urlState';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import {
  ARCANA_COLORS,
  ARCANA_STATS,
  SLOTS_PER_COLOR,
  damageReduction,
  round1,
  type ArcanaColor,
  type ArcanaEffect,
  type StatGroup,
  type StatKey,
} from '@/lib/arcanaStats';

/**
 * アルカナ計算機の操作部。
 *
 * 効果文の解析とヒーロー基礎値の読み込みはサーバー側（arcana/calculator/page.tsx）で
 * 済ませてある。ここは「枠に何をいくつ入れるか」という状態だけを持つ。
 * 装着枠は色ごとに10枠なので、同じ色の合計が10を超えるところで止める。
 */

export type CalcArcana = {
  id: string;
  color: ArcanaColor;
  name: string;
  stats: string;
  icon?: string;
  effects: ArcanaEffect[];
};

/** ロール別構成（arcanaBuilds.ts）を1クリックで流し込むための組み合わせ */
export type CalcPreset = {
  id: string;
  role: string;
  target: string;
  /** 色ごとに、その色の10枠すべてに入れるアルカナのID */
  picks: Record<ArcanaColor, string>;
};

export type CalcHero = {
  id: string;
  slug: string;
  name: string;
  base: Partial<Record<StatKey, number>>;
};

type Props = {
  arcanas: CalcArcana[];
  presets: CalcPreset[];
  heroes: CalcHero[];
  /** アルカナの数値を書き起こした日（data_freshness.json） */
  updatedAt: string;
};

const COLOR_STYLE: Record<ArcanaColor, { dot: string; card: string; name: string; chip: string }> = {
  red: { dot: 'bg-rose-500', card: 'bg-rose-50/70 border-rose-200', name: 'text-rose-900', chip: 'bg-rose-100 text-rose-800' },
  blue: { dot: 'bg-blue-500', card: 'bg-blue-50/70 border-blue-200', name: 'text-blue-900', chip: 'bg-blue-100 text-blue-800' },
  green: { dot: 'bg-emerald-500', card: 'bg-emerald-50/70 border-emerald-200', name: 'text-emerald-900', chip: 'bg-emerald-100 text-emerald-800' },
};

export function ArcanaCalculatorClient({ arcanas, presets, heroes, updatedAt }: Props) {
  const locale = useLocale();
  const isJa = locale === 'ja';

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [heroId, setHeroId] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const byId = useMemo(() => new Map(arcanas.map(a => [a.id, a])), [arcanas]);

  /**
   * 組んだ構成をURLに載せる。`?a=id:n,id:n&hero=105` の形。
   * 共有ボタンは location.href を読むので、書き戻した状態がそのまま共有に乗る。
   *
   * 復元値は必ず検証する。存在しないIDは捨て、色ごとの合計が SLOTS_PER_COLOR を
   * 超えたところで切り捨てる。壊れたリンクで不整合な画面を作らせない。
   */
  useEffect(() => {
    const q = readQuery();
    const raw = q?.get('a');
    if (raw) {
      const next: Record<string, number> = {};
      const perColor: Record<string, number> = { red: 0, blue: 0, green: 0 };
      for (const part of raw.split(',')) {
        const [id, nStr] = part.split(':');
        const a = byId.get(id);
        if (!a) continue;
        const n = Math.max(0, Math.min(SLOTS_PER_COLOR, parseInt(nStr, 10) || 0));
        if (!n) continue;
        const room = SLOTS_PER_COLOR - (perColor[a.color] ?? 0);
        const take = Math.min(n, room);
        if (take <= 0) continue;
        next[id] = take;
        perColor[a.color] = (perColor[a.color] ?? 0) + take;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Object.keys(next).length) setCounts(next);
    }
    const h = q?.get('hero');
    if (h && heroes.some(x => x.id === h)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeroId(h);
    }
    setIsMounted(true);
  }, [byId, heroes]);

  useEffect(() => {
    if (!isMounted) return;
    const a = Object.entries(counts).filter(([, n]) => n > 0).map(([id, n]) => `${id}:${n}`).join(',');
    replaceQuery({ a: a || null, hero: heroId || null });
  }, [counts, heroId, isMounted]);

  /** 色ごとに埋まっている枠数 */
  const used = useMemo(() => {
    const acc: Record<ArcanaColor, number> = { red: 0, blue: 0, green: 0 };
    for (const [id, n] of Object.entries(counts)) {
      const a = byId.get(id);
      if (a && n > 0) acc[a.color] += n;
    }
    return acc;
  }, [counts, byId]);

  /** 効果ごとの合計。丸めは表示のときに行う */
  const totals = useMemo(() => {
    const acc = new Map<StatKey, number>();
    for (const [id, n] of Object.entries(counts)) {
      const a = byId.get(id);
      if (!a || n <= 0) continue;
      for (const e of a.effects) acc.set(e.key, (acc.get(e.key) ?? 0) + e.value * n);
    }
    return acc;
  }, [counts, byId]);

  const totalUsed = used.red + used.blue + used.green;

  const setCount = (arcana: CalcArcana, next: number) => {
    const others = used[arcana.color] - (counts[arcana.id] ?? 0);
    const value = Math.max(0, Math.min(next, SLOTS_PER_COLOR - others));
    setCounts(prev => ({ ...prev, [arcana.id]: value }));
  };

  const applyPreset = (preset: CalcPreset) => {
    const next: Record<string, number> = {};
    for (const color of ARCANA_COLORS) next[preset.picks[color]] = SLOTS_PER_COLOR;
    setCounts(next);
  };

  const groupLabel = (group: StatGroup) => {
    if (group === 'offense') return isJa ? '攻撃' : 'Offense';
    if (group === 'defense') return isJa ? '耐久' : 'Survivability';
    return isJa ? 'その他' : 'Utility';
  };

  const colorLabel = (color: ArcanaColor) =>
    color === 'red' ? (isJa ? '赤' : 'Red') : color === 'blue' ? (isJa ? '青' : 'Blue') : (isJa ? '緑' : 'Green');

  const statLabel = (key: StatKey) => {
    const def = ARCANA_STATS.find(s => s.key === key);
    if (!def) return key;
    // 一覧では「1秒ごとのHP回復量」だが、表に入れると長すぎるので短くする
    if (key === 'healthRegen') return isJa ? 'HP回復/秒' : 'HP Regen /s';
    return isJa ? def.ja : def.en;
  };

  const formatTotal = (key: StatKey, value: number) => {
    const def = ARCANA_STATS.find(s => s.key === key);
    return `+${round1(value)}${def?.unit === 'percent' ? '%' : ''}`;
  };

  const filledGroups = (['offense', 'defense', 'utility'] as StatGroup[])
    .map(group => ({
      group,
      rows: ARCANA_STATS.filter(s => s.group === group && (totals.get(s.key) ?? 0) > 0),
    }))
    .filter(g => g.rows.length > 0);

  const hero = heroes.find(h => h.id === heroId);

  /** 基礎値に足せるのは実数で効く項目だけ。基礎値も合計も0の項目は行ごと出さない */
  const heroRows = hero
    ? ARCANA_STATS.filter(s => s.baseStatKey).flatMap(s => {
        const base = hero.base[s.key];
        const add = round1(totals.get(s.key) ?? 0);
        if (base === undefined) return [];
        if (base === 0 && add === 0) return [];
        const after = round1(base + add);
        const isDefense = s.key === 'physicalDefense' || s.key === 'magicalDefense';
        return [{
          key: s.key,
          label: statLabel(s.key),
          base,
          add,
          after,
          baseNote: isDefense ? `${damageReduction(base).toFixed(1)}%` : null,
          afterNote: isDefense ? `${damageReduction(after).toFixed(1)}%` : null,
        }];
      })
    : [];

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">

      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          {isJa ? 'アルカナ計算機' : 'Arcana Calculator'}
        </h1>
        {/* 並び替え・絞り込み・構成は replaceState でURLに載っている。
            ShareButton は location.href を読むので、そのまま共有に乗る */}
        <ShareButton title={isJa ? '【オナーオブキングス】アルカナ計算機' : 'Honor of Kings Arcana Calculator'} className="mt-3" />
        <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-500">
          {isJa
            ? '赤・青・緑の30枠に入れるアルカナを選ぶと、効果の合計が出ます。数値は一覧と同じレベル5のものです。'
            : 'Pick what goes into the 30 slots across red, blue and green, and the totals add up here. The values are the Level 5 figures used throughout the site.'}
        </p>
        <p className="mt-1 text-xs font-bold text-slate-500">
          {isJa ? `使用中 ${totalUsed} / 30 枠` : `${totalUsed} / 30 slots filled`}
        </p>
      </div>

      <div className="px-4 mt-4 space-y-4">

        {/* ロール別構成をそのまま流し込む。1クリックで30枠が埋まる */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <h2 className="text-sm font-black text-slate-900">
            {isJa ? 'ロール別構成から入れる' : 'Start from a role build'}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {presets.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                title={preset.target}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 active:bg-slate-100"
              >
                {preset.role}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCounts({})}
              disabled={totalUsed === 0}
              className="ml-auto flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50 disabled:opacity-40"
            >
              <RotateCcw size={13} />
              {isJa ? 'すべて外す' : 'Clear'}
            </button>
          </div>
        </section>

        <div className="space-y-4 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-5 lg:items-start lg:space-y-0">

          {/* 色ごとの選択欄 */}
          <div className="space-y-4">
            {ARCANA_COLORS.map(color => {
              const style = COLOR_STYLE[color];
              const remaining = SLOTS_PER_COLOR - used[color];
              return (
                <section key={color} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-baseline gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                    <h2 className="text-base font-black text-slate-900">{colorLabel(color)}</h2>
                    <span className={`rounded-lg px-2 py-0.5 text-[11px] font-black ${style.chip}`}>
                      {used[color]} / {SLOTS_PER_COLOR}
                    </span>
                    {remaining > 0 && (
                      <span className="text-[11px] font-bold text-slate-500">
                        {isJa ? `あと${remaining}枠` : `${remaining} left`}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {arcanas.filter(a => a.color === color).map(arcana => {
                      const count = counts[arcana.id] ?? 0;
                      const canAdd = remaining > 0;
                      return (
                        <div
                          key={arcana.id}
                          className={`flex items-center gap-2.5 rounded-xl border p-2.5 ${count > 0 ? style.card : 'border-slate-200 bg-white'}`}
                        >
                          {arcana.icon && (
                            <Image src={arcana.icon} alt="" width={32} height={32} className="h-8 w-8 shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className={`text-[13px] font-black leading-tight ${count > 0 ? style.name : 'text-slate-800'}`}>
                              {arcana.name}
                            </div>
                            <div className="mt-0.5 text-[11px] font-bold leading-snug text-slate-500">
                              {arcana.stats}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setCount(arcana, count - 1)}
                              disabled={count === 0}
                              aria-label={isJa ? `${arcana.name}を1つ減らす` : `Remove one ${arcana.name}`}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-5 text-center text-[13px] font-black tabular-nums text-slate-900">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => setCount(arcana, count + 1)}
                              disabled={!canAdd}
                              aria-label={isJa ? `${arcana.name}を1つ増やす` : `Add one ${arcana.name}`}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30"
                            >
                              <Plus size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCount(arcana, SLOTS_PER_COLOR)}
                              disabled={!canAdd}
                              aria-label={isJa ? `${arcana.name}で残りの枠を埋める` : `Fill the remaining slots with ${arcana.name}`}
                              className="ml-0.5 rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-[10px] font-black text-slate-500 transition-all hover:bg-slate-50 disabled:opacity-30"
                            >
                              MAX
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* 合計。画面が広いときは横に貼り付けて、選びながら見られるようにする */}
          <div className="space-y-4 lg:sticky lg:top-4">
            <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h2 className="text-base font-black text-slate-900">
                {isJa ? '効果の合計' : 'Total effects'}
              </h2>

              {filledGroups.length === 0 ? (
                <p className="mt-3 text-xs font-bold leading-relaxed text-slate-500">
                  {isJa
                    ? 'アルカナを選ぶと、ここに合計が出ます。'
                    : 'Pick some arcana and the totals appear here.'}
                </p>
              ) : (
                <div className="mt-3 space-y-3.5">
                  {filledGroups.map(({ group, rows }) => (
                    <div key={group}>
                      <div className="text-[11px] font-black text-slate-500">{groupLabel(group)}</div>
                      <dl className="mt-1.5 space-y-1">
                        {rows.map(row => (
                          <div key={row.key} className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-1 last:border-b-0">
                            <dt className="text-[12px] font-bold text-slate-600">{statLabel(row.key)}</dt>
                            <dd className="text-[14px] font-black tabular-nums text-slate-900">
                              {formatTotal(row.key, totals.get(row.key) ?? 0)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 基礎値に足した結果。実数で効く項目だけ */}
            <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h2 className="text-base font-black text-slate-900">
                {isJa ? 'ヒーローに乗せる' : 'Apply to a hero'}
              </h2>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-slate-500">
                {isJa
                  ? 'レベル1の基礎値に足した値を出します。攻撃速度や移動速度などの％は、装備やレベルで基準になる値が動くため、合計だけを出しています。'
                  : 'Added to the level 1 base stats. Percentage effects such as attack speed and movement speed are shown as totals only, because the value they scale from shifts with level and items.'}
              </p>

              <select
                value={heroId}
                onChange={(e) => setHeroId(e.target.value)}
                aria-label={isJa ? 'ヒーローを選ぶ' : 'Choose a hero'}
                className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-slate-300 focus:bg-white"
              >
                <option value="">{isJa ? 'ヒーローを選ぶ' : 'Choose a hero'}</option>
                {heroes.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>

              {hero && (
                <>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] font-black text-slate-500">
                          <th scope="col" className="py-1.5 pr-2 font-black">{isJa ? '項目' : 'Stat'}</th>
                          <th scope="col" className="py-1.5 px-2 text-right font-black">{isJa ? '基礎値' : 'Base'}</th>
                          <th scope="col" className="py-1.5 pl-2 text-right font-black">{isJa ? 'アルカナ込み' : 'With arcana'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* 変化のない行も残す。「+9」が基礎値のどれくらいかが見えなくなるため、
                            伸びた行だけを濃くして見分けられるようにする */}
                        {heroRows.map(row => (
                          <tr key={row.key} className="border-b border-slate-100 last:border-b-0">
                            <th scope="row" className="py-1.5 pr-2 text-[12px] font-bold text-slate-600 text-left">{row.label}</th>
                            <td className="py-1.5 px-2 text-right text-[13px] font-bold tabular-nums text-slate-500">
                              {row.base}
                              {row.baseNote && <span className="ml-1 text-[10px] font-bold text-slate-500">({row.baseNote})</span>}
                            </td>
                            <td className={`py-1.5 pl-2 text-right text-[13px] tabular-nums ${row.add > 0 ? 'font-black text-slate-900' : 'font-bold text-slate-500'}`}>
                              {row.after}
                              {row.afterNote && <span className="ml-1 text-[10px] font-bold text-slate-500">({row.afterNote})</span>}
                              {row.add > 0 && (
                                <span className="ml-1.5 text-[10px] font-black text-emerald-600">+{row.add}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-[10px] font-bold text-slate-500">
                    {isJa
                      ? '括弧内は、その防御値でのダメージ軽減率です。'
                      : 'The figure in brackets is the damage reduction at that defense value.'}
                  </p>
                  <Link
                    href={`/heroes/${hero.slug}`}
                    className="mt-2.5 inline-block text-[12px] font-black text-slate-500 underline underline-offset-2 hover:text-slate-800"
                  >
                    {isJa ? `${hero.name}のページを見る` : `Open the ${hero.name} page`}
                  </Link>
                </>
              )}
            </section>

            <p className="px-1 text-[11px] font-medium leading-relaxed text-slate-500">
              {isJa ? (
                <>効果の全文と、ロール別構成を選んだ理由は<Link href="/arcana" className="font-bold underline underline-offset-2 hover:text-slate-600">アルカナ一覧</Link>にあります。</>
              ) : (
                <>The full effect list and the reasoning behind each role build are on the <Link href="/arcana" className="font-bold underline underline-offset-2 hover:text-slate-600">arcana page</Link>.</>
              )}
            </p>
          </div>
        </div>

        {/* 一覧ページの解説と重ならないよう、ここでは計算の中身だけを書く */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-black tracking-tight text-slate-900">
            {isJa ? 'この計算機について' : 'About this calculator'}
          </h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
            {isJa
              ? `足しているのは、一覧に載せているレベル5の数値です。${updatedAt}時点の書き起こしです。`
              : `The figures added up here are the Level 5 values from the arcana list, transcribed on ${updatedAt}.`}
          </p>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
            {isJa
              ? `防御値の右の括弧は、その値でのダメージ軽減率です。防御 ÷（防御 + 600）で求まります。実測した${heroes.length}体・${heroes.length * 2}個の防御表示は、すべてこの式と一致しました。`
              : `The bracketed figure beside a defense value is the damage reduction it buys: defense ÷ (defense + 600). All ${heroes.length * 2} defense readings measured across ${heroes.length} heroes match that formula.`}
          </p>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
            {isJa
              ? '基礎値はレベル1のものです。試合ではここにレベルぶんと装備が乗ります。アルカナの数値は伸びないので、効き方は序盤ほど大きくなる。'
              : 'The base stats are the level 1 values; levels and items stack on top during a match. Arcana values never grow, so their effect weighs heaviest in the early game.'}
          </p>
        </section>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ShareButton } from '@/components/common/ShareButton';
import { readQuery, replaceQuery } from '@/lib/urlState';
import { useLocale } from 'next-intl';
import Image from '@/components/common/Image';
import { Link } from '@/i18n/routing';
import { ChevronDown, Minus, Plus, RotateCcw } from 'lucide-react';
import { ArcanaEffects } from '@/components/arcana/ArcanaEffects';
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
  /** 直前に増減したアルカナの効果。下の集計帯で先頭に出す */
  const [lastKeys, setLastKeys] = useState<StatKey[]>([]);
  /** 選択欄が画面に入っているか／合計欄まで来たか。下の集計帯の出し入れに使う */
  const [inChoices, setInChoices] = useState(false);
  const [atTotals, setAtTotals] = useState(false);
  const choicesRef = useRef<HTMLDivElement>(null);
  const totalsRef = useRef<HTMLElement>(null);
  const totalsHeadingRef = useRef<HTMLHeadingElement>(null);

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
      setHeroId(h);
    }
    setIsMounted(true);
  }, [byId, heroes]);

  useEffect(() => {
    if (!isMounted) return;
    const a = Object.entries(counts).filter(([, n]) => n > 0).map(([id, n]) => `${id}:${n}`).join(',');
    replaceQuery({ a: a || null, hero: heroId || null });
  }, [counts, heroId, isMounted]);

  /**
   * 下の集計帯は、選択欄を見ているあいだだけ出す。合計欄まで来たら同じ数字が
   * 画面にあるので引っ込め、ページ末尾の解説やフッターにも被せない。
   * 上は AppBar（56px）、下は TabBar（66px）＋集計帯（約69px）の裏を「見えていない」と数える
   */
  useEffect(() => {
    const choices = choicesRef.current;
    const totalsEl = totalsRef.current;
    if (!choices || !totalsEl || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === choices) setInChoices(e.isIntersecting);
          else if (e.target === totalsEl) setAtTotals(e.isIntersecting);
        }
      },
      { rootMargin: '-56px 0px -135px 0px' },
    );
    io.observe(choices);
    io.observe(totalsEl);
    return () => io.disconnect();
  }, []);

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
    setLastKeys(arcana.effects.map(e => e.key));
  };

  const applyPreset = (preset: CalcPreset) => {
    const next: Record<string, number> = {};
    for (const color of ARCANA_COLORS) next[preset.picks[color]] = SLOTS_PER_COLOR;
    setCounts(next);
    setLastKeys([]);
  };

  /** 集計帯の「合計へ」。URL に #totals を足すと共有リンクにも乗るので、アンカーにせずスクロールで運ぶ */
  const jumpToTotals = () => {
    const el = totalsRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    // 読み上げとキーボードの位置も合計欄へ移す。帯は合計欄に着くと消えるため
    totalsHeadingRef.current?.focus({ preventScroll: true });
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
    // 一覧では「5秒ごとのHP回復」だが、表に入れると長すぎるので短くする
    if (key === 'healthRegen') return isJa ? 'HP回復/5秒' : 'HP Regen /5s';
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

  /**
   * 集計帯に出す項目の並び。いま押したアルカナの効果を先頭に置き、残りは合計欄の順。
   * 帯は2行ぶんの高さで切るので、入りきらない項目は丸ごと隠れる（数字の途中では切らない）
   */
  const filledKeys = filledGroups.flatMap(g => g.rows.map(r => r.key));
  const barKeys = [
    ...lastKeys.filter(k => filledKeys.includes(k)),
    ...filledKeys.filter(k => !lastKeys.includes(k)),
  ];
  const showBar = totalUsed > 0 && inChoices && !atTotals;

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
    <div className="w-full bg-background font-sans text-slate-800">

      {/* page-hero は夜の配色の冒頭の帯（globals.css）。ヒーロー一覧・Tier表と揃える */}
      <div className="page-hero pt-6 pb-5 px-4 border-b border-slate-200">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          {isJa ? 'アルカナ計算機' : 'Arcana Calculator'}
        </h1>
        {/* 並び替え・絞り込み・構成は replaceState でURLに載っている。
            ShareButton は location.href を読むので、そのまま共有に乗る */}
        <ShareButton title={isJa ? '【オナーオブキングス】アルカナ計算機' : 'Honor of Kings Arcana Calculator'} className="mt-3" />
        {/* 冒頭の短い説明は文節で折る（auto-phrase。ほかのページの冒頭と同じ指定）。390px で「もので／す」と割れていた */}
        <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-500 [word-break:auto-phrase]">
          {isJa
            ? '赤・青・緑の30枠に入れるアルカナを選ぶと、効果の合計が出ます。数値は一覧と同じレベル5のものです。'
            : 'Pick what goes into the 30 slots across red, blue and green, and the totals add up here. The values are the Level 5 figures used throughout the site.'}
        </p>
        <p className="mt-1 text-sm font-bold text-slate-500">
          {isJa ? `使用中 ${totalUsed} / 30 枠` : `${totalUsed} / 30 slots filled`}
        </p>
      </div>

      <div className="px-4 mt-4 space-y-4">

        {/* ロール別構成をそのまま流し込む。1クリックで30枠が埋まる */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4">
          <h2 className="text-base font-black text-slate-900">
            {isJa ? 'ロール別構成から入れる' : 'Start from a role build'}
          </h2>
          {/* スマホでは押す的を44pxにする。PC（md 以上）は元の高さのまま */}
          <div className="mt-3 flex flex-wrap gap-2">
            {presets.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                title={preset.target}
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 active:bg-slate-100 md:min-h-0"
              >
                {preset.role}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCounts({})}
              disabled={totalUsed === 0}
              className="ml-auto flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:border-transparent disabled:bg-transparent disabled:text-slate-500 md:min-h-0"
            >
              <RotateCcw size={14} aria-hidden="true" />
              {isJa ? 'すべて外す' : 'Clear'}
            </button>
          </div>
        </section>

        <div className="space-y-4 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-5 lg:items-start lg:space-y-0">

          {/* 色ごとの選択欄 */}
          <div ref={choicesRef} className="space-y-4">
            {ARCANA_COLORS.map(color => {
              const style = COLOR_STYLE[color];
              const remaining = SLOTS_PER_COLOR - used[color];
              return (
                <section key={color} className="@container bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-baseline gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                    <h2 className="text-lg font-black text-slate-900">{colorLabel(color)}</h2>
                    <span className={`rounded-lg px-2 py-0.5 text-sm font-black tabular-nums ${style.chip}`}>
                      {used[color]} / {SLOTS_PER_COLOR}
                    </span>
                    {remaining > 0 && (
                      <span className="text-sm font-bold text-slate-500">
                        {isJa ? `あと${remaining}枠` : `${remaining} left`}
                      </span>
                    )}
                  </div>

                  {/* 行の組み方。TabBar のある幅（md 未満）は2段にして、−／＋／MAX を44pxにする。
                      1段に並べていた頃は的が28px（MAXは36×25）で、360px幅では効果の文が3行に折れていた。
                      md 以上はボタンを元の大きさに戻し、行の幅（@container）が20rem以上なら1段に戻す。
                      1段で効果の文に残る幅は「行幅−約200px」で、1280px幅の行（271px）では約70pxしかなく、
                      「クリティカ／ル率」のように6行まで折れていた。2段にすると2行以内に収まり、
                      選択欄も1950→1866pxと短くなる。1440px幅（行351px）からは1段のほうが短い。
                      2列に割るのは選択欄が24rem以上あるときだけ。1024px幅は合計欄が横に並ぶぶん
                      選択欄が約294pxしかなく、2列だと行が143pxで2段でも5行に折れていた。
                      2026-09-26 に文字を14pxへ上げ、1段に戻す条件を行幅20rem→28remにした。
                      1段で効果の欄に残る幅は「行幅−約220px」で、効果の塊の最長（「物理ライフスティール +0.5%」約188px）が
                      入るのは行幅28rem（448px）から。20remのままだと1440px幅の行（約351px）で欄が約130pxになり入らない。
                      2列に割る条件も選択欄24rem→32remに上げた。24remのままだと768px幅（サイドバーが出て選択欄が約398px）で
                      2列になり、効果の欄が131pxしかなく、「物理ライフスティール」（14pxで140px、途中では折らない）が枠からはみ出した。
                      32rem以上なら2列でも効果の欄は約188px以上ある */}
                  <div className="mt-3 grid gap-2 sm:@lg:grid-cols-2">
                    {arcanas.filter(a => a.color === color).map(arcana => {
                      const count = counts[arcana.id] ?? 0;
                      const canAdd = remaining > 0;
                      return (
                        <div key={arcana.id} className="@container">
                          <div
                            className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2.5 gap-y-1.5 rounded-xl border p-2.5 md:@md:flex ${count > 0 ? style.card : 'border-slate-200 bg-white'}`}
                          >
                            {arcana.icon ? (
                              <Image src={arcana.icon} alt="" width={32} height={32} className="h-8 w-8 shrink-0" />
                            ) : (
                              <span aria-hidden="true" className="h-8 w-8 shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className={`text-[15px] font-black leading-tight ${count > 0 ? style.name : 'text-slate-800'}`}>
                                {arcana.name}
                              </div>
                              {/* 効果は1つずつの塊にして、塊の間でだけ折る（14pxにしたら「クリティカ／ル率」と割れたため） */}
                              <ArcanaEffects stats={arcana.stats} layout="inline" className="mt-0.5" />
                            </div>
                            {/* scroll-mb-36 は、Tab で送ったボタンが下の集計帯（TabBar と合わせて約135px）の裏に潜らないように */}
                            <div className="col-span-2 flex shrink-0 items-center justify-end gap-1.5 md:gap-1">
                              <button
                                type="button"
                                onClick={() => setCount(arcana, count - 1)}
                                disabled={count === 0}
                                aria-label={isJa ? `${arcana.name}を1つ減らす` : `Remove one ${arcana.name}`}
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:border-transparent disabled:bg-transparent disabled:text-slate-300 md:h-7 md:w-7 md:rounded-lg scroll-mb-36 lg:scroll-mb-0"
                              >
                                <Minus className="h-[18px] w-[18px] md:h-[13px] md:w-[13px]" aria-hidden="true" />
                              </button>
                              <span className="w-7 text-center text-base font-black tabular-nums text-slate-900 md:w-6 md:text-sm">
                                {count}
                              </span>
                              <button
                                type="button"
                                onClick={() => setCount(arcana, count + 1)}
                                disabled={!canAdd}
                                aria-label={isJa ? `${arcana.name}を1つ増やす` : `Add one ${arcana.name}`}
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:border-transparent disabled:bg-transparent disabled:text-slate-300 md:h-7 md:w-7 md:rounded-lg scroll-mb-36 lg:scroll-mb-0"
                              >
                                <Plus className="h-[18px] w-[18px] md:h-[13px] md:w-[13px]" aria-hidden="true" />
                              </button>
                              {/* 押せないときは枠と塗りを外して示す。不透明度30%で薄めていた頃は、夜の配色で
                                  MAX の文字が地に対して1.83:1まで沈み、読めなかった。文字は一段暗い slate-500（約7.9:1）に留め、
                                  −／＋の図柄は slate-300 まで落とす（図柄は文字ではないので比の下限は無い） */}
                              <button
                                type="button"
                                onClick={() => setCount(arcana, SLOTS_PER_COLOR)}
                                disabled={!canAdd}
                                aria-label={isJa ? `${arcana.name}で残りの枠を埋める` : `Fill the remaining slots with ${arcana.name}`}
                                className="ml-1 h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition-colors hover:bg-slate-50 disabled:border-transparent disabled:bg-transparent disabled:text-slate-500 md:ml-0.5 md:h-7 md:rounded-lg md:px-1.5 scroll-mb-36 lg:scroll-mb-0"
                              >
                                MAX
                              </button>
                            </div>
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
            {/* scroll-mt は AppBar（56px）の裏に見出しが潜らないように */}
            <section id="totals" ref={totalsRef} className="scroll-mt-20 bg-white border border-slate-200 rounded-2xl p-4">
              <h2 ref={totalsHeadingRef} tabIndex={-1} className="section-title">
                {isJa ? '効果の合計' : 'Total effects'}
              </h2>

              {filledGroups.length === 0 ? (
                <p className="mt-3 text-sm font-bold leading-relaxed text-slate-500">
                  {isJa
                    ? 'アルカナを選ぶと、ここに合計が出ます。'
                    : 'Pick some arcana and the totals appear here.'}
                </p>
              ) : (
                <div className="mt-3 space-y-3.5">
                  {filledGroups.map(({ group, rows }) => (
                    <div key={group}>
                      <div className="text-sm font-black text-slate-500">{groupLabel(group)}</div>
                      <dl className="mt-1.5 space-y-1">
                        {rows.map(row => (
                          <div key={row.key} className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-1 last:border-b-0">
                            <dt className="text-sm font-bold text-slate-600">{statLabel(row.key)}</dt>
                            <dd className="text-base font-black tabular-nums text-slate-900">
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
            <section className="bg-white border border-slate-200 rounded-2xl p-4">
              <h2 className="section-title">
                {isJa ? 'ヒーローに乗せる' : 'Apply to a hero'}
              </h2>
              {/* 文節で折る（auto-phrase）。390px で「攻撃／速度」、360px で「レ／ベル」と語の途中で割れていた */}
              <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-500 [word-break:auto-phrase]">
                {isJa
                  ? 'レベル1の基礎値に足した値を出します。攻撃速度や移動速度などの％は、装備やレベルで基準になる値が動くため、合計だけを出しています。'
                  : 'Added to the level 1 base stats. Percentage effects such as attack speed and movement speed are shown as totals only, because the value they scale from shifts with level and items.'}
              </p>

              <select
                value={heroId}
                onChange={(e) => setHeroId(e.target.value)}
                aria-label={isJa ? 'ヒーローを選ぶ' : 'Choose a hero'}
                className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-800 outline-none focus:border-slate-300 focus:bg-white"
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
                        <tr className="border-b border-slate-200 text-sm font-black text-slate-500">
                          <th scope="col" className="py-1.5 pr-2 font-black">{isJa ? '項目' : 'Stat'}</th>
                          <th scope="col" className="py-1.5 px-2 text-right font-black">{isJa ? '基礎値' : 'Base'}</th>
                          <th scope="col" className="py-1.5 pl-2 text-right font-black">{isJa ? 'アルカナ込み' : 'With arcana'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* 変化のない行も残す。「+9」が基礎値のどれくらいかが見えなくなるため、
                            伸びた行だけを濃くして見分けられるようにする。
                            軽減率の括弧は数値の下の行に置く。14pxで横に並べると「150 (20.0%)」「164 (21.5%) +14」で
                            約310px要り、PCの合計欄（内側306px）と英語の390px幅で表が横に流れた */}
                        {heroRows.map(row => (
                          <tr key={row.key} className="border-b border-slate-100 align-top last:border-b-0">
                            <th scope="row" className="py-1.5 pr-2 text-sm font-bold text-slate-600 text-left">{row.label}</th>
                            <td className="py-1.5 px-2 text-right text-sm font-bold tabular-nums text-slate-500">
                              {row.base}
                              {row.baseNote && <span className="block">({row.baseNote})</span>}
                            </td>
                            <td className={`py-1.5 pl-2 text-right text-sm tabular-nums ${row.add > 0 ? 'font-black text-slate-900' : 'font-bold text-slate-500'}`}>
                              <span className="whitespace-nowrap">
                                {row.after}
                                {row.add > 0 && (
                                  <span className="ml-1.5 font-black text-emerald-700">+{row.add}</span>
                                )}
                              </span>
                              {row.afterNote && <span className="block font-bold text-slate-500">({row.afterNote})</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-sm font-bold text-slate-500 [word-break:auto-phrase]">
                    {isJa
                      ? '括弧内は、その防御値でのダメージ軽減率です。'
                      : 'The figure in brackets is the damage reduction at that defense value.'}
                  </p>
                  {/* 押せる高さを44pxにする（inline-flex と min-h-11） */}
                  <Link
                    href={`/heroes/${hero.slug}`}
                    className="mt-1 inline-flex min-h-11 items-center text-sm font-black text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    {isJa ? `${hero.name}のページを見る` : `Open the ${hero.name} page`}
                  </Link>
                </>
              )}
            </section>

            <p className="px-1 text-sm font-medium leading-relaxed text-slate-500">
              {isJa ? (
                <>効果の全文と、ロール別構成を選んだ理由は<Link href="/arcana" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">アルカナ一覧</Link>にあります。</>
              ) : (
                <>The full effect list and the reasoning behind each role build are on the <Link href="/arcana" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">arcana page</Link>.</>
              )}
            </p>
          </div>
        </div>

        {/* 一覧ページの解説と重ならないよう、ここでは計算の中身だけを書く */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="section-title">
            {isJa ? 'この計算機について' : 'About this calculator'}
          </h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
            {isJa
              ? `足しているのは、一覧に載せているレベル5の数値です。${updatedAt}時点の書き起こしです。`
              : `The figures added up here are the Level 5 values from the arcana list, transcribed on ${updatedAt}.`}
          </p>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
            {isJa
              ? `防御値の下の括弧は、その値でのダメージ軽減率です。防御 ÷（防御 + 600）で求まります。実測した${heroes.length}体・${heroes.length * 2}個の防御表示は、すべてこの式と一致しました。`
              : `The bracketed figure under a defense value is the damage reduction it buys: defense ÷ (defense + 600). All ${heroes.length * 2} defense readings measured across ${heroes.length} heroes match that formula.`}
          </p>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
            {isJa
              ? '基礎値はレベル1のものです。試合ではここにレベルぶんと装備が乗ります。アルカナの数値は伸びないので、効き方は序盤ほど大きくなる。'
              : 'The base stats are the level 1 values; levels and items stack on top during a match. Arcana values never grow, so their effect weighs heaviest in the early game.'}
          </p>
        </section>
      </div>

      {/* 集計帯（lg 未満）。スマホでは合計欄が3.9画面目にあり、＋を押しても変化が画面の外で起きていた。
          TabBar（66px＋端末の下端の余白）の真上に置く。md〜lg は TabBar が無くサイドバー（256px）があるので、
          下端に付けて左をサイドバーの幅だけ空ける。z は本文の固定帯の段（z-30）。
          アプリ追加の案内（z-[65]、下端から80px）が出ているあいだは、帯の上側49pxが案内の下に隠れ、
          下端14pxだけが覗く（390px幅の実測）。案内を閉じれば7日は出ない。
          文字を14pxにしても、帯の高さは案内が避ける72px（globals.css の --hok-bottom-bar）を超えないようにする。
          行の高さを18pxに詰めて約69pxに収めた（12pxのころは63px） */}
      {showBar && (
        <div data-bottom-bar className="fixed inset-x-0 bottom-[calc(66px+env(safe-area-inset-bottom,0px))] z-30 border-t border-slate-200 bg-white/95 backdrop-blur md:bottom-0 md:left-64 lg:hidden">
          <div className="flex items-center gap-3 px-4 py-1.5">
            <div className="min-w-0 flex-1">
              {/* 色の名前は丸の色と並び順（赤・青・緑）で示し、読み上げにだけ文字で渡す */}
              <div className="flex items-center gap-3 text-sm font-black tabular-nums leading-[1.125rem] text-slate-900">
                {ARCANA_COLORS.map(color => (
                  <span key={color} className="flex items-center gap-1">
                    <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${COLOR_STYLE[color].dot}`} />
                    <span className="sr-only">{colorLabel(color)}</span>
                    <span>
                      {used[color]}
                      <span className="font-bold text-slate-500">/{SLOTS_PER_COLOR}</span>
                    </span>
                  </span>
                ))}
              </div>
              {/* 項目は2行ぶん。1行だと英語の360px幅で1項目しか入らず、3つの効果を持つアルカナを
                  押しても2つは見えなかった。2行にしても中身の高さは56pxで、「合計へ」ボタン（44px）より12px高いだけ */}
              <ul className="mt-0.5 flex h-9 flex-wrap gap-x-3 overflow-hidden text-sm font-bold leading-[1.125rem] text-slate-600">
                {barKeys.map(key => (
                  <li key={key} className="max-w-full truncate">
                    {statLabel(key)}{' '}
                    <span className="font-black tabular-nums text-slate-900">{formatTotal(key, totals.get(key) ?? 0)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={jumpToTotals}
              className="flex h-11 shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
            >
              {isJa ? '合計へ' : 'Totals'}
              <ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

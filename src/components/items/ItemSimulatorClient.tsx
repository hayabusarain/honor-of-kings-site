'use client';

import { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Search, RotateCcw, X, Plus } from 'lucide-react';
import {
  ITEM_SLOTS,
  ITEM_STATS,
  damageReduction,
  round1,
  type ItemStatGroup,
  type ItemStatKey,
  type ItemTag,
  type SimItem,
  type SimulatorData,
} from '@/lib/itemSimulator';

/**
 * 装備6枠の合計を出す操作部。
 *
 * 効果文の解析とヒーロー基礎値の読み込みはサーバー側（itemSimulator.ts）で
 * 済ませてある。ここは「どの枠に何を入れるか」だけを持つ。
 */

/**
 * 装備の絞り込み。判定は解析済みの effects（キー）で行うので、効果文の表記ゆれに左右されない。
 * ステータス欄に出ない貫通と靴だけ、下ごしらえ側で付けた tags を見る。
 *
 * ラベルは一覧ページ（/items）と揃える。同じ装備を別の呼び名で出すと、
 * 2つのページを行き来したときに別物に見える。
 */
type ItemFilter = {
  id: string;
  ja: string;
  en: string;
  /** どれか1つでも持っていれば該当 */
  keys?: ItemStatKey[];
  tag?: ItemTag;
};

const ITEM_FILTERS: ItemFilter[] = [
  { id: 'all', ja: 'すべて', en: 'All' },
  { id: 'physical', ja: '物理攻撃', en: 'Physical', keys: ['physicalAttack'] },
  { id: 'magical', ja: '魔法攻撃', en: 'Magical', keys: ['magicalAttack'] },
  { id: 'defense', ja: '防御', en: 'Defense', keys: ['physicalDefense', 'magicalDefense'] },
  { id: 'health', ja: 'HP', en: 'Health', keys: ['maxHealth'] },
  { id: 'attackSpeed', ja: '攻撃速度', en: 'Attack Speed', keys: ['attackSpeed'] },
  { id: 'crit', ja: 'クリティカル', en: 'Crit', keys: ['critRate'] },
  { id: 'pierce', ja: '貫通', en: 'Pierce', tag: 'pierce' },
  { id: 'lifesteal', ja: 'ライフスティール', en: 'Lifesteal', keys: ['physicalLifesteal', 'magicalLifesteal'] },
  { id: 'cdr', ja: 'クールダウン短縮', en: 'Cooldown', keys: ['cooldownReduction'] },
  { id: 'moveSpeed', ja: '移動速度', en: 'Move Speed', keys: ['moveSpeed'] },
  { id: 'boots', ja: '靴', en: 'Boots', tag: 'boots' },
];

/**
 * 完成品とその素材を分ける価格。装備114種は850G以下と2000G以上にきれいに割れていて、
 * その間には1つも無い。一覧ページの「上位アイテム」と同じ基準にしてある。
 */
const ADVANCED_PRICE = 1700;

const matchesFilter = (item: SimItem, filter: ItemFilter) => {
  if (filter.tag) return item.tags.includes(filter.tag);
  if (filter.keys) return item.effects.some(e => filter.keys!.includes(e.key));
  return true;
};

type Props = {
  data: SimulatorData;
  /** 装備の効果と価格を書き起こした日 */
  itemsUpdatedAt: string;
};

export function ItemSimulatorClient({ data, itemsUpdatedAt }: Props) {
  const locale = useLocale();
  const isJa = locale === 'ja';

  const [slots, setSlots] = useState<(number | null)[]>(Array(ITEM_SLOTS).fill(null));
  const [query, setQuery] = useState('');
  const [filterId, setFilterId] = useState('all');
  const [advancedOnly, setAdvancedOnly] = useState(false);
  const [heroId, setHeroId] = useState('');

  const byId = useMemo(() => new Map(data.items.map(i => [i.id, i])), [data.items]);
  const hero = data.heroes.find(h => h.id === heroId);
  const preset = data.presets.find(p => p.heroId === heroId);

  const filled = slots.filter((s): s is number => s !== null);

  const totals = useMemo(() => {
    const acc = new Map<ItemStatKey, number>();
    for (const id of filled) {
      const item = byId.get(id);
      if (!item) continue;
      for (const e of item.effects) acc.set(e.key, (acc.get(e.key) ?? 0) + e.value);
    }
    return acc;
  }, [filled, byId]);

  const totalPrice = filled.reduce((sum, id) => sum + (byId.get(id)?.price ?? 0), 0);

  const addItem = (id: number) => {
    setSlots(prev => {
      const i = prev.indexOf(null);
      if (i === -1) return prev;
      const next = [...prev];
      next[i] = id;
      return next;
    });
  };

  const removeSlot = (index: number) => {
    setSlots(prev => prev.map((v, i) => (i === index ? null : v)));
  };

  const loadPreset = () => {
    if (!preset) return;
    const next = Array<number | null>(ITEM_SLOTS).fill(null);
    preset.items.slice(0, ITEM_SLOTS).forEach((id, i) => { next[i] = id; });
    setSlots(next);
  };

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filter = ITEM_FILTERS.find(f => f.id === filterId) ?? ITEM_FILTERS[0];
    return data.items.filter(i => {
      // 靴は700Gだが、そこから伸びる先が無い完成品。靴で絞っているときに
      // 価格でも切ると必ず0件になるので、そのときだけ価格を見ない
      if (advancedOnly && filter.id !== 'boots' && i.price < ADVANCED_PRICE) return false;
      if (!matchesFilter(i, filter)) return false;
      if (!q) return true;
      return i.name.toLowerCase().includes(q) || i.statsText.toLowerCase().includes(q);
    });
  }, [data.items, query, filterId, advancedOnly]);

  const statLabel = (key: ItemStatKey) => {
    const def = ITEM_STATS.find(s => s.key === key);
    if (!def) return key;
    return isJa ? def.ja : def.en;
  };

  const groupLabel = (g: ItemStatGroup) =>
    g === 'offense' ? (isJa ? '攻撃' : 'Offense')
      : g === 'defense' ? (isJa ? '耐久' : 'Survivability')
        : (isJa ? 'その他' : 'Utility');

  const filledGroups = (['offense', 'defense', 'utility'] as ItemStatGroup[])
    .map(group => ({
      group,
      rows: ITEM_STATS.filter(s => s.group === group && (totals.get(s.key) ?? 0) > 0),
    }))
    .filter(g => g.rows.length > 0);

  /** 基礎値に足せるのは実数で効く項目だけ。基礎値も合計も0の項目は行ごと出さない */
  const heroRows = hero
    ? ITEM_STATS.filter(s => s.baseStatKey).flatMap(s => {
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
          {isJa ? '装備シミュレータ' : 'Item Build Simulator'}
        </h1>
        <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-500">
          {isJa
            ? '装備を6枠まで選ぶと、ステータスの合計と必要なゴールドが出ます。'
            : 'Pick up to six items and see the combined stats and the gold they cost.'}
        </p>
      </div>

      <div className="px-4 mt-4 space-y-4">

        {/* 選んだ6枠 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-black text-slate-900">
              {isJa ? `選んだ装備 ${filled.length} / ${ITEM_SLOTS}` : `${filled.length} / ${ITEM_SLOTS} slots`}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-black tabular-nums text-slate-700">
                {isJa ? `合計 ${totalPrice.toLocaleString()}G` : `${totalPrice.toLocaleString()} gold`}
              </span>
              <button
                type="button"
                onClick={() => setSlots(Array(ITEM_SLOTS).fill(null))}
                disabled={filled.length === 0}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-500 transition-all hover:bg-slate-50 disabled:opacity-40"
              >
                <RotateCcw size={12} />
                {isJa ? 'すべて外す' : 'Clear'}
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {slots.map((id, i) => {
              const item = id !== null ? byId.get(id) : null;
              if (!item) {
                return (
                  <div
                    key={i}
                    className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-300"
                  >
                    <Plus size={18} />
                  </div>
                );
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => removeSlot(i)}
                  aria-label={isJa ? `${item.name}を外す` : `Remove ${item.name}`}
                  className="group relative flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1.5 transition hover:border-rose-300 hover:bg-rose-50"
                >
                  <span className="absolute right-1 top-1 text-slate-300 group-hover:text-rose-500">
                    <X size={12} />
                  </span>
                  {item.icon && (
                    <Image src={item.icon} alt="" width={40} height={40} className="h-10 w-10 rounded-lg" />
                  )}
                  <span className="line-clamp-2 w-full text-center text-[9px] font-bold leading-tight text-slate-600">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="space-y-4 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-5 lg:items-start lg:space-y-0">

          {/* 装備を選ぶ */}
          <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={isJa ? '装備名や効果で検索…' : 'Search by name or stat…'}
                className="w-full rounded-xl border border-transparent bg-slate-100 py-2 pl-10 pr-4 text-sm font-bold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
              />
            </div>

            {/* 114種を上から読んでいくのは現実的ではない。効果で絞れるようにする */}
            <div className="mt-2.5 flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {ITEM_FILTERS.map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterId(f.id)}
                  aria-pressed={filterId === f.id}
                  className={`shrink-0 whitespace-nowrap rounded-xl border px-3.5 py-1.5 text-[11px] font-bold transition-all ${
                    filterId === f.id
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isJa ? f.ja : f.en}
                </button>
              ))}
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              {/* 素材が半分を占めるため、完成品だけを見たいときのほうが多い */}
              <button
                type="button"
                onClick={() => setAdvancedOnly(v => !v)}
                aria-pressed={advancedOnly}
                className={`rounded-xl border px-3 py-1.5 text-[11px] font-bold transition-all ${
                  advancedOnly
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {isJa ? '上位アイテムのみ' : 'Advanced only'}
              </button>
              <p className="text-[11px] font-bold text-slate-500">
                {isJa ? `${visibleItems.length}種（価格の安い順）` : `${visibleItems.length} items, cheapest first`}
              </p>
            </div>

            {/* 枠が埋まると一覧が押せなくなる。理由が分からないと操作に詰まる */}
            {filled.length >= ITEM_SLOTS && (
              <p className="mt-2 text-[11px] font-bold text-slate-500">
                {isJa
                  ? '6枠が埋まっています。入れ替えるには、上の装備を押して外してください。'
                  : 'All six slots are full. Tap an item above to remove it first.'}
              </p>
            )}

            <div className="mt-2 grid max-h-[560px] gap-2 overflow-y-auto sm:grid-cols-2">
              {visibleItems.map(item => {
                const chosen = filled.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addItem(item.id)}
                    disabled={filled.length >= ITEM_SLOTS}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition disabled:opacity-40 ${
                      chosen ? 'border-brand-200 bg-brand-50/60' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {item.icon && (
                      <Image src={item.icon} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-lg" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="truncate text-[13px] font-black text-slate-800">{item.name}</span>
                        <span className="shrink-0 text-[10px] font-bold tabular-nums text-slate-500">
                          {item.price.toLocaleString()}G
                        </span>
                      </div>
                      <div className="truncate text-[11px] font-bold text-slate-500">{item.statsText}</div>
                    </div>
                  </button>
                );
              })}
              {visibleItems.length === 0 && (
                <div className="col-span-full py-8 text-center">
                  <p className="text-sm font-bold text-slate-500">
                    {isJa ? '条件に合う装備がありません' : 'No item matches'}
                  </p>
                  <button
                    type="button"
                    onClick={() => { setQuery(''); setFilterId('all'); setAdvancedOnly(false); }}
                    className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    {isJa ? '絞り込みを解除する' : 'Clear the filters'}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* 合計 */}
          <div className="space-y-4 lg:sticky lg:top-4">
            <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h2 className="text-base font-black text-slate-900">
                {isJa ? 'ステータスの合計' : 'Combined stats'}
              </h2>

              {filledGroups.length === 0 ? (
                <p className="mt-3 text-xs font-bold leading-relaxed text-slate-500">
                  {isJa ? '装備を選ぶと、ここに合計が出ます。' : 'Pick some items and the totals appear here.'}
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
                              +{round1(totals.get(row.key) ?? 0)}{row.unit === 'percent' ? '%' : ''}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 基礎値に足した結果 */}
            <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h2 className="text-base font-black text-slate-900">
                {isJa ? 'ヒーローに乗せる' : 'Apply to a hero'}
              </h2>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-slate-500">
                {isJa
                  ? 'レベル1の基礎値に足した値を出します。パッシブと発動効果は合計に入っていません。'
                  : 'Added to the level 1 base stats. Passive and active effects are not included in the totals.'}
              </p>

              <select
                value={heroId}
                onChange={e => setHeroId(e.target.value)}
                aria-label={isJa ? 'ヒーローを選ぶ' : 'Choose a hero'}
                className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-slate-300 focus:bg-white"
              >
                <option value="">{isJa ? 'ヒーローを選ぶ' : 'Choose a hero'}</option>
                {data.heroes.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>

              {preset && (
                <button
                  type="button"
                  onClick={loadPreset}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  {isJa ? `${preset.heroName}のおすすめビルドを読み込む` : `Load the recommended build for ${preset.heroName}`}
                </button>
              )}

              {hero && heroRows.length > 0 && (
                <>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] font-black text-slate-500">
                          <th scope="col" className="py-1.5 pr-2 font-black">{isJa ? '項目' : 'Stat'}</th>
                          <th scope="col" className="py-1.5 px-2 text-right font-black">{isJa ? '基礎値' : 'Base'}</th>
                          <th scope="col" className="py-1.5 pl-2 text-right font-black">{isJa ? '装備込み' : 'With items'}</th>
                        </tr>
                      </thead>
                      <tbody>
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
                              {row.add > 0 && <span className="ml-1.5 text-[10px] font-black text-emerald-600">+{row.add}</span>}
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

            {/* パッシブは合計に入らないので、選んだ装備のぶんだけ読めるようにする */}
            {filled.length > 0 && (
              <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <h2 className="text-base font-black text-slate-900">
                  {isJa ? '選んだ装備の効果' : 'Effects of the chosen items'}
                </h2>
                <div className="mt-3 space-y-3">
                  {filled.map((id, i) => {
                    const item = byId.get(id);
                    if (!item || (!item.passive && !item.active)) return null;
                    return (
                      <div key={`${id}-${i}`}>
                        <div className="text-[12px] font-black text-slate-700">{item.name}</div>
                        {item.passive && (
                          <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-slate-600">{item.passive}</p>
                        )}
                        {item.active && (
                          <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-slate-600">{item.active}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <p className="px-1 text-[11px] font-medium leading-relaxed text-slate-500">
              {isJa
                ? `装備の効果と価格は${itemsUpdatedAt}時点の書き起こしです。`
                : `Item effects and prices were transcribed on ${itemsUpdatedAt}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

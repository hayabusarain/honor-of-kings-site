'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ShareButton } from '@/components/common/ShareButton';
import { readQuery, replaceQuery } from '@/lib/urlState';
import { useLocale } from 'next-intl';
import Image from '@/components/common/Image';
import { Link } from '@/i18n/routing';
import { Search, RotateCcw, X, Plus, Check } from 'lucide-react';
import { Dropdown } from '@/components/common/Dropdown';
import { SELECTED } from '@/components/common/tones';
import { ItemNameText } from '@/components/items/ItemNameText';
// itemSimulator ではなく itemSimulatorShared から取る。
// あちらは hok_items.json など4つの JSON を読むので、値をひとつでも import すると
// モジュールごとクライアントバンドルへ入り、装備シミュレータを開いていない
// ページにも 200KB 超が配られる（2026-09-05 に実測して分離した）
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
} from '@/lib/itemSimulatorShared';

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
 * 2つのページを行き来したときに別物に見える。英語は装備のステータス欄（stats_en）の語に合わせた。
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
  { id: 'all', ja: '全アイテム', en: 'All items' },
  { id: 'physical', ja: '物理攻撃', en: 'Physical Attack', keys: ['physicalAttack'] },
  { id: 'magical', ja: '魔法攻撃', en: 'Magical Attack', keys: ['magicalAttack'] },
  { id: 'defense', ja: '防御', en: 'Defense', keys: ['physicalDefense', 'magicalDefense'] },
  { id: 'health', ja: 'HP', en: 'Max Health', keys: ['maxHealth'] },
  { id: 'attackSpeed', ja: '攻撃速度', en: 'Attack Speed', keys: ['attackSpeed'] },
  { id: 'crit', ja: 'クリティカル', en: 'Critical Rate', keys: ['critRate'] },
  { id: 'pierce', ja: '貫通', en: 'Pierce', tag: 'pierce' },
  { id: 'lifesteal', ja: 'ライフスティール', en: 'Lifesteal', keys: ['physicalLifesteal', 'magicalLifesteal'] },
  { id: 'cdr', ja: 'クールダウン短縮', en: 'Cooldown Reduction', keys: ['cooldownReduction'] },
  { id: 'moveSpeed', ja: '移動速度', en: 'Movement Speed', keys: ['moveSpeed'] },
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

/**
 * 共有の Dropdown は一覧を下へ最大 60vh で開くが、スマホの TabBar を避けない。
 * ここでは効果のプルダウンがヒーロー欄の下（開く前は画面の下寄り）にあり、390px幅で
 * 最後の「移動速度」「靴」が一覧を最後までスクロールしても TabBar の裏に残った。
 * そこを押すと TabBar のリンクに当たって別のページへ移る（2026-09-25 実測）。
 * 開いた直後に一覧の下端を測り、TabBar の上に収まるまで画面を送る。
 * 送るのは、ボタンが上の固定帯（topReserved の位置）に潜らない所まで。
 * Dropdown 側が TabBar を避けるようになったら外す（装備一覧 ItemsClient にも同じものがある）
 */
function keepListAboveTabBar(root: HTMLElement, topReserved: number) {
  if (!window.matchMedia('(max-width: 767px)').matches) return; // md 以上は TabBar が無い
  requestAnimationFrame(() => {
    const list = root.querySelector('[role="listbox"]');
    const button = list?.parentElement?.querySelector('button[aria-haspopup]');
    if (!list || !button) return;
    // 画面の下端に固定されている帯の上端。TabBar は iPhone のホームバーのぶん高くなるので決め打ちしない
    let barTop = window.innerHeight;
    for (let el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight - 2); el; el = el.parentElement) {
      if (getComputedStyle(el).position === 'fixed') { barTop = el.getBoundingClientRect().top; break; }
    }
    const by = Math.min(list.getBoundingClientRect().bottom + 8 - barTop, button.getBoundingClientRect().top - topReserved);
    if (by > 0) window.scrollBy(0, by);
  });
}

type Props = {
  data: SimulatorData;
  /** 装備の効果と価格を書き起こした日 */
  itemsUpdatedAt: string;
};

export function ItemSimulatorClient({ data, itemsUpdatedAt }: Props) {
  const locale = useLocale();
  const isJa = locale === 'ja';

  const [slots, setSlots] = useState<(number | null)[]>(Array(ITEM_SLOTS).fill(null));
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [filterId, setFilterId] = useState('all');
  const [advancedOnly, setAdvancedOnly] = useState(false);
  const [heroId, setHeroId] = useState('');
  /** 貼り付く6枠の帯。プルダウンを開いたとき、ボタンをこの帯の下までしか送らないために高さを読む */
  const bandRef = useRef<HTMLElement>(null);

  const byId = useMemo(() => new Map(data.items.map(i => [i.id, i])), [data.items]);

  /**
   * 組んだ6枠と対象ヒーローをURLに載せる。`?b=1137,1133&hero=105` の形。
   * 共有ボタンは location.href を読むので、書き戻した状態がそのまま共有に乗る。
   *
   * 検索語・種類フィルタ・上位装備のみ、はURLに入れない。1文字打つたびに
   * replaceState が走るうえ、共有したいのは6枠の構成であって装備リストの
   * 絞り込みではない。
   *
   * 復元値は byId に実在するIDだけ・先頭6件までに絞る
   */
  useEffect(() => {
    const q = readQuery();
    const raw2 = q?.get('b');
    if (raw2) {
      const ids = raw2.split(',')
        .map(x => parseInt(x, 10))
        .filter(n => Number.isFinite(n) && byId.has(n))
        .slice(0, ITEM_SLOTS);
      if (ids.length) {
        const next: (number | null)[] = Array(ITEM_SLOTS).fill(null);
        ids.forEach((id, i) => { next[i] = id; });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSlots(next);
      }
    }
    const h = q?.get('hero');
    if (h && data.heroes.some(x => x.id === h)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeroId(h);
    }
    setIsMounted(true);
  }, [byId, data.heroes]);

  useEffect(() => {
    if (!isMounted) return;
    const b2 = slots.filter((x): x is number => x !== null).join(',');
    replaceQuery({ b: b2 || null, hero: heroId || null });
  }, [slots, heroId, isMounted]);

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
    <div className="w-full bg-background font-sans text-slate-800">

      {/* page-hero は夜の配色の冒頭の帯（globals.css）。Tier表・ヒーロー一覧と同じ見た目にそろえる */}
      <div className="page-hero pt-6 pb-5 px-4 border-b border-slate-200">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          {isJa ? '装備シミュレータ' : 'Item Build Simulator'}
        </h1>
        {/* 並び替え・絞り込み・構成は replaceState でURLに載っている。
            ShareButton は location.href を読むので、そのまま共有に乗る */}
        <ShareButton title={isJa ? '【オナーオブキングス】装備シミュレータ' : 'Honor of Kings Item Build Simulator'} className="mt-3" />
        <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-600">
          {isJa
            ? '装備を6枠まで選ぶと、ステータスの合計と必要なゴールドが出ます。'
            : 'Pick up to six items and see the combined stats and the gold they cost.'}
        </p>
      </div>

      <div className="px-4 mt-4 space-y-4">

        {/* 選んだ6枠。lg 未満では画面の上（スマホは AppBar の下）に貼り付く1段の帯にする。
            装備リストをページごとスクロールさせたので、この欄が画面外へ消えると、
            いま何を選んでいて合計が何Gかを見るたびに上まで戻ることになる。
            帯の高さは390px幅で54px（実測）。見えている範囲（844−56−66＝722px）の7.5%。
            lg 以上では装備リストが560pxの箱の中で流れるので、元どおり固定しないカードにする。
            夜の配色では影が見えないので、下の装備リストと重なったときの境目は一段強い線（slate-300）で出す */}
        <section
          ref={bandRef}
          aria-labelledby="sim-slots-heading"
          className="sticky top-14 z-20 -mx-2 flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-2.5 py-2 md:top-0 lg:static lg:mx-0 lg:flex-wrap lg:justify-between lg:gap-x-3 lg:gap-y-3 lg:rounded-2xl lg:border-slate-200 lg:p-4"
        >
          <h2 id="sim-slots-heading" className="sr-only lg:not-sr-only lg:text-base lg:font-black lg:text-slate-900">
            {isJa ? `選んだ装備 ${filled.length} / ${ITEM_SLOTS}` : `${filled.length} / ${ITEM_SLOTS} slots`}
          </h2>

          {/* 帯では6枠を先頭に置き、名前は出さずアイコンだけにする。外すときは枠を押す */}
          <div className="order-first grid min-w-0 flex-1 grid-cols-6 gap-1 lg:order-last lg:basis-full lg:gap-2">
            {slots.map((id, i) => {
              const item = id !== null ? byId.get(id) : null;
              if (!item) {
                return (
                  <div
                    key={i}
                    className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-slate-300 lg:rounded-xl"
                  >
                    <Plus size={16} aria-hidden="true" />
                  </div>
                );
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => removeSlot(i)}
                  aria-label={isJa ? `${item.name}を外す` : `Remove ${item.name}`}
                  title={isJa ? `${item.name}を外す` : `Remove ${item.name}`}
                  className="group relative flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 transition hover:border-rose-300 hover:bg-rose-50 lg:rounded-xl lg:p-1.5"
                >
                  <span className="absolute right-0 top-0 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 group-hover:text-rose-600 lg:right-1 lg:top-1 lg:h-4 lg:w-4">
                    <X size={10} aria-hidden="true" />
                  </span>
                  {item.icon && (
                    <Image src={item.icon} alt="" width={40} height={40} className="h-full w-full rounded-md lg:h-10 lg:w-10 lg:rounded-lg" />
                  )}
                  <span className="hidden w-full text-center text-sm font-bold leading-tight text-slate-600 break-keep wrap-anywhere lg:line-clamp-2">
                    <ItemNameText name={item.name} />
                  </span>
                </button>
              );
            })}
          </div>

          {/* 合計の幅は最小を決めておく。「0G」から「4,900G」へ桁が増えるたびに6枠が細り、
              帯の高さが 57.8px→54px と縮んで、下の装備リストが指の下で動いていた（390px幅で実測）。
              「合計」はスマホでは画面に出さないが、読み上げには残す。
              14pxの「4,900G」は約50pxあるので、最小幅は3.5rem（56px）にしてある */}
          <div className="flex shrink-0 items-center gap-2 lg:gap-3">
            <span className="min-w-14 text-right text-sm font-black tabular-nums text-slate-800">
              <span className="sr-only lg:not-sr-only">{isJa ? '合計 ' : 'Total '}</span>
              {totalPrice.toLocaleString(locale)}G
            </span>
            <button
              type="button"
              onClick={() => setSlots(Array(ITEM_SLOTS).fill(null))}
              disabled={filled.length === 0}
              aria-label={isJa ? 'すべて外す' : 'Clear all'}
              title={isJa ? 'すべて外す' : 'Clear all'}
              className="flex h-9 w-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-40 lg:h-11 lg:w-auto lg:px-3"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span className="hidden lg:inline">{isJa ? 'すべて外す' : 'Clear all'}</span>
            </button>
          </div>
        </section>

        {/* スマホでは「ヒーローに乗せる」を装備リストより前に出す（下の order-first）。
            おすすめビルドの読み込みがいちばん速い入口で、以前は装備リストの下、1.8画面目にあった。
            右の列を lg 未満で contents にしているのは、その中の欄を外側の並びに直接並べ替えるため */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-5">

          {/* 装備を選ぶ */}
          <section className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4">
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label={isJa ? '装備を検索' : 'Search items'}
                placeholder={isJa ? '装備名や効果で検索' : 'Search by name or stat'}
                className="h-11 w-full rounded-xl border border-transparent bg-slate-100 pl-9 pr-3 text-sm font-bold text-slate-800 outline-none transition-all placeholder:text-slate-500 focus:border-slate-300 focus:bg-white"
              />
            </div>

            {/* 114種を上から読んでいくのは現実的ではない。効果で絞れるようにする。
                チップ12個の横スクロールは最初の画面に4つしか見えなかったので、一覧ページと同じプルダウンにした */}
            {/* 上の固定帯は AppBar（56px）と6枠の帯。ボタンは帯の下端より上へは送らない。
                1024px幅では装備の欄が約295pxしかなく、プルダウンを14rem固定にすると「上位｜のみ」が2行に折れた。
                ボタンは折らず、プルダウンの側を縮める */}
            <div
              className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:grid-cols-[minmax(0,14rem)_auto] sm:justify-start"
              onClickCapture={(e) => keepListAboveTabBar(e.currentTarget, 56 + (bandRef.current?.offsetHeight ?? 0) + 8)}
              onKeyDownCapture={(e) => keepListAboveTabBar(e.currentTarget, 56 + (bandRef.current?.offsetHeight ?? 0) + 8)}
            >
              <Dropdown
                label={isJa ? '効果で絞り込む' : 'Filter by effect'}
                options={ITEM_FILTERS.map(f => ({ value: f.id, label: isJa ? f.ja : f.en }))}
                value={filterId}
                onChange={setFilterId}
                defaultValue="all"
              />
              {/* 素材が半分を占めるため、完成品だけを見たいときのほうが多い。
                  オンは金の線と淡い塗り（tones.ts の SELECTED）。墨の塗りは夜の配色で白く光るので使わない */}
              <button
                type="button"
                onClick={() => setAdvancedOnly(v => !v)}
                aria-pressed={advancedOnly}
                className={`flex h-11 items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 text-sm font-bold transition-colors ${
                  advancedOnly
                    ? SELECTED
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {advancedOnly && <Check size={14} aria-hidden="true" />}
                {isJa ? '上位のみ' : 'Advanced only'}
              </button>
            </div>

            <p className="mt-2 text-sm font-bold text-slate-500">
              {isJa ? `${visibleItems.length}種（価格の安い順）` : `${visibleItems.length} items, cheapest first`}
            </p>

            {/* 枠が埋まると一覧が押せなくなる。理由が分からないと操作に詰まる */}
            {filled.length >= ITEM_SLOTS && (
              <p className="mt-2 text-sm font-bold text-slate-600">
                {isJa
                  ? '6枠が埋まっています。入れ替えるには、上の装備を押して外してください。'
                  : 'All six slots are full. Tap an item above to remove it first.'}
              </p>
            )}

            {/* lg 未満は箱の中でスクロールさせず、ページごと流す。560pxの箱に7574px分が入っていて、
                指を置く場所によってページが動いたりリストが動いたりした（2026-09-25 実測）。
                PCは右の列が固定で横に並ぶので、箱のままにする。
                列の数は画面の幅ではなく、この欄の幅で決める（1列256px以上）。画面の幅で2列にしていたときは、
                サイドバーと右の列に挟まれる1024px幅で1列が約140pxになり、名前が「ハン｜ター｜ブレ｜ード」と
                2字ずつ折れていた（768px幅でも「ハンターブレ｜ード」）。いまは 360・390・768・1024px で1列、
                640・1280px で2列（2026-09-26 実測） */}
            <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),1fr))] gap-2 lg:max-h-[560px] lg:overflow-y-auto">
              {visibleItems.map(item => {
                const chosen = filled.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addItem(item.id)}
                    disabled={filled.length >= ITEM_SLOTS}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition disabled:opacity-40 ${
                      chosen ? SELECTED : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {item.icon && (
                      <Image src={item.icon} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-lg" />
                    )}
                    {/* 名前は14pxで省略せず2行まで折る。1行に切り詰めると、英語の
                        「Crimson Shadow - Redemption」のように末尾の語で見分ける名前が消える。
                        日本語は ItemNameText が置く語の切れ目（「・」「の」の後ろ、カタカナ語の間）で折り、
                        それでも入らないときだけ任意の位置で折る */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="min-w-0 flex-1 break-keep wrap-anywhere text-sm font-black leading-snug text-slate-800"><ItemNameText name={item.name} /></span>
                        <span className="shrink-0 text-sm font-bold tabular-nums text-slate-500">
                          {item.price.toLocaleString(locale)}G
                        </span>
                      </div>
                      <div className="truncate text-sm font-bold text-slate-500">{item.statsText}</div>
                    </div>
                    {/* 選んだ装備は金の線と淡い塗り（tones.ts の SELECTED）とチェックで示す。
                        墨の線は夜の配色で白く光るので使わない */}
                    {chosen && (
                      <>
                        <Check size={16} aria-hidden="true" className="shrink-0 text-brand-700" />
                        <span className="sr-only">{isJa ? '（選択中）' : '(selected)'}</span>
                      </>
                    )}
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
                    className="mt-2 h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    {isJa ? '絞り込みを解除する' : 'Clear the filters'}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* 合計 */}
          <div className="contents lg:block lg:sticky lg:top-4 lg:space-y-4">
            {/* 右の列の見出しは節の見出し（section-title、左に金の縦線）にそろえる */}
            <section className="bg-white border border-slate-200 rounded-2xl p-4">
              <h2 className="section-title">
                {isJa ? 'ステータスの合計' : 'Combined stats'}
              </h2>

              {filledGroups.length === 0 ? (
                <p className="mt-3 text-sm font-bold leading-relaxed text-slate-500">
                  {isJa ? '装備を選ぶと、ここに合計が出ます。' : 'Pick some items and the totals appear here.'}
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

            {/* 基礎値に足した結果。lg 未満では order-first で装備リストの前に出る */}
            <section className="order-first bg-white border border-slate-200 rounded-2xl p-4">
              <h2 className="section-title">
                {isJa ? 'ヒーローに乗せる' : 'Apply to a hero'}
              </h2>
              {/* 14pxにした360px幅で「…入っていませ｜ん。」と2字だけ次の行に落ちた。
                  text-pretty で最終行を「せん。」の3字に延ばす（本文なので語の切れ目までは求めない） */}
              <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-500 text-pretty">
                {isJa
                  ? 'レベル1の基礎値に足した値を出します。パッシブと発動効果は合計に入っていません。'
                  : 'Added to the level 1 base stats. Passive and active effects are not included in the totals.'}
              </p>

              <select
                value={heroId}
                onChange={e => setHeroId(e.target.value)}
                aria-label={isJa ? 'ヒーローを選ぶ' : 'Choose a hero'}
                className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-800 outline-none focus:border-slate-300 focus:bg-white"
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
                  className="mt-2 min-h-11 w-full rounded-xl border border-brand-700 bg-white px-3 py-2 text-sm font-black text-brand-700 text-balance transition-colors hover:bg-brand-50"
                >
                  {isJa ? `${preset.heroName}のおすすめビルドを読み込む` : `Load the recommended build for ${preset.heroName}`}
                </button>
              )}

              {hero && heroRows.length > 0 && (
                <>
                  {/* 防御の軽減率は値の下の行に出す。14pxで値と同じ行に並べると、
                      「300 (33.3%) +150」の列が約130pxになり、360px幅で表が枠から約20pxはみ出して横に流れる */}
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-sm font-black text-slate-500">
                          <th scope="col" className="py-1.5 pr-2 font-black">{isJa ? '項目' : 'Stat'}</th>
                          <th scope="col" className="py-1.5 px-2 text-right font-black">{isJa ? '基礎値' : 'Base'}</th>
                          <th scope="col" className="py-1.5 pl-2 text-right font-black">{isJa ? '装備込み' : 'With items'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {heroRows.map(row => (
                          <tr key={row.key} className="border-b border-slate-100 last:border-b-0">
                            <th scope="row" className="py-1.5 pr-2 align-top text-sm font-bold text-slate-600 text-left">{row.label}</th>
                            <td className="py-1.5 px-2 align-top text-right text-sm font-bold tabular-nums text-slate-500">
                              {row.base}
                              {row.baseNote && <span className="block font-bold text-slate-500">({row.baseNote})</span>}
                            </td>
                            <td className={`py-1.5 pl-2 align-top text-right text-sm tabular-nums ${row.add > 0 ? 'font-black text-slate-900' : 'font-bold text-slate-500'}`}>
                              {row.after}
                              {/* emerald-600 は白地で 3.65 と AA（4.5）に届かない。同じ「正」の緑の emerald-700（5.36）にする。
                                  jade は A ティアのバッジ専用（globals.css）なので、増えた値には使わない */}
                              {row.add > 0 && <span className="ml-1.5 font-black text-emerald-700">+{row.add}</span>}
                              {row.afterNote && <span className="block font-bold text-slate-500">({row.afterNote})</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    {isJa
                      ? '括弧内は、その防御値でのダメージ軽減率です。'
                      : 'The figure in brackets is the damage reduction at that defense value.'}
                  </p>
                  <Link
                    href={`/heroes/${hero.slug}`}
                    className="mt-1 inline-flex min-h-11 items-center text-sm font-bold text-brand-700 underline underline-offset-2 hover:decoration-2"
                  >
                    {isJa ? `${hero.name}のページを見る` : `Open the ${hero.name} page`}
                  </Link>
                </>
              )}
            </section>

            {/* パッシブは合計に入らないので、選んだ装備のぶんだけ読めるようにする */}
            {filled.length > 0 && (
              <section className="bg-white border border-slate-200 rounded-2xl p-4">
                <h2 className="section-title">
                  {isJa ? '選んだ装備の効果' : 'Effects of the chosen items'}
                </h2>
                <div className="mt-3 space-y-3">
                  {filled.map((id, i) => {
                    const item = byId.get(id);
                    if (!item || (!item.passive && !item.active)) return null;
                    return (
                      <div key={`${id}-${i}`}>
                        <div className="text-sm font-black text-slate-800">{item.name}</div>
                        {item.passive && (
                          <p className="mt-0.5 text-sm font-medium leading-relaxed text-slate-600">{item.passive}</p>
                        )}
                        {item.active && (
                          <p className="mt-0.5 text-sm font-medium leading-relaxed text-slate-600">{item.active}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <p className="px-1 text-sm font-medium leading-relaxed text-slate-500">
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

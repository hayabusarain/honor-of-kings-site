'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronDown, Plus } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ShareButton } from '@/components/common/ShareButton';
import { readQuery } from '@/lib/urlState';
import { getTierBadgeStyle } from '@/lib/tierBadge';
// 型だけを取る。compare.ts は src/data の JSON を読むので値は import しない
import type { CompareHero, CompareLocale, CompareMeta, LaneId, RangeId, SharedStatKey } from '@/lib/compare';
import { HeroPickerDialog, ROLE_LABEL } from './HeroPickerDialog';

/**
 * ヒーロー比較の本体。2体を1つの表に並べる。
 *
 * 状態は ?h=slug1,slug2。id ではなく slug にしたのは、共有されたURLを見て
 * 何と何の比較か読めるようにするため（旧URLの数値IDも読み取りだけは受ける）。
 *
 * クエリはマウント後に location から読み、history.replaceState で書き戻す。
 * useSearchParams と router.replace は使わない。前者は Suspense 境界を要求し、
 * 後者はクエリが変わるたびにサーバーへ画面データ（RSC）を取りに行く。
 * このページはクエリで中身が変わらない静的ページなので、どちらも要らない
 * （src/lib/urlState.ts と同じ判断）。
 *
 * 表は初期HTMLから出す。未選択の枠は「—」で埋めておき、何を比べるページかが
 * 選ぶ前から読めるようにする。
 *
 * 組み方: md 以上は [項目][1体目][2体目] の表。md 未満は1項目を2行にする
 * （1行目に項目名、2行目に2体の値）。同じ <table> のまま、md 未満だけ tr を
 * CSS grid にして組み替える（/heroes/stats の StatsRankingClient と同じやり方）。
 * 項目名の th は両方の幅で同じ要素なので、読み上げの行見出しが幅で消えない。
 */

type Slots = [string | null, string | null];
type Mark = 'high' | 'low' | null;

type RowDef = {
  key: string;
  label: string;
  /** 表示する値。null は「データが無い」 */
  value: (h: CompareHero) => ReactNode | null;
  /**
   * 大小を比べる数値。持たせるのは「高いほうが有利」と言える項目だけ。
   * 出現率・BAN率・リソース量は高いほうが強いとは限らないので持たせない
   */
  num?: (h: CompareHero) => number | null;
};

type GroupDef = {
  key: string;
  title: string;
  /** 見出しの横に添える出所 */
  source?: ReactNode;
  /** 値が無いときの表示 */
  missing: string;
  rows: RowDef[];
};

const LANE_LABEL: Record<LaneId, Record<CompareLocale, string>> = {
  CLASH: { ja: 'クラッシュレーン', en: 'Clash Lane' },
  JUNGLE: { ja: 'ジャングル', en: 'Jungle' },
  MID: { ja: 'ミッドレーン', en: 'Mid Lane' },
  FARM: { ja: 'ファームレーン', en: 'Farm Lane' },
  ROAM: { ja: 'ローム', en: 'Roam' },
};

const RANGE_LABEL: Record<RangeId, Record<CompareLocale, string>> = {
  melee: { ja: '近距離', en: 'Melee' },
  ranged: { ja: '遠距離', en: 'Ranged' },
};

/** 全員同じ値のため表から外した項目の名前。注記で使う */
const SHARED_LABEL: Record<SharedStatKey, Record<CompareLocale, string>> = {
  magicAttack: { ja: '魔法攻撃', en: 'Magic Attack' },
  physDefense: { ja: '物理防御', en: 'Physical Armor' },
  magicDefense: { ja: '魔法防御', en: 'Magic Defense' },
};

/** 名前を「AとB」「A and B」でつなぐ */
const joinNames = (names: string[], ja: boolean) => names.join(ja ? 'と' : ' and ');

/** 英語の列挙。「A, B and C」 */
const listEn = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/** クエリの値。空・重複・存在しない slug は捨て、2体までにする */
function parseSlots(raw: string, resolve: (token: string) => string | null): Slots {
  const out: string[] = [];
  for (const part of raw.split(',')) {
    const slug = resolve(part.trim().toLowerCase());
    if (!slug || out.includes(slug)) continue;
    out.push(slug);
    if (out.length === 2) break;
  }
  return [out[0] ?? null, out[1] ?? null];
}

/**
 * ?h= を書き戻す。他のクエリ（utm_* など）は残す。
 * urlState.ts の replaceQuery はカンマを %2C にしてしまい、共有されるURLが
 * ?h=lian-po%2Cmulan になる。slug は英小文字・数字・ハイフンだけなのでそのまま書く
 */
function writeSlots(slugs: string[]) {
  const url = new URL(window.location.href);
  url.searchParams.delete('h');
  const rest = url.searchParams.toString();
  const qs = [slugs.length ? `h=${slugs.join(',')}` : '', rest].filter(Boolean).join('&');
  window.history.replaceState(null, '', url.pathname + (qs ? `?${qs}` : '') + url.hash);
}

type Props = {
  locale: CompareLocale;
  heroes: CompareHero[];
  meta: CompareMeta;
};

export function CompareClient({ locale, heroes, meta }: Props) {
  const ja = locale === 'ja';
  const [slots, setSlots] = useState<Slots>([null, null]);
  const [ready, setReady] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<0 | 1 | null>(null);

  const bySlug = useMemo(() => new Map(heroes.map((h) => [h.slug, h])), [heroes]);
  const resolve = useCallback(
    (token: string) => (bySlug.has(token) ? token : heroes.find((h) => h.id === token)?.slug ?? null),
    [bySlug, heroes],
  );

  // クエリはサーバー側では読めないので、マウント後に入れる
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect --
     * location はマウント後にしか読めない。初期 state に入れるとサーバーの HTML と食い違う */
    setSlots(parseSlots(readQuery()?.get('h') ?? '', resolve));
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [resolve]);

  useEffect(() => {
    if (ready) writeSlots(slots.filter((s): s is string => Boolean(s)));
  }, [slots, ready]);

  const picked: [CompareHero | null, CompareHero | null] = [
    slots[0] ? bySlug.get(slots[0]) ?? null : null,
    slots[1] ? bySlug.get(slots[1]) ?? null : null,
  ];
  const chosen = picked.filter((h): h is CompareHero => Boolean(h));

  const pick = (slug: string) => {
    if (pickerSlot === null) return;
    const next: Slots = [...slots];
    next[pickerSlot] = slug;
    setSlots(next);
    // もう一方が空なら、続けてそちらを選ばせる。埋まっていれば閉じて表を見せる
    const other = pickerSlot === 0 ? 1 : 0;
    setPickerSlot(next[other] ? null : other);
  };
  const clearSlot = () => {
    if (pickerSlot === null) return;
    const next: Slots = [...slots];
    next[pickerSlot] = null;
    setSlots(next);
    setPickerSlot(null);
  };

  const missingData = ja ? 'データなし' : 'No data';
  const pct = (v: number) => `${v}%`;
  const shared = new Set(meta.sharedStats.map((s) => s.key));

  const groups: GroupDef[] = [
    {
      key: 'profile',
      title: ja ? 'プロフィール' : 'Profile',
      missing: missingData,
      rows: [
        {
          key: 'role',
          label: ja ? 'ロール' : 'Role',
          value: (h) => (h.roles.length ? h.roles.map((r) => ROLE_LABEL[r][locale]).join(' / ') : null),
        },
        { key: 'type', label: ja ? '戦い方タイプ' : 'Type', value: (h) => h.type },
        { key: 'difficulty', label: ja ? '難易度' : 'Difficulty', value: (h) => h.difficulty },
      ],
    },
    {
      key: 'base',
      title: ja ? '基本ステータス' : 'Base Stats',
      source: ja ? 'ゲーム内のステータス画面より（アルカナ分を除く）' : 'From the in-game stat screen, Arcana excluded',
      missing: missingData,
      rows: [
        {
          key: 'range',
          label: ja ? '攻撃範囲' : 'Attack Range',
          value: (h) => (h.base?.range ? RANGE_LABEL[h.base.range][locale] : null),
        },
        {
          key: 'hp',
          label: ja ? '最大HP' : 'Max HP',
          value: (h) => h.base?.hp ?? null,
          num: (h) => h.base?.hp ?? null,
        },
        {
          key: 'physAttack',
          label: ja ? '物理攻撃' : 'Physical Attack',
          value: (h) => h.base?.physAttack ?? null,
          num: (h) => h.base?.physAttack ?? null,
        },
        {
          key: 'moveSpeed',
          label: ja ? '移動速度' : 'Movement Speed',
          value: (h) => h.base?.moveSpeed ?? null,
          num: (h) => h.base?.moveSpeed ?? null,
        },
        {
          key: 'hpRegen',
          label: ja ? 'HP回復/秒' : 'HP Regen / s',
          value: (h) => h.base?.hpRegen ?? null,
          num: (h) => h.base?.hpRegen ?? null,
        },
        // 全員同じ値のあいだは行にしない（下の注記で値を出す）。違う値が入ったら行に戻る
        ...(['magicAttack', 'physDefense', 'magicDefense'] as const)
          .filter((key) => !shared.has(key))
          .map(
            (key): RowDef => ({
              key,
              label: SHARED_LABEL[key][locale],
              value: (h) => h.base?.[key] ?? null,
              num: (h) => {
                const n = Number(h.base?.[key]?.split('|')[0]);
                return Number.isFinite(n) ? n : null;
              },
            }),
          ),
        {
          // リソースは種類が違うと量を比べられない（MP 470 と 闘志 200）ので、向きを付けない
          key: 'resource',
          label: ja ? 'リソース' : 'Resource',
          value: (h) => h.base?.resource ?? null,
        },
      ],
    },
    {
      key: 'camp',
      title: ja ? '統計' : 'Stats',
      source: (
        <>
          {ja ? '公式HoK Camp（' : 'Official HoK Camp, as of '}
          <time dateTime={meta.statsUpdatedAt}>{meta.statsUpdatedAt}</time>
          {ja ? '取得）' : ''}
        </>
      ),
      missing: ja ? '統計なし' : 'No stats',
      rows: [
        {
          key: 'lane',
          label: ja ? 'レーン' : 'Lane',
          value: (h) => (h.camp?.lane ? LANE_LABEL[h.camp.lane][locale] : null),
        },
        {
          key: 'tier',
          label: 'Tier',
          value: (h) =>
            h.camp ? (
              <span
                className={`inline-flex h-6 min-w-7 items-center justify-center rounded-md border px-1.5 text-xs font-black ${getTierBadgeStyle(h.camp.tier)}`}
              >
                {h.camp.tier}
              </span>
            ) : null,
        },
        {
          key: 'win',
          label: ja ? '勝率' : 'Win Rate',
          value: (h) => (h.camp ? pct(h.camp.win) : null),
          num: (h) => h.camp?.win ?? null,
        },
        // 出現率・BAN率は人気と警戒の度合いで、高いほうが強いとは限らない。向きを付けない
        { key: 'pick', label: ja ? '出現率' : 'Pick Rate', value: (h) => (h.camp ? pct(h.camp.pick) : null) },
        { key: 'ban', label: ja ? 'BAN率' : 'Ban Rate', value: (h) => (h.camp ? pct(h.camp.ban) : null) },
      ],
    },
  ];

  const markOf = (row: RowDef): [Mark, Mark] => {
    const [a, b] = picked;
    if (!row.num || !a || !b) return [null, null];
    const x = row.num(a);
    const y = row.num(b);
    if (x === null || y === null || x === y) return [null, null];
    return x > y ? ['high', 'low'] : ['low', 'high'];
  };

  const renderCell = (row: RowDef, group: GroupDef, hero: CompareHero | null, mark: Mark) => {
    if (!hero) {
      return (
        <span className="text-slate-500">
          <span aria-hidden="true">—</span>
          <span className="sr-only">{ja ? '未選択' : 'Not selected'}</span>
        </span>
      );
    }
    const v = row.value(hero);
    if (v === null || v === undefined) return <span className="font-bold text-slate-500">{group.missing}</span>;
    if (mark === 'high') {
      return (
        <span className="font-black text-slate-900">
          {v}
          <span className="sr-only">{ja ? '（高い）' : ' (higher)'}</span>
        </span>
      );
    }
    if (mark === 'low') return <span className="font-medium text-slate-600">{v}</span>;
    return <span className="font-bold text-slate-800">{v}</span>;
  };

  // 表の下の注記。選んだヒーローに当てはまるものだけ出す
  const preAdjust = chosen.filter((h) => h.preAdjust).map((h) => h.name);
  const unranked = chosen.filter((h) => h.unranked).map((h) => h.name);
  const noScreen = chosen.filter((h) => h.noStatScreen).map((h) => h.name);

  const shareTitle =
    chosen.length === 2
      ? ja
        ? `【オナーオブキングス】${chosen[0].name}と${chosen[1].name}を比較`
        : `${chosen[0].name} vs ${chosen[1].name} - Honor of Kings Hero Comparison`
      : ja
        ? '【オナーオブキングス】ヒーロー比較'
        : 'Honor of Kings Hero Comparison';

  return (
    <div className="pb-10">
      <div className="px-1 pt-2 pb-4">
        <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          {ja ? 'ヒーロー比較' : 'Compare Heroes'}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
          {ja
            ? '2体を選ぶと、基本ステータスと勝率などの統計を1つの表に並べます。選んだ組み合わせはURLに残るので、そのまま共有できる。'
            : 'Pick two heroes to line up their base stats and win, pick and ban rates in one table. The pair stays in the URL, so you can share it as is.'}
        </p>
        <ShareButton title={shareTitle} className="mt-3" />
      </div>

      {/* 枠に overflow を付けないこと。見出し行の sticky が効かなくなる */}
      <section
        aria-label={ja ? '比較表' : 'Comparison table'}
        className="rounded-2xl border border-slate-200 bg-white"
      >
        <table className="w-full border-collapse text-left max-md:block md:table-fixed">
          <caption className="sr-only">
            {chosen.length === 2
              ? ja
                ? `${chosen[0].name}と${chosen[1].name}の比較`
                : `${chosen[0].name} compared with ${chosen[1].name}`
              : ja
                ? 'ヒーロー2体の比較'
                : 'Two heroes compared'}
          </caption>
          {/* 見出し行は画面の上に貼り付ける。スマホは AppBar（56px）の下、PCは画面の上端。
              スマホは thead ごと、PCは th ごとに貼る（表の中の thead の sticky は PC の表組みでは効きにくい） */}
          <thead className="max-md:sticky max-md:top-14 max-md:z-20 max-md:block max-md:rounded-t-2xl max-md:border-b max-md:border-slate-200 max-md:bg-white">
            <tr className="max-md:grid max-md:grid-cols-2 max-md:gap-2 max-md:p-2">
              <th
                scope="col"
                className="w-36 max-md:hidden md:sticky md:top-0 md:z-20 md:rounded-tl-2xl md:bg-white md:shadow-[inset_0_-1px_0_var(--color-slate-200)] lg:w-44"
              >
                <span className="sr-only">{ja ? '項目' : 'Item'}</span>
              </th>
              {([0, 1] as const).map((i) => {
                const hero = picked[i];
                return (
                  <th
                    key={i}
                    scope="col"
                    className={`font-normal md:sticky md:top-0 md:z-20 md:bg-white md:px-2 md:py-2 md:shadow-[inset_0_-1px_0_var(--color-slate-200)] ${
                      i === 1 ? 'md:rounded-tr-2xl' : ''
                    }`}
                  >
                    {hero ? (
                      <button
                        type="button"
                        onClick={() => setPickerSlot(i)}
                        aria-haspopup="dialog"
                        className="flex min-h-14 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-2 text-left transition-colors hover:border-slate-400"
                      >
                        <Image
                          src={hero.image}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="sr-only">{ja ? `${i + 1}体目：` : `Hero ${i + 1}: `}</span>
                          {/* 「元流の子（サポート）」は390pxで1行に入らない。省略せず2行まで折り返す */}
                          <span className="line-clamp-2 text-sm leading-tight font-black break-words text-slate-900">
                            {hero.name}
                          </span>
                          <span className="mt-0.5 flex items-center gap-0.5 text-xs font-bold text-slate-600">
                            {ja ? '変更' : 'Change'}
                            <ChevronDown size={12} aria-hidden="true" className="shrink-0" />
                          </span>
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPickerSlot(i)}
                        aria-haspopup="dialog"
                        className="flex min-h-14 w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-2 text-sm font-black text-slate-700 transition-colors hover:border-slate-500"
                      >
                        <Plus size={16} aria-hidden="true" className="shrink-0" />
                        {ja ? `${i + 1}体目を選ぶ` : `Pick hero ${i + 1}`}
                      </button>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          {groups.map((group) => (
            <tbody key={group.key} className="max-md:block">
              <tr className="max-md:block">
                <th
                  scope="rowgroup"
                  colSpan={3}
                  className="bg-slate-50 px-3 py-2 text-left max-md:block md:px-4"
                >
                  <span className="text-sm font-black text-slate-800">{group.title}</span>
                  {group.source && (
                    <span className="mt-0.5 block text-xs font-bold text-slate-600 md:mt-0 md:ml-2 md:inline">
                      {group.source}
                    </span>
                  )}
                </th>
              </tr>
              {group.rows.map((row) => {
                const marks = markOf(row);
                return (
                  <tr
                    key={row.key}
                    className="border-t border-slate-100 max-md:grid max-md:grid-cols-2 max-md:gap-x-3 max-md:gap-y-1 max-md:px-3 max-md:py-2.5"
                  >
                    <th
                      scope="row"
                      className="text-left align-top text-xs font-bold text-slate-500 max-md:col-span-2 md:py-3 md:pr-2 md:pl-4 md:text-sm"
                    >
                      {row.label}
                    </th>
                    {([0, 1] as const).map((i) => (
                      <td key={i} className="min-w-0 align-top text-sm break-words tabular-nums md:px-3 md:py-3">
                        {renderCell(row, group, picked[i], marks[i])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          ))}

          {/* 各ヒーローの詳細ページへ。比べたあとに1体を掘り下げる入口 */}
          <tbody className="max-md:block">
            <tr className="border-t border-slate-200 max-md:grid max-md:grid-cols-2 max-md:gap-x-3 max-md:px-3 max-md:py-1">
              <th scope="row" className="text-left text-xs font-bold text-slate-500 max-md:sr-only md:py-2 md:pr-2 md:pl-4 md:text-sm">
                {ja ? '詳細ページ' : 'Hero Page'}
              </th>
              {([0, 1] as const).map((i) => {
                const hero = picked[i];
                return (
                  <td key={i} className="min-w-0 md:px-3 md:py-1">
                    {hero ? (
                      <Link
                        href={`/heroes/${hero.slug}`}
                        prefetch={false}
                        className="inline-flex h-11 items-center gap-1 text-sm font-bold text-brand-700 hover:underline"
                      >
                        {ja ? (
                          <>
                            <span className="sr-only">{hero.name}の</span>詳細を見る
                          </>
                        ) : (
                          <>
                            Details<span className="sr-only"> for {hero.name}</span>
                          </>
                        )}
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    ) : (
                      <span className="inline-flex h-11 items-center text-sm text-slate-500">
                        <span aria-hidden="true">—</span>
                        <span className="sr-only">{ja ? '未選択' : 'Not selected'}</span>
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </section>

      <div className="mt-3 space-y-2 px-1 text-xs leading-relaxed font-bold text-slate-600">
        {preAdjust.length > 0 && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
            {ja
              ? `${joinNames(preAdjust, ja)}は${meta.adjustPatch}で調整されたため、統計は調整前のものです。`
              : `${joinNames(preAdjust, ja)} ${preAdjust.length > 1 ? 'are' : 'is'} adjusted in ${meta.adjustPatch}; the stats here predate that change.`}
          </p>
        )}
        {unranked.length > 0 && (
          <p>
            {ja
              ? `${joinNames(unranked, ja)}は公式HoK Campのランキングにまだ載っておらず、統計がありません。`
              : `${joinNames(unranked, ja)} ${unranked.length > 1 ? 'are' : 'is'} not on the official HoK Camp rankings yet, so there are no stats.`}
          </p>
        )}
        {noScreen.length > 0 && (
          <p>
            {ja
              ? `${joinNames(noScreen, ja)}はゲーム内にステータス画面が無く、基本ステータスを載せられない。`
              : `${joinNames(noScreen, ja)} ${noScreen.length > 1 ? 'have' : 'has'} no stat screen in the game, so there are no base stats.`}
          </p>
        )}
        {meta.sharedStats.length > 0 && (
          <p>
            {ja
              ? `${meta.sharedStats.map((s) => `${SHARED_LABEL[s.key].ja}（${s.value}）`).join('・')}は、ステータス画面のあるヒーロー全員が同じ値なので表から外した。`
              : `${listEn(meta.sharedStats.map((s) => `${SHARED_LABEL[s.key].en} (${s.value})`))} ${meta.sharedStats.length > 1 ? 'are' : 'is'} the same for every hero with a stat screen, so ${meta.sharedStats.length > 1 ? 'they are' : 'it is'} left out of the table.`}
          </p>
        )}
      </div>

      {pickerSlot !== null && (
        <HeroPickerDialog
          // 枠が替わったら開き直す。検索語と絞り込みを前の枠から持ち越さない
          key={pickerSlot}
          locale={locale}
          heroes={heroes}
          slot={pickerSlot}
          current={slots[pickerSlot]}
          taken={slots[pickerSlot === 0 ? 1 : 0]}
          onPick={pick}
          onClear={clearSlot}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </div>
  );
}

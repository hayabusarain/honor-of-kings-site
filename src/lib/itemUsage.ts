import heroItemBuilds from '@/data/hero_item_builds.json';
import hokHeroes from '@/data/hok_heroes.json';
import campStats from '@/data/hero_stats_camp.json';
import itemsData from '@/data/hok_items.json';

/**
 * おすすめビルドに、どの装備が何回入っているかの集計。
 *
 * hero_item_builds.json は116体ぶん・227通りのビルドで、1ビルド6枠なので
 * のべ1362回ぶんの採用がある。これをロール別・レーン別に数え直す。
 *
 * サーバー側に置くのは、装備マスタ（100KB）とビルド一覧（50KB）を
 * クライアントバンドルへ入れないため。表示に要るのは名前・アイコン・
 * 価格・効果だけで、使われている62種ぶんで足りる。
 */

/** ここで要るのは装備の並びだけ。スペルとアルカナは heroItemBuilds.ts が扱う */
type RawBuild = { items: number[] };
type RawItem = {
  id: number; name: string; name_en?: string; price: number; totalPrice?: number;
  stats?: string; stats_en?: string; icon?: string;
};
type RawHero = { id: string; role?: string[] };

/** 表示に要る分だけの装備情報。IDを鍵にして本文と切り離す */
export type UsageItem = { name: string; icon?: string; price: number; stats: string };

/** 1つの切り口（全体／ロール／レーン）での並び。rows は [装備ID, 採用セット数] */
export type UsageGroup = {
  key: string;
  axis: 'all' | 'role' | 'lane';
  /** その切り口に属するセットの総数。採用率の分母 */
  sets: number;
  rows: [number, number][];
};

export type ItemUsage = {
  totalSets: number;
  heroCount: number;
  items: Record<number, UsageItem>;
  groups: UsageGroup[];
  /** どのセットにも入っていない完成装備。素材はここに含めない */
  unusedFinished: number[];
  /** どのセットにも入っていない素材の数。6枠に入る装備ではないので数だけ出す */
  unusedComponents: number;
};

/**
 * 素材と完成装備の境目。データに等級の欄が無いので価格で分ける。
 *
 * 使われていない52種の価格は 850G 以下が44種、2080G 以上が8種で、
 * その間には1つも無い。実際に組まれている62種も、2000G未満は靴6種だけで、
 * 残る56種は 2000G 以上だった。素材が1つも混じっていないことは、
 * アイコン照合が正しく効いていることの裏付けにもなっている
 * （2026-08-28 の撮り直し後も同じ形のまま）。
 */
const COMPONENT_MAX_PRICE = 1000;

const ROLE_KEYS = ['Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'];
const LANE_KEYS = ['CLASH', 'JUNGLE', 'MID', 'FARM', 'ROAM'];

const stripHtml = (html: string | null | undefined) =>
  (html || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');

export function getItemUsage(locale: string): ItemUsage {
  const isJa = locale !== 'en';
  const builds = heroItemBuilds as Record<string, RawBuild[]>;
  const heroes = new Map((hokHeroes as RawHero[]).map(h => [h.id, h]));
  const lanes = campStats as Record<string, { lane?: string }>;

  // key ごとに「セット数」と「装備ID→そのセット数」を貯める
  const buckets = new Map<string, { axis: UsageGroup['axis']; sets: number; count: Map<number, number> }>();
  const bucket = (key: string, axis: UsageGroup['axis']) => {
    let b = buckets.get(key);
    if (!b) buckets.set(key, (b = { axis, sets: 0, count: new Map() }));
    return b;
  };

  let totalSets = 0;
  let heroCount = 0;
  for (const [heroId, sets] of Object.entries(builds)) {
    if (sets.length === 0) continue;
    heroCount++;
    // 2ロール持ちを両方で数えると母数が総数を超えるので、主ロール（先頭）だけを使う
    const role = heroes.get(heroId)?.role?.[0];
    const lane = lanes[heroId]?.lane;
    for (const set of sets) {
      totalSets++;
      const targets = [bucket('all', 'all')];
      if (role && ROLE_KEYS.includes(role)) targets.push(bucket(role, 'role'));
      if (lane && LANE_KEYS.includes(lane)) targets.push(bucket(lane, 'lane'));
      for (const b of targets) {
        b.sets++;
        // 同じセットに同じ装備が2つ入ることはないが、数え漏れを防ぐため一意化する
        for (const id of new Set(set.items)) b.count.set(id, (b.count.get(id) ?? 0) + 1);
      }
    }
  }

  const usedIds = new Set(buckets.get('all')?.count.keys() ?? []);
  const items: Record<number, UsageItem> = {};
  const unusedFinished: number[] = [];
  let unusedComponents = 0;
  for (const it of itemsData as RawItem[]) {
    const price = it.totalPrice ?? it.price;
    if (!usedIds.has(it.id) && price <= COMPONENT_MAX_PRICE) {
      unusedComponents++;
      continue;
    }
    if (!usedIds.has(it.id)) unusedFinished.push(it.id);
    items[it.id] = {
      name: !isJa && it.name_en ? it.name_en : it.name,
      icon: it.icon,
      price,
      stats: stripHtml(!isJa && it.stats_en ? it.stats_en : it.stats),
    };
  }

  const order = ['all', ...ROLE_KEYS, ...LANE_KEYS];
  const groups: UsageGroup[] = order.flatMap(key => {
    const b = buckets.get(key);
    if (!b || b.sets === 0) return [];
    const rows = [...b.count.entries()]
      // 同数のときは名前順にして、ビルドのたびに並びが変わらないようにする
      .sort((x, y) => y[1] - x[1] || items[x[0]].name.localeCompare(items[y[0]].name, locale));
    return [{ key, axis: b.axis, sets: b.sets, rows }];
  });

  unusedFinished.sort((a, b) => items[a].price - items[b].price
    || items[a].name.localeCompare(items[b].name, locale));

  return { totalSets, heroCount, items, groups, unusedFinished, unusedComponents };
}

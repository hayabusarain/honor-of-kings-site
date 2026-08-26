import itemsData from '@/data/hok_items.json';
import heroItemBuilds from '@/data/hero_item_builds.json';
import hokHeroes from '@/data/hok_heroes.json';
import baseStatsRaw from '@/data/hero_base_stats.json';

/**
 * 装備6枠のステータス合計を出すための下ごしらえ。
 *
 * hok_items.json の stats は「+80 物理攻撃, +10% クールダウン短縮, +500 最大HP」
 * という文字列。114種すべてがこの形で、12種類の効果に分解できることを確認済み。
 *
 * サーバー側に置くのは、装備マスタ（100KB）をクライアントバンドルに入れないため。
 * 効果名の対応表はアルカナ側（arcanaStats.ts）と一部重なるが、装備にしか無い
 * 「最大MP」があり、逆に貫通やHP回復は装備では stats ではなくパッシブに書かれる。
 * 共通化すると両方の都合を持ち込むことになるので、ここは独立させている。
 */

export type ItemStatKey =
  | 'physicalAttack'
  | 'magicalAttack'
  | 'attackSpeed'
  | 'critRate'
  | 'physicalLifesteal'
  | 'magicalLifesteal'
  | 'maxHealth'
  | 'physicalDefense'
  | 'magicalDefense'
  | 'maxMana'
  | 'cooldownReduction'
  | 'moveSpeed';

export type ItemStatGroup = 'offense' | 'defense' | 'utility';

/**
 * ステータス欄に現れない絞り込み用の目印。
 * 貫通は stats ではなくパッシブ側にしか書かれず、靴は名前でしか判別できない。
 * それ以外の絞り込みは effects のキーでそのまま判定できるので、ここには持たせない。
 */
export type ItemTag = 'pierce' | 'boots';

type StatDef = {
  key: ItemStatKey;
  /** hok_items.json の stats に出てくる表記そのまま */
  ja: string;
  en: string;
  unit: 'flat' | 'percent';
  group: ItemStatGroup;
  /** hero_base_stats.json の stats のキー。実数で足せる項目にだけ持たせる */
  baseStatKey?: string;
};

export const ITEM_STATS: StatDef[] = [
  { key: 'physicalAttack', ja: '物理攻撃', en: 'Physical Attack', unit: 'flat', group: 'offense', baseStatKey: '物理攻撃' },
  { key: 'magicalAttack', ja: '魔法攻撃', en: 'Magical Attack', unit: 'flat', group: 'offense', baseStatKey: '魔法攻撃' },
  { key: 'attackSpeed', ja: '攻撃速度', en: 'Attack Speed', unit: 'percent', group: 'offense' },
  { key: 'critRate', ja: 'クリティカル率', en: 'Critical Rate', unit: 'percent', group: 'offense' },
  { key: 'physicalLifesteal', ja: '物理ライフスティール', en: 'Physical Lifesteal', unit: 'percent', group: 'offense' },
  { key: 'magicalLifesteal', ja: '魔法ライフスティール', en: 'Magical Lifesteal', unit: 'percent', group: 'offense' },
  { key: 'maxHealth', ja: '最大HP', en: 'Max Health', unit: 'flat', group: 'defense', baseStatKey: '最大HP' },
  { key: 'physicalDefense', ja: '物理防御', en: 'Physical Defense', unit: 'flat', group: 'defense', baseStatKey: '物理防御' },
  { key: 'magicalDefense', ja: '魔法防御', en: 'Magical Defense', unit: 'flat', group: 'defense', baseStatKey: '魔法防御' },
  { key: 'maxMana', ja: '最大MP', en: 'Max Mana', unit: 'flat', group: 'utility' },
  { key: 'cooldownReduction', ja: 'クールダウン短縮', en: 'Cooldown Reduction', unit: 'percent', group: 'utility' },
  { key: 'moveSpeed', ja: '移動速度', en: 'Movement Speed', unit: 'percent', group: 'utility' },
];

const BY_JA_LABEL = new Map(ITEM_STATS.map(s => [s.ja, s]));

export type SimItem = {
  id: number;
  name: string;
  icon?: string;
  price: number;
  /** 画面にそのまま出す効果文 */
  statsText: string;
  /** パッシブと発動効果。合計には入らないので、選んだときだけ読ませる */
  passive: string;
  active: string;
  effects: { key: ItemStatKey; value: number }[];
  tags: ItemTag[];
};

export type SimHero = {
  id: string;
  slug: string;
  name: string;
  base: Partial<Record<ItemStatKey, number>>;
};

/** 人気セットの読み込み用。装備6つのIDだけ持つ */
export type SimPreset = { heroId: string; heroName: string; items: number[] };

export type SimulatorData = {
  items: SimItem[];
  heroes: SimHero[];
  presets: SimPreset[];
};

/** 装備は6枠。ゲーム内の持ち物欄と同じ */
export const ITEM_SLOTS = 6;

/** 小数第1位まで。0.1 の足し合わせで誤差が出るので毎回丸める */
export const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * 防御値からダメージ軽減率を出す。防御 ÷（防御 + 600）。
 * 実測した113体・226個の防御表示すべてと一致することを確認済み。
 */
export const damageReduction = (defense: number) => (defense / (defense + 600)) * 100;

const stripHtml = (html: string | null | undefined) =>
  (html || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');

type RawItem = {
  id: number; name: string; name_en?: string; price: number; totalPrice?: number;
  stats?: string; stats_en?: string; passive?: string | null; passive_en?: string | null;
  active?: string | null; active_en?: string | null; icon?: string;
};
type RawHero = { id: string; name: string; name_en?: string; slug?: string };
type RawBuild = { items: number[] };

/**
 * 「+80 物理攻撃, +10% クールダウン短縮」を数値に開く。
 * 見るのは日本語表記だけ。英語表記は同じ並びの訳なので、両方を解釈すると
 * 片方の表記ゆれで合計が二重にずれる。
 * 知らない効果名が来たら例外にして、データ側の変更に気付けるようにする。
 */
function parseEffects(raw: string, itemName: string) {
  return raw.split(/[,、]/).flatMap(part => {
    const t = part.trim();
    if (!t) return [];
    const m = t.match(/^\+?([0-9.]+)(%?)\s*(.+)$/);
    if (!m) throw new Error(`装備「${itemName}」の効果を読めない: ${t}`);
    const def = BY_JA_LABEL.get(m[3]);
    if (!def) throw new Error(`装備「${itemName}」に未知の効果名: ${m[3]}`);
    return [{ key: def.key, value: Number(m[1]) }];
  });
}

/**
 * 貫通と靴の目印を付ける。parseEffects と同じく、見るのは日本語表記だけ。
 * 英語表記も見ると、片方の訳ゆれで目印が付いたり付かなかったりする。
 */
function tagsOf(it: RawItem): ItemTag[] {
  const tags: ItemTag[] = [];
  if (`${it.passive ?? ''}${it.active ?? ''}`.includes('貫通')) tags.push('pierce');
  if (it.name.includes('靴')) tags.push('boots');
  return tags;
}

/** 「150|20%」は実数値と軽減率の併記。足し算に使うのは実数値のほう */
const flatOf = (raw: string | undefined) => {
  if (!raw) return undefined;
  const v = Number(raw.split('|')[0]);
  return Number.isFinite(v) ? v : undefined;
};

export function getSimulatorData(locale: string): SimulatorData {
  const isJa = locale !== 'en';

  const items: SimItem[] = (itemsData as RawItem[]).map(it => ({
    id: it.id,
    name: !isJa && it.name_en ? it.name_en : it.name,
    icon: it.icon,
    price: Number(it.totalPrice ?? it.price),
    statsText: stripHtml(!isJa && it.stats_en ? it.stats_en : it.stats),
    passive: stripHtml(!isJa && it.passive_en ? it.passive_en : it.passive),
    active: stripHtml(!isJa && it.active_en ? it.active_en : it.active),
    effects: parseEffects(it.stats ?? '', it.name),
    tags: tagsOf(it),
  })).sort((a, b) => a.price - b.price || a.name.localeCompare(b.name, locale));

  const baseStats = baseStatsRaw as unknown as Record<string, { stats: Record<string, string> }>;
  const heroes: SimHero[] = (hokHeroes as RawHero[])
    .filter(h => baseStats[h.id])
    .map(h => {
      const s = baseStats[h.id].stats;
      const base: Partial<Record<ItemStatKey, number>> = {};
      for (const def of ITEM_STATS) {
        if (!def.baseStatKey) continue;
        const v = flatOf(s[def.baseStatKey]);
        if (v !== undefined) base[def.key] = v;
      }
      return { id: h.id, slug: h.slug || h.id, name: isJa ? h.name : h.name_en || h.name, base };
    })
    .sort((a, b) => a.name.localeCompare(b.name, locale));

  // 人気1位のセットだけを読み込み候補にする。2つ出すと選ぶ手間が増えるわりに違いが小さい
  const builds = heroItemBuilds as Record<string, RawBuild[]>;
  const heroName = new Map(heroes.map(h => [h.id, h.name]));
  const presets: SimPreset[] = Object.entries(builds)
    .flatMap(([heroId, sets]) => {
      const name = heroName.get(heroId);
      if (!name || sets.length === 0) return [];
      return [{ heroId, heroName: name, items: sets[0].items }];
    })
    .sort((a, b) => a.heroName.localeCompare(b.heroName, locale));

  return { items, heroes, presets };
}

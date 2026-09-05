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

// 型・定数・純関数は itemSimulatorShared.ts に移した。
// クライアント部品が ITEM_SLOTS などをこのファイルから取ると、上の4つの JSON
// （合わせて 200KB 超）がモジュールごとクライアントバンドルへ運ばれてしまう。
// 2026-09-05 の実測では、この経路でヒーロー詳細232ページ・トップ・初心者向け・
// アルカナ・パッチ・スペルが hok_items 105KB を積んでいた。
// 値を使うクライアント部品は itemSimulatorShared から import すること。
import {
  ITEM_STATS,
  type ItemStatKey,
  type ItemTag,
  type SimHero,
  type SimItem,
  type SimPreset,
  type SimulatorData,
} from './itemSimulatorShared';

// サーバー側の呼び出し元（items/simulator/page.tsx）が import 元を変えずに済むよう、
// 共有分はここからも出しておく
export * from './itemSimulatorShared';

// ITEM_STATS から導けるので shared には置かず、使う側のここで作る
const BY_JA_LABEL = new Map(ITEM_STATS.map(s => [s.ja, s]));

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

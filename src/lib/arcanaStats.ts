import arcanasData from '@/data/hok_arcanas.json';

/**
 * アルカナの効果文を数値に開くための定義と変換。
 *
 * hok_arcanas.json は効果を「物理攻撃 +2, 物理防御貫通 +3.6」という文字列で持っている。
 * 一覧ページはそのまま出すだけで足りるが、合計を出すには数値にする必要がある。
 * ここで一度だけ開き、計算機のサーバー側で使う。
 */

export type ArcanaColor = 'red' | 'blue' | 'green';

/** 1色あたりの装着枠。赤・青・緑それぞれ10枠、計30枠（2026-08-20 にゲーム内のアルカナ画面で確認） */
export const SLOTS_PER_COLOR = 10;

export const ARCANA_COLORS: ArcanaColor[] = ['red', 'blue', 'green'];

export type StatKey =
  | 'physicalAttack'
  | 'magicalAttack'
  | 'attackSpeed'
  | 'critRate'
  | 'critDamage'
  | 'physicalPierce'
  | 'magicalPierce'
  | 'physicalLifesteal'
  | 'magicalLifesteal'
  | 'maxHealth'
  | 'physicalDefense'
  | 'magicalDefense'
  | 'healthRegen'
  | 'cooldownReduction'
  | 'moveSpeed';

/** 合計欄の並び。攻める値・耐える値・それ以外の3つに分ける */
export type StatGroup = 'offense' | 'defense' | 'utility';

export type StatDef = {
  key: StatKey;
  /** hok_arcanas.json の stats に出てくる表記そのまま。突き合わせのキーになる */
  ja: string;
  en: string;
  unit: 'flat' | 'percent';
  group: StatGroup;
  /**
   * hero_base_stats.json の stats のキー。
   * 基礎値に足して「アルカナ込みの値」を出せる項目にだけ持たせる。
   * 割合で効く項目（攻撃速度・移動速度・クリティカル等）は、ゲーム内の
   * 基準値が装備やレベルで動くため、ここでは合計だけを出す
   */
  baseStatKey?: string;
  /** 基礎値とアルカナで単位が違うときの換算。HP回復だけが該当する（基礎値=5秒 / アルカナ=1秒） */
  baseStatDivisor?: number;
};

export const ARCANA_STATS: StatDef[] = [
  { key: 'physicalAttack', ja: '物理攻撃', en: 'Physical Attack', unit: 'flat', group: 'offense', baseStatKey: '物理攻撃' },
  { key: 'magicalAttack', ja: '魔法攻撃', en: 'Magical Attack', unit: 'flat', group: 'offense', baseStatKey: '魔法攻撃' },
  { key: 'attackSpeed', ja: '攻撃速度', en: 'Attack Speed', unit: 'percent', group: 'offense' },
  { key: 'critRate', ja: 'クリティカル率', en: 'Critical Rate', unit: 'percent', group: 'offense' },
  { key: 'critDamage', ja: 'クリティカル効果', en: 'Critical Damage', unit: 'percent', group: 'offense' },
  { key: 'physicalPierce', ja: '物理防御貫通', en: 'Physical Pierce', unit: 'flat', group: 'offense' },
  { key: 'magicalPierce', ja: '魔法防御貫通', en: 'Magical Pierce', unit: 'flat', group: 'offense' },
  { key: 'physicalLifesteal', ja: '物理ライフスティール', en: 'Physical Lifesteal', unit: 'percent', group: 'offense' },
  { key: 'magicalLifesteal', ja: '魔法ライフスティール', en: 'Magical Lifesteal', unit: 'percent', group: 'offense' },
  { key: 'maxHealth', ja: '最大HP', en: 'Max Health', unit: 'flat', group: 'defense', baseStatKey: '最大HP' },
  { key: 'physicalDefense', ja: '物理防御', en: 'Physical Defense', unit: 'flat', group: 'defense', baseStatKey: '物理防御' },
  { key: 'magicalDefense', ja: '魔法防御', en: 'Magical Defense', unit: 'flat', group: 'defense', baseStatKey: '魔法防御' },
  // アルカナの表記は毎秒だが、ヒーローの基礎値はゲーム内で5秒あたりで出る。
  // 足せるように、基礎値の側を baseStatDivisor で毎秒へ直す
  { key: 'healthRegen', ja: '1秒ごとのHP回復量', en: 'Recovery/s', unit: 'flat', group: 'defense', baseStatKey: '5秒ごとのHP回復', baseStatDivisor: 5 },
  { key: 'cooldownReduction', ja: 'クールダウン短縮', en: 'Cooldown Reduction', unit: 'percent', group: 'utility' },
  { key: 'moveSpeed', ja: '移動速度', en: 'Movement Speed', unit: 'percent', group: 'utility' },
];

const BY_JA_LABEL = new Map(ARCANA_STATS.map(s => [s.ja, s]));

export type ArcanaEffect = { key: StatKey; value: number };

export type ParsedArcana = {
  id: string;
  color: ArcanaColor;
  name: string;
  nameEn: string;
  stats: string;
  statsEn: string;
  icon?: string;
  effects: ArcanaEffect[];
};

type RawArcana = {
  id: string;
  type: string;
  name: string;
  name_en?: string;
  stats: string;
  stats_en?: string;
  icon?: string;
};

/** 効果値は小数第1位まで。0.7 + 0.7 が 1.4000000000000001 になるので毎回丸める */
export const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * 防御値からダメージ軽減率を出す。
 * ゲーム内のステータス画面は「150|20%」と併記していて、150 /(150 + 600) = 20%。
 * 実測した113体すべてでこの式と一致する。
 */
export const damageReduction = (defense: number) => (defense / (defense + 600)) * 100;

/**
 * 「物理攻撃 +2, 物理防御貫通 +3.6」を [{physicalAttack, 2}, {physicalPierce, 3.6}] にする。
 *
 * 見るのは日本語表記だけ。英語表記は同じ並びの訳なので、両方を解釈すると
 * 片方の表記ゆれで合計が二重にずれる。
 * 知らない効果名が来たら例外にして、データ側の変更に気付けるようにする。
 */
export function parseArcanas(): ParsedArcana[] {
  return (arcanasData as RawArcana[]).map(raw => {
    const effects = raw.stats.split(/[,、]/).map(part => {
      const m = part.trim().match(/^(.+?)\s*\+([0-9.]+)(%?)$/);
      if (!m) throw new Error(`アルカナ「${raw.name}」の効果を読めない: ${part}`);
      const def = BY_JA_LABEL.get(m[1]);
      if (!def) throw new Error(`アルカナ「${raw.name}」に未知の効果名: ${m[1]}`);
      return { key: def.key, value: Number(m[2]) };
    });
    return {
      id: raw.id,
      color: raw.type as ArcanaColor,
      name: raw.name,
      nameEn: raw.name_en || raw.name,
      stats: raw.stats,
      statsEn: raw.stats_en || raw.stats,
      icon: raw.icon,
      effects,
    };
  });
}

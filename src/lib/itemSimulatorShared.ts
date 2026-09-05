/**
 * 装備シミュレータのうち、**データファイルを読まない部分**だけを置く。
 *
 * 分けた理由。ItemSimulatorClient（'use client'）は ITEM_SLOTS・ITEM_STATS・
 * round1・damageReduction という値を使う。これを itemSimulator.ts から取ると、
 * バンドラはモジュール単位で解決するので、同じファイルの先頭にある
 * hok_items.json（105KB）・hero_item_builds.json・hok_heroes.json（36KB）・
 * hero_base_stats.json（53KB）まで一緒にクライアントへ運ばれる。
 *
 * 実際そうなっていた。2026-09-05 の実測では、装備シミュレータを開いていない
 * ヒーロー詳細232ページ・トップ・初心者向け・アルカナ・パッチ・スペルが、
 * この経路で hok_items 105KB を積んでいた。
 *
 * 監査の検査22は 'use client' のファイルが JSON を直接 import する形しか見ないので、
 * この「lib 経由」の持ち込みは検出できない。値を使う側は必ずこのファイルから取ること。
 * JSON を読む処理を足すときは itemSimulator.ts の側に書く。
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

export type StatDef = {
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

/** おすすめビルドの読み込み用。装備6つのIDだけ持つ */
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

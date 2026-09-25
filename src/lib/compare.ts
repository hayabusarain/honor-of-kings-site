import hokHeroes from '@/data/hok_heroes.json';
import heroBaseStats from '@/data/hero_base_stats.json';
import campStatsRaw from '@/data/hero_stats_camp.json';
import skillsJa from '@/data/skills/ja.json';
import dataFreshness from '@/data/data_freshness.json';
import type { HokHero } from '@/types/database';
import { searchNormalize } from '@/utils/searchNormalize';
import { difficultyLabel } from '@/content/heroDifficulty';
import { COMPOUND_ROLE_LABELS, normalizeSubRole, subRoleLabel } from '@/content/subRoleNames';

/**
 * ヒーロー比較（/compare）に渡す行を、サーバー側で全ヒーローぶん組み立てる。
 *
 * 選択は ?h=slug1,slug2 のクエリで動く。searchParams を読むとページが動的になり
 * 静的生成から外れるので、選ばれた2体だけを作ることはできない。全ヒーローぶんを渡すが、
 * 項目は比較表に出すものだけに絞る。
 *
 * このファイルは src/data の JSON を読む。クライアント部品からは型だけを import すること
 * （値を1つでも import すると、JSON がまるごとクライアントのバンドルに載る）。
 *
 * 無い値は null のまま渡し、表示側で「データなし」「統計なし」と出す。既定値で埋めない。
 */

export type CompareLocale = 'ja' | 'en';

export type RoleId = 'Tank' | 'Fighter' | 'Assassin' | 'Mage' | 'Marksman' | 'Support';
export type LaneId = 'CLASH' | 'JUNGLE' | 'MID' | 'FARM' | 'ROAM';
export type RangeId = 'melee' | 'ranged';

const ROLE_IDS: readonly RoleId[] = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
const LANE_IDS: readonly LaneId[] = ['CLASH', 'JUNGLE', 'MID', 'FARM', 'ROAM'];

/** ゲーム内のステータス画面の値。ヒーロー詳細の「基本ステータス」と同じ出所 */
export type CompareBase = {
  range: RangeId | null;
  hp: number | null;
  physAttack: number | null;
  moveSpeed: number | null;
  hpRegen: number | null;
  /** 画面の表記のまま（例 "150|20%"）。全員同じ値のあいだは表に出さない */
  magicAttack: string | null;
  physDefense: string | null;
  magicDefense: string | null;
  /** 言語で解決済み。例 "MP 470"、"闘志 200" */
  resource: string | null;
};

/** 公式 HoK Camp の統計 */
export type CompareCamp = {
  lane: LaneId | null;
  tier: string;
  win: number;
  pick: number;
  ban: number;
};

export type CompareHero = {
  /** 数値ID。旧URLの ?h=105 のような指定も受けるために持つ */
  id: string;
  slug: string;
  name: string;
  image: string;
  roles: RoleId[];
  /** 戦い方タイプ（ゲーム内のヒーロー画面の分類）。言語で解決済み */
  type: string | null;
  /** ゲーム内の難易度表記。言語で解決済み */
  difficulty: string | null;
  /** 検索用。名前・英語名・よみ・slug を searchNormalize して「|」でつないだもの */
  search: string;
  base: CompareBase | null;
  /** ゲーム内にステータス画面そのものが無いヒーロー */
  noStatScreen: boolean;
  camp: CompareCamp | null;
  /** 公式ランキングにまだ載っていない新ヒーロー */
  unranked: boolean;
  /** 統計の取得後に調整が入り、統計が調整前のもの */
  preAdjust: boolean;
};

/** 表から外した、全員が同じ値の基本ステータス */
export type SharedStatKey = 'magicAttack' | 'physDefense' | 'magicDefense';

export type CompareMeta = {
  /** 統計の取得日（YYYY-MM-DD） */
  statsUpdatedAt: string;
  /** preAdjust の対象になった更新の名前。言語で解決済み */
  adjustPatch: string;
  /** 全員が同じ値の項目。値は画面表記の先頭の数値（"150|20%" なら "150"） */
  sharedStats: { key: SharedStatKey; value: string }[];
};

type BaseEntry = {
  stats: Record<string, string>;
  resource?: { name: string; max: string };
};
type CampEntry = { tier: string; lane?: string; win_rate: number; pick_rate: number; ban_rate: number };
type SkillEntry = { difficulty?: string; sub_role?: string };

const HEROES = hokHeroes as HokHero[];
const BASE = heroBaseStats as Record<string, BaseEntry>;
const CAMP = campStatsRaw as Record<string, CampEntry>;
const SKILLS = skillsJa as Record<string, SkillEntry>;

const UNRANKED = new Set<string>(dataFreshness.campStats.unrankedHeroIds);
const PRE_ADJUST = new Set<string>(dataFreshness.campStats.patchBasisHeroIds);

/**
 * ゲーム内にステータス画面が無い3体（Arena of Valor 出身）。
 * 2026-09-07 に運営者が確認済み（data_freshness.json の staticData._noStatusScreen）。
 * 撮り漏れではないので、この3体だけ理由を添えて「データなし」と出す
 */
const NO_STAT_SCREEN = new Set(['631', '635', '640']);

/**
 * リソース名の英語。公式グローバル版での呼称を確認できたものだけを持つ
 * （ヒーロー詳細の RESOURCE_EN と同じ範囲）。闘志・鋭気などは推測で訳さず Other と出す
 */
const RESOURCE_EN: Record<string, string> = {
  MP: 'MP',
  'エネルギー': 'Energy',
  'シャドウパワー': 'Shadow Power',
  'シャドーパワー': 'Shadow Power',
};

/** "3675" や "150|20%" の先頭の数値 */
const leadingNumber = (raw: string | undefined): number | null => {
  if (raw === undefined) return null;
  const n = Number(raw.split('|')[0]);
  return Number.isFinite(n) ? n : null;
};

const toBase = (entry: BaseEntry, locale: CompareLocale): CompareBase => {
  const s = entry.stats;
  const range = s['攻撃範囲'] === '近距離' ? 'melee' : s['攻撃範囲'] === '遠距離' ? 'ranged' : null;
  const res = entry.resource;
  const resourceName = res ? (locale === 'ja' ? res.name : RESOURCE_EN[res.name] ?? 'Other') : null;
  return {
    range,
    hp: leadingNumber(s['最大HP']),
    physAttack: leadingNumber(s['物理攻撃']),
    moveSpeed: leadingNumber(s['移動速度']),
    // S16 の元流の子（583・585）は画面の行名が変わっていて、このキーを持たない（heroes/stats/page.tsx）
    hpRegen: leadingNumber(s['1秒ごとのHP回復量']),
    magicAttack: s['魔法攻撃'] ?? null,
    physDefense: s['物理防御'] ?? null,
    magicDefense: s['魔法防御'] ?? null,
    resource: res && resourceName ? `${resourceName} ${res.max}` : null,
  };
};

export function buildCompareHeroes(locale: CompareLocale): CompareHero[] {
  const keyed = HEROES.map((hero): { row: CompareHero; sortKey: string } => {
    const id = hero.id;
    const name = locale === 'en' && hero.name_en ? hero.name_en : hero.name;
    const skill = SKILLS[id];
    const subRole = skill?.sub_role ? normalizeSubRole(skill.sub_role) : null;
    const camp = CAMP[id];
    const base = BASE[id];
    const lane = LANE_IDS.find((l) => l === camp?.lane) ?? null;
    const row: CompareHero = {
      id,
      slug: hero.slug || id,
      name,
      image: hero.image || `/images/heroes/${id}.webp`,
      roles: (hero.role ?? []).filter((r): r is RoleId => (ROLE_IDS as readonly string[]).includes(r)),
      type: subRole && !COMPOUND_ROLE_LABELS.has(subRole) ? subRoleLabel(subRole, locale) : null,
      difficulty: skill?.difficulty ? difficultyLabel(skill.difficulty, locale) : null,
      search: [hero.name, hero.name_en, hero.search_alias, hero.reading, hero.slug]
        .filter((v): v is string => Boolean(v))
        .map(searchNormalize)
        .join('|'),
      base: base ? toBase(base, locale) : null,
      noStatScreen: !base && NO_STAT_SCREEN.has(id),
      camp: camp
        ? { lane, tier: camp.tier, win: camp.win_rate, pick: camp.pick_rate, ban: camp.ban_rate }
        : null,
      unranked: !camp && UNRANKED.has(id),
      preAdjust: Boolean(camp) && PRE_ADJUST.has(id),
    };
    // 選ぶ一覧の並び。日本語はよみ（ひらがな）の五十音順、英語は英語名のアルファベット順
    return { row, sortKey: locale === 'ja' ? hero.search_alias || hero.reading || hero.name : name };
  });
  // 言語を渡す。渡さないとビルド環境の既定言語で並び、ブラウザと食い違う（audit 検査26）
  keyed.sort((a, b) => a.sortKey.localeCompare(b.sortKey, locale) || a.row.id.localeCompare(b.row.id, 'en'));
  return keyed.map((k) => k.row);
}

export function buildCompareMeta(locale: CompareLocale): CompareMeta {
  // 全員が同じ値なら、2体を並べても差が出ないので行にしない。値は注記で1回だけ出す。
  // 1体でも違う値が入ったら自動で行に戻る
  const keys: [SharedStatKey, string][] = [
    ['magicAttack', '魔法攻撃'],
    ['physDefense', '物理防御'],
    ['magicDefense', '魔法防御'],
  ];
  const entries = Object.values(BASE);
  const sharedStats: CompareMeta['sharedStats'] = [];
  for (const [key, label] of keys) {
    const values = new Set(entries.map((e) => e.stats[label]));
    const [only] = [...values];
    if (values.size === 1 && only !== undefined) {
      const n = leadingNumber(only);
      if (n !== null) sharedStats.push({ key, value: String(n) });
    }
  }
  return {
    statsUpdatedAt: dataFreshness.campStats.updatedAt,
    adjustPatch: locale === 'ja' ? dataFreshness.campStats.patchBasisPatchJa : dataFreshness.campStats.patchBasisPatchEn,
    sharedStats,
  };
}

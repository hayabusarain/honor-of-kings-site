import hokHeroes from '@/data/hok_heroes.json';
// 実測値だけを収めた基本ステータス。ゲーム内のステータス画面を113体ぶん書き起こしたもの。
// 旧 hero_detailed_stats.json は穴埋め用のダミーを読んでおり、大半のヒーローに
// 「最大HP 3300」を出していたため、2026-08-29 に生成スクリプトごと削除した
import heroBaseStats from '@/data/hero_base_stats.json';
import campStatsRaw from '@/data/hero_stats_camp.json';
import type { HokHero } from '@/types/database';

/**
 * ヒーロー詳細（HeroDetailClient）が表示に使う値を、サーバー側で1体ぶんだけ組み立てる。
 *
 * 2026-09-25 まではクライアント部品が hok_heroes.json・hero_base_stats.json・
 * hero_stats_camp.json・hok_arcanas.json を直接 import しており、全ヒーロー分
 * （JSON.stringify で計約69KB）が詳細ページのチャンクに載っていた。
 * 1ページで要るのは、そのヒーローの基礎値と統計、相性・編成・同レーンに出る
 * 十数体の名前と画像だけ。アルカナの詳細は heroItemBuilds.ts がビルドと一緒に解決する。
 */

/** ページの主役のヒーロー。name はロケールで解決済み */
export type HeroProfile = {
  /** 数値ID。data_freshness の patchBasisHeroIds やスキルアイコンのファイル名はこちらで引く */
  id: string;
  slug: string;
  name: string;
  /** 名前のふりがな。漢字を含む82体だけが持つ。ゲーム内のヒーロー画面に出ている読み */
  reading?: string;
  title: string;
  tags: string[];
  image: string;
};

/** 基本ステータス。実測値のあるヒーローだけが載っている */
export type HeroBaseStats = {
  source: string;
  stats: Record<string, string>;
  resource?: { name: string; max: string; maxLabel?: string; regen?: string; regenLabel?: string };
};

/** 公式 HoK Camp の統計。role は CLASH/JUNGLE/… の内部ID */
export type HeroCampStats = {
  role: string;
  tier: string;
  win_rate: number;
  pick_rate: number;
  ban_rate: number;
};

/** 相性・編成・同レーンの欄に出す他のヒーロー。name はロケールで解決済み */
export type HeroRef = { slug: string; name: string; image: string };

export type SameLaneMate = HeroRef & { id: string; tier: string };

export type HeroDetailData = {
  profile: HeroProfile;
  baseStats: HeroBaseStats | null;
  campStats: HeroCampStats | null;
  /** 相性・編成に出るヒーローを数値IDで引く表。載っていないIDは表示側で「Hero {id}」に落とす */
  heroRefs: Record<string, HeroRef>;
  sameLane: { lane: string; mates: SameLaneMate[] } | null;
};

type CampRow = { tier: string; lane?: string; win_rate: number; pick_rate: number; ban_rate: number };
type MetaRef = { hero_id?: string | number } | string;
type HeroMeta = {
  counters?: MetaRef[];
  synergy?: MetaRef[];
  official_team_combos?: { partners?: (string | number)[] }[];
} | null | undefined;

const HEROES = hokHeroes as HokHero[];
const HERO_BY_ID = new Map(HEROES.map((h) => [h.id, h]));
const CAMP = campStatsRaw as Record<string, CampRow>;
const BASE = heroBaseStats as Record<string, HeroBaseStats>;

const toRef = (h: HokHero, locale: string): HeroRef => ({
  slug: h.slug || h.id,
  name: locale === 'en' && h.name_en ? h.name_en : h.name,
  image: h.image || `/images/heroes/${h.id}.webp`,
});

// 同じレーンのヒーローの並び。Tier順（S>A>B>C）→同Tierは勝率降順
const TIER_ORDER: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 };

export function getHeroDetailData(hero: HokHero, locale: string, meta: HeroMeta): HeroDetailData {
  const profile: HeroProfile = {
    id: hero.id,
    slug: hero.slug || hero.id,
    name: locale === 'en' && hero.name_en ? hero.name_en : hero.name,
    reading: hero.reading,
    title: hero.title || 'Honor of Kings Hero',
    tags: hero.role?.length ? hero.role : ['Mage'],
    image: hero.image || `/images/heroes/${hero.id}.webp`,
  };

  // camp統計が無いヒーロー（S16 の新ヒーローなど）は null にし、ダミーで埋めない
  const camp = CAMP[hero.id];
  const campStats: HeroCampStats | null = camp
    ? {
        role: camp.lane || hero.role?.[0] || 'ALL',
        tier: camp.tier,
        win_rate: camp.win_rate,
        pick_rate: camp.pick_rate,
        ban_rate: camp.ban_rate,
      }
    : null;

  // 相性・編成の欄に出るIDだけを集める。いちばん多い孫臏でも24体（2026-09-25 時点）
  const ids = new Set<string>();
  for (const k of ['counters', 'synergy'] as const) {
    for (const c of meta?.[k] ?? []) ids.add(String((typeof c === 'object' && c.hero_id) || c));
  }
  for (const combo of meta?.official_team_combos ?? []) {
    for (const pid of combo.partners ?? []) ids.add(String(pid));
  }
  const heroRefs: Record<string, HeroRef> = {};
  for (const refId of ids) {
    const h = HERO_BY_ID.get(refId);
    if (h) heroRefs[refId] = toRef(h, locale);
  }

  // 同じレーンのヒーロー（回遊導線）。最大8体、自分自身は除く
  let sameLane: HeroDetailData['sameLane'] = null;
  const lane = camp?.lane;
  if (lane) {
    const top = Object.entries(CAMP)
      .filter(([hid, s]) => s.lane === lane && hid !== hero.id)
      .sort(([, a], [, b]) =>
        ((TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9)) || (b.win_rate - a.win_rate))
      .slice(0, 8);
    if (top.length > 0) {
      sameLane = {
        lane,
        mates: top.flatMap(([mateId, s]) => {
          const h = HERO_BY_ID.get(mateId);
          return h ? [{ ...toRef(h, locale), id: mateId, tier: s.tier }] : [];
        }),
      };
    }
  }

  return { profile, baseStats: BASE[hero.id] ?? null, campStats, heroRefs, sameLane };
}

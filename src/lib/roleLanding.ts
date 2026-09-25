import hokHeroes from '@/data/hok_heroes.json';
import campStatsRaw from '@/data/hero_stats_camp.json';
import dataFreshness from '@/data/data_freshness.json';
// skills/ja.json は1.6MBある。ここはサーバー（page.tsx・sitemap）からだけ読むこと。
// クライアント部品から import すると、バンドルに丸ごと載る
import skillsJa from '@/data/skills/ja.json';
import type { HokHero } from '@/types/database';
import { DIFFICULTY_IDS, difficultyLabel } from '@/content/heroDifficulty';
import { LANE_TIER_PAGES, type LaneId } from '@/content/laneTierPages';
import {
  ROLE_LANDING_PUBLISHED,
  type RoleFacts,
  type RoleLanding,
} from '@/content/roleLandings';
import { heroPublishedAt, latestOf, statsUpdatedAt } from '@/lib/contentDates';

/**
 * ロール別のヒーロー一覧（/heroes/role/[role]）に載せるものを、データから組み立てる。
 *
 * 数字は全部ここで数える。文言（src/content/roleLandings.ts）には数字を書かない。
 * 統計を取り直せば、ページの要約も格子も一緒に変わる。
 *
 * Tier・勝率・レーンは公式 HoK Camp の統計（hero_stats_camp.json）。1体に1レーンだけ入っている。
 * 統計の無い新ヒーロー（campStats.unrankedHeroIds）は、格子に「統計なし」で出し、
 * レーンと Tier の内訳からは外す。直近の調整前の統計（campStats.patchBasisHeroIds）は、
 * そのロールに当たる体だけを名前で断る。
 */

type CampStat = { tier: string; lane: string; win_rate: number };
type SkillEntry = { difficulty?: string };

type Loc = 'ja' | 'en';

const CAMP = campStatsRaw as Record<string, CampStat>;
const SKILLS = skillsJa as Record<string, SkillEntry>;
const HEROES = hokHeroes as HokHero[];

const TIER_ORDER = ['S', 'A', 'B', 'C'] as const;
const TIER_RANK: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };

export type RoleHeroCard = {
  id: string;
  /** ヒーロー詳細の URL（slug 側が正規） */
  href: string;
  name: string;
  image: string;
  /** 統計の無い体は null */
  tier: string | null;
  winRate: number | null;
  lane: LaneId | null;
  /** 統計が直近の調整前のまま */
  prePatch: boolean;
};

export type RoleLandingData = {
  landing: RoleLanding;
  heroes: RoleHeroCard[];
  facts: RoleFacts;
  /** 統計でのレーンの登録（多い順）。Tier表への導線に使う */
  lanes: { id: LaneId; slug: string; name: string; count: number }[];
  /** 調整前の注記の本文は data_freshness にあるが、対象の ID が空のとき */
  patchBasisWithoutIds: boolean;
};

const nameOf = (h: HokHero, loc: Loc) => (loc === 'en' ? h.name_en || h.name : h.name);

/** そのロールのヒーロー（ロールを2つ持つ体は両方のページに出る） */
function heroesOfRole(landing: RoleLanding): HokHero[] {
  return HEROES.filter((h) => (h.role || []).includes(landing.id));
}

/** ロールの体数。メタデータと導線のチップで使う */
export function roleHeroCount(landing: RoleLanding): number {
  return heroesOfRole(landing).length;
}

export function buildRoleLanding(landing: RoleLanding, locale: string, roleName: string): RoleLandingData {
  const loc: Loc = locale === 'ja' ? 'ja' : 'en';
  const cs = dataFreshness.campStats;
  const unrankedIds: readonly string[] = cs.unrankedHeroIds;
  const prePatchIds: readonly string[] = cs.patchBasisHeroIds;
  const members = heroesOfRole(landing);

  const heroes: RoleHeroCard[] = members.map((h) => {
    // 統計の無い体は unrankedHeroIds に載っていて、hero_stats_camp.json にキーが無い（監査の検査4が両方を見る）
    const s = unrankedIds.includes(h.id) ? undefined : CAMP[h.id];
    return {
      id: h.id,
      href: `/heroes/${h.slug || h.id}`,
      name: nameOf(h, loc),
      image: h.image || `/images/heroes/${h.id}.webp`,
      tier: s?.tier ?? null,
      winRate: typeof s?.win_rate === 'number' ? s.win_rate : null,
      lane: (s?.lane as LaneId | undefined) ?? null,
      prePatch: Boolean(s) && prePatchIds.includes(h.id),
    };
  });

  // Tier の高い順、同じ Tier は勝率の高い順、統計の無い体は末尾。
  // 名前の比較には言語を渡す。渡さないとビルド環境とブラウザで並びが変わりうる
  heroes.sort((a, b) => {
    const ta = a.tier ? TIER_RANK[a.tier] ?? 0 : -1;
    const tb = b.tier ? TIER_RANK[b.tier] ?? 0 : -1;
    if (ta !== tb) return tb - ta;
    const wa = a.winRate ?? -1;
    const wb = b.winRate ?? -1;
    if (wa !== wb) return wb - wa;
    return a.name.localeCompare(b.name, loc);
  });

  const ranked = heroes.filter((h) => h.tier !== null);

  // レーン。表示名は Tier表のページ（laneTierPages）の名前に揃える
  const laneCount = new Map<LaneId, number>();
  for (const h of ranked) if (h.lane) laneCount.set(h.lane, (laneCount.get(h.lane) ?? 0) + 1);
  const lanes = LANE_TIER_PAGES
    .filter((p) => laneCount.has(p.id))
    .map((p) => ({ id: p.id, slug: p.slug, name: p.name[loc], count: laneCount.get(p.id) ?? 0 }))
    // 同数のときは LANE_TIER_PAGES の並び（クラッシュ→ジャングル→ミッド→ファーム→ローム）
    .sort((a, b) => b.count - a.count);

  const tierCount = (t: string) => ranked.filter((h) => h.tier === t).length;
  const sNames = ranked.filter((h) => h.tier === 'S').map((h) => h.name);
  const otherTiers = TIER_ORDER.filter((t) => t !== 'S')
    .map((t) => ({ tier: t, count: tierCount(t) }))
    .filter((t) => t.count > 0);

  // 難易度は skills/ja.json の公式表記（イージー／ノーマル／ハード／ベリーハード）
  const difficultyOf = (id: string) => SKILLS[id]?.difficulty;
  const easyNames = heroes.filter((h) => difficultyOf(h.id) === 'イージー').map((h) => h.name);
  const otherDifficulties = DIFFICULTY_IDS.filter((d) => d !== 'イージー')
    .map((d) => ({ label: difficultyLabel(d, loc), count: heroes.filter((h) => difficultyOf(h.id) === d).length }))
    .filter((d) => d.count > 0);
  const noDifficultyNames = heroes
    .filter((h) => !(DIFFICULTY_IDS as readonly string[]).includes(difficultyOf(h.id) ?? ''))
    .map((h) => h.name);

  const facts: RoleFacts = {
    roleName,
    count: heroes.length,
    rankedCount: ranked.length,
    lanes: lanes.map((l) => ({ name: l.name, count: l.count })),
    sNames,
    otherTiers,
    easyNames,
    otherDifficulties,
    noDifficultyNames,
    unrankedNames: heroes.filter((h) => h.tier === null).map((h) => h.name),
    prePatchNames: heroes.filter((h) => h.prePatch).map((h) => h.name),
    patchName: loc === 'ja' ? cs.patchBasisPatchJa : cs.patchBasisPatchEn,
  };

  return {
    landing,
    heroes,
    facts,
    lanes,
    patchBasisWithoutIds: prePatchIds.length === 0 && Boolean(loc === 'ja' ? cs.patchBasisJa : cs.patchBasisEn),
  };
}

/**
 * サイトマップの lastmod 用。載っているのは公式統計（Tier・勝率・レーン）と、
 * そのロールのヒーローの顔ぶれ。難易度は書き起こしの日付（skillData.updatedAt）が
 * 全ヒーローの書き起こしで上がるので入れない。入れると、難易度が変わっていない日にも更新を申告する。
 */
export function roleLandingUpdatedAt(landing: RoleLanding): string {
  return latestOf(
    ROLE_LANDING_PUBLISHED,
    statsUpdatedAt(),
    ...heroesOfRole(landing).map((h) => heroPublishedAt(h.id)),
  );
}

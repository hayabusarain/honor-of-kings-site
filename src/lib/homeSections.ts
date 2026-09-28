// トップページの節を組み立てる（2026-09-28、MLBB Hub のトップにならって充実させた。運営者の依頼）。
//
// 材料は手元の公式データだけ: 統計は HoK Camp（hero_stats_camp.json と前回分の _prev）、
// パッチは patches.json（公式パッチノートの書き起こし）。外から数字を足さない。
// patches.json（約180KB）や hok_heroes.json をクライアントへ運ばないよう、ここはサーバーコンポーネント
// （src/app/[locale]/page.tsx）からだけ呼び、出来上がった小さな配列を HomeClient に渡す。
import hokHeroes from '@/data/hok_heroes.json';
import campStats from '@/data/hero_stats_camp.json';
import campPrev from '@/data/hero_stats_camp_prev.json';
import dataFreshness from '@/data/data_freshness.json';
import { getAllPatches } from '@/lib/patchData';
import { getLatestPatchChanges } from '@/lib/patchBadges';
import { normalizePatchText, patchShortLabel } from '@/lib/patchText';
import { DEFAULT_HERO_IMAGE } from '@/lib/basePath';
import { LANE_TIER_PAGES } from '@/content/laneTierPages';
import { ROLE_LANDINGS, type RoleLanding } from '@/content/roleLandings';

/**
 * 勝率・BAN率の上位と、前回からの動きに入れる下限の出現率（%）。
 * 使う人が少ないヒーローは、数試合で勝率が大きく振れる。2026-09-25 の集計では
 * 118体の出現率の中央値が 0.73%、0.5% 以上が85体。これより少ないものは外す
 */
export const MIN_PICK_RATE = 0.5;

type Stat = { tier: string; lane: string; win_rate: number; pick_rate: number; ban_rate: number };
type Hero = { id: string; slug?: string; name: string; name_en?: string; image?: string };

const STATS = campStats as Record<string, Stat>;
const PREV = campPrev as Record<string, Stat>;
const HEROES = hokHeroes as Hero[];
const HERO_BY_ID = new Map(HEROES.map((h) => [String(h.id), h]));
const PRE_PATCH_IDS = new Set((dataFreshness.campStats.patchBasisHeroIds as string[]).map(String));

export const LANES = ['CLASH', 'JUNGLE', 'MID', 'FARM', 'ROAM'] as const;
export type Lane = (typeof LANES)[number];

export interface HomeHeroRef {
  id: string;
  slug: string;
  name: string;
  image: string;
}

export interface LaneHero extends HomeHeroRef {
  tier: string;
  winRate: number;
  pickRate: number;
  /** 統計を取ったあとにバランス調整が入ったヒーロー（data_freshness.json の patchBasisHeroIds） */
  isPrePatch: boolean;
}

export interface PatchChangeCard {
  hero: HomeHeroRef;
  changeType: 'buff' | 'nerf' | 'adjust';
  /** 見出し行の「— 」の後ろ（当サイトの要約）。無ければ空 */
  summary: string;
  /** 最初の変更の1行（どのスキルか、何がどう変わったか） */
  firstChange: { section: string; text: string } | null;
  /** 残りの変更の件数 */
  moreCount: number;
}

export interface Mover {
  hero: HomeHeroRef;
  before: number;
  after: number;
}

export interface Ranked {
  hero: HomeHeroRef;
  value: number;
}

export interface HomeSections {
  heroCount: number;
  lanes: { lane: Lane; heroes: LaneHero[] }[];
  patch: { label: string; date: string; cards: PatchChangeCard[]; buff: number; nerf: number; adjust: number } | null;
  movers: { from: string; to: string; up: Mover[]; down: Mover[] };
  topWin: Ranked[];
  topBan: Ranked[];
  /** 上位と動きの候補にしたヒーローの数（出現率の下限を満たすもの） */
  rankedCount: number;
  /**
   * 出現率の下限（MIN_PICK_RATE）。HomeClient は値を import せずにここから読む。
   * import するとこのモジュールごと（patches.json などを含めて）クライアントのバンドルに載る
   */
  minPickRate: number;
  /** ページ一覧のボタン。レーン別Tier表の解説文（laneTierPages.ts）をクライアントへ運ばないよう、名前だけ渡す */
  laneLinks: { slug: string; lane: Lane; name: string }[];
  roleLinks: { slug: string; id: RoleLanding['id']; labelKey: RoleLanding['labelKey'] }[];
}

const heroRef = (id: string, locale: string): HomeHeroRef | null => {
  const h = HERO_BY_ID.get(String(id));
  if (!h) return null;
  return {
    id: String(h.id),
    slug: h.slug || String(h.id),
    name: locale === 'en' && h.name_en ? h.name_en : h.name,
    image: h.image || DEFAULT_HERO_IMAGE,
  };
};

const tierRank = (t: string) => ({ S: 3, A: 2, B: 1 } as Record<string, number>)[t] ?? 0;

/**
 * パッチの本文（公式パッチノートの書き起こし）を、見出しの要約・最初の変更・残りの件数に分ける。
 * 本文の形は日英とも「**名前 — 要約**」「**スキル名**」「・変更」…「**この変更の意味**（当サイトの解説）」。
 * 解説の節より後ろは数えない
 */
function parseChange(text: string): Pick<PatchChangeCard, 'summary' | 'firstChange' | 'moreCount'> {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const head = (lines[0] ?? '').replace(/\*\*/g, '');
  const at = head.indexOf(' — ');
  const summary = at > 0 ? head.slice(at + 3).trim() : '';
  const changes: { section: string; text: string }[] = [];
  let section = '';
  for (const line of lines.slice(1)) {
    const heading = line.match(/^\*\*(.+)\*\*$/);
    if (heading) {
      if (/^(この変更の意味|What this means)/.test(heading[1])) break;
      // 「パッシブ「迅速」（元流の子の共通ステータス）」の括弧書きは1行に収まらないので落とす
      section = heading[1].replace(/\s*[（(][^（()）]*[）)]\s*$/, '').trim();
      continue;
    }
    const bullet = line.match(/^[・•]\s*(.+)$/);
    if (bullet) changes.push({ section, text: bullet[1] });
  }
  return { summary, firstChange: changes[0] ?? null, moreCount: Math.max(0, changes.length - 1) };
}

function latestPatch(locale: string): HomeSections['patch'] {
  const latest = getLatestPatchChanges();
  const seen = new Set<string>();
  const cards: PatchChangeCard[] = [];
  for (const p of getAllPatches()) {
    if (p.version !== latest.version || !p.is_hero || !p.hero_id || seen.has(String(p.hero_id))) continue;
    const changeType = latest.changes[String(p.hero_id)];
    const hero = heroRef(String(p.hero_id), locale);
    if (!changeType || !hero) continue;
    seen.add(String(p.hero_id));
    const text = normalizePatchText(locale === 'en' ? p.description_en || p.description : p.description, locale);
    cards.push({ hero, changeType, ...parseChange(text || '') });
  }
  if (cards.length === 0) return null;
  // 強化 → 調整 → 弱体の順（同じ種類の中はパッチノートの並び）
  const order = { buff: 0, adjust: 1, nerf: 2 } as const;
  cards.sort((a, b) => order[a.changeType] - order[b.changeType]);
  const count = (t: PatchChangeCard['changeType']) => cards.filter((c) => c.changeType === t).length;
  return {
    label: patchShortLabel(latest.version, locale),
    date: latest.date,
    cards,
    buff: count('buff'),
    nerf: count('nerf'),
    adjust: count('adjust'),
  };
}

export function getHomeSections(locale: string): HomeSections {
  // レーンごとに Tier の高い順、同じ Tier なら勝率の高い順に3体（Tier表と同じ並べ方）
  const lanes = LANES.map((lane) => {
    const heroes = Object.entries(STATS)
      .filter(([, s]) => s.lane === lane)
      .sort(([, a], [, b]) => tierRank(b.tier) - tierRank(a.tier) || b.win_rate - a.win_rate)
      .slice(0, 3)
      .map(([id, s]) => {
        const ref = heroRef(id, locale);
        return ref ? { ...ref, tier: s.tier, winRate: s.win_rate, pickRate: s.pick_rate, isPrePatch: PRE_PATCH_IDS.has(id) } : null;
      })
      .filter((h): h is LaneHero => h !== null);
    return { lane, heroes };
  });

  const ranked = Object.entries(STATS).filter(([id, s]) => s.pick_rate >= MIN_PICK_RATE && HERO_BY_ID.has(id));
  const top = (key: 'win_rate' | 'ban_rate') =>
    [...ranked]
      .sort(([, a], [, b]) => b[key] - a[key])
      .slice(0, 5)
      .map(([id, s]) => ({ hero: heroRef(id, locale) as HomeHeroRef, value: s[key] }));

  // 前回の集計からの動き。2回とも出現率の下限を満たすヒーローだけで比べる
  const moves = ranked
    .filter(([id]) => PREV[id] && PREV[id].pick_rate >= MIN_PICK_RATE)
    .map(([id, s]) => ({ hero: heroRef(id, locale) as HomeHeroRef, before: PREV[id].win_rate, after: s.win_rate }))
    .sort((a, b) => b.after - b.before - (a.after - a.before));

  return {
    heroCount: HEROES.length,
    lanes,
    patch: latestPatch(locale),
    movers: {
      from: dataFreshness.campStats.prevUpdatedAt,
      to: dataFreshness.campStats.updatedAt,
      up: moves.filter((m) => m.after > m.before).slice(0, 3),
      down: moves.filter((m) => m.after < m.before).reverse().slice(0, 3),
    },
    topWin: top('win_rate'),
    topBan: top('ban_rate'),
    rankedCount: ranked.length,
    minPickRate: MIN_PICK_RATE,
    laneLinks: LANE_TIER_PAGES.map((p) => ({ slug: p.slug, lane: p.id as Lane, name: locale === 'en' ? p.name.en : p.name.ja })),
    roleLinks: ROLE_LANDINGS.map((r) => ({ slug: r.slug, id: r.id, labelKey: r.labelKey })),
  };
}

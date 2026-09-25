/**
 * ロールとレーンのアイコン。lucide（ISC ライセンス）の図柄で、公式の画像は使っていない。
 * MLBB Hub の src/components/icons/GameIcons.tsx（2026-09-24）を HoK のロールとレーンに合わせて写した。
 *
 *   ロール … 盾・交差した剣・刃・杖・弓・心臓。ロールごとに色を持たせる
 *   レーン … クラッシュ＝昇段の山形、ファーム＝硬貨、ミッド＝盤面の対角線、ジャングル＝針葉樹、ローム＝足跡。
 *            ロールの図柄と重ねない（剣や盾をレーンに使うと、ファイターやタンクと見分けがつかない）
 *
 * 公式の絵を使ってよいと 2026-09-25 に言われている（MLBB の申し送り）。公式の絵が取れたら差し替える。
 * サーバー部品からもクライアント部品からも使える（フックを持たない）。
 */
import {
  BowArrow,
  ChevronsUp,
  Coins,
  Footprints,
  HeartPlus,
  LayoutGrid,
  MoveDiagonal2,
  Shield,
  Slice,
  Swords,
  TreePine,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react';

/** hok_heroes.json の role の値 */
export type RoleId = 'Tank' | 'Fighter' | 'Assassin' | 'Mage' | 'Marksman' | 'Support';
/** hero_stats_camp.json の lane の値。ALL は「全レーン」のタブ */
export type LaneId = 'CLASH' | 'JUNGLE' | 'MID' | 'FARM' | 'ROAM' | 'ALL';

export const ROLE_ICON: Record<RoleId, LucideIcon> = {
  Tank: Shield,
  Fighter: Swords,
  Assassin: Slice,
  Mage: WandSparkles,
  Marksman: BowArrow,
  Support: HeartPlus,
};

/**
 * ロールの色。アイコンの線に使う。値は夜の配色の段（globals.css）。
 * 盾役は空色、前衛は紅、暗殺は紫、魔法は青、射手は金、支援は翡翠
 */
export const ROLE_TONE: Record<RoleId, string> = {
  Tank: 'text-sky-600',
  Fighter: 'text-rose-600',
  Assassin: 'text-violet-600',
  Mage: 'text-blue-600',
  Marksman: 'text-brand-700',
  Support: 'text-jade-600',
};

export const LANE_ICON: Record<LaneId, LucideIcon> = {
  ALL: LayoutGrid,
  CLASH: ChevronsUp,
  FARM: Coins,
  MID: MoveDiagonal2,
  JUNGLE: TreePine,
  ROAM: Footprints,
};

type IconProps = { className?: string };

export function RoleIcon({ role, className = 'h-5 w-5', tone = true }: IconProps & { role: string; tone?: boolean }) {
  const Icon = ROLE_ICON[role as RoleId];
  if (!Icon) return null;
  return <Icon className={`${className} ${tone ? ROLE_TONE[role as RoleId] : ''}`} aria-hidden="true" strokeWidth={2.2} />;
}

export function LaneIcon({ lane, className = 'h-5 w-5' }: IconProps & { lane: string }) {
  const Icon = LANE_ICON[String(lane).toUpperCase() as LaneId];
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" strokeWidth={2.2} />;
}

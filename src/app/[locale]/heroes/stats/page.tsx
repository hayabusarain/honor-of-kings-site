import hokHeroes from '@/data/hok_heroes.json';
import baseStatsRaw from '@/data/hero_base_stats.json';
import dataFreshness from '@/data/data_freshness.json';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { StatsRankingClient, type HeroStatRow, type PipeStat } from '@/components/heroes/StatsRankingClient';

/**
 * 全ヒーロー基本ステータス一覧・ランキング。
 *
 * データはゲーム内ステータス画面からの実測値（hero_base_stats.json）。
 * 実測できた分のみを載せ、未実測のヒーローは推定値で埋めずに掲載しない方針。
 * ここでロケール別の名前解決と数値パースを済ませ、操作（ソート・絞り込み）は
 * StatsRankingClient に渡す。魔法攻撃は全ヒーローが0のため列にしない。
 */

export const revalidate = 3600;

type HeroEntry = {
  id: string;
  name: string;
  name_en?: string;
  slug?: string;
  image?: string;
  role?: string[];
};

type BaseStatsEntry = {
  stats: Record<string, string>;
};

// 「150|20%」のパイプ形式（実数値|ダメージ軽減率）を分解する
function parsePipe(raw: string): PipeStat {
  const [value, percent] = raw.split('|');
  return { value: Number(value), percent: percent ?? null };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  const count = Object.keys(baseStatsRaw).length;
  return buildPageMetadata({
    locale,
    path: '/heroes/stats',
    title: isJa
      ? '全ヒーロー基本ステータス一覧・実測ランキング'
      : 'Hero Base Stats: Measured List & Rankings',
    description: isJa
      ? `オナーオブキングス（HoK）のヒーロー${count}体の最大HP・物理攻撃・防御・移動速度・HP回復をゲーム内画面から実測して一覧化。項目ごとの並び替えとロール絞り込みに対応。`
      : `Base stats for ${count} Honor of Kings (HoK) heroes — max HP, attack, defenses, move speed and HP regen — measured from the in-game stats screen. Sortable by column, filterable by role.`,
  });
}

export default async function HeroStatsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const heroes = hokHeroes as HeroEntry[];
  const baseStats = baseStatsRaw as unknown as Record<string, BaseStatsEntry>;

  // hok_heroes.json と突き合わせ、実測データがあるヒーローだけを載せる
  const rows: HeroStatRow[] = heroes
    .filter((h) => baseStats[h.id])
    .map((h) => {
      const s = baseStats[h.id].stats;
      return {
        id: h.id,
        slug: h.slug || h.id,
        name: locale === 'ja' ? h.name : h.name_en || h.name,
        image: h.image || `/images/heroes/${h.id}.webp`,
        roles: h.role || [],
        hp: Number(s['最大HP']),
        attack: Number(s['物理攻撃']),
        defense: parsePipe(s['物理防御']),
        magicDefense: parsePipe(s['魔法防御']),
        moveSpeed: Number(s['移動速度']),
        hpRegen: Number(s['1秒ごとのHP回復量']),
      };
    });

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        trail={[
          { name: locale === 'ja' ? 'ヒーロー一覧' : 'Heroes', path: '/heroes' },
          { name: locale === 'ja' ? '基本ステータス' : 'Base Stats', path: '/heroes/stats' },
        ]}
      />
      <StatsRankingClient rows={rows} totalHeroes={heroes.length} measuredAt={dataFreshness.staticData.baseStats.updatedAt} />
    </>
  );
}

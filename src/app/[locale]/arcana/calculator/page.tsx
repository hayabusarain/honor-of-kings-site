import baseStatsRaw from '@/data/hero_base_stats.json';
import dataFreshness from '@/data/data_freshness.json';
import hokHeroes from '@/data/hok_heroes.json';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd, Breadcrumb } from '@/components/seo/BreadcrumbJsonLd';
import { ARCANA_COLORS, ARCANA_STATS, parseArcanas, type ArcanaColor, type StatKey } from '@/lib/arcanaStats';
import { ARCANA_BUILDS } from '@/content/arcanaBuilds';
import {
  ArcanaCalculatorClient,
  type CalcArcana,
  type CalcHero,
  type CalcPreset,
} from '@/components/arcana/ArcanaCalculatorClient';

/**
 * アルカナ計算機。
 *
 * 一覧ページは1枠あたりの効果を出しているだけで、30枠ぶんの合計は載せていなかった。
 * 効果文の解析・ロール別構成の突き合わせ・ヒーロー基礎値の読み込みをここで済ませ、
 * 操作は ArcanaCalculatorClient に渡す。
 */

type HeroEntry = {
  id: string;
  name: string;
  name_en?: string;
  slug?: string;
};

type BaseStatsEntry = { stats: Record<string, string> };

/** 「150|20%」は実数値とダメージ軽減率の併記。足し算に使うのは実数値のほう */
const flatOf = (raw: string | undefined) => {
  if (!raw) return undefined;
  const value = Number(raw.split('|')[0]);
  return Number.isFinite(value) ? value : undefined;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/arcana/calculator',
    title: isJa ? 'アルカナ計算機｜30枠の合計ステータス' : 'Arcana Calculator: Total Stats for 30 Slots',
    description: isJa
      ? 'オナーオブキングス（HoK）のアルカナを赤・青・緑の30枠に組み、効果の合計を計算します。ロール別構成の呼び出しと、ヒーローの基礎値に足した数値の確認にも対応。'
      : 'Build a full Honor of Kings (HoK) arcana page across the 30 red, blue and green slots and see the totals add up. Load a role build in one click, or apply the totals to a hero’s base stats.',
  });
}

export default async function ArcanaCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';

  const parsed = parseArcanas();

  const arcanas: CalcArcana[] = parsed.map(a => ({
    id: a.id,
    color: a.color,
    name: isJa ? a.name : a.nameEn,
    stats: isJa ? a.stats : a.statsEn,
    icon: a.icon,
    effects: a.effects,
  }));

  // ロール別構成の1色目の候補を、その色の10枠すべてに入れる形にする。
  // 名前の突き合わせは日本語側で行い、表示だけロケールに合わせる
  const byJaName = new Map(parsed.map(a => [a.name, a]));
  const presets: CalcPreset[] = ARCANA_BUILDS.ja.map((jaBuild, index) => {
    const shown = ARCANA_BUILDS[isJa ? 'ja' : 'en'][index];
    const picks = {} as Record<ArcanaColor, string>;
    for (const color of ARCANA_COLORS) {
      const pick = jaBuild[color][0];
      const arcana = pick ? byJaName.get(pick.name) : undefined;
      if (!arcana) throw new Error(`ロール別構成「${jaBuild.role}」の${color}「${pick?.name}」が hok_arcanas.json に無い`);
      picks[color] = arcana.id;
    }
    return { id: jaBuild.id, role: shown.role, target: shown.target, picks };
  });

  // 基礎値は実測できたヒーローのぶんだけ。推定値では埋めない
  const baseStats = baseStatsRaw as unknown as Record<string, BaseStatsEntry>;
  const heroes: CalcHero[] = (hokHeroes as HeroEntry[])
    .filter(h => baseStats[h.id])
    .map(h => {
      const s = baseStats[h.id].stats;
      const base: Partial<Record<StatKey, number>> = {};
      for (const def of ARCANA_STATS) {
        if (!def.baseStatKey) continue;
        const value = flatOf(s[def.baseStatKey]);
        if (value !== undefined) base[def.key] = value;
      }
      return {
        id: h.id,
        slug: h.slug || h.id,
        name: isJa ? h.name : h.name_en || h.name,
        base,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, locale));

  const trail = [
    { name: isJa ? 'アルカナ一覧' : 'Arcana', path: '/arcana' },
    { name: isJa ? 'アルカナ計算機' : 'Arcana Calculator', path: '/arcana/calculator' },
  ];

  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={trail} />
      {/* 構造化データと同じトレイルを可視の導線にも渡す。別々に書くと片方だけ直して食い違う */}
      <Breadcrumb locale={locale} trail={trail} className="px-1 pt-3 pb-1" />
      <ArcanaCalculatorClient
        arcanas={arcanas}
        presets={presets}
        heroes={heroes}
        updatedAt={dataFreshness.staticData.arcana.updatedAt}
      />
    </>
  );
}

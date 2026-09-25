import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BreadcrumbJsonLd, Breadcrumb } from '@/components/seo/BreadcrumbJsonLd';
import { RoleLandingView, type OtherRoleLink } from '@/components/heroes/role/RoleLandingView';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { buildRoleLanding, roleHeroCount } from '@/lib/roleLanding';
import { ROLE_LANDINGS, ROLE_META, findRoleLanding } from '@/content/roleLandings';
import type { LaneId } from '@/content/laneTierPages';

/**
 * ロール別のヒーロー一覧。6ロール×2言語＝12ページを静的生成する。
 *
 * ヒーロー一覧（/heroes）のロール絞り込みは ?role= のクエリなので、
 * 「オナーオブキングス タンク 一覧」のような検索の受け皿にならない。ロールごとに固定URLを持たせ、
 * そのロールの内訳（統計でのレーン・Tier・ゲーム内の難易度）とヒーローの格子を載せる。
 * レーン別は作らない。/tier-list/[lane] と中身が重なる。
 *
 * 数字は src/lib/roleLanding.ts がデータから数える。統計の更新は hero_stats_camp.json の
 * 差し替えだけで、ここに手作業は増えない。
 */

// ROLE_LANDINGS に無いロールは、ページ本体を実行せずに404へ落とす
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => ROLE_LANDINGS.map((r) => ({ locale, role: r.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; role: string }> }) {
  const { locale, role } = await params;
  const landing = findRoleLanding(role);
  if (!landing) return {};
  const t = await getTranslations({ locale, namespace: 'Role' });
  const { title, description } = ROLE_META[locale === 'ja' ? 'ja' : 'en'](t(landing.labelKey), roleHeroCount(landing));
  return buildPageMetadata({ locale, path: `/heroes/role/${landing.slug}`, title, description });
}

export default async function RoleLandingPage({ params }: { params: Promise<{ locale: string; role: string }> }) {
  const { locale, role } = await params;
  const landing = findRoleLanding(role);
  if (!landing) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Role' });
  const th = await getTranslations({ locale, namespace: 'Heroes' });
  const roleName = t(landing.labelKey);
  const data = buildRoleLanding(landing, locale, roleName);

  // カードのレーン名。messages の Role.* は「ジャングル (Jungle)」「Clash Lane」の形なので、
  // ヒーロー一覧のレーンのプルダウンと同じ規則で短くする
  const short = (key: string) => t(key).replace(/\s*\(.+\)$/, '').replace(/\s+Lane$/, '');
  const laneShort: Record<LaneId, string> = {
    CLASH: short('clash'),
    JUNGLE: short('jungle'),
    MID: short('mid'),
    FARM: short('farm'),
    ROAM: short('roam'),
  };

  const otherRoles: OtherRoleLink[] = ROLE_LANDINGS.filter((r) => r.slug !== landing.slug).map((r) => ({
    slug: r.slug,
    id: r.id,
    name: t(r.labelKey),
    count: roleHeroCount(r),
  }));

  const trail = [
    { name: th('title'), path: '/heroes' },
    { name: roleName, path: `/heroes/role/${landing.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={trail} />
      {/* 構造化データと同じトレイルを可視の導線にも渡す */}
      <Breadcrumb locale={locale} trail={trail} className="px-1 pt-3 pb-1" />
      <RoleLandingView locale={locale} data={data} laneShort={laneShort} otherRoles={otherRoles} />
    </>
  );
}

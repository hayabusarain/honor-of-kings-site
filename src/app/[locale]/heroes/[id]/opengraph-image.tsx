import { routing } from '@/i18n/routing';
import hokHeroes from '@/data/hok_heroes.json';
import { HokHero } from '@/types/database';
import { getHeroPageText } from '@/lib/heroPageTitle';
import { hasHeroItemBuilds } from '@/lib/heroItemBuilds';
import { ogHeading } from '@/lib/buildMetadata';
import { renderOgImage, ogSize, ogContentType } from '@/lib/ogImage';

// ヒーロー詳細のOGP画像。232枚をビルド時に焼く。
// 見出しは page.tsx の generateMetadata とまったく同じ経路で作る
// （getHeroPageText の title → ogHeading）。ここで文言を書き直すと、
// タイトルを変えたときに絵だけ古いまま残る。
export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  for (const locale of routing.locales) {
    for (const hero of hokHeroes as HokHero[]) {
      if (hero.slug) params.push({ locale, id: hero.slug });
    }
  }
  return params;
}

export default async function Image({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const hero = (hokHeroes as HokHero[]).find((h) => h.id === id || h.slug === id);
  const heroName = locale === 'ja' ? (hero?.name || id) : (hero?.name_en || hero?.name || id);
  const { title } = getHeroPageText(locale, heroName, hasHeroItemBuilds(String(hero?.id ?? id)));
  return renderOgImage(locale, ogHeading(title));
}

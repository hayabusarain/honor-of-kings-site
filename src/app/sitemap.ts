import { MetadataRoute } from 'next';
import heroesData from '@/data/hok_heroes.json';
import dataFreshness from '@/data/data_freshness.json';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hok.hub-game.com';
  // 主言語の英語を先に並べる
  const locales = ['en', 'ja'];

  // 全URLにビルド時刻を入れると、実際には何も変わっていないのに更新扱いになり、
  // lastModified が更新シグナルとして機能しなくなる。掲載データの更新日を使う
  const contentUpdatedAt = new Date(
    [dataFreshness.campStats.updatedAt, dataFreshness.skillPriority.updatedAt, dataFreshness.combos.updatedAt]
      .sort()
      .pop() as string
  );
  const statsUpdatedAt = new Date(dataFreshness.campStats.updatedAt);

  const heroIds = heroesData.map((h: { slug?: string; id: string }) => h.slug || h.id).filter(Boolean);

  // Define active static paths (without locale prefix)
  // '/links' は noindex なので載せない（載せると Search Console でカバレッジ警告になる）
  const staticPaths = [
    '',
    '/heroes',
    // 基本ステータス実測一覧（101体・実測値）
    '/heroes/stats',
    '/tier-list',
    '/patches',
    '/items',
    '/arcana',
    '/spells',
    '/guide',
    '/guide/bosses',
    '/guide/macro',
    '/guide/beginner-heroes',
    '/esports/asian-games-2026',
    '/terms',
    '/privacy',
    '/legal',
    '/contact',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Pages
  for (const path of staticPaths) {
    const isHome = path === '';
    const isHighFrequency = path === '/tier-list' || path === '/patches';
    
    // Generate alternates languages object
    // HTML 側の hreflang には x-default があるので、sitemap でも揃える
    const alternatesLanguages: Record<string, string> = { 'x-default': `${baseUrl}/en${path}` };
    for (const l of locales) {
      alternatesLanguages[l] = `${baseUrl}/${l}${path}`;
    }

    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: isHighFrequency ? statsUpdatedAt : contentUpdatedAt,
        changeFrequency: isHome || isHighFrequency ? 'daily' : 'weekly',
        priority: isHome ? 1.0 : isHighFrequency ? 0.9 : 0.7,
        alternates: {
          languages: alternatesLanguages
        }
      });
    }
  }

  // 2. Dynamic Hero Pages
  for (const champId of heroIds) {
    // Generate alternates languages object for main hero page
    const alternatesLanguages: Record<string, string> = { 'x-default': `${baseUrl}/en/heroes/${champId}` };
    for (const l of locales) {
      alternatesLanguages[l] = `${baseUrl}/${l}/heroes/${champId}`;
    }

    for (const locale of locales) {
      // Main Hero Page
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/heroes/${champId}`,
        lastModified: contentUpdatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
          languages: alternatesLanguages
        }
      });
    }
  }

  return sitemapEntries;
}

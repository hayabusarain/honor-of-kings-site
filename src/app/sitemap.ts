import { MetadataRoute } from 'next';
import heroesData from '@/data/hok_heroes.json';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hok.hub-game.com';
  // 主言語の英語を先に並べる
  const locales = ['en', 'ja'];
  
  const heroIds = heroesData.map((h: { slug?: string; id: string }) => h.slug || h.id).filter(Boolean);

  // Define active static paths (without locale prefix)
  const staticPaths = [
    '',
    '/heroes',
    '/tier-list',
    '/patches',
    '/items',
    '/arcana',
    '/spells',
    '/guide',
    '/guide/bosses',
    '/guide/macro',
    '/links',
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
    const alternatesLanguages: Record<string, string> = {};
    for (const l of locales) {
      alternatesLanguages[l] = `${baseUrl}/${l}${path}`;
    }
    
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
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
    const alternatesLanguages: Record<string, string> = {};
    for (const l of locales) {
      alternatesLanguages[l] = `${baseUrl}/${l}/heroes/${champId}`;
    }

    for (const locale of locales) {
      // Main Hero Page
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/heroes/${champId}`,
        lastModified: new Date(),
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

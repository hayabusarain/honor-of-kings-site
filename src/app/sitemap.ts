import { MetadataRoute } from 'next';
import heroesData from '@/data/hok_heroes.json';
import { contentUpdatedAt, statsUpdatedAt } from '@/lib/contentDates';
import { LANE_TIER_PAGES } from '@/content/laneTierPages';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hok.hub-game.com';
  // 主言語の英語を先に並べる
  const locales = ['en', 'ja'];

  // 全URLにビルド時刻を入れると、実際には何も変わっていないのに更新扱いになり、
  // lastModified が更新シグナルとして機能しなくなる。掲載データの更新日を使う。
  // 日付の求め方は src/lib/contentDates.ts に1本化した。以前はここと
  // heroes/[id]/page.tsx で別々に書いていて、キー集合がずれていた
  // （ここは teamCombos を、あちらは site.lastUpdated を落としていた）
  const contentDate = new Date(contentUpdatedAt());
  const statsDate = new Date(statsUpdatedAt());

  const heroIds = heroesData.map((h: { slug?: string; id: string }) => h.slug || h.id).filter(Boolean);

  // Define active static paths (without locale prefix)
  // '/links' は noindex なので載せない（載せると Search Console でカバレッジ警告になる）
  const staticPaths = [
    '',
    '/heroes',
    // 基本ステータス実測一覧（113体・実測値）
    '/heroes/stats',
    '/tier-list',
    // レーン別Tier表（5レーン）。総合ページはタブ切り替えで、
    // 初期HTMLに既定レーン分しか出ないため、レーンごとに固定URLを持たせている
    ...LANE_TIER_PAGES.map(l => `/tier-list/${l.slug}`),
    '/patches',
    '/items',
    '/items/usage',
    '/items/simulator',
    '/arcana',
    '/arcana/calculator',
    '/spells',
    '/guide',
    '/guide/bosses',
    '/guide/beginner-heroes',
    '/esports/asian-games-2026',
    '/about',
    '/terms',
    '/privacy',
    '/legal',
    '/contact',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Pages
  for (const path of staticPaths) {
    // changeFrequency と priority は出さない。Google はどちらも見ないと
    // 明言している。実際に使われるのは lastModified だけなので、
    // 取得日で出し分ける判定だけ残す
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
        lastModified: isHighFrequency ? statsDate : contentDate,
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
        lastModified: contentDate,
        alternates: {
          languages: alternatesLanguages
        }
      });
    }
  }

  return sitemapEntries;
}

import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wildrift.hub-game.com';
  const locales = ['ja', 'en'];
  
  // Set up Supabase Client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  let heroIds: string[] = [];
  
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    // Fetch active heros from stats table to filter out PC LoL only entries
    const { data } = await supabase.from('hero_stats').select('hero_name_en');
    if (data) {
      heroIds = Array.from(new Set(data.map(c => c.hero_name_en))).filter(Boolean);
    }
  }

  // Define active static paths (without locale prefix)
  const staticPaths = [
    '',
    '/heros',
    '/tier-list',
    '/patches',
    '/calculator',
    '/items',
    '/arcanas',
    '/skills',
    '/guide',
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
      alternatesLanguages[l] = `${baseUrl}/${l}/heros/${champId}`;
    }

    // Generate alternates languages object for hero builds page
    const alternatesLanguagesBuilds: Record<string, string> = {};
    for (const l of locales) {
      alternatesLanguagesBuilds[l] = `${baseUrl}/${l}/heros/${champId}/builds`;
    }

    for (const locale of locales) {
      // Main Hero Page
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/heros/${champId}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
          languages: alternatesLanguages
        }
      });
      
      // Hero Builds Page
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/heros/${champId}/builds`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.5,
        alternates: {
          languages: alternatesLanguagesBuilds
        }
      });
    }
  }

  return sitemapEntries;
}

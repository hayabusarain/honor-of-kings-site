import { MetadataRoute } from 'next';
import heroesData from '@/data/hok_heroes.json';
import {
  contentUpdatedAt,
  statsUpdatedAt,
  dataUpdatedAt,
  guidePageUpdatedAt,
  staticPageUpdatedAt,
} from '@/lib/contentDates';
import { LANE_TIER_PAGES } from '@/content/laneTierPages';
import patchMetas from '@/data/patch_meta.json';

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
    // 版ごとのパッチノート。lastModified はその版の日付を使う（下の dateFor）。
    // 解説文を後から直すことはあるが、そのために全版を「今日更新した」ことに
    // するより、実際の版の日付で古いまま出すほうが申告として正しい
    ...(patchMetas as { created_at: string }[]).map(m => `/patches/${m.created_at.slice(0, 10)}`),
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

  /*
   * パスごとの lastModified。
   *
   * 全URLに同じ日付を入れてはいけない。以前は contentUpdatedAt() と
   * statsUpdatedAt() の両方が site.lastUpdated を含んでいて、それが
   * `npm run touch:updated` で毎回当日に上がるため、298URL すべてが同じ日付になり、
   * プッシュのたびに「規約もプライバシーポリシーも今日更新した」と申告していた。
   * 公式は lastmod を「そのページの最後の重要な更新」と定義し、一貫して
   * 検証可能なかたちで正確な場合にだけ使うと書いている。実ページと突き合わせれば
   * 嘘だと分かる申告を続けると、lastmod ごと信用されなくなる。
   * https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
   *
   * ここに無いパスは contentDate（掲載データ全体の更新日）に落ちる。
   * 新しく足したページは実際その日が初出なので、それで正しい。
   */
  const PATCH_PREFIX = '/patches/';
  const latestPatchDate = (patchMetas as { created_at: string }[])
    .map(m => m.created_at.slice(0, 10))
    .sort()
    .at(-1) ?? contentUpdatedAt();

  const FIXED_DATES: Record<string, string> = {
    '/heroes/stats': dataUpdatedAt('baseStats'),
    '/tier-list': statsUpdatedAt(),
    ...Object.fromEntries(LANE_TIER_PAGES.map(l => [`/tier-list/${l.slug}`, statsUpdatedAt()])),
    '/patches': latestPatchDate,
    '/items': dataUpdatedAt('items'),
    '/items/usage': dataUpdatedAt('items', 'itemBuilds'),
    '/items/simulator': dataUpdatedAt('items', 'baseStats'),
    '/arcana': dataUpdatedAt('arcana'),
    '/arcana/calculator': dataUpdatedAt('arcana'),
    '/spells': dataUpdatedAt('spells'),
    '/guide': guidePageUpdatedAt('guide'),
    '/guide/bosses': guidePageUpdatedAt('bosses'),
    '/guide/beginner-heroes': guidePageUpdatedAt('beginnerHeroes'),
    '/esports/asian-games-2026': staticPageUpdatedAt('asianGames2026'),
    '/about': staticPageUpdatedAt('about'),
    '/terms': staticPageUpdatedAt('terms'),
    '/privacy': staticPageUpdatedAt('privacy'),
    '/legal': staticPageUpdatedAt('legal'),
    '/contact': staticPageUpdatedAt('contact'),
  };

  // 版ごとのパッチノートは、URL がそのまま公開日になっている
  const dateFor = (p: string): Date =>
    p.startsWith(PATCH_PREFIX)
      ? new Date(p.slice(PATCH_PREFIX.length))
      : FIXED_DATES[p]
        ? new Date(FIXED_DATES[p])
        : contentDate;

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Pages
  for (const path of staticPaths) {
    // changeFrequency と priority は出さない。Google はどちらも見ないと明言している
    // Generate alternates languages object
    // HTML 側の hreflang には x-default があるので、sitemap でも揃える
    const alternatesLanguages: Record<string, string> = { 'x-default': `${baseUrl}/en${path}` };
    for (const l of locales) {
      alternatesLanguages[l] = `${baseUrl}/${l}${path}`;
    }

    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: dateFor(path),
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

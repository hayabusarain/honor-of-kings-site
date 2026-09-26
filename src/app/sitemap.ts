import { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/basePath';
import heroesData from '@/data/hok_heroes.json';
import {
  contentUpdatedAt,
  statsUpdatedAt,
  dataUpdatedAt,
  guidePageUpdatedAt,
  staticPageUpdatedAt,
  heroUpdatedAt,
  latestOf,
  PAGE_PUBLISHED,
} from '@/lib/contentDates';
import { LANE_TIER_PAGES } from '@/content/laneTierPages';
import { CHANGELOG } from '@/content/changelog';
import { ROLE_LANDINGS } from '@/content/roleLandings';
import { roleLandingUpdatedAt } from '@/lib/roleLanding';
import patchMetas from '@/data/patch_meta.json';

// 静的書き出し（サイト統合）でもファイルとして出す。統合後はポータルの robots.txt がこのサイトマップを束ねる
export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_ORIGIN;
  // 主言語の英語を先に並べる
  const locales = ['en', 'ja'];

  // 全URLにビルド時刻を入れると、実際には何も変わっていないのに更新扱いになり、
  // lastModified が更新シグナルとして機能しなくなる。掲載データの更新日を使う。
  // 日付の求め方は src/lib/contentDates.ts に1本化した。以前はここと
  // heroes/[id]/page.tsx で別々に書いていて、キー集合がずれていた
  // （ここは teamCombos を、あちらは site.lastUpdated を落としていた）
  const contentDate = new Date(contentUpdatedAt());

  const heroes = (heroesData as { id: string; slug?: string }[]).filter((h) => h.slug || h.id);

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
    // 用語集。2026-09-26 に /guide の節から独立させた
    '/guide/glossary',
    // ロール別のヒーロー一覧（6ロール）。文字列で書くと検査17が静的ルートとして突き合わせて
    // 落とすので、LANE_TIER_PAGES と同じく定義から作る。レーン別は /tier-list/[lane] が担う
    ...ROLE_LANDINGS.map((r) => `/heroes/role/${r.slug}`),
    '/esports/asian-games-2026',
    // よくある質問の索引。全文は各ページの末尾にある（src/content/faq.ts）
    '/faq',
    // ヒーロー2体の比較。選んだ2体はクエリ（?h=）で持つので、載せるのは素のURLだけ
    '/compare',
    // サイトの更新履歴（src/content/changelog.ts）
    '/updates',
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
   * ここに無いパス（トップ・ヒーロー一覧・FAQ索引）は contentDate に落ちる。
   * site.lastUpdated を含むので、プッシュのたびに当日になる。
   * 新しいページを足したら、ここに日付の出どころを1行足すこと。
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
    '/guide/glossary': guidePageUpdatedAt('glossary'),
    // ロールの内訳は公式統計と、そのロールのヒーローの追加日から作る（src/lib/roleLanding.ts）
    ...Object.fromEntries(ROLE_LANDINGS.map((r) => [`/heroes/role/${r.slug}`, roleLandingUpdatedAt(r)])),
    // 比較表に出るのは基本ステータスと公式統計。どちらの取得日もページの初出より古い
    '/compare': latestOf(PAGE_PUBLISHED.compare, dataUpdatedAt('baseStats'), statsUpdatedAt()),
    // 中身は更新履歴の行そのものなので、いちばん新しい行の日付
    '/updates': latestOf(...CHANGELOG.map((e) => e.date)),
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
  // lastModified はヒーローごとに、そのページに載るデータの日付を使う（heroUpdatedAt）。
  // 以前は contentDate の一律で、プッシュのたびに236URLが全部当日になっていた
  for (const hero of heroes) {
    const champId = hero.slug || hero.id;
    const heroDate = new Date(heroUpdatedAt(hero.id));
    const alternatesLanguages: Record<string, string> = { 'x-default': `${baseUrl}/en/heroes/${champId}` };
    for (const l of locales) {
      alternatesLanguages[l] = `${baseUrl}/${l}/heroes/${champId}`;
    }

    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/heroes/${champId}`,
        lastModified: heroDate,
        alternates: {
          languages: alternatesLanguages
        }
      });
    }
  }

  return sitemapEntries;
}

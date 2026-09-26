import { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/basePath';

// 静的書き出し（サイト統合）でもファイルとして出す。統合後はドメイン直下の robots.txt をポータルが出すので、
// /hok/robots.txt は検索エンジンに読まれない（残しても害は無い。docs/CONSOLIDATION_PLAN.md）
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /api/latest はポータル向けのJSONで、読み物ではない。
      // インデックスされると Search Console のカバレッジにノイズが増える。
      //
      // 2026-09-02 に /api/og を廃止し、OGP画像は各ルートの
      // opengraph-image.tsx がビルド時に焼く静的PNGになった。
      // /api/ 配下の実ルートは latest の1本だけ。
      // それでも '/api/' と丸ごと書かず対象を直接書くのは、あとで別の
      // API を足したときに、意図せず巻き添えで禁止しないため
      disallow: ['/api/latest'],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}

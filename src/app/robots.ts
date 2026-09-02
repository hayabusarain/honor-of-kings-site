import { MetadataRoute } from 'next';

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
    sitemap: 'https://hok.hub-game.com/sitemap.xml',
  };
}

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /api/latest はポータル向けのJSONで、読み物ではない。
      // インデックスされると Search Console のカバレッジにノイズが増える
      disallow: ['/api/'],
    },
    sitemap: 'https://hok.hub-game.com/sitemap.xml',
  };
}

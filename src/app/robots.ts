import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /api/latest はポータル向けのJSONで、読み物ではない。
      // インデックスされると Search Console のカバレッジにノイズが増える。
      //
      // /api/ を丸ごと禁止しない。/api/og が OGP画像を返しており、
      // facebookexternalhit と Twitterbot が取りに来られなくなる。
      // Allow で上書きする書き方は取らない。両者の robots パーサが
      // Allow の最長一致を守る保証が無いため、禁止対象を直接書くほうが確実。
      // 実ルートは latest と og の2本だけなので過不足も出ない
      disallow: ['/api/latest'],
    },
    sitemap: 'https://hok.hub-game.com/sitemap.xml',
  };
}

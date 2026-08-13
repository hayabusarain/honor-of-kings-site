import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.0.25', 'localhost:3000', '127.0.0.1:3000', '192.168.0.25:3000'],
  // 機能削除で消えたURLの301リダイレクト。
  // Google にインデックスされていた旧URLが404になり Search Console で
  // 報告されたため、後継ページへ恒久リダイレクトして評価を引き継ぐ
  async redirects() {
    return [
      {
        source: '/:locale(ja|en)/heroes/:id/builds',
        destination: '/:locale/heroes/:id',
        permanent: true,
      },
      {
        source: '/:locale(ja|en)/admin/:path*',
        destination: '/:locale',
        permanent: true,
      },
      {
        source: '/:locale(ja|en)/modes/aram',
        destination: '/:locale/guide',
        permanent: true,
      },
      {
        source: '/:locale(ja|en)/crop',
        destination: '/:locale',
        permanent: true,
      },
      {
        // /skills は /spells とほぼ同一データの重複ページだったため統合
        source: '/:locale(ja|en)/skills',
        destination: '/:locale/spells',
        permanent: true,
      },
    ];
  },
  /* config options here */
  outputFileTracingExcludes: {
    '*': [
      './scratch/**/*'
    ]
  },
  images: {
    unoptimized: true,
    // remotePatterns は意図的に空にしてある。
    // かつて game.gtimg.cn（Tencent CDN）を許可していたが、スキンギャラリーとアルカナ
    // アイコンの撤去で参照元が全て消えたため、宣言だけが残っていた。
    //
    // 注意: unoptimized: true のとき next/image は最適化器を通らないので、remotePatterns の
    // 検証（hasRemoteMatch）はそもそも実行されない。ここを空にしても外部URLの直リンクは
    // 技術的には止められない。実際に止めているのは scripts/audit.mjs の外部画像ホスト検査で、
    // CI が push ごとに走る。掲載画像は public/images/ 配下の自前ホストだけに限定する。
    remotePatterns: []
  }
};

export default withNextIntl(nextConfig);

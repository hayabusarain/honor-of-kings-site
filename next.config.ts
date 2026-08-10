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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'game.gtimg.cn',
      }
    ]
  }
};

export default withNextIntl(nextConfig);

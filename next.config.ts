import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.0.25', 'localhost:3000', '127.0.0.1:3000', '192.168.0.25:3000'],
  /* config options here */
  outputFileTracingExcludes: {
    '*': [
      './public/images/items/raw/**/*',
      './scratch/**/*'
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'game.gtimg.cn',
      },
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
      }
    ]
  }
};

export default withNextIntl(nextConfig);

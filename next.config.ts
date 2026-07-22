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
  }
};

export default withNextIntl(nextConfig);

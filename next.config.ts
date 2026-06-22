import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingExcludes: {
    '*': [
      './public/images/items/raw/**/*',
      './scratch/**/*'
    ]
  }
};

export default withNextIntl(nextConfig);

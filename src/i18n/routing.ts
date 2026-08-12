import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ja'],
  // 英語を主言語にする。日本での競技人口に対し英語圏の方が桁違いに大きいため。
  // URL は元から /en /ja の両方が前置されるので、既存の /ja/... はそのまま生きる。
  // 変わるのは「/」の行き先と、ロケールが解決できなかったときの既定値だけ。
  defaultLocale: 'en'
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

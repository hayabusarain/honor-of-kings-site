import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ja'],
  // 英語を主言語にする。日本での競技人口に対し英語圏の方が桁違いに大きいため。
  // URL は元から /en /ja の両方が前置されるので、既存の /ja/... はそのまま生きる。
  // 変わるのは「/」の行き先と、ロケールが解決できなかったときの既定値だけ。
  defaultLocale: 'en',
  // ミドルウェアによる Link ヘッダーの hreflang 出力を止める。
  // このヘッダーは x-default を接頭辞なしの /heroes/mulan（307で /en/... へ飛ぶURL）に
  // 向けるため、各ページの <link rel="alternate"> が出す x-default（/en/heroes/mulan）と
  // 食い違い、クローラーに矛盾した情報を渡していた。hreflang は HTML 側に一本化する。
  alternateLinks: false
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

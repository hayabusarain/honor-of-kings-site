import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { createElement, type ComponentProps } from 'react';
import { STATIC_EXPORT } from '@/lib/basePath';

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

const navigation = createNavigation(routing);
export const { redirect, usePathname, useRouter } = navigation;
const NavLink = navigation.Link;

/**
 * next-intl の Link の包み。静的書き出し（サイト統合後の Cloudflare）のときだけ、先読みを既定で止める。
 * Next 16 の静的書き出しは、先読み用の RSC ペイロードを実在しないパスへ取りに行き 404 を並べる
 * （vercel/next.js#85374。MLBB で実測、src/lib/prefetchPolicy.ts）。遷移そのものは通常の読み込みに落ちて正しく動く。
 * サーバーのある今の本番（Vercel）では何も変えない。prefetch を明示したリンクはその値を使う。
 * Next 側が直ったら、この包みを外して navigation.Link をそのまま出す
 */
export function Link(props: ComponentProps<typeof NavLink>) {
  return createElement(NavLink, STATIC_EXPORT && props.prefetch === undefined ? { ...props, prefetch: false } : props);
}

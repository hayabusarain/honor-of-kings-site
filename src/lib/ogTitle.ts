import type { Metadata } from 'next';

/**
 * Metadata の title から文字列を取り出す。
 *
 * buildPageMetadata は absoluteTitle の有無で `string` と `{ absolute }` を
 * 使い分けるので、opengraph-image.tsx 側はどちらでも受けられる必要がある。
 * 取り出せなければ空文字を返し、呼び出し側（renderOgImage）が既定の見出しを出す。
 */
export function ogTitleOf(md: Metadata): string {
  const t = md?.title;
  if (typeof t === 'string') return t;
  if (t && typeof t === 'object' && 'absolute' in t && typeof t.absolute === 'string') {
    return t.absolute;
  }
  return '';
}

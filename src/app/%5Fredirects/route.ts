import fs from 'node:fs';
import path from 'node:path';
import { buildRedirects } from '@/lib/redirectRules';
import { routing } from '@/i18n/routing';

/**
 * Cloudflare の _redirects を書き出す（サイト統合後の静的書き出し用、2026-09-27）。
 *
 * フォルダ名の %5F は「_」。App Router は _ で始まるフォルダをルートにしないので、この書き方で /_redirects を作る。
 * 静的書き出しでは out/_redirects になり、scripts/postbuild_basepath.mjs が各行に前置き（/hok）を付けて dist/ 直下へ置く。
 * サーバーのある今の本番（Vercel）では next.config の redirects() と src/proxy.ts が同じ仕事をしているので、この出力は使わない
 * （/_redirects は proxy が言語付きへ送るので、読者に見えることも無い）。
 *
 * 中身は3つ。上から順に最初に一致したものが使われる。
 * 1. 旧 URL の恒久転送（src/lib/redirectRules.ts。next.config と同じ一覧）。:locale(ja|en) は ja と en の2行に展開する
 * 2. 言語の付いていないパス（/heroes など）→ 既定の言語。今は proxy.ts がブラウザの言語で振り分けているが、
 *    静的書き出しではそれができないので既定の言語へ送る。/hok の入口だけは、入口の小さなスクリプトがブラウザの言語で振り分ける（計画の6章）
 * 3. / → 既定の言語
 */
export const dynamic = 'force-static';

const LOCALES = routing.locales;
const FALLBACK = routing.defaultLocale;

/** Next の書式（:path*）を Cloudflare の書式（* と :splat）に直す */
const toSource = (s: string) => s.replace(/\/:path\*$/, '/*');
const toDestination = (d: string) => d.replace(/:path\*/g, ':splat');

function lines(): string[] {
  const staticLines: string[] = [];
  const dynamicLines: string[] = [];
  for (const r of buildRedirects()) {
    const status = r.permanent ? 301 : 302;
    for (const locale of LOCALES) {
      const source = toSource(r.source.replace(':locale(ja|en)', locale));
      const destination = toDestination(r.destination.replace(':locale', locale));
      const line = `${source} ${destination} ${status}`;
      (/[:*]/.test(source) ? dynamicLines : staticLines).push(line);
    }
  }

  // [locale] の下の最上位のフォルダ（heroes・tier-list など）。_ ( [ で始まるものはルートにならないので除く
  const segments = fs
    .readdirSync(path.join(process.cwd(), 'src', 'app', '[locale]'), { withFileTypes: true })
    .filter((e) => e.isDirectory() && !/^[_([]/.test(e.name))
    .map((e) => e.name)
    .sort();
  const localeless = segments.flatMap((s) => [`/${s} /${FALLBACK}/${s} 302`, `/${s}/* /${FALLBACK}/${s}/:splat 302`]);

  return [
    '# 旧 URL の恒久転送（src/lib/redirectRules.ts）',
    ...staticLines,
    ...dynamicLines,
    '# 言語の付いていないパス → 既定の言語',
    ...localeless,
    '# トップ → 既定の言語（/hok の入口は、入口のスクリプトがブラウザの言語で振り分ける）',
    `/ /${FALLBACK} 302`,
  ];
}

export function GET() {
  return new Response(lines().join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

import fs from 'node:fs';
import path from 'node:path';
import { buildRedirects, type RedirectRule } from '@/lib/redirectRules';
import { routing } from '@/i18n/routing';

/**
 * Cloudflare の _redirects を書き出す（サイト統合後の静的書き出し用、2026-09-27）。
 *
 * フォルダ名の %5F は「_」。App Router は _ で始まるフォルダをルートにしないので、この書き方で /_redirects を作る。
 * 静的書き出しでは out/_redirects になり、scripts/postbuild_basepath.mjs が各行に前置き（/hok）を付けて dist/ 直下へ置く。
 * サーバーのある今の本番（Vercel）では next.config の redirects() と src/proxy.ts が同じ仕事をしているので、この出力は使わない
 * （/_redirects は proxy が言語付きへ送るので、読者に見えることも無い）。
 *
 * 中身:
 * 1. 旧 URL の恒久転送（src/lib/redirectRules.ts。next.config と同じ一覧）。:locale(ja|en) は ja と en の2行に展開する。
 *    Next の /:path* は0段にも一致するが、Cloudflare の /* は一致しない。/ja/admin のような素のパスの行も出す
 * 2. 言語の付いていない旧 URL（/skills・/calculator など、今は無いページ）→ 既定の言語の最終の行き先へ1段で。
 *    今の本番では proxy が言語付きへ送り、そこから 1 の転送が効いていた
 * 3. 言語の付いていないパス（/heroes など）→ 既定の言語。静的書き出しではブラウザの言語で振り分けられないので既定の言語へ送る。
 *    /hok の入口だけは、入口の小さなスクリプトがブラウザの言語で振り分ける（計画の6章）
 * 4. / → 既定の言語
 *
 * 並びは「完全一致の行をすべて先、:id や * を含む行を後」。Cloudflare（wrangler）は動的な行が1本でも出ると、
 * それより後の完全一致の行も動的な規則として扱い、上限（動的100本）に数え、リクエストのたびに正規表現で試す。
 * 行どうしの重なりは無いので、並べ替えても行き先は変わらない（2026-09-27 の反証で確認）。
 *
 * 末尾スラッシュ付きの旧 URL（/ja/heroes/105/）は拾わない。静的な行が倍（約1,450本、上限2,000本）になるわりに、
 * 旧サイトの Next.js が末尾スラッシュを外していたので外部に残っている見込みが薄い。今ある URL の末尾スラッシュは
 * Workers の html_handling（auto-trailing-slash）が外す
 */
export const dynamic = 'force-static';

const LOCALES = routing.locales;
const FALLBACK = routing.defaultLocale;
const LOCALE_SOURCE = '/:locale(ja|en)';

/** Next の書式（:path*）を Cloudflare の書式（* と :splat）に直す */
const toSource = (s: string) => s.replace(/\/:path\*$/, '/*');
const toDestination = (d: string) => d.replace(/:path\*/g, ':splat');
const isDynamic = (source: string) => /[:*]/.test(source);

/** 1本の規則を Cloudflare の行にする。/:path* で終わる規則は、素のパスの行も出す */
function expand(source: string, destination: string, status: number): string[] {
  const out = [`${toSource(source)} ${toDestination(destination)} ${status}`];
  if (source.endsWith('/:path*')) out.push(`${source.slice(0, -'/:path*'.length)} ${toDestination(destination)} ${status}`);
  return out;
}

function lines(): string[] {
  // [locale] の下の最上位のフォルダ（heroes・tier-list など）。_ ( [ で始まるものはルートにならないので除く
  const segments = fs
    .readdirSync(path.join(process.cwd(), 'src', 'app', '[locale]'), { withFileTypes: true })
    .filter((e) => e.isDirectory() && !/^[_([]/.test(e.name))
    .map((e) => e.name)
    .sort();
  const segmentSet = new Set(segments);

  const all: string[] = [];
  const rules: RedirectRule[] = buildRedirects();

  // 1. 旧 URL（言語付き）
  for (const r of rules) {
    const status = r.permanent ? 301 : 302;
    for (const locale of LOCALES) {
      all.push(...expand(r.source.replace(LOCALE_SOURCE, `/${locale}`), r.destination.replace(':locale', locale), status));
    }
  }
  // 2. 言語の付いていない旧 URL（今は無いページだけ。今あるフォルダの下は 3 が既定の言語へ送り、そこから 1 が効く）
  for (const r of rules) {
    if (!r.source.startsWith(`${LOCALE_SOURCE}/`)) continue;
    const rest = r.source.slice(LOCALE_SOURCE.length);
    if (segmentSet.has(rest.split('/')[1])) continue;
    all.push(...expand(rest, r.destination.replace(':locale', FALLBACK), r.permanent ? 301 : 302));
  }
  // 3. 言語の付いていないパス → 既定の言語
  for (const s of segments) all.push(`/${s} /${FALLBACK}/${s} 302`, `/${s}/* /${FALLBACK}/${s}/:splat 302`);
  // 4. トップ → 既定の言語（/hok の入口は、入口のスクリプトがブラウザの言語で振り分ける）
  all.push(`/ /${FALLBACK} 302`);

  const staticLines = all.filter((l) => !isDynamic(l.split(' ')[0]));
  const dynamicLines = all.filter((l) => isDynamic(l.split(' ')[0]));
  return [
    `# 完全一致の行（${staticLines.length} 本）。動的な行より先に置く`,
    ...staticLines,
    `# :id や * を含む行（${dynamicLines.length} 本）`,
    ...dynamicLines,
  ];
}

export function GET() {
  return new Response(lines().join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

/**
 * サイト統合（2026-09-27 運営者了承）の書き出し後の後処理。
 *
 * このファイルは Desktop/hub-game-rules/shared/scripts から配られている。
 * 手で編集せず、正本を直して node sync.mjs を実行すること。
 * 計画の全体は HoK のリポジトリの docs/CONSOLIDATION_PLAN.md（7章に MLBB の試作の結果）。
 *
 * 統合後は hub-game.com の下で、Workers の静的アセットがパスごとに各サイトを配る
 * （ルート hub-game.com/hok* → HoK の Worker、置き場所は dist/hok/。mlbb・wildrift も同じ）。
 * next build は basePath を付けても out/ の中に前置きの階層を作らないので、ここで写し直す。
 *
 * NEXT_PUBLIC_BASE_PATH が無ければ何もしない（今のサブドメイン向けのビルドはそのまま out/ を配る）。
 * 前置きとドメインはビルド時の環境変数で切り替える:
 *   NEXT_PUBLIC_BASE_PATH=/hok  NEXT_PUBLIC_SITE_ORIGIN=https://hub-game.com
 *
 * 1. out/* を dist/<前置き>/ へ写す
 * 2. out/_redirects と out/_headers の規則に前置きを付けて dist/ の直下に置く
 *    （Workers の静的アセットは、アセットのディレクトリの直下にあるものを読む。試作で確認）
 * 3. manifest*.json の id・start_url・scope・アイコン・ショートカットに前置きを付ける
 * 4. 全ページの canonical・og:url・og:image・twitter:image が「オリジン＋前置き」で始まるかを検査し、ずれたらビルドを止める
 *    （Turbopack はファイルで置いた OGP 画像の URL に basePath を付けず、webpack は付ける。どちらかに寄せ損ねると
 *     前置きが抜けるか /hok/hok になる。metadataBase を前置き込みにしておくのが Turbopack での正解）
 *
 * 使い方: package.json に "postbuild": "node scripts/postbuild_basepath.mjs" を足す（npm run build の後に自動で走る）。
 * 前提は next.config の output: 'export' と、basePath を同じ環境変数から読むこと。
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
if (!BASE) {
  console.log('[postbuild_basepath] NEXT_PUBLIC_BASE_PATH が無いので何もしない');
  process.exit(0);
}
if (!/^\/[a-z0-9-]+$/.test(BASE)) throw new Error(`前置きの形が不正: ${BASE}（/hok のように / で始まる英小文字）`);

const OUT = 'out';
const DIST = 'dist';
const TARGET = path.join(DIST, BASE.slice(1));
if (!fs.existsSync(OUT)) {
  throw new Error(`${OUT}/ が無い。next.config を output: 'export' にしてからビルドする（静的書き出しの出力を写し直すための後処理）`);
}

// fs.cpSync は使わない。Node 24 の Windows では、日本語を含むパス（オナーオブキングスサイト・モバレサイト・ワイリフサイト）で
// フォルダを写すと、何も出さずに終了コード 127 で落ちる（2026-09-27 に HoK で確認。英数字だけのパスの試作では通っていた）。
// ファイルを1つずつ写す
const copyDir = (from, to) => {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, e.name);
    const dst = path.join(to, e.name);
    if (e.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
};

fs.rmSync(DIST, { recursive: true, force: true });
copyDir(OUT, TARGET);

const prefix = (p) => (p === '/' ? BASE : p.startsWith('/') && !p.startsWith('//') ? `${BASE}${p}` : p);

// _redirects: 「元 先 [状態]」の行。元と先の両方に前置きを付ける。
// 元が / の行は、/hok と /hok/ の2行にする（どちらで来てもトップの転送に当てる）
const redirectsSrc = path.join(TARGET, '_redirects');
if (fs.existsSync(redirectsSrc)) {
  const out = [`# サイト統合の後処理（scripts/postbuild_basepath.mjs）が public/_redirects に前置き ${BASE} を付けたもの`];
  for (const line of fs.readFileSync(redirectsSrc, 'utf8').split(/\r?\n/)) {
    const cols = line.trim().split(/\s+/);
    if (!line.trim() || line.trim().startsWith('#') || cols.length < 2) {
      out.push(line);
      continue;
    }
    const [from, to, ...rest] = cols;
    out.push([prefix(from), prefix(to), ...rest].join(' '));
    if (from === '/') out.push([`${BASE}/`, prefix(to), ...rest].join(' '));
  }
  fs.writeFileSync(path.join(DIST, '_redirects'), out.join('\n'));
  fs.rmSync(redirectsSrc);
}

// _headers: 行頭が / の行がパス。字下げした行はヘッダーなので触らない
const headersSrc = path.join(TARGET, '_headers');
if (fs.existsSync(headersSrc)) {
  const out = [`# サイト統合の後処理（scripts/postbuild_basepath.mjs）が public/_headers に前置き ${BASE} を付けたもの`];
  for (const line of fs.readFileSync(headersSrc, 'utf8').split(/\r?\n/)) {
    out.push(line.startsWith('/') ? prefix(line) : line);
  }
  fs.writeFileSync(path.join(DIST, '_headers'), out.join('\n'));
  fs.rmSync(headersSrc);
}

// manifest: ルート相対のパスに前置きを付ける。id も変わるので、統合前にホーム画面へ追加したものとは別のアプリになる
let manifests = 0;
for (const name of fs.readdirSync(TARGET).filter((n) => /^manifest.*\.(json|webmanifest)$/.test(n))) {
  const p = path.join(TARGET, name);
  const m = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const k of ['id', 'start_url', 'scope']) if (typeof m[k] === 'string') m[k] = prefix(m[k]);
  if (!m.scope) m.scope = `${BASE}/`;
  for (const list of ['icons', 'screenshots']) for (const i of m[list] ?? []) if (i.src) i.src = prefix(i.src);
  for (const s of m.shortcuts ?? []) {
    if (s.url) s.url = prefix(s.url);
    for (const i of s.icons ?? []) if (i.src) i.src = prefix(i.src);
  }
  fs.writeFileSync(p, JSON.stringify(m, null, 2));
  manifests++;
}

// 検査: 全ページの canonical・og:url・og:image・twitter:image が「オリジン＋前置き」で始まり、前置きが二重になっていないか
const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? '';
const want = `${ORIGIN}${BASE}/`;
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const files = walk(TARGET);
const bad = [];
let checked = 0;
for (const f of files.filter((n) => n.endsWith('.html'))) {
  const html = fs.readFileSync(f, 'utf8');
  const urls = [...html.matchAll(/<(?:link rel="canonical" href|meta property="og:(?:url|image)" content|meta name="twitter:image" content)="([^"]+)"/g)].map((m) => m[1]);
  for (const u of urls) {
    checked++;
    if (!ORIGIN || !u.startsWith(want) || u.includes(`${BASE}${BASE}/`)) bad.push(`${path.relative(TARGET, f)}: ${u}`);
  }
}
if (bad.length) {
  console.error(`[postbuild_basepath] 前置きのずれた URL が ${bad.length} 件（期待: ${want}…）`);
  for (const b of bad.slice(0, 10)) console.error(`  ${b}`);
  process.exit(1);
}

console.log(`[postbuild_basepath] canonical・og:url・og:image・twitter:image ${checked} 件がすべて ${want} で始まる`);
console.log(`[postbuild_basepath] ${OUT}/ → ${TARGET}/（${files.length} ファイル）、_redirects と _headers を ${DIST}/ 直下へ、manifest ${manifests} 本に前置き ${BASE}`);

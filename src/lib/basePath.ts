/**
 * サイト統合（2026-09-27 運営者了承）の前置きとオリジン。
 *
 * 統合後の HoK Hub は https://hub-game.com/hok/ja/… になる（ポータルが直下、MLBB が /mlbb、Wild Rift が /wildrift）。
 * 値はビルド時の環境変数で切り替える。どちらも無ければ、今の hok.hub-game.com（Vercel、サーバーあり）向けにビルドされる。
 * このため、このコードを main に入れても今の本番は壊れない。切り替え日に Cloudflare のビルドへ
 *   NEXT_PUBLIC_BASE_PATH=/hok
 *   NEXT_PUBLIC_SITE_ORIGIN=https://hub-game.com
 * を入れる。前置きがあるときは next.config.ts が静的書き出し（output: 'export'）に切り替わり、
 * 書き出し後に scripts/postbuild_basepath.mjs（hub-game-rules から配布）が out/ を dist/hok/ へ写す。
 *
 * 計画の全体は docs/CONSOLIDATION_PLAN.md（7章に MLBB の試作の結果）。
 */

/** 前置き。統合後は '/hok'、今は ''（next.config の basePath と同じ値） */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** 前置きがあるとき（= Cloudflare への静的書き出し）だけ true。サーバーの機能（proxy・redirects・ISR）は使えない */
export const STATIC_EXPORT = BASE_PATH !== '';

/** ドメイン（オリジン） */
export const ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://hok.hub-game.com';

/**
 * サイトの入口の URL（オリジン＋前置き）。metadataBase・JSON-LD・サイトマップ・共有 URL に使う。
 * metadataBase も前置き込みにする。Turbopack（Next 16.3.6）はファイルで置いた OGP 画像の URL に basePath を付けないため
 * （MLBB の試作で確認）。webpack は付けるので、ビルド方式を変えると /hok/hok になる。postbuild_basepath.mjs の検査が止める
 */
export const SITE_ORIGIN = `${ORIGIN}${BASE_PATH}`;

/** 画面に出すサイトの所在（https:// を外したもの。今は hok.hub-game.com、統合後は hub-game.com/hok） */
export const SITE_LABEL = SITE_ORIGIN.slice(SITE_ORIGIN.indexOf('//') + 2);

/**
 * Atom フィードの id に使う旧オリジン。id はエントリーの恒久的な識別子なので、ドメインが変わっても変えない。
 * 変えるとフィードリーダーで全エントリーが新着として出直す
 */
export const FEED_ID_ORIGIN = 'https://hok.hub-game.com';

/**
 * ルート相対のパス（/images/… や /ja/…）に前置きを付ける。
 *
 * next/link と next-intl の Link、next/router には Next が自動で付ける。
 * 付かないのは、next/image の src、画像の読み込み失敗時の src の差し替え、<link href> の直書き、
 * fetch、location の比較、Service Worker の登録。外部 URL（https://…、//…）とすでに前置きの付いたパスはそのまま返す
 */
export function withBasePath(path: string): string {
  if (!BASE_PATH || !path.startsWith('/') || path.startsWith('//')) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}

/** location.pathname から前置きを外す（言語の判定などに使う） */
export function stripBasePath(pathname: string): string {
  if (!BASE_PATH) return pathname;
  if (pathname === BASE_PATH) return '/';
  return pathname.startsWith(`${BASE_PATH}/`) ? pathname.slice(BASE_PATH.length) : pathname;
}

/** ヒーロー画像が読めなかったときの代わり（前置き込み） */
export const DEFAULT_HERO_IMAGE = withBasePath('/images/heroes/default.webp');

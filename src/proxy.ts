import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// next-intl のミドルウェア。
// これが無いとサーバーコンポーネントのページで requestLocale が解決できず、
// ページが defaultLocale にフォールバックして意図しない言語で表示される。
export default createMiddleware(routing);

export const config = {
  // API・Next内部・静的ファイル（拡張子付き）に加えて、
  // **すでに /en /ja が付いているパスも除外する**。
  //
  // 全ページが静的でCDNから返るのに、以前はHTMLの全リクエストでミドルウェアが
  // 起動していた（232体のヒーロー詳細を含む全ページ×全訪問）。Vercel の
  // Fluid Active CPU がこれで枯渇した。接頭辞つきのパスでミドルウェアに
  // させる仕事は無い。生成HTMLを検査したところ、内部リンクは全て接頭辞つきで、
  // 除外しても遷移は壊れない（2026-09-02 実測）。
  //
  // 残るのは「/」と、接頭辞なしで外から来たURLの言語判定だけ。
  // これは Accept-Language を読むのでビルド時には解決できず、
  // next.config の redirects では代替できない。
  //
  // 副作用: next-intl が NEXT_LOCALE cookie を更新する機会が減るため、
  // 言語を切り替えたあとに「/」へ来ても記憶が効かないことがある。
  // その場合は Accept-Language での判定に戻る。許容する判断（ユーザー確認済み）。
  matcher: ['/((?!api|_next|_vercel|(?:en|ja)(?:/|$)|.*\\..*).*)'],
};

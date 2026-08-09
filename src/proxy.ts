import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// next-intl のミドルウェア。
// これが無いとサーバーコンポーネントのページで requestLocale が解決できず、
// EN ページが defaultLocale (ja) にフォールバックして日本語表示になる不具合があった。
export default createMiddleware(routing);

export const config = {
  // API・Next内部・静的ファイル（拡張子付き）を除く全パスに適用
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

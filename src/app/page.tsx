import { redirect } from 'next/navigation';

// 注意: このファイルは「/」へのアクセスでは実行されない。
// src/proxy.ts の matcher '/((?!api|_next|_vercel|.*\\..*).*)' が「/」に一致し、
// next-intl のミドルウェアが先に言語判定してリダイレクトするため。
//
// 2026-08-15 の監査で「307 ではなく 308 にすべき」と指摘され permanentRedirect に
// 変えたが、実測すると 307 のままだった（上記の理由）。加えて、この 307 は正しい。
// next-intl は NEXT_LOCALE cookie → Accept-Language の順で行き先を決めるので、
// 日本語環境は /ja、英語環境は /en に散る。308 にするとブラウザが「/ → /en」を
// 恒久キャッシュしてしまい、言語判定が効かなくなる。
//
// ここはミドルウェアが動かない場合のフォールバックとしてのみ残す。
export default function RootPage() {
  redirect('/en');
}

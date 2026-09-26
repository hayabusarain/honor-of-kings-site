import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { buildRedirects } from './src/lib/redirectRules';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // サイト統合（2026-09-27）。NEXT_PUBLIC_BASE_PATH があるときだけ静的書き出しに切り替え、前置き（/hok）を付ける。
  // 無ければ今の Vercel（サーバーあり）向けのまま。src/lib/basePath.ts と scripts/postbuild_basepath.mjs も同じ変数を読む。
  // 静的書き出しでは下の redirects() と headers() が効かないので、同じ中身を src/app/%5Fredirects と %5Fheaders が
  // Cloudflare の _redirects・_headers の書式で書き出す
  ...(process.env.NEXT_PUBLIC_BASE_PATH ? { output: 'export' as const, basePath: process.env.NEXT_PUBLIC_BASE_PATH } : {}),
  // src/app/global-not-found.tsx を使うためのフラグ（Next 16 では experimental）。
  // 無効だと404は <html id="__next_error__"> というエラーシェルになり、
  // サーバーが返すHTMLの可視テキストが <title> の57文字だけになる。
  // 本文も復帰リンクも RSC ペイロードの中にしか入らず、JavaScript を
  // 実行しないクローラーと読者には空白のページが届く。
  // 将来このフラグが外れたときは src/app/not-found.tsx が落とし先になる。
  experimental: {
    globalNotFound: true,
    // 静的生成のワーカー数を4に絞る。既定はコア数に追随し、この機械では11本
    // 立っていた。OGP画像をビルド時に焼くようにしたので、1ワーカーが satori と
    // resvg を抱えて数百MB使う。11本並ぶとメモリが尽きてビルドが落ちる。
    // 落ちるときは無言で終わるのではなく OOM で止まるため原因が分かりにくい。
    // 速さより完走を取る。
    cpus: 4,
  },
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.0.25', 'localhost:3000', '127.0.0.1:3000', '192.168.0.25:3000'],
  // 機能削除で消えたURLの301リダイレクト。
  // Google にインデックスされていた旧URLが404になり Search Console で
  // 報告されたため、後継ページへ恒久リダイレクトして評価を引き継ぐ
  // 旧 URL からの恒久転送。一覧は src/lib/redirectRules.ts（静的書き出しの _redirects と共通）
  async redirects() {
    return buildRedirects();
  },
  // public/ 配下はURLにハッシュが付かないため、Vercel の既定では
  // Cache-Control: max-age=0, must-revalidate になる。ヒーロー一覧は116枚を並べるので、
  // 再訪のたびに116本の条件付きGETが飛び、ディスクキャッシュから即復元できない。
  // 画像を差し替える運用があるので immutable は使わず、1週間で見直させる
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
  // 本番ビルドから console.log を落とす。warn / error は障害調査に要るので残す。
  // 全ページ共通の PwaRegister が登録成功のたびにログを出しており、
  // 本番の全訪問者のコンソールに毎回出ていた。今後の混入もここで止まる
  compiler: {
    removeConsole: { exclude: ['warn', 'error'] },
  },
  /* config options here */
  outputFileTracingExcludes: {
    '*': [
      './scratch/**/*'
    ]
  },
  images: {
    unoptimized: true,
    // remotePatterns は意図的に空にしてある。
    // かつて game.gtimg.cn（Tencent CDN）を許可していたが、スキンギャラリーとアルカナ
    // アイコンの撤去で参照元が全て消えたため、宣言だけが残っていた。
    //
    // 注意: unoptimized: true のとき next/image は最適化器を通らないので、remotePatterns の
    // 検証（hasRemoteMatch）はそもそも実行されない。ここを空にしても外部URLの直リンクは
    // 技術的には止められない。実際に止めているのは scripts/audit.mjs の外部画像ホスト検査で、
    // CI が push ごとに走る。掲載画像は public/images/ 配下の自前ホストだけに限定する。
    remotePatterns: []
  }
};

export default withNextIntl(nextConfig);

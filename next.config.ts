import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import hokHeroes from './src/data/hok_heroes.json';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.0.25', 'localhost:3000', '127.0.0.1:3000', '192.168.0.25:3000'],
  // 機能削除で消えたURLの301リダイレクト。
  // Google にインデックスされていた旧URLが404になり Search Console で
  // 報告されたため、後継ページへ恒久リダイレクトして評価を引き継ぐ
  async redirects() {
    // ヒーロー詳細の数値ID → slug の301。canonical・内部リンク・sitemapはslugに
    // 統一済みだが、旧ID URLは200で同一本文を返し続けており、外部から張られた
    // 旧リンクの評価が301より弱いcanonical頼みになっていた。
    // hok_heroes.json からビルド時に生成する（116本）
    const heroIdRedirects = (hokHeroes as { id: string; slug?: string }[])
      .filter((h) => h.slug && h.slug !== h.id)
      .map((h) => ({
        source: `/:locale(ja|en)/heroes/${h.id}`,
        destination: `/:locale/heroes/${h.slug}`,
        permanent: true,
      }));

    // 旧 /heroes/{数値ID}/builds が「builds除去 → ID→slug」の2段リダイレクトに
    // ならないよう、slug へ直接送る本数を先に並べる（リダイレクトは最初の
    // 1件しか適用されないため、これが builds の汎用ルールより先にヒットする）
    const heroBuildsRedirects = (hokHeroes as { id: string; slug?: string }[])
      .filter((h) => h.slug && h.slug !== h.id)
      .map((h) => ({
        source: `/:locale(ja|en)/heroes/${h.id}/builds`,
        destination: `/:locale/heroes/${h.slug}`,
        permanent: true,
      }));

    return [
      ...heroBuildsRedirects,
      ...heroIdRedirects,
      {
        source: '/:locale(ja|en)/heroes/:id/builds',
        destination: '/:locale/heroes/:id',
        permanent: true,
      },
      {
        // /guide/macro は /guide のゲームの流れ＋レーン解説とほぼ全面的に重複していた。
        // インデックス済みなので、削除ではなく統合先へ送る（2026-08-23）
        source: '/:locale(ja|en)/guide/macro',
        destination: '/:locale/guide',
        permanent: true,
      },
      {
        source: '/:locale(ja|en)/admin/:path*',
        destination: '/:locale',
        permanent: true,
      },
      {
        source: '/:locale(ja|en)/modes/aram',
        destination: '/:locale/guide',
        permanent: true,
      },
      {
        source: '/:locale(ja|en)/crop',
        destination: '/:locale',
        permanent: true,
      },
      {
        // /skills は /spells とほぼ同一データの重複ページだったため統合
        source: '/:locale(ja|en)/skills',
        destination: '/:locale/spells',
        permanent: true,
      },
    ];
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

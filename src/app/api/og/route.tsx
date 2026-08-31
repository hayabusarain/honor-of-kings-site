import { ImageResponse } from 'next/og';
import dataFreshness from '@/data/data_freshness.json';

/**
 * ページごとのOGP画像。
 *
 * これまで282ページすべてが同じ /images/og-image.jpg を出していた。
 * XやDiscordで共有すると、どのページを貼っても同じ絵が並ぶ。
 *
 * /og ではなく /api/ 配下に置く。src/proxy.ts の matcher が api を除外している
 * ため、ここだけがミドルウェア（ロケール判定のリダイレクト）に飲まれない。
 * /api/latest が本番で 200 を返していることで確認済み。
 *
 * ビルド時に232枚を焼く方式は採らない。その分の外部フォント取得（実測で
 * 6枚20リクエスト、232枚なら約460回）とビルド時間が増える。
 * 実際に読まれるのは共有されたページの分だけなので、要求されたときに作って
 * CDN に1日置く。
 *
 * ヒーロー画像は載せない。128x128 しか無く、1200x630 に引き伸ばすと粗くなる。
 */
export const runtime = 'nodejs';

const BG = '#f8f6f1';       // 白磁
const INK = '#1c1e26';      // 墨
const GOLD = '#8a6425';     // brand-700
const MUTED = '#475569';    // slate-600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'ja';
  const heading = (searchParams.get('t') || '').slice(0, 60);
  const isJa = locale === 'ja';

  const asOf = isJa
    ? `統計は ${dataFreshness.campStats.updatedAt} 取得`
    : `Stats as of ${dataFreshness.campStats.updatedAt}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          padding: '72px 80px',
          // 金は線で。塗りは Tier S だけという設計に合わせ、ここでは上端の1本だけ使う
          borderTop: `12px solid ${GOLD}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 30, color: GOLD, letterSpacing: 4, fontWeight: 700 }}>
            HONOR OF KINGS HUB
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: heading.length > 26 ? 60 : 76,
              lineHeight: 1.25,
              color: INK,
              fontWeight: 900,
              display: 'flex',
            }}
          >
            {heading || (isJa ? '攻略データベース' : 'Strategy Database')}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 26, color: MUTED }}>{asOf}</div>
          <div style={{ fontSize: 26, color: MUTED }}>
            {isJa ? '非公式ファンサイト' : 'UNOFFICIAL FAN SITE'}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // 内容はページ見出しと統計の取得日だけなので、1日置いて1週間は古いまま返してよい
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    },
  );
}

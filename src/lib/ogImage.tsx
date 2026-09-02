import { ImageResponse } from 'next/og';
import dataFreshness from '@/data/data_freshness.json';

/**
 * OGP画像の共通描画。
 *
 * もとは src/app/api/og/route.tsx で、リクエストのたびに描いていた。
 * 本番で実測すると1枚2.0秒かかり、`t` パラメータが無制限なので
 * 誰でも任意の文字列で生成を走らせられた。Vercel の Fluid Active CPU が
 * これで枯渇したため、各ルートの opengraph-image.tsx から呼んで
 * ビルド時に焼く形へ移した。動的なルートは1本も残っていない。
 *
 * 呼び出し側は、そのページの generateMetadata と**同じ出所**から見出しを作ること。
 * 例: ヒーロー詳細は getHeroPageText() の title を ogHeading() に通す。
 * 文言をここで書き直すと、タイトルを変えたときに絵だけ古いまま残る。
 *
 * ヒーロー画像は載せない。128x128 しか無く、1200x630 に引き伸ばすと粗くなる。
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const BG = '#fbfaf7';      // 白磁
const INK = '#1c1e26';     // 墨
const GOLD = '#8a6425';    // brand-700
const MUTED = '#475569';   // slate-600

/** 見出しを受け取って1200x630のPNGを返す。locale は 'ja' 以外を英語として扱う */
export function renderOgImage(locale: string, heading: string) {
  const isJa = locale === 'ja';
  const text = (heading || '').slice(0, 60);

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
              fontSize: text.length > 26 ? 60 : 76,
              lineHeight: 1.25,
              color: INK,
              fontWeight: 900,
              display: 'flex',
            }}
          >
            {text || (isJa ? '攻略データベース' : 'Strategy Database')}
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
    ogSize,
  );
}

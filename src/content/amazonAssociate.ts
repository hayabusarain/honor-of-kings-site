/**
 * Amazon アソシエイトの紹介枠の設定。
 * 全ページの本文最上部に1枠だけ出し、中身はページに応じて入れ替える。
 *
 * ■ 出す・出さないの切り替え
 *
 * `tag` が空なら、コンポーネントは null を返して何も描画しない。
 * 商品ごとの文言も、その言語が空なら出さない。いまは英語を空にしてあるので
 * 英語ページには何も出ない（amazon.co.jp の商品は海外の読者には買えないため）。
 *
 * 9/14 の AdSense 再審査までは tag を空に戻しておくという選択もある。
 * 不承認の理由は「有用性の低いコンテンツ」で、この判定は広告とコンテンツの
 * 比率も見る。経緯は hub-game-portal/docs/ADSENSE_REVIEW_LOG.md にある。
 *
 * ■ Amazon 側の必須要件（守らないと規約違反）
 *
 * 1. 必須表記。運営規約は「Amazonのアソシエイトとして、［名称］は適格販売により
 *    収入を得ています。」を目立つように掲示することを義務づけている。
 *    コンポーネントがリンクの隣に必ず出す。消さないこと。
 *    プライバシーポリシーにも同じ趣旨の節を置いてある。
 *
 * 2. 180日ルール。申請から180日以内に3件の適格販売が無いとアカウントが閉鎖される。
 *    https://affiliate.amazon.co.jp/help/node/topic/G7MJTPEP9NC3YKMG
 *
 * ■ 商品を足すとき
 *
 * サイトの記述と食い違う商品を置かないこと。書いていないことを勧める形になる。
 * いまの2件はどちらもガイドの設定節（src/data/guide/ja.json の settings）に対応がある。
 *   指サック   … 項目2「スキルの発動方式は指追従（手動エイム）を推奨」
 *   クーラー   … 項目8「端末が発熱して動作が重くなる場合も、画質を落とすと安定します」
 *
 * URL は「/dp/ASIN」の形まで切り詰める。アソシエイト・セントラルが出すリンクには
 * tag のほか qid（取得時刻）や pd_rd_ / pf_rd_ が付くが、どれも発行した人の
 * セッション固有の値で意味が無い。tag はコンポーネントが付けるので、
 * ここに含めると二重になる。amzn.to の短縮リンクも使わない
 * （リダイレクトが1回増え、ソースを見て飛び先が分からなくなる）。
 */

export type AmazonProduct = {
  /** ASIN。どの商品か追えるように控えておくだけで、表示には使わない */
  asin: string;
  url: string;
  /** リンクの文言。商品名そのままより、何のためのものか分かる短い語がよい */
  title: { ja: string; en: string };
  /** リンクの前に置く一文。なぜこのサイトがこれを出すのかが分かるように */
  note: { ja: string; en: string };
  /**
   * この接頭辞で始まるパスに出す（ロケールを除いた形。例: '/guide'）。
   * 上から順に見て最初に一致したものを使う。
   * 空配列はどれにも一致しない。一致が無ければ配列の最後の1件を既定として使う。
   */
  paths: string[];
};

export const AMAZON_ASSOCIATE: { tag: string; products: AmazonProduct[] } = {
  /** アソシエイトのトラッキングID。空なら何も出ない */
  tag: 'harusama10-22',

  products: [
    {
      // ガイドは発熱と画質・フレームレートの話をしている場所なので、冷却を当てる
      asin: 'B0GTV71HP3',
      url: 'https://www.amazon.co.jp/dp/B0GTV71HP3',
      title: { ja: 'スマホ用冷却クーラー', en: '' },
      note: {
        ja: '発熱でフレームレートが落ちる端末には、外付けの冷却が効きます。',
        en: '',
      },
      paths: ['/guide'],
    },
    {
      // 既定。ヒーロー詳細・Tier表・装備など、実際に操作を詰める人が見るページ
      asin: 'B09Z2G8MMY',
      url: 'https://www.amazon.co.jp/dp/B09Z2G8MMY',
      title: { ja: 'ゲーミング指サック', en: '' },
      note: {
        ja: 'ガイドで勧めている手動エイムは、指の滑りがそのまま精度に出ます。',
        en: '',
      },
      paths: [],
    },
  ],
};

/**
 * パスに対応する商品を返す。`pathname` はロケール接頭辞を含んだ実際のURL
 * （例: /ja/guide/bosses）を渡してよい。先頭の /ja か /en は落として比較する。
 * どれにも一致しなければ配列の最後を既定として返す。
 */
export function pickAmazonProduct(pathname: string): AmazonProduct | null {
  const { products } = AMAZON_ASSOCIATE;
  if (products.length === 0) return null;
  const path = pathname.replace(/^\/(ja|en)(?=\/|$)/, '') || '/';
  const matched = products.find((p) => p.paths.some((prefix) => path.startsWith(prefix)));
  return matched ?? products[products.length - 1];
}

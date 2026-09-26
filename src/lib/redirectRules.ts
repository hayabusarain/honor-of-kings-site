/**
 * 旧 URL からの恒久転送の一覧。
 *
 * 機能削除で消えた URL、ヒーローの数値 ID と hero_NNN の旧形式を、後継のページへ送る。
 * Google にインデックスされていた旧 URL が 404 になり Search Console で報告されたため、
 * 後継ページへ恒久転送して評価を引き継ぐ。
 *
 * 2026-09-27 に next.config.ts の redirects() から移した。同じ一覧を2か所で使う。
 * - 今の本番（Vercel、サーバーあり）: next.config.ts の redirects()
 * - サイト統合後（Cloudflare、静的書き出し）: src/app/%5Fredirects/route.ts が _redirects の書式にして書き出す
 * 一覧を2か所に書くと片方だけ直す事故が起きるので、ここを唯一の出所にする。
 * next.config.ts からも読むので、@/ の別名は使わず相対パスで import する。
 */
import hokHeroes from '../data/hok_heroes.json';
import legacyHeroIds from '../data/legacy_hero_ids.json';

export type RedirectRule = { source: string; destination: string; permanent: boolean };

export function buildRedirects(): RedirectRule[] {
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

  // さらに古い hero_NNN 形式 → slug の301。この形式は初回公開（2026-06-22）から
  // 366da77（07-22）までの1か月だけ使われていた。その間に Google がインデックスした
  // 分が404で残り続けており、Search Console の「見つかりませんでした（404）」80件の
  // 主因になっていた（/ja/heroes/hero_023 など。2026-09-03 に実測）。
  // 数値IDの301は最初から張っていたが、その前の世代は漏れていた。
  // 対応表は src/data/legacy_hero_ids.json、行き先の slug は hok_heroes.json から引く。
  //
  // hero_NNN/builds は専用の行を作らない。下の汎用ルールで /heroes/hero_NNN に落ち、
  // そこからこの301でslugへ飛ぶ2段になる。数値IDのほうを1段にしてあるのと揃わないが、
  // 1段にするには116行増えて総数が473になる。Google は301の連鎖を数段たどって
  // 評価も渡すので、実在も怪しいURLのために倍増させる価値はないと判断した。
  const slugById = new Map(
    (hokHeroes as { id: string; slug?: string }[])
      .filter((h) => h.slug)
      .map((h) => [h.id, h.slug as string]),
  );
  const legacyHeroRedirects = Object.entries(legacyHeroIds.map)
    .map(([legacyId, currentId]) => ({ legacyId, slug: slugById.get(currentId) }))
    .filter((x): x is { legacyId: string; slug: string } => Boolean(x.slug))
    .map((x) => ({
      source: `/:locale(ja|en)/heroes/${x.legacyId}`,
      destination: `/:locale/heroes/${x.slug}`,
      permanent: true,
    }));

  return [
    ...heroBuildsRedirects,
    ...heroIdRedirects,
    ...legacyHeroRedirects,
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
      // 旧ダメージ計算機（86869ec で削除）。404 のまま放置していたが、
      // 消えたURLは301で送る方針なので、役割の近い装備シミュレーターへ寄せる
      source: '/:locale(ja|en)/calculator',
      destination: '/:locale/items/simulator',
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
    {
      // /esports には子が1本しかない。インデックスページは作らず親を子へ送る。
      // 中身がリンク1本だけのページを増やすと、審査で問題になっている
      // 薄いページが1枚増える。:path* は付けない（子にマッチしてループする）
      source: '/:locale(ja|en)/esports',
      destination: '/:locale/esports/asian-games-2026',
      permanent: true,
    },
  ];
}

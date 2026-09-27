/**
 * サイト統合（2026-09-27 運営者了承）の入口のスクリプト。言語の付いていない入口（/ や /hok）を、
 * ブラウザの言語（Accept-Language）で /ja か /en へ振り分ける。
 *
 * このファイルは Desktop/hub-game-rules/shared/worker から配られている。
 * 手で編集せず、正本を直して node sync.mjs を実行すること。計画は HoK の docs/CONSOLIDATION_PLAN.md（6章）。
 *
 * 動くのは入口だけ。wrangler.jsonc の assets.run_worker_first に入口のパス（ポータルは "/"、HoK は "/hok" と "/hok/"）
 * だけを並べ、ほかのリクエストはスクリプトを通さず静的アセットが直接返す（静的アセットは無料で回数の上限も無い。
 * スクリプトが動くのは無料で1日10万回まで）。言語の付いていない奥のパス（/guides など）は _redirects が既定の言語へ送る。
 *
 * 設定は wrangler.jsonc の vars:
 *   BASE_PATH       サイトの前置き。ポータルは ""、HoK は "/hok"
 *   LOCALES         持っている言語。"ja,en" のようにカンマ区切り
 *   DEFAULT_LOCALE  ブラウザの言語がどれにも当たらないとき（Accept-Language が無いときも）の言語。**3サイトとも "en"**。
 *                   routing.ts の defaultLocale（Wild Rift は ja）とは別の値。あちらは _redirects が言語の無い奥のパスを送る先
 *
 * 言語は Accept-Language の重み（q）の高い順に見て、持っている言語に最初に当たったものにする。
 * 「日本語のブラウザなら /ja、それ以外は /en」（運営者の答え）は、この決め方に DEFAULT_LOCALE "en" を合わせて満たせる。
 * 日本語しかない MLBB はこのスクリプトを使わず、_redirects で /mlbb/ja に送る。
 * 言語の cookie（NEXT_LOCALE）は見ない。ドメイン直下のポータルが書くと path=/ になり、同じドメインの全サイトに届くため
 * （ポータルは静的書き出しでは書かない設定にしてある）
 */
const entry = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const base = env.BASE_PATH ?? '';
    const isEntry = url.pathname === (base || '/') || url.pathname === `${base}/`;
    if (!isEntry || (request.method !== 'GET' && request.method !== 'HEAD')) return env.ASSETS.fetch(request);

    const locales = String(env.LOCALES ?? '').split(',').map((l) => l.trim()).filter(Boolean);
    const locale = pickLocale(request.headers.get('Accept-Language'), locales, env.DEFAULT_LOCALE ?? locales[0]);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${base}/${locale}${url.search}`,
        // 行き先がブラウザの言語で変わるので、途中のキャッシュに1つの答えを持たせない
        Vary: 'Accept-Language',
        'Cache-Control': 'private, no-store',
      },
    });
  },
};

// 変数に入れてから出す（名前の無い default export は、ポータルの lint の import/no-anonymous-default-export が警告する）
export default entry;

/**
 * Accept-Language（例: "ja,en-US;q=0.9,en;q=0.8"）から、持っている言語のうち最も重いものを選ぶ。
 * export しない（Workers は名前付きの export を入口のクラスとして扱おうとする）
 */
function pickLocale(header, locales, fallback) {
  if (!header) return fallback;
  const prefs = header
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      // q は大文字でもよい（RFC 9110 12.4.2）
      const q = params.map((p) => p.trim()).find((p) => p.toLowerCase().startsWith('q='));
      const weight = q ? Number(q.slice(2)) : 1;
      return { lang: tag.trim().toLowerCase().split('-')[0], weight: Number.isFinite(weight) ? weight : 0, index };
    })
    .filter((p) => p.lang && p.weight > 0)
    // 重みが同じなら書かれた順
    .sort((a, b) => b.weight - a.weight || a.index - b.index);
  for (const p of prefs) if (locales.includes(p.lang)) return p.lang;
  return fallback;
}

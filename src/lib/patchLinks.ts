// パッチノートの版ページ（/patches/<日付>）へのリンクを作る入口（2026-11-18、ポータルの案C）。
//
// 最新版の本文は一覧（/patches）に全文で載っているので、最新版の版ページを書き出すと同じ本文のページが
// 2つになる（AdSense のクローラーは広告タグのある URL を読むので、canonical やサイトマップから外しても重複は残る）。
// そこで最新版の版ページは書き出さず、最新版へのリンクはすべて /patches（#id 付き）に向ける。
// 最新版は patch_meta.json の created_at のいちばん新しい日付で、ビルドのたびにデータから決まる。
// 新しい版が入ると、前の最新版の版ページは自動で書き出される。
//
// 版ページへのリンクを作るときは、ここの patchPageHref を通すこと（npm run audit の検査37が見張る）。
// 本番に出ていた最新版の URL（/hok/ja/patches/2026-11-05 など）は、src/app/%5Fredirects が /patches へ 302 で送る。
import patchMetas from '@/data/patch_meta.json';

const DATES = Array.from(new Set((patchMetas as { created_at: string }[]).map((m) => m.created_at.slice(0, 10)))).sort();

/** いちばん新しい版の日付（YYYY-MM-DD）。この版の版ページは書き出さない */
export const LATEST_PATCH_DATE: string | null = DATES.at(-1) ?? null;

/** 版ページを書き出す日付（最新版を除く） */
export const PAST_PATCH_DATES: string[] = DATES.filter((d) => d !== LATEST_PATCH_DATE);

/** 版のリンク先。最新版は一覧の /patches、それ以外は版ページ。hash を渡すとその項目へ着地する */
export function patchPageHref(date: string, hash?: string): string {
  const base = date === LATEST_PATCH_DATE ? '/patches' : `/patches/${date}`;
  return hash ? `${base}#${hash}` : base;
}

import dataFreshness from '@/data/data_freshness.json';

/**
 * 掲載ページの「いつ時点か」を1箇所で決める。
 *
 * 同じことを求める式が3箇所にあって、しかもキー集合がずれていた。
 *   sitemap.ts        … campStats / skillPriority / combos / site.lastUpdated
 *   heroes/[id]       … campStats / skillPriority / teamCombos / combos（site が無い）
 *   guide の3ページ    … 手書きの固定値
 * sitemap は teamCombos を落とし、ヒーロー詳細は site.lastUpdated を落としていた。
 * どちらも「含む側」へ揃える。ページ本文の加筆（掲載文の校正など）は統計の
 * 取得日には出ないので、site.lastUpdated が無いと本文を直しても日付が動かない。
 *
 * 日付は YYYY-MM-DD の文字列。この形なら辞書順の比較がそのまま日付の比較になる。
 */

/** YYYY-MM-DD の中でいちばん新しいものを返す。空や undefined は無視する */
export function latestOf(...dates: (string | undefined | null)[]): string {
  const valid = dates.filter((d): d is string => typeof d === 'string' && d.length > 0);
  return valid.sort().at(-1) ?? '';
}

/**
 * ヒーロー詳細と、サイト全体の静的ページが使う更新日。
 * ヒーロー詳細に出る材料（統計・スキル優先度・編成・コンボ・装備・アルカナ・
 * 基本ステータス・おすすめビルド）と、本文の更新日を全部見る。
 */
export function contentUpdatedAt(): string {
  return latestOf(
    dataFreshness.campStats.updatedAt,
    dataFreshness.skillPriority.updatedAt,
    dataFreshness.teamCombos.updatedAt,
    dataFreshness.combos.updatedAt,
    dataFreshness.staticData.items.updatedAt,
    dataFreshness.staticData.arcana.updatedAt,
    dataFreshness.staticData.baseStats.updatedAt,
    dataFreshness.staticData.itemBuilds.updatedAt,
    dataFreshness.site.lastUpdated,
  );
}

/**
 * Tier表とパッチノートが使う更新日。
 * 統計の取得日より本文の更新が新しければそちらを使う。でないと、いちばん
 * 頻繁に変わる2ページが全URL中いちばん古い lastmod になる。
 */
export function statsUpdatedAt(): string {
  return latestOf(dataFreshness.campStats.updatedAt, dataFreshness.site.lastUpdated);
}

/** ヒーロー詳細の初出。初期コミット（2026-06-22）から全ヒーローのページがある。個別の初出日は記録がない */
export const HERO_PAGE_PUBLISHED = '2026-06-22';

/** ガイド3本の初出。git の初コミット日 */
export const GUIDE_PUBLISHED = {
  guide: '2026-06-22',
  bosses: '2026-08-08',
  beginnerHeroes: '2026-08-15',
} as const;

export type GuideKey = keyof typeof GUIDE_PUBLISHED;

/**
 * ガイド3本の更新日。
 *
 * site.lastUpdated は混ぜない。混ぜると3本とも同じ日になり、ページ別に持つ意味が消える。
 * 値は data_freshness.json の guides ブロックで手で維持する。
 * 上げ忘れは audit の検査15が見張る（src/content/beginnerHeroes.ts や
 * 各ガイドの本文に未コミットの変更があるのに、対応する updatedAt が当日でない場合）。
 */
export function guidePageUpdatedAt(key: GuideKey): string {
  return dataFreshness.guides[key].updatedAt;
}

/**
 * サイトの「今日」を返す。
 *
 * 掲載日は日本の読者に向けた日付なので、実行環境のタイムゾーンではなく
 * 日本時間で決める。ローカル時間のままにすると、CI（UTC）が JST の当日日付を
 * 「未来の日付」と判定して落ちる。2026-08-21 26:54 JST の push で実際に起きた。
 *
 * npm run touch:updated が書く日付と npm run audit が検証する日付は
 * 必ず一致していないといけないため、両方からここを呼ぶ。
 */
export const SITE_TIMEZONE = 'Asia/Tokyo';

/** YYYY-MM-DD（日本時間）。sv-SE ロケールがこの書式を返す */
export const siteToday = () =>
  new Date().toLocaleDateString('sv-SE', { timeZone: SITE_TIMEZONE });

/**
 * パッチ本文の表示前の整形。
 *
 * description_en は日本語版から訳したもので、箇条書きの記号が「・」のまま残っている。
 * 英語の文章に中黒が並ぶのは読みづらく、スモークテストでも日本語残留として引っかかる。
 *
 * 置き換えるのは行頭の「・」だけ。description_en の229件はすべて行頭で、
 * 文中で使われているものは1件も無いことを確認済み（人名の中黒などは巻き込まない）。
 * 日本語側の「・」は日本語の箇条書きとして正しいので触らない。
 */
export function normalizePatchText(text: string | null | undefined, locale: string): string {
  const s = text || '';
  if (locale !== 'en') return s;
  return s.replace(/(^|\n)・\s*/g, '$1• ');
}

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * 版の短い呼び名。公式の記事名「9月23日S16「流の交わる地」バージョンアップデートのお知らせ」は
 * 版の選択に入れると390px幅で途中から切れるので、日付だけにする（9月23日パッチ / September 23 patch）。
 * withSeason でシーズン番号を添える（9月23日パッチ（S16））。
 *
 * 英語も日本語の記事名から作る。以前の版ページは日付の部分を訳さずに使い、
 * 英語ページの見出しと title が「9月23日 patch」になっていた。
 * 日付が読めない記事名は、そのまま返す。
 */
export function patchShortLabel(version: string | null | undefined, locale: string, withSeason = false): string {
  const v = version || '';
  const m = v.match(/^(\d+)月(\d+)日(?:S(\d+))?/);
  if (!m) return v;
  const season = withSeason && m[3] ? `S${m[3]}` : '';
  if (locale === 'en') {
    const month = MONTHS_EN[Number(m[1]) - 1] ?? m[1];
    return `${month} ${Number(m[2])} patch${season ? ` (${season})` : ''}`;
  }
  return `${Number(m[1])}月${Number(m[2])}日パッチ${season ? `（${season}）` : ''}`;
}

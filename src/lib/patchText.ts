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

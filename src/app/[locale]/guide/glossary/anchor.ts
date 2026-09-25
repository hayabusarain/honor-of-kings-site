/**
 * 用語集の1語のアンカー（/guide/glossary#term-gank）。
 *
 * id は src/data/guide/{ja,en}.json の glossary[].id。英語の語から作った slug で、
 * 日英で同じ値を振ってある（食い違うと page.tsx がビルドで止める）。
 * 並び順の番号にしなかったのは、語を途中に足したときに既存のリンクがずれるため。
 *
 * この形を使っている場所は4つ。変えるときは全部そろえること。
 *   - src/app/[locale]/guide/glossary/page.tsx（各語の id）
 *   - src/app/[locale]/guide/glossary/CurrentTermMark.tsx（飛んできた語の印。この関数から頭を取る）
 *   - src/app/[locale]/guide/GuideClient.tsx（/guide の抜粋から各語へのリンク）
 *   - src/components/search/GlobalSearchModal.tsx（横断検索の結果の飛び先。ここは文字列で書いている）
 */
export const glossaryAnchor = (id: string) => `term-${id}`;

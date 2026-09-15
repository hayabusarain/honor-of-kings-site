/**
 * よくある質問（初心者向け）。
 *
 * 全文は話題のページの末尾に出す。/faq は索引で、質問・答えの1文目・置き場へのリンクだけを並べる。
 * どのページにも収まらない問いだけ page を '/faq' にして、/faq に全文を置く。
 * 「短い答え」の欄は作らない。索引は答えの1文目を firstSentence で切り出す。
 *
 * 書き方の決まり。scripts/audit.mjs の検査23が止める。
 * - 数値は直書きしない。{slotName} と書き、ページ側がデータから読んで差し込む。
 *   統計の日付や体数も同じ。直書きしてよいのは根拠ファイルにそのまま書いてある値だけ
 * - 「最多」「唯一」のように、数値を評価する言い回しは書かない
 * - 答えに確認日を書かない。ページに出す日付は最終更新日だけ
 * - 1文目は索引に単独で出る。日本語50字以内で、「これは」「それは」から始めない
 * - Tier・勝率・出現率・BAN率・今のパッチに紐づく問いは載せない（category 'site' の問いは、
 *   サイトがそれらの数字をどう扱っているかを答えるので Tier などの語を使ってよい）
 * - データの集め方は書かない。出どころは「ゲーム内の表示から」までに留める
 *
 * 構造化データ（FAQPage）は全文を持つページだけに付ける。/faq には付けない。
 */

export const FAQ_CATEGORIES = ['site', 'basics', 'lanes', 'objectives', 'spells', 'items', 'arcana', 'heroes'] as const;

/** 本文の {slotName} に差し込める名前。実装はページ側に置き、ここに無い名前は検査23が止める */
export const FAQ_SLOT_NAMES = [] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];
export type FaqSlotName = (typeof FAQ_SLOT_NAMES)[number];
export type FaqText = { q: string; a: string };
export type FaqEntry = {
  /** 英小文字とハイフン。ページ内のアンカー #faq-{id} に使う */
  id: string;
  /** 全文を置くページ。ロケールを除いたパス（例 '/guide/bosses'）。どこにも収まらない問いは '/faq' */
  page: string;
  category: FaqCategory;
  /** 答えの裏付けになるファイル。リポジトリ直下からのパス */
  sources: string[];
  ja: FaqText;
  en: FaqText;
};

export const FAQ_ENTRIES: FaqEntry[] = [];

/** 答えの1文目。索引と検査23の字数判定で同じ切り方を使う */
export function firstSentence(text: string, locale: 'ja' | 'en'): string {
  if (locale === 'ja') {
    const i = text.indexOf('。');
    return i === -1 ? text : text.slice(0, i + 1);
  }
  const m = text.match(/^[\s\S]*?[.!?](?=\s+[A-Z0-9{]|$)/);
  return m ? m[0] : text;
}

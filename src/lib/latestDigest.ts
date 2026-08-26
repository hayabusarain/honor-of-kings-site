/**
 * /api/latest がポータルの「今週の注目」へ渡す要約を、パッチのメタ分析文から作る。
 *
 * 分析文は「【見出し】」で始まり、Markdown の強調（**）を含む数段落の文章。
 * 以前は最初の一文だけを返していたが、書き出しが「今回の中心はルアンナです。」のような
 * 導入文だと内容が伝わらず、姉妹サイト（ワイリフ側は一文で調整内容まで言い切る）と
 * 並んだときに見劣りした。そこで、最低文字数に届くまで文を足していく。
 */

/** 見出し行と強調記号を落とし、空白を詰めた本文にする */
function plainBody(text: string): string {
  return text
    .replace(/^\s*[【[][^】\]]*[】\]]\s*/, '')
    .replace(/\*\*/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * 文に分ける。日本語は「。」の直後に空白を置かないので単独で文末とみなす。
 * 英語のピリオドは "7.2c" のような数字で切れないよう、後ろに空白か終端を要求する。
 */
function sentences(body: string): string[] {
  const out: string[] = [];
  let rest = body;
  while (rest) {
    const idx = rest.search(/。|[.](\s|$)/);
    if (idx < 0) {
      out.push(rest.trim());
      break;
    }
    out.push(rest.slice(0, idx + 1).trim());
    rest = rest.slice(idx + 1).trim();
  }
  return out.filter(Boolean);
}

/**
 * 先頭から文を足していき、min 文字に届いたら止める。max を超える文は足さない。
 * 最初の一文だけで max を超える場合は、末尾を「…」で詰める。
 */
export function digestBody(text: string, { min, max }: { min: number; max: number }): string {
  const parts = sentences(plainBody(text));
  if (parts.length === 0) return '';
  let acc = '';
  for (const s of parts) {
    // 日本語の文末「。」の後ろには空白を入れない。英語は1つ空ける
    const joiner = acc.endsWith('。') ? '' : ' ';
    const next = acc ? `${acc}${joiner}${s}` : s;
    if (acc && next.length > max) break;
    acc = next;
    if (acc.length >= min) break;
  }
  return acc.length > max ? `${acc.slice(0, max - 1)}…` : acc;
}

/**
 * 分析文の先頭にある「[August 13 Update — Meta Analysis]」のような見出しを題名に使う。
 * 無ければ fallback（version_en 等）を返す。
 */
export function digestHeading(text: string, fallback: string): string {
  const m = text.match(/^\s*[【[]([^】\]]+)[】\]]/);
  const heading = m ? m[1].trim() : '';
  return heading || fallback;
}

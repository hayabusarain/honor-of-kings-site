/**
 * コンボの手順（`skills/*.json` の strategy.combos[].sequence）を、押す順の記号に分ける。
 *
 * データは「スキル3（対象へ跳躍・Lv.1でHPの16%…）→ スキル1（移動速度+30%…）→ …」という
 * 1本の文字列で持っている。丸括弧の中はスキルの効果説明で、同じ内容は下の解説文にも書いてある。
 * 順番だけを読みたい読者には長すぎるので、番号のチップに分けて出す（2026-09-23）。
 *
 * 分けられない手順（「味方の方向へ後退」のような地の文の指示）は、文字のまま残す。
 * 全116体の947手順のうち、記号にできるのは871個（92%）で、残りは本当に文章の指示。
 * 消すと意味が変わるので、落とさずにそのまま出すこと。
 */

/** チップの前後に付く但し書き。「打撃中に」は前、「の3打目」は後ろに出す */
type Notes = { before?: string; after?: string };

export type ComboStep =
  /** 押すもの。label は 1〜4 / P、basic は通常攻撃 */
  | ({ kind: 'skill'; label: string; raw: string } & Notes)
  | ({ kind: 'basic'; raw: string } & Notes)
  /** 地の文の指示 */
  | { kind: 'text'; text: string; raw: string };

/** 丸括弧の外にある「→」だけで区切る。括弧の中にも「→」が出てくるため */
function splitSteps(sequence: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of sequence) {
    if (ch === '（' || ch === '(') depth++;
    if (ch === '）' || ch === ')') depth = Math.max(0, depth - 1);
    if (depth === 0 && (ch === '→' || ch === '➡')) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

/** 但し書き（「強化」「再発動」「3回目」など）。長いものはチップの脇に置けないので落とす */
const NOTE_MAX = 8;

function tidyNote(note: string): string | undefined {
  const t = note.replace(/^[・,、.\s]+|[・,、.\s]+$/g, '').replace(/^(the|a|an)\s+/i, '').trim();
  if (!t || t.length > NOTE_MAX) return undefined;
  return t;
}

/** 一致した語の前後を、それぞれ但し書きとして取り出す */
function notesAround(body: string, matched: string): Notes {
  const i = body.indexOf(matched);
  return { before: tidyNote(body.slice(0, i)), after: tidyNote(body.slice(i + matched.length)) };
}

export function parseComboSequence(sequence: string, locale: string): ComboStep[] {
  const isJa = locale !== 'en';
  return splitSteps(sequence).map((raw) => {
    // 括弧の中はスキルの効果説明。順番の行には出さない（同じ内容が解説文にある）
    const body = raw.replace(/（[^）]*）|\([^)]*\)/g, '').trim();

    const skill = body.match(isJa ? /スキル\s*([1-4])/ : /skill\s*([1-4])/i);
    if (skill) return { kind: 'skill', label: skill[1], ...notesAround(body, skill[0]), raw };

    const passive = body.match(isJa ? /パッシブ/ : /passive/i);
    if (passive) return { kind: 'skill', label: 'P', ...notesAround(body, passive[0]), raw };

    const basic = body.match(isJa ? /通常攻撃/ : /basic attacks?/i);
    if (basic) return { kind: 'basic', ...notesAround(body, basic[0]), raw };

    return { kind: 'text', text: body || raw, raw };
  });
}

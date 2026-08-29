/**
 * skills/ja.json の sub_role（戦い方タイプ）の正規化と英語表記の対応表。
 *
 * 生の sub_role は111体分・33種の表記が混在している。大半は「範囲攻撃型メイジ」の
 * ような単独のタイプ名だが、一部は「範囲攻撃型メイジ / 持続攻撃/回復 / 序盤」の
 * ように、得意な攻め方や強い時間帯まで「 / 」（前後スペース付きスラッシュ）で
 * 連結されている。タイプ名は先頭セグメントだけなので、そこだけを取り出す。
 *
 * 注意: 「アサシン/ファイター」のようにスペースを挟まないスラッシュは複合ロール名
 * そのものなので、分割してはいけない。区切りは必ず「 / 」で判定すること
 * （2026-08-29 時点で全33種。正規化後は23種になる）。
 */
export function normalizeSubRole(raw: string): string {
  return raw.split(' / ')[0].trim();
}

/**
 * sub_role の先頭セグメントが複合ロール名（「アサシン/ファイター」等）になっている値。
 * これは「戦い方タイプ」ではなくロールの掛け持ちを表しているだけなので、
 * タイプ絞り込みの選択肢やカードのタイプ表示には出さない（呼び出し側で除外する）。
 */
export const COMPOUND_ROLE_LABELS = new Set(['アサシン/ファイター', 'メイジ/ファイター', 'サポート/タンク']);

/**
 * 正規化済み sub_role → 英語表記。キーは normalizeSubRole の返り値と一致させる。
 * ゲーム内の英語公式表記が確認できていないため、直訳で自然な英語ゲーム用語に寄せた。
 */
export const SUB_ROLE_EN: Record<string, string> = {
  // メイジ系
  'CC型メイジ': 'Control Mage',
  'ポーク型メイジ': 'Poke Mage',
  '奇襲型メイジ': 'Ambush Mage',
  '砲台型メイジ': 'Artillery Mage',
  '範囲攻撃型メイジ': 'AoE Mage',
  // ファイター系
  'アサシン型ファイター': 'Assassin Fighter',
  '狂戦士型ファイター': 'Berserker Fighter',
  '突撃型ファイター': 'Assault Fighter',
  '重装型ファイター': 'Armored Fighter',
  // タンク系
  '先鋒型タンク': 'Vanguard Tank',
  '防衛型タンク': 'Defensive Tank',
  // アサシン系
  'ローム型アサシン': 'Roaming Assassin',
  '高ダメージ型アサシン': 'Burst Assassin',
  // マークスマン系
  '俊敏型マークスマン': 'Agile Marksman',
  '連射型マークスマン': 'Rapid-Fire Marksman',
  '重砲型マークスマン': 'Heavy Artillery Marksman',
  'タンクマークスマン': 'Tank Marksman',
  // サポート系
  'バフ系サポート': 'Buff Support',
  '守護系サポート': 'Guardian Support',
  '戦術系サポート': 'Tactical Support',
  '攻撃系サポート': 'Offensive Support',
  // 複合ロール名（アサシン/ファイター等）は COMPOUND_ROLE_LABELS で除外するため、ここには持たない
};

/**
 * 表示用ラベル。英語で対応表に無い値は、推測で訳さず日本語のまま出す
 * （誤訳を出すより、元データの表記をそのまま見せるほうが害が少ない）。
 */
export function subRoleLabel(normalized: string, locale: string): string {
  if (locale !== 'en') return normalized;
  return SUB_ROLE_EN[normalized] ?? normalized;
}

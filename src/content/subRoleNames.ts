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
 *
 * 2026-08-29 に英語クライアントのヒーロー右パネルで全20種を照合し、
 * 実機の表記に置き換えた（それまでは直訳の推測で、20種中10種が実際と違っていた）。
 * 特に Guardian と Defensive は取り違えていた: 守護系サポート=Defensive Support、
 * 防衛型タンク=Guardian Tank が実機。
 *
 * 「俊敏型マークスマン」だけは実機の英語が割れている（5体中4体 Nimble Marksman、
 * エリンのみ Deft Marksman）。絞り込みの選択肢は1つに揃える必要があるので多数派を採った。
 * ポーク型メイジは現在どのヒーローにも付いていない（実機未確認のまま）。
 */
export const SUB_ROLE_EN: Record<string, string> = {
  // メイジ系
  'CC型メイジ': 'Control Mage',
  'ポーク型メイジ': 'Poke Mage',
  '奇襲型メイジ': 'Ambush Mage',
  '砲台型メイジ': 'Artillery Mage',
  '範囲攻撃型メイジ': 'Formation Mage',
  // ファイター系
  'アサシン型ファイター': 'Assassin Fighter',
  '狂戦士型ファイター': 'Berserker',
  '突撃型ファイター': 'Charger',
  '重装型ファイター': 'Heavy Fighter',
  // タンク系
  '先鋒型タンク': 'Vanguard Tank',
  '防衛型タンク': 'Guardian Tank',
  // アサシン系
  'ローム型アサシン': 'Roving Assassin',
  '高ダメージ型アサシン': 'Burst Assassin',
  // マークスマン系
  '俊敏型マークスマン': 'Nimble Marksman',
  '連射型マークスマン': 'DPS Marksman',
  '重砲型マークスマン': 'Artillery Marksman',
  'タンクマークスマン': 'Tank Marksman',
  // サポート系
  'バフ系サポート': 'Buff Support',
  '守護系サポート': 'Defensive Support',
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

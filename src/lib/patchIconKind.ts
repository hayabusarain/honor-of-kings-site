/**
 * パッチノートでヒーロー以外の行（イベント・不具合の修正・装備の調整など）に出す図柄の種類。
 *
 * 以前はヒーロー以外の行を一律に「⚔️」で描いていて、イベントも装備の調整も同じ剣だった。
 * Wild Rift Hub が 2026-09-26 に同じ直しを入れ、HoK にも申し送りが来た
 * （docs/handoff-from-wildrift-2026-09-26-patch-icons.md）。
 *
 * 種類は行の英語名（hero_name_en）に上から順に規則を当て、最初に合ったものにする。並びに意味がある。
 * - mode は season より先に見る。「Season Mode Adjustments」はモードの話で、シーズンの話ではない
 * - season は hero より先に見る。「Season & New Heroes」はシーズンの切り替わりの行
 * どれにも当たらない行は system（「Game Systems」など）。
 *
 * 決めるのはサーバー側（patchData.ts）。このファイルは JSON を読まないので、型はクライアントから import してよい。
 */
export type PatchIconKind = 'event' | 'fix' | 'mode' | 'season' | 'hero' | 'item' | 'arcana' | 'map' | 'system';

const RULES: [PatchIconKind, RegExp][] = [
  ['event', /\bevents?\b/i],
  ['fix', /\bfix|optimi[sz]ation/i],
  ['mode', /\bmodes?\b|frenzy|bounty/i],
  ['season', /\bseason\b/i],
  ['hero', /\bnew heroes?\b/i],
  ['item', /\bitems?\b/i],
  ['arcana', /\barcana\b/i],
  ['map', /battlefield|\bmap\b|tower/i],
];

export function patchIconKind(nameEn: string | null | undefined): PatchIconKind {
  const name = nameEn ?? '';
  return RULES.find(([, re]) => re.test(name))?.[0] ?? 'system';
}

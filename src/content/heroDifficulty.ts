// ゲーム内の難易度表記（イージー/ノーマル/ハード/ベリーハード）の対訳と配色。
// ヒーロー一覧のフィルタとヒーロー詳細のバッジの両方で使うため1か所にまとめる。
export const DIFFICULTY_IDS = ['イージー', 'ノーマル', 'ハード', 'ベリーハード'] as const;
export type DifficultyId = (typeof DIFFICULTY_IDS)[number];

const EN: Record<DifficultyId, string> = {
  'イージー': 'Easy',
  'ノーマル': 'Normal',
  'ハード': 'Hard',
  'ベリーハード': 'Very Hard',
};

export const DIFFICULTY_COLOR: Record<DifficultyId, string> = {
  'イージー': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'ノーマル': 'bg-sky-100 text-sky-700 border-sky-200',
  'ハード': 'bg-amber-100 text-amber-700 border-amber-200',
  'ベリーハード': 'bg-rose-100 text-rose-700 border-rose-200',
};

export function isDifficultyId(v: unknown): v is DifficultyId {
  return typeof v === 'string' && (DIFFICULTY_IDS as readonly string[]).includes(v);
}

/** 表示用ラベル。未知の値は英語でも日本語のまま返す（誤訳を出すより安全） */
export function difficultyLabel(raw: string, locale: string): string {
  if (locale === 'en' && isDifficultyId(raw)) return EN[raw];
  return raw;
}

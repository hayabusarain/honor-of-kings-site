// Tier バッジの配色。Tier表とヒーロー詳細の同レーン欄で共通。
// 玉璽の序列: S=金（塗り）→ A=翡翠 → B以下=石。
// 比の値は明るい配色（白磁）のころのもの。2026-09-26 に夜の配色へ写し替え、どの組も 4.5:1 以上になった
// （scratch/dark_palette_hok_0926.mjs で検算）。
// B/C の地は白ではなく bg-slate-100 (#f1f5f9)。slate-500 では 4.33:1 で
// AA に届かないため slate-600（6.92:1）にした。
// バッジの文字は Tier表が 16px、ヒーロー詳細が 14px で、どちらも
// 「大きい文字」の 3:1 には該当しない。
//
// 当サイトの Tier（OP〜D、src/lib/siteTier.ts）は scheme 'site' で引く（2026-11-02）。
// 金の塗りは序列の最上位だけ（AGENTS.md「金の使い方」）なので、当サイトの表では OP だけを塗り、
// S は金の線と金の文字で、地はカードと同じ（塗らない）。淡い金の地にすると、選択中の SELECTED
// （淡い金の地・金の線・金の文字）と線の明るさしか違わず、隣の「勝率込み」のボタンと同じ札に見えた（2026-11-02 の見直し）。
// 公式の表では今までどおり S が塗り。2つの表を同時には出さないので、塗りの金は常に1段だけ
const SITE_STYLES: Record<string, string> = {
  OP: 'bg-brand-700 text-white border-brand-700',
  S: 'bg-white text-brand-700 border-brand-300',
  A: 'bg-jade-50 text-jade-700 border-jade-300',
  B: 'bg-white text-slate-600 border-slate-300',
  C: 'bg-slate-100 text-slate-600 border-slate-300',
  D: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function getTierBadgeStyle(tier: string, scheme: 'official' | 'site' = 'official'): string {
  if (scheme === 'site') return SITE_STYLES[tier] ?? SITE_STYLES.D;
  switch (tier) {
    case 'S': return 'bg-brand-700 text-white border-brand-700';
    case 'A': return 'bg-jade-50 text-jade-700 border-jade-300';
    case 'B': return 'bg-slate-100 text-slate-600 border-slate-300';
    case 'C': return 'bg-slate-100 text-slate-600 border-slate-200';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

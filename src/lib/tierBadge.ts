// Tier バッジ（S/A/B/C）の配色。Tier表とヒーロー詳細の同レーン欄で共通。
// 玉璽の序列: S=金（塗り）→ A=翡翠 → B以下=石。
// 比の値は明るい配色（白磁）のころのもの。2026-09-26 に夜の配色へ写し替え、どの組も 4.5:1 以上になった
// （scratch/dark_palette_hok_0926.mjs で検算）。
// B/C の地は白ではなく bg-slate-100 (#f1f5f9)。slate-500 では 4.33:1 で
// AA に届かないため slate-600（6.92:1）にした。
// バッジの文字は Tier表が 16px、ヒーロー詳細が 14px で、どちらも
// 「大きい文字」の 3:1 には該当しない。
export function getTierBadgeStyle(tier: string): string {
  switch (tier) {
    case 'S': return 'bg-brand-700 text-white border-brand-700';
    case 'A': return 'bg-jade-50 text-jade-700 border-jade-300';
    case 'B': return 'bg-slate-100 text-slate-600 border-slate-300';
    case 'C': return 'bg-slate-100 text-slate-600 border-slate-200';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

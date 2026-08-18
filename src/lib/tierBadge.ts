// Tier バッジ（S/A/B/C）の配色。Tier表とヒーロー詳細の同レーン欄で共通。
// C の文字色は slate-400 だったが、白背景で 4.5:1 に届かないため slate-500 にした
export function getTierBadgeStyle(tier: string): string {
  switch (tier) {
    case 'S': return 'bg-brand-600 text-white border-brand-600';
    case 'A': return 'bg-jade-50 text-jade-700 border-jade-300';
    case 'B': return 'bg-slate-100 text-slate-500 border-slate-300';
    case 'C': return 'bg-slate-100 text-slate-500 border-slate-200';
    default: return 'bg-slate-100 text-slate-500 border-slate-200';
  }
}

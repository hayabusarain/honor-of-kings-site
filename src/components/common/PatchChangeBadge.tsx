import type { LatestPatchChanges, PatchChangeType } from '@/lib/patchBadges';
import dataFreshness from '@/data/data_freshness.json';

// 「直近パッチで強化/弱体/調整」バッジの共通部品。
// ヒーロー一覧と Tier表で別々に描いていたため、文言（「の」の有無・英語の日付書式）と
// 配色が食い違っていた。ここに集約し、読み上げ用テキストも1か所で持つ。
//
// patches.json は import しない（156KB がクライアントに載る）。呼び出し側がサーバーで
// getLatestPatchChanges() した結果を渡す。この部品自体は 'use client' 不要の純描画。

/** "2026-08-13" → 「8月13日」。Date を経由しない（SSRとクライアントでずれない） */
export function formatPatchDateJa(isoDate: string): string {
  const [, m, d] = isoDate.split('-');
  return `${Number(m)}月${Number(d)}日`;
}

/**
 * パッチが統計の取得日より後か。後なら統計に入っていないと言い切れる。
 * 取得日以前のパッチは、公式の集計期間が分からないので、どこまで入っているか言えない。
 * 以前は日付を比べずに常に「未反映」と出していて、9/11 取得の統計に 9/10 のパッチを「未反映」と書いていた
 */
export function patchIsAfterStats(patch: LatestPatchChanges): boolean {
  return patch.date > dataFreshness.campStats.updatedAt;
}

/** バッジ横に出す凡例の1行。バッジがある画面には必ず添える（統計値との時差を伝える） */
export function patchBadgeLegend(patch: LatestPatchChanges, locale: string): string {
  const after = patchIsAfterStats(patch);
  return locale === 'ja'
    ? `※↑↓・調整は${formatPatchDateJa(patch.date)}パッチでの調整。${after ? '統計値には未反映です。' : '統計値への反映は未確認です。'}`
    : `↑↓ and “adj” mark heroes changed in the ${patch.versionEn}; ${after ? 'the statistics do not reflect those changes yet.' : 'whether the statistics reflect those changes is unconfirmed.'}`;
}

const DEFS: Record<PatchChangeType, { symbol: string; symbolEn: string; cls: string; ja: string; en: string }> = {
  buff:   { symbol: '↑', symbolEn: '↑', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', ja: '強化', en: 'Buffed' },
  nerf:   { symbol: '↓', symbolEn: '↓', cls: 'bg-rose-50 text-rose-700 border-rose-200', ja: '弱体化', en: 'Nerfed' },
  adjust: { symbol: '調整', symbolEn: 'adj', cls: 'bg-slate-100 text-slate-600 border-slate-300', ja: '調整', en: 'Adjusted' },
};

interface Props {
  patch: LatestPatchChanges;
  heroId: string;
  locale: string;
  /** 位置・サイズは呼び出し側で決める（absolute の座標や文字サイズ）。既定は右上・小 */
  className?: string;
}

export function PatchChangeBadge({ patch, heroId, locale, className }: Props) {
  const type = patch.changes[heroId];
  if (!type) return null;
  const def = DEFS[type];
  if (!def) return null;
  const en = locale === 'en';
  const description = en
    ? `${def.en} in the ${patch.versionEn}`
    : `${formatPatchDateJa(patch.date)}パッチで${def.ja}`;
  return (
    <span
      title={description}
      className={`rounded-md border font-black leading-none ${def.cls} ${className ?? 'absolute top-1.5 right-1.5 z-10 text-[10px] px-1 py-0.5'}`}
    >
      <span aria-hidden="true">{en ? def.symbolEn : def.symbol}</span>
      <span className="sr-only">{description}</span>
    </span>
  );
}

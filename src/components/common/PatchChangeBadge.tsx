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

/**
 * 変更の種類の呼び方と色。パッチノート（PatchTable）の札・絞り込み・目次もここを引く。
 * 以前はパッチノートだけ change_type の生の値（BUFF / NERF / ADJUST）を日本語ページにも出し、
 * 絞り込みは「バフ／ナーフ」、この札は「強化／弱体化」と、1つのサイトに3通りの書き方があった。
 * 日本語はこの札の「強化／弱体化／調整」に揃える。英語は従来の Buff / Nerf / Adjust のまま。
 * new（新ヒーロー・新イベント）はこの札には出ないが（getLatestPatchChanges が拾わない）、
 * パッチノートでは使うので一緒に持つ。
 */
export type PatchChangeKind = PatchChangeType | 'new';

export const PATCH_CHANGE: Record<PatchChangeKind, { symbol: string; symbolEn: string; cls: string; ja: string; en: string }> = {
  buff:   { symbol: '↑', symbolEn: '↑', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', ja: '強化', en: 'Buff' },
  nerf:   { symbol: '↓', symbolEn: '↓', cls: 'bg-rose-50 text-rose-700 border-rose-200', ja: '弱体化', en: 'Nerf' },
  adjust: { symbol: '調整', symbolEn: 'adj', cls: 'bg-slate-100 text-slate-600 border-slate-300', ja: '調整', en: 'Adjust' },
  new:    { symbol: '新規', symbolEn: 'new', cls: 'bg-purple-50 text-purple-700 border-purple-200', ja: '新規', en: 'New' },
};

const OTHER = { symbol: '他', symbolEn: '…', cls: 'bg-slate-100 text-slate-600 border-slate-300', ja: 'その他', en: 'Other' };

// Object.hasOwn は iOS 15.3 以前の Safari に無いので使わない（in は toString なども拾う）
const has = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

/** patches.json の change_type から表示の定義を引く。4種に無い値は「その他」 */
export function patchChangeDef(type: string | null | undefined) {
  return type && has(PATCH_CHANGE, type) ? PATCH_CHANGE[type as PatchChangeKind] : OTHER;
}

/** 読み上げ用の「〜された」形。記号だけの札に添える */
const PAST_EN: Record<PatchChangeType, string> = { buff: 'Buffed', nerf: 'Nerfed', adjust: 'Adjusted' };

interface Props {
  patch: LatestPatchChanges;
  heroId: string;
  locale: string;
  /** 位置・サイズは呼び出し側で決める（absolute の座標や文字サイズ）。既定は右上・小 */
  className?: string;
}

export function PatchChangeBadge({ patch, heroId, locale, className }: Props) {
  const type = patch.changes[heroId];
  if (!type || !has(PAST_EN, type)) return null;
  const def = PATCH_CHANGE[type];
  const en = locale === 'en';
  const description = en
    ? `${PAST_EN[type]} in the ${patch.versionEn}`
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

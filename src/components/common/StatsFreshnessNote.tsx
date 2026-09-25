import { ChevronDown } from 'lucide-react';
import dataFreshness from '@/data/data_freshness.json';
import { patchBadgeLegend } from '@/components/common/PatchChangeBadge';
// type-only import なので patches.json はクライアントバンドルに載らない
import type { LatestPatchChanges } from '@/lib/patchBadges';

// 統計の取得日と「調整前」注記を出す共通の注記。
// Tier表・ヒーロー詳細には元からあるが、同じ勝率・Tierを表示している
// ヒーロー一覧とトップには無かったため、共通化して置けるようにした。
// 日付・文言は data_freshness.json を正とし、直書きしない（更新漏れ防止）。
interface Props {
  locale: string;
  /** 「9月23日調整前」の注記も出すか。狭い場所では false にして取得日だけ出す */
  showPatchBasis?: boolean;
  /** 取得日の行を出すか。Tier表は見出しの下に自前で出しているので false にする */
  showDate?: boolean;
  /** ↑↓バッジを出す画面だけ渡す。凡例を注記の中に入れる */
  patchChanges?: LatestPatchChanges;
  /** そのページだけの注記（Tier表の「統計が無いので載せていない新ヒーロー」など） */
  notes?: string[];
  className?: string;
}

export function StatsFreshnessNote({
  locale,
  showPatchBasis = true,
  showDate = true,
  patchChanges,
  notes = [],
  className = '',
}: Props) {
  const en = locale === 'en';
  const cs = dataFreshness.campStats;
  const at = cs.updatedAt;
  const basis = showPatchBasis ? (en ? cs.patchBasisEn : cs.patchBasisJa) : '';
  const basisCount = cs.patchBasisHeroIds.length;
  const basisPatch = en ? cs.patchBasisPatchEn : cs.patchBasisPatchJa;
  const legend = patchChanges && Object.keys(patchChanges.changes).length > 0
    ? patchBadgeLegend(patchChanges, locale)
    : '';
  const extras = [...notes, legend].filter(Boolean);

  // 調整前の注記は8体の名前を並べるので、スマホで5行になる。未掲載の注記と↑↓の凡例を
  // 足すと Tier表では約200px あり、Tier S が2画面目から始まっていた（2026-09-25 実測）。
  // 読者の判断に効くのは「何体が・どのパッチの前か」なので、それを1行の要約にして
  // 名前の一覧と残りの注記は開いた中に置く。<details> なので閉じていても初期HTMLに全文が載る。
  // 要約は360pxでも1行に収まる長さにする（「〜の調整前の統計です」だと「す」だけが次の行に落ちた）。
  // 英語は1体のときに「1 heroes」にしない（Tier表の件数の札で同じ誤りがあった）。
  // 本文だけ入っていて ID が空のときも、注記を消さずに件数抜きの要約で出す
  const patchName = basisPatch || (en ? 'the latest balance changes' : '直近の調整');
  const summary = basisCount > 0
    ? en
      ? `Stats for ${basisCount} ${basisCount === 1 ? 'hero' : 'heroes'} predate ${patchName}`
      : `${basisCount}体は${patchName}前の統計です`
    : en
      ? `Some stats predate ${patchName}`
      : `一部は${patchName}前の統計です`;

  return (
    <div className={className}>
      {/* 取得日は <time dateTime> で囲む。この部品はトップ・ヒーロー一覧・
          ヒーロー詳細117ページで使うので、ここ1箇所で約119ページに効く。
          値は既に YYYY-MM-DD なのでそのまま dateTime に渡せる */}
      {showDate && (
        <p className="text-sm font-bold text-slate-500">
          {en ? (
            <>Stats: official HoK Camp, as of <time dateTime={at}>{at}</time></>
          ) : (
            <>統計データ: 公式HoK Camp（<time dateTime={at}>{at}</time>取得）</>
          )}
        </p>
      )}
      {basis ? (
        <details className={`group rounded-xl border border-amber-200 bg-amber-50 ${showDate ? 'mt-1.5' : ''}`}>
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm font-bold text-amber-800 [&::-webkit-details-marker]:hidden">
            <span className="flex-1 text-pretty">{summary}</span>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="space-y-1.5 border-t border-amber-200 px-3 pb-3 pt-2 text-sm leading-relaxed">
            <p className="font-bold text-amber-800">{basis}</p>
            {/* amber-50 の地では slate-500 が 4.5:1 ぎりぎりなので slate-600 */}
            {extras.map((n, i) => (
              <p key={i} className="font-bold text-slate-600">{n}</p>
            ))}
          </div>
        </details>
      ) : (
        // 調整前の注記が無いとき（統計を取り直した直後）は短いので畳まない
        extras.map((n, i) => (
          <p key={i} className={`text-sm font-bold text-slate-500 leading-relaxed ${showDate || i > 0 ? 'mt-1.5' : ''}`}>{n}</p>
        ))
      )}
    </div>
  );
}

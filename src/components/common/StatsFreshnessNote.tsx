import dataFreshness from '@/data/data_freshness.json';

// 統計の取得日と「調整前」注記を出す共通の1行注記。
// Tier表・ヒーロー詳細には元からあるが、同じ勝率・Tierを表示している
// ヒーロー一覧とトップには無かったため、共通化して置けるようにした。
// 日付・文言は data_freshness.json を正とし、直書きしない（更新漏れ防止）。
interface Props {
  locale: string;
  /** 「8月13日調整前」の注記も出すか。狭い場所では false にして取得日だけ出す */
  showPatchBasis?: boolean;
  className?: string;
}

export function StatsFreshnessNote({ locale, showPatchBasis = true, className = '' }: Props) {
  const en = locale === 'en';
  const at = dataFreshness.campStats.updatedAt;
  const basis = en ? dataFreshness.campStats.patchBasisEn : dataFreshness.campStats.patchBasisJa;

  return (
    <div className={className}>
      {/* 取得日は <time dateTime> で囲む。この部品はトップ・ヒーロー一覧・
          ヒーロー詳細117ページで使うので、ここ1箇所で約119ページに効く。
          値は既に YYYY-MM-DD なのでそのまま dateTime に渡せる */}
      <p className="text-[11px] font-bold text-slate-500">
        {en ? (
          <>Stats: official HoK Camp, as of <time dateTime={at}>{at}</time></>
        ) : (
          <>統計データ: 公式HoK Camp（<time dateTime={at}>{at}</time>取得）</>
        )}
      </p>
      {showPatchBasis && basis && (
        <p className="mt-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed">
          {basis}
        </p>
      )}
    </div>
  );
}

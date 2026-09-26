import { LIST_NOTES, type ListNotesKey } from '@/content/listNotes';
import dataFreshness from '@/data/data_freshness.json';

// 解説文中の {updatedAt} を data_freshness.json の書き起こし日で埋める。
// 日付を listNotes.ts に直書きすると JSON を更新したときに取り残されるため
const STATIC_DATA_KEY: Partial<Record<ListNotesKey, keyof typeof dataFreshness.staticData>> = {
  items: 'items',
  arcana: 'arcana',
  spells: 'spells',
};

function fillFootnote(page: ListNotesKey, footnote: string): string {
  const key = STATIC_DATA_KEY[page];
  if (!key) return footnote;
  const entry = dataFreshness.staticData[key];
  const updatedAt = typeof entry === 'object' && entry && 'updatedAt' in entry ? entry.updatedAt : '';
  return footnote.replace('{updatedAt}', updatedAt);
}

/**
 * 一覧ページの下に置く解説。
 *
 * 一覧そのものは「調べに来た人」が使うものなので上には何も足さず、
 * 読み物はスクロールし切った先に置く。検索エンジンに対しても
 * 一覧だけのページ（データの羅列）にならないようにする狙いがある。
 */
export function ListNotes({ page, locale }: { page: ListNotesKey; locale: string }) {
  const notes = LIST_NOTES[page]?.[locale === 'ja' ? 'ja' : 'en'];
  if (!notes) return null;

  return (
    // 見出しは節の見出し（section-title、左に金の縦線）。影は暗い地で見えないので線だけにした（2026-09-26）
    <section className="mt-10 bg-white border border-slate-200 rounded-2xl p-5 sm:p-7">
      <h2 className="section-title">{notes.title}</h2>
      <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">{notes.lead}</p>

      <div className="mt-6 space-y-6">
        {notes.sections.map(section => (
          <div key={section.heading}>
            <h3 className="text-base font-black text-slate-800">{section.heading}</h3>
            {section.body.map((paragraph, i) => (
              <p key={i} className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="mt-3 space-y-1.5">
                {section.list.map(item => (
                  <li key={item.term} className="text-sm text-slate-600 font-medium leading-relaxed">
                    <span className="font-bold text-slate-800">{item.term}</span>
                    <span className="text-slate-500"> — </span>
                    {item.desc}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* 注記は 12px だったのを 14px にした（文字は 14px 以上の方針） */}
      <p className="mt-7 pt-4 border-t border-slate-200 text-sm text-slate-500 font-medium leading-relaxed">
        {fillFootnote(page, notes.footnote)}
      </p>
    </section>
  );
}

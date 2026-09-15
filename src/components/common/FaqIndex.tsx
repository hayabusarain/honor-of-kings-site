import { Link } from '@/i18n/routing';
import { FAQ_CATEGORIES, FAQ_CATEGORY_LABELS, FAQ_ENTRIES, firstSentence } from '@/content/faq';
import { fillFaqSlots } from '@/lib/faqSlots';

/**
 * /faq の索引。質問・答えの1文目・全文のある場所だけを並べる。
 *
 * 「短い答え」の欄は持たず、答えの1文目を firstSentence で切り出す。
 * 1文目が単独で読めることは監査の検査23が見ている（50字以内、指示語で始めない）。
 * 置き場の名前はパンくずの呼び方に揃える。
 */
const PAGE_LABELS: Record<string, { ja: string; en: string }> = {
  '/tier-list': { ja: 'Tier表', en: 'Tier List' },
  '/heroes': { ja: 'ヒーロー一覧', en: 'Heroes' },
  '/patches': { ja: 'パッチノート', en: 'Patch Notes' },
  '/about': { ja: 'このサイトについて', en: 'About' },
  '/items': { ja: 'アイテム一覧', en: 'Items' },
  '/items/usage': { ja: 'アイテム採用率', en: 'Item Pick Rates' },
  '/spells': { ja: 'サモナースペル', en: 'Summoner Spells' },
  '/arcana': { ja: 'アルカナ一覧', en: 'Arcana' },
  '/guide': { ja: '初心者ガイド', en: "Beginner's Guide" },
  '/guide/bosses': { ja: 'ボス攻略', en: 'Bosses' },
  '/guide/beginner-heroes': { ja: '最初に選ぶヒーロー', en: 'First Heroes' },
};

export function FaqIndex({ locale }: { locale: string }) {
  const lang = locale === 'ja' ? 'ja' : 'en';
  const groups = FAQ_CATEGORIES.map((category) => ({
    category,
    entries: FAQ_ENTRIES.filter((e) => e.category === category),
  })).filter((g) => g.entries.length > 0);

  return (
    <div className="space-y-6">
      {groups.map(({ category, entries }) => (
        <section
          key={category}
          aria-labelledby={`faq-group-${category}`}
          className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm"
        >
          <h2 id={`faq-group-${category}`} className="text-lg font-black tracking-tight text-slate-900">
            {FAQ_CATEGORY_LABELS[category][lang]}
          </h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {entries.map((e) => {
              const onThisPage = e.page === '/faq';
              const label = onThisPage
                ? (lang === 'ja' ? 'このページの下' : 'Further down this page')
                : (PAGE_LABELS[e.page]?.[lang] ?? (lang === 'ja' ? '全文' : 'Full answer'));
              const href = onThisPage ? `#faq-${e.id}` : `${e.page}#faq-${e.id}`;
              return (
                <li key={e.id} className="py-4 first:pt-0 last:pb-0">
                  <Link href={href} className="text-sm font-black text-brand-700 underline underline-offset-2 leading-relaxed hover:text-brand-800">
                    {fillFaqSlots(e[lang].q)}
                  </Link>
                  <p className="mt-1.5 text-sm text-slate-600 font-medium leading-relaxed">
                    {fillFaqSlots(firstSentence(e[lang].a, lang))}
                  </p>
                  <p className="mt-1 text-[11px] font-bold text-slate-500">
                    {lang === 'ja' ? `全文: ${label}` : `Full answer: ${label}`}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

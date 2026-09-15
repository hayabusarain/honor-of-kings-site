import { FAQ_ENTRIES } from '@/content/faq';
import { fillFaqSlots } from '@/lib/faqSlots';

const ORIGIN = 'https://hok.hub-game.com';

/**
 * ページ末尾の「よくある質問」。faq.ts のうち page が一致する問いの全文を出す。
 *
 * FAQPage の構造化データは全文を持つページだけに付け、/faq には付けない。
 * リッチリザルトはもう出ないが、Bing と AI のクローラーが読む。
 * 置き場のページがこの部品を出しているかは、監査の検査23が page.tsx / layout.tsx を読んで確かめる。
 * 差し込み口の値は skills/ja.json から読むので、サーバー部品として置く。
 */
export function PageFaq({ page, locale, title, className = '' }: { page: string; locale: string; title?: string; className?: string }) {
  const lang = locale === 'ja' ? 'ja' : 'en';
  const items = FAQ_ENTRIES.filter((e) => e.page === page).map((e) => ({
    id: e.id,
    q: fillFaqSlots(e[lang].q),
    a: fillFaqSlots(e[lang].a),
  }));
  if (items.length === 0) return null;

  const jsonLd = page === '/faq' ? null : {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: `${ORIGIN}/${locale}${page}`,
    inLanguage: lang === 'ja' ? 'ja-JP' : 'en-US',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };

  return (
    <section
      aria-labelledby={`faq-heading${page.replace(/\//g, '-')}`}
      className={`bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm ${className}`}
    >
      <h2 id={`faq-heading${page.replace(/\//g, '-')}`} className="text-lg font-black tracking-tight text-slate-900">
        {title ?? (lang === 'ja' ? 'よくある質問' : 'FAQ')}
      </h2>
      <div className="mt-4 divide-y divide-slate-100">
        {items.map((i) => (
          <div key={i.id} id={`faq-${i.id}`} className="py-4 first:pt-0 last:pb-0 scroll-mt-24">
            <h3 className="text-sm font-black text-slate-800 leading-relaxed">{i.q}</h3>
            <p className="mt-1.5 text-sm text-slate-600 font-medium leading-relaxed">{i.a}</p>
          </div>
        ))}
      </div>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
    </section>
  );
}

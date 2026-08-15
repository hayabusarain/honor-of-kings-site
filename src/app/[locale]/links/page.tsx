import { useTranslations, useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ExternalLink, Link2 } from 'lucide-react';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Links' });
  return {
    title: t('title'),
    description: t('subtitle'),
    // リンク集自体は検索結果に出す必要がないが、follow は残す。
    // false にすると、ここから辿れる自サイト内のページまで評価が切れる
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function LinksPage() {
  const t = useTranslations('Links');
  const locale = useLocale();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
            <Link2 className="text-brand-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">{t('title')}</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Official Links */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <ExternalLink className="text-blue-500" size={20} />
            {t('official')}
          </h2>
          <div className="space-y-3">
            <a 
              href="https://www.honorofkings.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-4 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-slate-50 transition-colors"
            >
              <div className="font-bold text-slate-800">Honor of Kings</div>
              <div className="text-xs text-slate-500 mt-1">
                {locale === 'en' ? 'Level Infinite Official Site' : 'Level Infinite 公式サイト'}
              </div>
            </a>
          </div>
        </div>

        {/* Useful Sites */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <Link2 className="text-emerald-500" size={20} />
            {t('useful')}
          </h2>
          <div className="space-y-3">
            <a 
              href="https://hub-game.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-4 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-slate-50 transition-colors"
            >
              <div className="font-bold text-slate-800">Hub-Game</div>
              <div className="text-xs text-slate-500 mt-1">
                {locale === 'en' ? 'A gaming portal and database run by the same operator' : '当サイトと同じ運営者が手がけるゲーム攻略ポータル'}
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 相互リンク募集の枠は 2026-08-15 に撤去した。
          リンクを目的にした働きかけは検索エンジン側でリンクスパムとして扱われうるため、
          掲載するのは実際に参照する価値のあるサイトだけにする */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <p className="text-sm font-semibold text-slate-600 leading-relaxed">
          {locale === 'en'
            ? 'Have a question about this site, or spotted something wrong in our data? Let us know.'
            : '当サイトについてのご質問や、掲載内容の誤りのご指摘はこちらからお願いします。'}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm hover:scale-105 transition-transform mt-4"
        >
          {t('contact')}
        </Link>
      </div>
    </div>
  );
}

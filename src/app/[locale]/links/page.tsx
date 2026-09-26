import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ExternalLink, Link2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { FEED_ALTERNATE_TYPES } from '@/lib/buildMetadata';

// 夜の配色（2026-09-26）の固定ページ。節は金の縦線の見出し（.section-title）を持つカード
// 見出しと短い説明は [word-break:auto-phrase]（Chrome は文節で折る。ガイドのページと同じ）。
// 360px で「につい／て」「アク／セス」「ゲ／ーム攻略」など語の途中で折れていた
const CARD = 'rounded-2xl border border-slate-200 bg-white p-5 sm:p-7';
const SITE_LINK =
  'flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-brand-300';

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
    // noindex のページでも canonical は自分自身を指しておく。
    // 別URLを指すと「そちらも索引に入れるな」と読まれる余地が残る
    alternates: {
      canonical: `/${locale}/links`,
      ...(locale === 'ja' ? { types: FEED_ALTERNATE_TYPES } : {}),
    },
  };
}

export default async function LinksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 静的プリレンダに載せるために必要。これが無いと next-intl の useLocale が
  // リクエスト時解決になり、このページだけ動的レンダリング（ƒ）に落ちる
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Links' });

  return (
    <div className="pb-10">
      {/* 冒頭は見本（Tier表・ヒーロー一覧）と同じ .page-hero の帯。影は暗い地で見えないので線で区切る */}
      <div className="page-hero border-b border-slate-200">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-5 pt-6 pb-5 sm:px-7">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-300 bg-brand-50">
            <Link2 className="text-brand-700" size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{t('title')}</h1>
            <p className="mt-1 text-sm font-bold text-slate-600 [word-break:auto-phrase]">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-4 pt-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Official Links */}
          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">{t('official')}</h2>
            <div className="mt-4 space-y-3">
              <a
                href="https://www.honorofkings.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={SITE_LINK}
              >
                <span className="min-w-0">
                  <span className="block font-bold text-slate-900">Honor of Kings</span>
                  <span className="mt-1 block text-sm text-slate-600 [word-break:auto-phrase]">
                    {locale === 'en' ? 'Level Infinite Official Site' : 'Level Infinite 公式サイト'}
                  </span>
                </span>
                <ExternalLink className="shrink-0 text-slate-500" size={16} aria-hidden="true" />
              </a>
            </div>
          </section>

          {/* Useful Sites */}
          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">{t('useful')}</h2>
            <div className="mt-4 space-y-3">
              <a
                href="https://hub-game.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={SITE_LINK}
              >
                <span className="min-w-0">
                  <span className="block font-bold text-slate-900">Hub-Game</span>
                  <span className="mt-1 block text-sm text-slate-600 [word-break:auto-phrase]">
                    {locale === 'en' ? 'A gaming portal and database run by the same operator' : '当サイトと同じ運営者が手がけるゲーム攻略ポータル'}
                  </span>
                </span>
                <ExternalLink className="shrink-0 text-slate-500" size={16} aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>

        {/* 相互リンク募集の枠は 2026-08-15 に撤去した。
            リンクを目的にした働きかけは検索エンジン側でリンクスパムとして扱われうるため、
            掲載するのは実際に参照する価値のあるサイトだけにする */}
        <div className={CARD}>
          <p className="text-base leading-relaxed text-slate-700">
            {locale === 'en'
              ? 'Have a question about this site, or spotted something wrong in our data? Let us know.'
              : '当サイトについてのご質問や、掲載内容の誤りのご指摘はこちらからお願いします。'}
          </p>
          {/* 墨の塗りは夜の配色で白く光る。金の線と淡い金の地は「選択中」（tones.ts の SELECTED）と
              同じ見た目になるので、ほかのページの入口（ヒーロー一覧のロール別・大会ページの関連リンク）と同じ線のボタンにする */}
          <Link
            href="/contact"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            {t('contact')}
          </Link>
        </div>
      </div>
    </div>
  );
}

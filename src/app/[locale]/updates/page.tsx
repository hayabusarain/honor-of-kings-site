import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd, Breadcrumb } from '@/components/seo/BreadcrumbJsonLd';
import { CHANGELOG } from '@/content/changelog';

/**
 * サイトの更新履歴。中身は src/content/changelog.ts。
 *
 * 再訪した人に出す「前回の訪問後にサイトが更新されました」（TabBar）の行き先。
 * 何が変わったかを書いた場所が無く、赤点を見ても確かめようがなかった（2026-09-25 追加）。
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/updates',
    title: isJa ? 'サイトの更新履歴' : 'Site Updates',
    description: isJa
      ? 'オナーオブキングス（HoK）攻略サイト Honor of Kings Hub の更新履歴。新ヒーローや装備の追加、統計の更新、解説の書き直しなど、掲載内容が変わった日を新しい順に並べています。'
      : 'What changed on Honor of Kings Hub and when: new heroes and items, statistics updates and rewritten guides, newest first.',
  });
}

export default async function UpdatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isJa = locale === 'ja';
  const trail = [{ name: isJa ? '更新履歴' : 'Site Updates', path: '/updates' }];

  return (
    <div className="pb-10">
      <BreadcrumbJsonLd locale={locale} trail={trail} />
      {/* 冒頭は見本（Tier表・ヒーロー一覧）と同じ .page-hero の帯。パンくずも帯に入れる */}
      <div className="page-hero border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-5 pt-3 pb-5 sm:px-7">
          <Breadcrumb locale={locale} trail={trail} />
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{isJa ? '更新履歴' : 'Site Updates'}</h1>
          {/* auto-phrase は文節で折る（Chrome）。390〜360px で「載せてい／ます」と語の途中で折れていた */}
          <p className="mt-1.5 text-sm font-bold leading-relaxed text-slate-600 [word-break:auto-phrase]">
            {isJa
              ? '掲載内容が変わった日だけを、新しい順に載せています。'
              : 'Only the days when the content changed, newest first.'}
          </p>
        </div>
      </div>
      {/* 影は暗い地で見えないので、1件ずつ線で区切ったカードにする */}
      <ol className="mx-auto max-w-3xl space-y-3 pt-4">
        {CHANGELOG.map((entry) => (
          <li key={entry.date} className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <time dateTime={entry.date} className="text-sm font-bold tabular-nums text-slate-500">
              {entry.date}
            </time>
            <p className="mt-1 text-sm leading-relaxed text-slate-800">{isJa ? entry.ja : entry.en}</p>
            {entry.path && (
              <Link
                href={entry.path}
                className="mt-2 inline-flex min-h-11 items-center text-sm font-bold text-brand-700 underline underline-offset-2"
              >
                {isJa ? 'このページを見る' : 'See the page'}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

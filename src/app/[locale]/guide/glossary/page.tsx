import { setRequestLocale } from 'next-intl/server';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { Link, routing } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd, Breadcrumb } from '@/components/seo/BreadcrumbJsonLd';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import { guidePageUpdatedAt, GUIDE_PUBLISHED } from '@/lib/contentDates';
import type { GuideData } from '../GuideClient';
import { glossaryAnchor } from './anchor';
import { CurrentTermMark } from './CurrentTermMark';
// 本文は /guide と同じ JSON の glossary。定義文はここにだけ出し、/guide 側は先頭の数語とリンクに縮めてある
// （同じ文を2か所に置くと、片方だけ直して古い説明が残る）
import guideJa from '@/data/guide/ja.json';
import guideEn from '@/data/guide/en.json';

/**
 * 用語集。もとは /guide の最後の節で、390px幅で画面23枚ぶん下にあった。
 *
 * 本文はサーバー部品だけで描く（開閉も絞り込みも無い）。クライアントで動くのは、
 * 飛んできた語に印を付ける CurrentTermMark だけで、これは何も描かない。
 * 各語に id を振り、横断検索（GlobalSearchModal）からその語へ直接飛べるようにしてある。
 */

const PATH = '/guide/glossary';
const ORIGIN = 'https://hok.hub-game.com';

const GLOSSARY: Record<'ja' | 'en', GuideData['glossary']> = { ja: guideJa.glossary, en: guideEn.glossary };

// id は日英で同じ語に同じ値を振る（hreflang で対になるページどうしでアンカーが一致するように）。
// 並びがずれたり重複したりしたら、ここでビルドを止める
{
  const ja = GLOSSARY.ja.map((g) => g.id);
  const en = GLOSSARY.en.map((g) => g.id);
  if (ja.join(',') !== en.join(',') || new Set(ja).size !== ja.length || ja.some((id) => !/^[a-z0-9-]+$/.test(id))) {
    throw new Error('guide/{ja,en}.json の glossary[].id が日英で一致していないか、重複・不正な文字がある');
  }
}

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// metadata・Article・DefinedTermSet の3つから参照する。片方だけ直すと食い違うので1か所にまとめる
function pageText(locale: string) {
  const isJa = locale === 'ja';
  const n = GLOSSARY[isJa ? 'ja' : 'en'].length;
  return {
    title: isJa ? `MOBA用語集（ガンク・ピール・CSなど${n}語）` : `MOBA Glossary: Gank, Peel, CS and ${n - 3} More Terms`,
    description: isJa
      ? `オナーオブキングス（HoK）の攻略で出てくるMOBA用語${n}語の意味と、試合のどこで効くかを1語ずつ説明しています。ガンク、ピール、リーシュ、ウェーブ管理、賞金首など。`
      : `What ${n} MOBA terms used in Honor of Kings (HoK) guides mean, and where each one matters in a match: gank, peel, leash, wave management, bounty and more.`,
    heading: isJa ? 'MOBA・HoK 用語集' : 'MOBA / HoK Glossary',
    lead: isJa
      ? `CSやガンクから賞金首まで${n}語。意味に加えて、試合のどこで効いてくるかも書いています。`
      : `${n} terms, from CS and ganks to bounties. Each entry covers what the word means and where it matters in a match.`,
    note: isJa ? '説明文は当サイトによる解説です。' : 'The explanations are written by this site.',
  };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { title, description } = pageText(locale);
  return buildPageMetadata({ locale, path: PATH, title, description, ogType: 'article' });
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 静的プリレンダに載せるために必要。呼ばないとこのページだけ動的レンダリングに落ちる
  setRequestLocale(locale);
  const isJa = locale === 'ja';
  const glossary = GLOSSARY[isJa ? 'ja' : 'en'];
  const { title, description, heading, lead, note } = pageText(locale);

  const trail = [
    { name: isJa ? '初心者ガイド' : "Beginner's Guide", path: '/guide' },
    { name: isJa ? '用語集' : 'Glossary', path: PATH },
  ];

  const url = `${ORIGIN}/${locale}${PATH}`;
  const setId = `${url}#terms`;
  const dateModified = guidePageUpdatedAt('glossary');
  const termSetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': setId,
    name: heading,
    description,
    url,
    inLanguage: isJa ? 'ja-JP' : 'en-US',
    datePublished: GUIDE_PUBLISHED.glossary,
    dateModified,
    hasDefinedTerm: glossary.map((g) => ({
      '@type': 'DefinedTerm',
      '@id': `${url}#${glossaryAnchor(g.id)}`,
      url: `${url}#${glossaryAnchor(g.id)}`,
      name: g.term,
      description: g.definition,
      inDefinedTermSet: { '@id': setId },
    })),
  };

  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={trail} />
      <ArticleJsonLd
        locale={locale}
        path={PATH}
        headline={title}
        description={description}
        datePublished={GUIDE_PUBLISHED.glossary}
        dateModified={dateModified}
      />
      {/* 構造化データは初期HTMLに要るので素の script で出す（BreadcrumbJsonLd と同じ理由） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termSetJsonLd).replace(/</g, '\\u003c') }}
      />

      <Breadcrumb locale={locale} trail={trail} className="max-w-3xl mx-auto px-4 pt-3" />

      {/* 冒頭の帯は page-hero（globals.css、Tier表・ヒーロー一覧と同じ）で、画面の幅いっぱいに敷く。
          中身の幅と左右の余白は、パンくずと本文の枠（max-w-3xl px-4）に揃える。
          px-4 は枠の内側に置く（外に置くと PC で題名がパンくずと本文より16px左に出た） */}
      <header className="page-hero border-b border-slate-200 mt-3 py-6">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <span className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-emerald-600">
              <BookOpen size={22} aria-hidden="true" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 [word-break:auto-phrase]">
              {heading}
            </h1>
          </div>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{lead}</p>
          {/* 注記も 14px（文字の下限。以前は 12px） */}
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{note}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-5 pb-8">

        {/* dt と dd の組を div で包む（dl の中で許されている形）。id は包んだ div に付け、
            検索から飛んできたときに語と説明がまとめて見えるようにする。
            scroll-mt はスマホの AppBar（56px、sticky）の裏に語が潜らない高さ。PC は AppBar が無い。
            飛んできた語には金の線を引く（金は線で使う。塗りは Tier S だけ）。:target は使わない。
            チップや検索からの移動（pushState）では付かない。直接開いた語には残るので、そこから別の語へ移ると線が2行に出る。
            印は CurrentTermMark が data-current で付ける */}
        <CurrentTermMark />
        {/* 語の区切りは slate-200 の線（ほかのカードの枠と同じ段）。slate-100 はカードの地（#1a1713）に近く、線がかすれて見えた */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <dl className="divide-y divide-slate-200">
            {glossary.map((g) => (
              <div
                key={g.id}
                id={glossaryAnchor(g.id)}
                className="scroll-mt-20 md:scroll-mt-6 px-4 py-4 sm:flex sm:gap-6 sm:px-6 first:rounded-t-2xl last:rounded-b-2xl data-current:bg-brand-50 data-current:shadow-[inset_3px_0_0_var(--color-brand-700)]"
              >
                <dt className="text-base font-black leading-snug text-slate-900 sm:w-52 sm:shrink-0 [word-break:auto-phrase]">
                  {g.term}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-slate-700 sm:mt-0">{g.definition}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Link
          href="/guide"
          className="mt-6 inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          <ChevronLeft size={18} aria-hidden="true" className="text-slate-500" />
          {isJa ? '初心者ガイドに戻る' : "Back to the Beginner's Guide"}
        </Link>
      </div>
    </>
  );
}

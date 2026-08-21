import { Link } from '@/i18n/routing';
import { Compass, Swords, TrendingUp, Trophy } from 'lucide-react';
import dataFreshness from '@/data/data_freshness.json';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import { JUNGLE_GUIDE } from '@/content/jungleGuide';

/**
 * ジャングル攻略。
 *
 * 本文は jungleGuide.ts。数字の出どころもそちらのコメントに書いてある。
 * 操作するものが無いのでサーバーコンポーネントのまま置き、初期HTMLに全文を出す。
 */

const PATH = '/guide/jungle';

function pageText(locale: string) {
  const isJa = locale === 'ja';
  return {
    title: isJa
      ? 'ジャングル攻略｜スマイト・ジャングル装備・立ち回り'
      : 'Jungle Guide: Smite, Jungle Items and Pathing',
    description: isJa
      ? 'オナーオブキングス（HoK）のジャングルの基本。スマイトが要る理由、250Gと700Gのジャングル装備の選び方、グリードバイトの採用率91.8%、ボスの時刻から逆算する動き方を、実測データつきで解説します。'
      : 'How the Honor of Kings (HoK) jungle works: why Smite is required, which 250g and 700g jungle item to buy, Rapacious Bite at a 91.8% pick rate, and how to plan around the objective timers.',
  };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { title, description } = pageText(locale);
  return buildPageMetadata({ locale, path: PATH, title, description });
}

export default async function JungleGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  const { title, description } = pageText(locale);
  const guide = JUNGLE_GUIDE[isJa ? 'ja' : 'en'];

  const related = [
    { href: '/guide/bosses', icon: Swords, label: isJa ? 'ボス攻略' : 'Objectives' },
    { href: '/guide/macro', icon: Compass, label: isJa ? 'レーン別の立ち回り' : 'Macro by Lane' },
    { href: '/items/usage', icon: TrendingUp, label: isJa ? 'アイテム採用率' : 'Item pick rates' },
    { href: '/tier-list/jungle', icon: Trophy, label: isJa ? 'ジャングルのTier表' : 'Jungle tier list' },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        trail={[
          { name: isJa ? '初心者ガイド' : "Beginner's Guide", path: '/guide' },
          { name: isJa ? 'ジャングル攻略' : 'Jungle Guide', path: PATH },
        ]}
      />
      <ArticleJsonLd
        locale={locale}
        path={PATH}
        headline={title}
        description={description}
        datePublished="2026-08-22"
        dateModified="2026-08-22"
      />

      <div className="w-full bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
        <div className="bg-white pt-8 pb-5 px-4 shadow-sm border-b border-slate-200">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {isJa ? 'ジャングル攻略' : 'Jungle Guide'}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm font-medium leading-relaxed text-slate-600">
            {guide.lead}
          </p>
        </div>

        <div className="px-4 mt-4 space-y-4">
          {guide.sections.map(section => (
            <section key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-black tracking-tight text-slate-900">{section.heading}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                  {paragraph}
                </p>
              ))}
              {section.rows && (
                <ul className="mt-4 space-y-2">
                  {section.rows.map(row => (
                    <li key={row.term} className="rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5">
                      <span className="text-[13px] font-black text-slate-800">{row.term}</span>
                      <span className="mt-0.5 block text-[12px] font-medium leading-relaxed text-slate-600">
                        {row.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              {isJa ? 'あわせて読む' : 'Related pages'}
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {related.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Icon size={16} className="shrink-0 text-brand-500" />
                  {label}
                </Link>
              ))}
            </div>
            <p className="mt-5 border-t border-slate-100 pt-4 text-xs font-medium leading-relaxed text-slate-400">
              {guide.sourceNote}
              {isJa
                ? `（統計は${dataFreshness.campStats.updatedAt}、装備セットは${dataFreshness.staticData.itemBuilds.updatedAt} 時点）`
                : ` (Statistics as of ${dataFreshness.campStats.updatedAt}; item sets as of ${dataFreshness.staticData.itemBuilds.updatedAt}.)`}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

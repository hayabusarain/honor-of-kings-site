'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Sprout, ChevronRight, AlertTriangle } from 'lucide-react';
import { BEGINNER_HEROES } from '@/content/beginnerHeroes';
import dataFreshness from '@/data/data_freshness.json';
import hokHeroes from '@/data/hok_heroes.json';

type HeroRow = { id: string; slug?: string; image?: string };

export default function BeginnerHeroesPage() {
  const locale = useLocale();
  const isJa = locale === 'ja';
  const lanes = BEGINNER_HEROES[isJa ? 'ja' : 'en'];

  const imageFor = (slug: string) => {
    const hero = (hokHeroes as HeroRow[]).find((h) => h.slug === slug);
    return hero ? `/images/heroes/${hero.id}.webp` : null;
  };

  return (
    <div className="w-full bg-background font-sans text-slate-800">
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <Sprout className="text-emerald-600" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none mb-1">
            {isJa ? 'レーン別・最初に選ぶヒーロー' : 'Which Hero to Start With'}
          </h1>
          <p className="text-slate-500 text-[10px] font-bold leading-relaxed">
            {isJa ? '5レーン × 2体。選んだ理由と弱みつき' : 'Two per lane, with the reasoning and the caveats'}
          </p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4 max-w-3xl mx-auto">
        {/* 選定基準を先に出す。何を根拠に選んだか分からない「おすすめ」にしない */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-black text-slate-900">
            {isJa ? '選び方' : 'How these were chosen'}
          </h2>
          <p className="mt-2 text-[13px] font-medium leading-relaxed text-slate-600">
            {isJa
              ? '全116体から、難易度が「イージー」か「ノーマル」で、かつ勝率48%以上のヒーローを機械的に絞ると49体が残ります。そこからレーンごとに2体を選びました。優先したのは、難易度がイージーであること、出現率が高く情報を探しやすいこと、そして弱みが最初の1体としてつまずきにくいものであることです。'
              : 'Filtering all 116 heroes down to those rated Easy or Normal in difficulty with a win rate of 48% or higher leaves 49. From those, two were picked per lane, favouring Easy difficulty, a high pick rate (so information is easy to find), and weaknesses that are not the kind to trip up a new player.'}
          </p>
          <p className="mt-3 text-[11px] font-medium leading-relaxed text-slate-500">
            {isJa
              ? `難易度はゲーム内表示の書き起こし、勝率・出現率は${dataFreshness.campStats.sourceJa}の統計（${dataFreshness.campStats.updatedAt}時点）です。どのヒーローを選ぶかの解説そのものは当サイトによるものです。`
              : `Difficulty is transcribed from the in-game display; win rate and pick rate come from ${dataFreshness.campStats.sourceEn} statistics (as of ${dataFreshness.campStats.updatedAt}). The selection and the write-ups are this site's own.`}
          </p>
        </section>

        {lanes.map((lane) => (
          <section key={lane.lane} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-black text-slate-900">{lane.lane}</h2>
            <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-slate-600">{lane.summary}</p>

            {lane.note && (
              <p className="mt-3 flex gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-[12px] font-bold leading-relaxed text-amber-900">
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600" />
                <span>{lane.note}</span>
              </p>
            )}

            <div className="mt-4 space-y-3">
              {lane.picks.map((pick) => {
                const img = imageFor(pick.slug);
                return (
                  <article key={pick.slug} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                    <Link
                      href={`/heroes/${pick.slug}`}
                      className="group flex items-center gap-3"
                    >
                      {img && (
                        <Image
                          src={img}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 bg-white object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[15px] font-black text-slate-900 group-hover:text-brand-700">
                            {pick.name}
                          </span>
                          <ChevronRight size={15} className="text-slate-300 group-hover:text-brand-500" />
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-black text-slate-500 border border-slate-200">
                            {pick.role}
                          </span>
                          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200">
                            {isJa ? `難易度 ${pick.difficulty}` : pick.difficulty}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <p className="mt-3 text-[13px] font-medium leading-relaxed text-slate-700">{pick.reason}</p>
                    <p className="mt-2 text-[12px] font-bold leading-relaxed text-slate-500">
                      <span className="text-rose-600">{isJa ? '先に知っておくこと — ' : 'Know going in — '}</span>
                      {pick.caveat}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-black text-slate-900">{isJa ? '次に読むもの' : 'Where to go next'}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/guide/bosses" className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-black text-slate-700 hover:border-brand-300 hover:text-brand-700">
              {isJa ? 'ボスの湧き時間' : 'Boss timings'}
            </Link>
            <Link href="/spells" className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-black text-slate-700 hover:border-brand-300 hover:text-brand-700">
              {isJa ? 'サモナースペルの選び方' : 'Choosing a summoner spell'}
            </Link>
            <Link href="/tier-list" className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-black text-slate-700 hover:border-brand-300 hover:text-brand-700">
              {isJa ? '現在のTier表' : 'Current tier list'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

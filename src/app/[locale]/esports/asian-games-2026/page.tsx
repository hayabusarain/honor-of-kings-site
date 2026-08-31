'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Trophy, CalendarDays, ExternalLink } from 'lucide-react';
import { ASIAN_GAMES_2026 } from '@/content/asianGames2026';

export default function AsianGames2026Page() {
  const locale = useLocale();
  const isJa = locale === 'ja';
  const c = ASIAN_GAMES_2026[isJa ? 'ja' : 'en'];

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-24 font-sans text-slate-800">
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
          <Trophy className="text-amber-600" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight mb-1">
            {c.title}
          </h1>
          <p className="text-slate-500 text-[10px] font-bold leading-relaxed">
            {isJa ? '第20回アジア競技大会（2026／愛知・名古屋）' : '20th Asian Games, Aichi-Nagoya 2026'}
          </p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4 max-w-3xl mx-auto">
        <p className="text-[14px] font-medium leading-relaxed text-slate-700">{c.lead}</p>

        {/* 読者が予定を空けるために要る情報を、最初に表で出す */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">
            <CalendarDays size={16} className="text-brand-700" />
            {isJa ? '確定している情報' : 'Confirmed details'}
          </h2>
          <dl className="divide-y divide-slate-100">
            {c.facts.map((f) => (
              <div key={f.label} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:gap-4">
                <dt className="shrink-0 text-[12px] font-black text-slate-500 sm:w-44">{f.label}</dt>
                <dd className="text-[13px] font-bold text-slate-900">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {c.sections.map((s) => (
          <section key={s.heading} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-black text-slate-900">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-2 text-[13px] font-medium leading-relaxed text-slate-600">
                {p}
              </p>
            ))}
          </section>
        ))}

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-black text-slate-900">{c.ctaHeading}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/tier-list" className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-black text-slate-700 hover:border-brand-300 hover:text-brand-700">
              {isJa ? '現在のTier表' : 'Current tier list'}
            </Link>
            <Link href="/heroes" className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-black text-slate-700 hover:border-brand-300 hover:text-brand-700">
              {isJa ? '全116体のヒーロー' : 'All 116 heroes'}
            </Link>
            <Link href="/guide/beginner-heroes" className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-black text-slate-700 hover:border-brand-300 hover:text-brand-700">
              {isJa ? '最初に選ぶヒーロー' : 'Which hero to start with'}
            </Link>
          </div>
        </section>

        {/* いつ・どこで裏を取ったかを明記する */}
        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[11px] font-medium leading-relaxed text-slate-500">
          {c.verifiedNote(ASIAN_GAMES_2026.verifiedOn)}
          <a
            href={ASIAN_GAMES_2026.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-flex items-center gap-1 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-700"
          >
            {isJa ? 'JESUの発表' : 'JESU announcement'}
            <ExternalLink size={11} />
          </a>
        </p>
      </div>
    </div>
  );
}

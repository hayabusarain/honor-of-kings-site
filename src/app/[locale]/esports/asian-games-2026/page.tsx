'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Trophy, ExternalLink } from 'lucide-react';
import { ASIAN_GAMES_2026 } from '@/content/asianGames2026';

// 夜の配色（2026-09-26）の固定ページ。節は金の縦線の見出し（.section-title）を持つカード
// 見出しと短い説明は [word-break:auto-phrase]（Chrome は文節で折る。ガイドのページと同じ）。
// 360px で「につい／て」「アク／セス」「ゲ／ーム攻略」など語の途中で折れていた
const CARD = 'rounded-2xl border border-slate-200 bg-white p-5 sm:p-7';
// 関連ページへの入口。主な操作なので高さ 44px
const CTA_LINK =
  'inline-flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700';

export default function AsianGames2026Page() {
  const locale = useLocale();
  const isJa = locale === 'ja';
  const c = ASIAN_GAMES_2026[isJa ? 'ja' : 'en'];

  return (
    <div className="w-full bg-background pb-10 font-sans text-slate-800">
      {/* 冒頭は見本（Tier表・ヒーロー一覧）と同じ .page-hero の帯。影は暗い地で見えないので線で区切る */}
      <div className="page-hero border-b border-slate-200">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 pt-6 pb-5 sm:px-7">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-300 bg-brand-50">
            <Trophy className="text-brand-700" size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-900 [word-break:auto-phrase]">
              {c.title}
            </h1>
            {/* 390px で「名／古屋」と地名の途中で折れたので、日本語は括弧の前でだけ折る */}
            <p className="mt-1 text-sm font-bold leading-relaxed text-slate-600">
              {isJa ? (
                <>
                  第20回アジア競技大会<wbr />
                  <span className="whitespace-nowrap">（2026／愛知・名古屋）</span>
                </>
              ) : (
                '20th Asian Games, Aichi-Nagoya 2026'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 文字は 14px 以上（2026-09-26）。本文は 13px だったのを 16px、表の項目名は 12px を 14px にした */}
      <div className="mx-auto mt-4 max-w-3xl space-y-4">
        <p className="px-5 text-base font-medium leading-relaxed text-slate-700 sm:px-7">{c.lead}</p>

        {/* 読者が予定を空けるために要る情報を、最初に表で出す */}
        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase] mb-2">
            {isJa ? '確定している情報' : 'Confirmed details'}
          </h2>
          <dl className="divide-y divide-slate-100">
            {c.facts.map((f) => (
              <div key={f.label} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-4">
                <dt className="shrink-0 text-sm font-bold text-slate-500 sm:w-44">{f.label}</dt>
                <dd className="text-base font-bold text-slate-900 [word-break:auto-phrase]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {c.sections.map((s) => (
          <section key={s.heading} className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 text-base font-medium leading-relaxed text-slate-700">
                {p}
              </p>
            ))}
            {/* 組み分けのように項目と値が対になるものは、冒頭の表と同じ組みで出す */}
            {s.list && (
              <dl className="mt-2 divide-y divide-slate-100">
                {s.list.map((r) => (
                  <div key={r.label} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-4">
                    <dt className="shrink-0 text-sm font-bold text-slate-500 sm:w-24">{r.label}</dt>
                    <dd className="text-base font-bold text-slate-900 [word-break:auto-phrase]">{r.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase]">{c.ctaHeading}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/tier-list" className={CTA_LINK}>
              {isJa ? '現在のTier表' : 'Current tier list'}
            </Link>
            <Link href="/heroes" className={CTA_LINK}>
              {isJa ? '全118体のヒーロー' : 'All 118 heroes'}
            </Link>
            <Link href="/guide/beginner-heroes" className={CTA_LINK}>
              {isJa ? '最初に選ぶヒーロー' : 'Which hero to start with'}
            </Link>
          </div>
        </section>

        {/* いつ・どこで裏を取ったかを明記する。2026-09-26 に出典が JESU の1本から12本になったので一覧にした */}
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:px-7">
          <p className="text-sm font-medium leading-relaxed text-slate-600">
            {c.verifiedNote(ASIAN_GAMES_2026.verifiedOn)}
          </p>
          <h2 className="mt-3 text-sm font-bold text-slate-500">{c.sourcesHeading}</h2>
          <ul className="mt-1">
            {c.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2"
                >
                  <span>{s.label}</span>
                  <ExternalLink size={14} className="shrink-0" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

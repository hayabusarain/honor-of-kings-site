import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from '@/components/common/Image';
import { Sprout, ChevronRight, AlertTriangle } from 'lucide-react';
import { BEGINNER_HEROES } from '@/content/beginnerHeroes';
import dataFreshness from '@/data/data_freshness.json';
import hokHeroes from '@/data/hok_heroes.json';
import { LaneIcon, RoleIcon, type LaneId, type RoleId } from '@/components/icons/GameIcons';

type HeroRow = { id: string; slug?: string; image?: string };

// beginnerHeroes.ts のレーン名・ロール名（表示用の文字列）から、印の図柄を引く。
// 表示の文言は変えずに、印だけを足すための対応表。載っていない名前は印を出さない
const LANE_ID: Record<string, LaneId> = {
  クラッシュレーン: 'CLASH', 'Clash Lane': 'CLASH',
  ファームレーン: 'FARM', 'Farm Lane': 'FARM',
  ジャングル: 'JUNGLE', Jungle: 'JUNGLE',
  ミッドレーン: 'MID', 'Mid Lane': 'MID',
  ローム: 'ROAM', Roam: 'ROAM',
};
const ROLE_ID: Record<string, RoleId> = {
  タンク: 'Tank', ファイター: 'Fighter', アサシン: 'Assassin',
  メイジ: 'Mage', マークスマン: 'Marksman', サポート: 'Support',
  Tank: 'Tank', Fighter: 'Fighter', Assassin: 'Assassin',
  Mage: 'Mage', Marksman: 'Marksman', Support: 'Support',
};
// 「ファイター／タンク」「Fighter / Tank」のような兼任は、ロールごとに印と名前を組にして並べる。
// 区切り（／ や " / "）は前のロールの後ろに付けて残す（表示の文字列は変えない）。
// 組ごとに折り返さないので、札が1行に入らない幅でも区切りの後ろでだけ折れる。
// 以前は印2つを頭にまとめていて、360px幅で「ファイター／タン｜ク」と語の途中で割れた
const roleParts = (role: string) => {
  const parts = role.split(/(\s*[／/]\s*)/);
  const out: { label: string; sep: string; id?: RoleId }[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    out.push({ label: parts[i], sep: parts[i + 1] ?? '', id: ROLE_ID[parts[i]] });
  }
  return out;
};

// サーバー部品。以前は 'use client' で、読むだけのページのために hok_heroes.json（全ヒーロー分）を
// クライアントのバンドルへ載せていた（監査の検査22）。ここで使うのは slug から画像の id を引くことだけ
export default async function BeginnerHeroesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 静的プリレンダに載せるために必要。呼ばないとこのページだけ動的レンダリングに落ちる
  setRequestLocale(locale);
  const isJa = locale === 'ja';
  const lanes = BEGINNER_HEROES[isJa ? 'ja' : 'en'];

  const imageFor = (slug: string) => {
    const hero = (hokHeroes as HeroRow[]).find((h) => h.slug === slug);
    return hero ? `/images/heroes/${hero.id}.webp` : null;
  };

  return (
    <div className="w-full bg-background font-sans text-slate-800">
      {/* 冒頭の帯は page-hero（globals.css、Tier表・ヒーロー一覧と同じ）。
          以前は bg-white に影の帯で、夜の配色では影が見えず、帯の下端が地に溶けていた。
          中身はパンくず・本文・FAQ と同じ枠（max-w-3xl px-4、layout.tsx）に置く。
          以前は帯の中身だけが全幅の左寄せで、PC では本文の枠より左に出ていた */}
      <div className="page-hero border-b border-slate-200 mt-3 py-5">
        <div className="max-w-3xl mx-auto px-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <Sprout className="text-emerald-600" size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            {/* 360px幅で「最初に選ぶヒー／ロー」と語の途中で割れ、leading-none のため2行が詰まって見えた。
                英語は360px幅で「Which Hero to Start / With」と1語だけ2行目に落ちたので、行の長さを揃える */}
            <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight mb-1 text-balance [word-break:auto-phrase]">
              {isJa ? 'レーン別・最初に選ぶヒーロー' : 'Which Hero to Start With'}
            </h1>
            {/* 14pxにしたら360px幅で「弱みつ／き」と語の途中で割れたので、文節で折る */}
            <p className="text-slate-600 text-sm font-bold leading-relaxed [word-break:auto-phrase]">
              {isJa ? '5レーン × 2体。選んだ理由と弱みつき' : 'Two per lane, with the reasoning and the caveats'}
            </p>
          </div>
        </div>
      </div>

      {/* 本文の文字は 14px 以上（2026-09-26、夜の配色への作り直しで決まった下限）。
          以前は説明が13px、注記と弱みが12px、ロールと難易度の札が10pxだった */}
      <div className="px-4 mt-4 space-y-4 max-w-3xl mx-auto">
        {/* 選定基準を先に出す。何を根拠に選んだか分からない「おすすめ」にしない */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="section-title">
            {isJa ? '選び方' : 'How these were chosen'}
          </h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
            {isJa
              ? '全ヒーローから、難易度が「イージー」か「ノーマル」で、かつ勝率48%以上のヒーローに機械的に絞り、そこからレーンごとに2体を選びました。優先したのは、難易度がイージーであること、出現率が高く情報を探しやすいこと、そして弱みが最初の1体としてつまずきにくいものであることです。'
              : 'All heroes were first filtered down to those rated Easy or Normal in difficulty with a win rate of 48% or higher. From those, two were picked per lane, favouring Easy difficulty, a high pick rate (so information is easy to find), and weaknesses that are not the kind to trip up a new player.'}
          </p>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
            {isJa
              ? `難易度はゲーム内表示の書き起こし、勝率・出現率は${dataFreshness.campStats.sourceJa}の統計（${dataFreshness.campStats.updatedAt}時点）です。どのヒーローを選ぶかの解説そのものは当サイトによるものです。`
              : `Difficulty is transcribed from the in-game display; win rate and pick rate come from ${dataFreshness.campStats.sourceEn} statistics (as of ${dataFreshness.campStats.updatedAt}). The selection and the write-ups are this site's own.`}
          </p>
        </section>

        {lanes.map((lane) => (
          <section key={lane.lane} className="rounded-2xl border border-slate-200 bg-white p-5">
            {/* レーンの印はTier表のレーンのタブと同じ図柄（GameIcons.tsx）。名前から引けないときは印を出さない */}
            <h2 className="section-title">
              {LANE_ID[lane.lane] && <LaneIcon lane={LANE_ID[lane.lane]} className="h-5 w-5 shrink-0 text-slate-500" />}
              {lane.lane}
            </h2>
            <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-600">{lane.summary}</p>

            {lane.note && (
              <p className="mt-3 flex gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-sm font-bold leading-relaxed text-amber-900">
                <AlertTriangle size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-amber-600" />
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
                          <span className="text-base font-black text-slate-900 group-hover:text-brand-700">
                            {pick.name}
                          </span>
                          <ChevronRight size={16} aria-hidden="true" className="text-slate-500 group-hover:text-brand-700" />
                        </div>
                        {/* 札は10pxから14pxにした。ロールには一覧と同じ色つきの印を添える */}
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex flex-wrap items-center gap-x-1 rounded-md bg-white px-1.5 py-0.5 text-sm font-bold text-slate-600 border border-slate-200">
                            {roleParts(pick.role).map((r) => (
                              <span key={r.label} className="inline-flex items-center gap-1 whitespace-nowrap">
                                {r.id && <RoleIcon role={r.id} className="h-3.5 w-3.5 shrink-0" />}
                                {r.label}
                                {r.sep}
                              </span>
                            ))}
                          </span>
                          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-sm font-bold text-emerald-700 border border-emerald-200">
                            {isJa ? `難易度 ${pick.difficulty}` : pick.difficulty}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">{pick.reason}</p>
                    <p className="mt-2 text-sm font-bold leading-relaxed text-slate-500">
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
          <h2 className="section-title">{isJa ? '次に読むもの' : 'Where to go next'}</h2>
          {/* 押す的は高さ44px（主な操作の下限）。以前は12pxの文字で高さ32pxだった */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/guide/bosses" className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-black text-slate-700 hover:border-brand-300 hover:text-brand-700">
              {isJa ? 'ボスの湧き時間' : 'Boss timings'}
            </Link>
            <Link href="/spells" className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-black text-slate-700 hover:border-brand-300 hover:text-brand-700">
              {isJa ? 'サモナースペルの選び方' : 'Choosing a summoner spell'}
            </Link>
            <Link href="/tier-list" className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-black text-slate-700 hover:border-brand-300 hover:text-brand-700">
              {isJa ? '現在のTier表' : 'Current tier list'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

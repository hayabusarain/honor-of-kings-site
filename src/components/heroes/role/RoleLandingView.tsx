import Image from 'next/image';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { StatsFreshnessNote } from '@/components/common/StatsFreshnessNote';
import { getTierBadgeStyle } from '@/lib/tierBadge';
import { LaneIcon, RoleIcon } from '@/components/icons/GameIcons';
import type { LaneId } from '@/content/laneTierPages';
import { ROLE_STATS_CAVEATS, ROLE_SUMMARY, ROLE_UI, type RoleId } from '@/content/roleLandings';
import type { RoleHeroCard, RoleLandingData } from '@/lib/roleLanding';

/**
 * ロール別のヒーロー一覧の本体。
 *
 * サーバーコンポーネント。操作するものが無いので状態を持たない。絞り込みや並び替えを
 * したい読者はヒーロー一覧（?role=）へ回す。要約と格子は初期HTMLにそのまま載る。
 * 中身がリンクの並びだけのページにしないため、要約（数えた内訳）を先頭に置く。
 */

type Loc = 'ja' | 'en';

export type OtherRoleLink = { slug: string; id: RoleId; name: string; count: number };

type Props = {
  locale: string;
  data: RoleLandingData;
  /** 格子のカードに出す短いレーン名（「クラッシュ」「Clash」） */
  laneShort: Record<LaneId, string>;
  otherRoles: OtherRoleLink[];
};

/**
 * 名前を本体と括弧書きに分ける（「元流の子（メイジ）」「Flowborn (Mage)」）。
 * ヒーロー一覧のカードと同じ扱い。1行に収めると括弧の中が切れ、元流の子どうしが見分けられない
 */
const splitName = (name: string): [string, string | null] => {
  const m = name.match(/^(.+?)\s*([（(][^（()）]+[）)])$/);
  return m ? [m[1], m[2]] : [name, null];
};

function HeroCard({ hero, loc, laneShort, eager }: { hero: RoleHeroCard; loc: Loc; laneShort: Record<LaneId, string>; eager: boolean }) {
  const [nameBase, nameQualifier] = splitName(hero.name);
  return (
    <li>
      <Link href={hero.href} className="group flex h-full flex-col items-center gap-1.5">
        <span className="relative h-[76px] w-[76px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-20 sm:w-20">
          {/* 名前は下に文字で出すので、画像は読み上げない。
              priority は Next 16 で非推奨なので、最初の段だけ loading="eager" にする */}
          <Image
            src={hero.image}
            alt=""
            width={80}
            height={80}
            loading={eager ? 'eager' : 'lazy'}
            className="h-full w-full scale-[1.05] object-cover"
          />
          {/* Tier と「調整前」は顔の上に重ねるので、DOM では名前より前に来る。
              そのまま読ませるとリンク名が「Tier S 蔡文姫…」になるので、読み上げは名前のあとの sr-only に回す */}
          {hero.tier && (
            <span aria-hidden="true" className={`absolute top-0 right-0 rounded-bl-lg border px-1.5 py-1 text-sm font-black leading-none ${getTierBadgeStyle(hero.tier)}`}>
              {hero.tier}
            </span>
          )}
          {/* 統計が直近の調整前のままの体。勝率の下に置くと、その体だけ数字の位置が上にずれて
              同じ段の勝率が揃わなかったので、顔の下端に帯で重ねる */}
          {hero.prePatch && (
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 border-t border-amber-200 bg-amber-50 text-center text-sm font-bold leading-tight text-amber-800">
              {ROLE_UI.prePatch[loc]}
            </span>
          )}
        </span>
        <span className="flex w-full flex-1 flex-col items-center gap-0.5">
          {/* ふりがなは振らない。Tier表の格子と同じ扱いで、読みはヒーロー一覧とヒーロー詳細にある。
              英語名は空白で2行に折る（「Gao Changgong」が1行だと切れる）。カタカナ名は語の途中で折らず1行で省略する。
              名前の行だけ、左右の間隔（gap-x-3）の半分ずつまで広げる。360px の1マスは101pxで、
              14px の8字（「フロレンティーノ」「（マークスマン）」112px）が省略されていた。広げると113px */}
          <span className="flex w-[calc(100%+0.75rem)] flex-col items-center text-sm font-bold leading-tight text-slate-800 transition-colors group-hover:text-brand-700">
            <span className={`w-full text-center ${loc === 'en' ? 'line-clamp-2 break-words' : 'truncate'}`}>
              {nameBase}
            </span>
            {nameQualifier && <span className="w-full truncate text-center">{nameQualifier}</span>}
          </span>
          {(hero.tier || hero.prePatch) && (
            <span className="sr-only">{ROLE_UI.cardSr[loc](hero.tier, hero.prePatch)}</span>
          )}
          {/* 同じ段で名前が1行と2行のカードが混ざっても、数字の位置は下端で揃える */}
          <span className="mt-auto flex flex-col items-center">
            {/* レーンは図柄と短い名前。Tier表・ヒーロー一覧と同じ図柄（GameIcons） */}
            {hero.lane && (
              <span className="flex items-center gap-0.5 text-sm font-bold leading-tight text-slate-500">
                <LaneIcon lane={hero.lane} className="h-3.5 w-3.5 shrink-0" />
                {laneShort[hero.lane]}
              </span>
            )}
            {hero.winRate !== null ? (
              <span className="text-sm font-black tabular-nums leading-tight text-slate-800">
                <span className="sr-only">{ROLE_UI.winRate[loc]} </span>
                {hero.winRate.toFixed(2)}%
              </span>
            ) : (
              <span className="text-sm font-bold leading-tight text-slate-500">{ROLE_UI.noStats[loc]}</span>
            )}
          </span>
        </span>
      </Link>
    </li>
  );
}

export function RoleLandingView({ locale, data, laneShort, otherRoles }: Props) {
  const loc: Loc = locale === 'ja' ? 'ja' : 'en';
  const { facts, heroes, lanes, landing } = data;
  const roleName = facts.roleName;
  const summary = ROLE_SUMMARY[loc](facts);
  const caveats = ROLE_STATS_CAVEATS[loc](facts);

  const chip =
    'inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition-colors hover:border-brand-700 hover:text-brand-700';

  return (
    // シェル（MobileAppShell）が <main> を持っているので、ここは div
    <div className="w-full bg-background px-1 pb-10">
      {/* 冒頭の帯は page-hero（夜の配色、globals.css）。ヒーロー一覧・基本ステータスと同じく
          シェルの幅いっぱいに敷く（-mx-1 でこの部品の px-1 を打ち消す）。
          図柄はヒーロー一覧のロールの絞り込みと同じもの（GameIcons。ロールごとの色つき） */}
      <div className="page-hero -mx-1 flex items-center gap-2.5 border-b border-slate-200 px-4 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <RoleIcon role={landing.id} className="h-5 w-5" />
        </span>
        {/* auto-phrase はガイドの見出しと同じ。無いと 360px で「ファイターのヒ／ーロー一覧」と語の途中で折れた */}
        <h1 className="text-xl font-black tracking-tight text-slate-900 text-balance [word-break:auto-phrase] sm:text-2xl">
          {ROLE_UI.heading[loc](roleName, facts.count)}
        </h1>
      </div>

      {/* 数えた内訳。ページの本文はここで、格子より先に置く */}
      <section aria-labelledby="role-summary" className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        {/* 節の見出しは下の2つと同じ section-title（金の縦線）。カードの中でも同じ段の見出しとして揃える */}
        <h2 id="role-summary" className="section-title">
          {ROLE_UI.summaryHeading[loc](roleName)}
        </h2>
        <div className="mt-2 max-w-3xl space-y-2">
          {summary.map((p, i) => (
            <p key={i} className="text-sm font-medium leading-relaxed text-slate-700">{p}</p>
          ))}
        </div>
        {caveats.length > 0 && (
          <div className="mt-3 max-w-3xl space-y-1">
            {caveats.map((c, i) => (
              <p key={i} className="text-sm font-bold leading-relaxed text-slate-600">{c}</p>
            ))}
          </div>
        )}
        {/* 取得日と出典。調整前の断りは、このロールに当たる体だけを上で名前で出している。
            全体の8体を並べると、このロールに関係の無い名前が混ざる。
            ID が空で本文だけ入っているときだけ、全体の注記に任せる */}
        <StatsFreshnessNote locale={locale} showPatchBasis={data.patchBasisWithoutIds} className="mt-3 max-w-3xl" />
      </section>

      <section aria-labelledby="role-grid" className="mt-8">
        <h2 id="role-grid" className="section-title">
          {ROLE_UI.gridHeading[loc](roleName)}
        </h2>
        <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">{ROLE_UI.gridOrder[loc]}</p>
        {/* 列数はヒーロー一覧の格子と同じ。カード1枚の幅を約100px以上に保つ */}
        <ul className="mt-4 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
          {/* 1280px の最初の段は8枚。スマホでは最初の画面に3枚しか入らないが、軽い webp なので揃えて先に読む */}
          {heroes.map((hero, i) => (
            <HeroCard key={hero.id} hero={hero} loc={loc} laneShort={laneShort} eager={i < 8} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="role-more" className="mt-10">
        <h2 id="role-more" className="section-title">{ROLE_UI.moreHeading[loc]}</h2>

        <Link
          href={`/heroes?role=${landing.id}`}
          className="group mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-700"
        >
          <SlidersHorizontal size={20} className="shrink-0 text-brand-700" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            {/* auto-phrase が無いと 360px で「マークスマンを絞り／込む」と語の途中で折れた */}
            <span className="block text-sm font-black text-slate-900 [word-break:auto-phrase] group-hover:text-brand-700">{ROLE_UI.toList[loc](roleName)}</span>
            <span className="mt-0.5 block text-sm font-medium leading-relaxed text-slate-600">{ROLE_UI.toListDesc[loc]}</span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-slate-500" aria-hidden="true" />
        </Link>

        {lanes.length > 0 && (
          <>
            <h3 className="mt-6 text-sm font-black text-slate-800">{ROLE_UI.lanesHeading[loc](roleName)}</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {lanes.map((l) => (
                <li key={l.id}>
                  <Link href={`/tier-list/${l.slug}`} className={chip}>
                    <LaneIcon lane={l.id} className="h-4 w-4 text-slate-500" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <h3 className="mt-6 text-sm font-black text-slate-800">{ROLE_UI.otherRolesHeading[loc]}</h3>
        <ul className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {otherRoles.map((r) => {
            return (
              <li key={r.slug}>
                {/* 名前と体数は2段。1行に並べると、360px の英語で「Figh…」「Assas…」と名前が切れた */}
                <Link
                  href={`/heroes/role/${r.slug}`}
                  className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-colors hover:border-brand-700 sm:w-auto sm:min-w-36"
                >
                  <RoleIcon role={r.id} className="h-4 w-4 shrink-0" />
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm font-bold text-slate-700">{r.name}</span>
                    <span className="text-sm font-bold tabular-nums text-slate-500">{ROLE_UI.count[loc](r.count)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

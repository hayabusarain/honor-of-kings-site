'use client';

import { Fragment, useSyncExternalStore } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from '@/components/common/Image';
import { Trophy, Users, Hexagon, BookOpen, ShoppingBag, FileText, ChevronRight, Zap, BarChart3, ExternalLink, TrendingUp, TrendingDown, SlidersHorizontal, Calculator, Swords, Sprout, Ban, Info } from "lucide-react";
import dataFreshness from '@/data/data_freshness.json';
import { StatsFreshnessNote } from '@/components/common/StatsFreshnessNote';
import { LaneIcon, RoleIcon } from '@/components/icons/GameIcons';
import { getTierBadgeStyle } from '@/lib/tierBadge';
// 型だけを取る（値を import すると homeSections.ts ごと patches.json などがクライアントのバンドルに載る）
import type { HomeSections, HomeHeroRef, PatchChangeCard } from '@/lib/homeSections';

/**
 * 名前を本体と括弧書きに分ける（「元流の子（マークスマン）」→「元流の子」「（マークスマン）」）。
 * 括弧の前の空白は括弧書きの側に残す（英語の「Flowborn (Marksman)」で空白が消えないように）
 */
const splitHeroName = (name: string): [string, string | null] => {
  const m = name.match(/^(.+?)(\s*[（(][^（()）]+[）)])$/);
  return m ? [m[1], m[2]] : [name, null];
};

/** 名前は括弧の前でだけ折る（「元流の子 / （マークスマン）」）。語の途中では折らない */
function HeroName({ name }: { name: string }) {
  const [base, qualifier] = splitHeroName(name);
  return qualifier ? <>{base}<wbr />{qualifier}</> : <>{base}</>;
}

/** 顔の小さな画像。名前は横に文字で出すので読み上げない */
function HeroFace({ hero, size }: { hero: HomeHeroRef; size: 28 | 40 | 48 }) {
  const box = size === 48 ? 'h-12 w-12 rounded-xl' : size === 40 ? 'h-10 w-10 rounded-xl' : 'h-7 w-7 rounded-lg';
  return (
    <span className={`relative shrink-0 overflow-hidden bg-slate-100 ring-1 ring-slate-200 ${box}`}>
      <Image src={hero.image} alt="" fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}

// 強化・弱体・調整の札。色は Tier表とヒーロー一覧の「直近パッチで強化/弱体」の札と同じ系統
const CHANGE_TONE: Record<PatchChangeCard['changeType'], string> = {
  buff: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  nerf: 'border-rose-300 bg-rose-50 text-rose-700',
  adjust: 'border-amber-300 bg-amber-50 text-amber-800',
};

/**
 * このサイトにしか無い5本。ショートカットとは別の節に出す。
 * ここに並べるのは「他所で代替できないもの」だけにする。
 * 一覧や個別ページはショートカット側の担当
 */
// 日本語名は折り返してよい位置で区切って持つ。スマホの2列では名前の幅が 68〜83px しかなく、
// 区切りが無いと「アイテム採用 / 率」「最初に選ぶヒ / ーロー」のように語の途中で割れていた
const TOOL_LINKS = [
  { href: '/items/usage', Icon: TrendingUp, tint: 'bg-emerald-50 text-emerald-600', ja: ['アイテム', '採用率'], en: 'Item Pick Rates' },
  { href: '/items/simulator', Icon: SlidersHorizontal, tint: 'bg-blue-50 text-blue-600', ja: ['装備', 'シミュレータ'], en: 'Build Simulator' },
  { href: '/arcana/calculator', Icon: Calculator, tint: 'bg-brand-50 text-brand-700', ja: ['アルカナ', '計算機'], en: 'Arcana Calculator' },
  { href: '/guide/bosses', Icon: Swords, tint: 'bg-amber-50 text-amber-600', ja: ['ボス攻略'], en: 'Boss Guide' },
  { href: '/guide/beginner-heroes', Icon: Sprout, tint: 'bg-rose-50 text-rose-600', ja: ['最初に選ぶ', 'ヒーロー'], en: 'Heroes to Start With' },
] as const;

// バナーの期限は外部から通知されるものではないので、購読は何もしない
const bannerSubscribe = () => () => {};

// 節の見出しの行。右の「すべて見る」は文字だけだと 60×16px の的なので、行の高さを 44px にして的を広げる
function SectionHead({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-3 px-4 mb-1">
      <h2 className="section-title">{title}</h2>
      {href && linkLabel && (
        <Link href={href} className="inline-flex min-h-11 shrink-0 items-center text-sm font-bold text-brand-700 active:text-brand-800 transition-colors">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export function HomeClient({ sections, showAsianGamesBanner, asianGamesBannerUntil }: {
  /**
   * トップの節の中身。統計（hero_stats_camp.json と前回分）とパッチ（patches.json 約180KB）から
   * サーバー側（src/lib/homeSections.ts）で組み立てた結果だけを受け取る。
   * クライアントで求めると、それらの JSON がトップのバンドルに載る
   */
  sections: HomeSections;
  /** アジア競技大会のバナーを出すか。ビルド時にサーバー側で判定した値 */
  showAsianGamesBanner: boolean;
  /** 同バナーの表示期限（ISO8601、+09:00 付き）。マウント後の再判定に使う */
  asianGamesBannerUntil: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Home");
  const r = useTranslations("Role");
  const ja = locale === 'ja';
  const pct = (n: number) => `${n.toFixed(1)}%`;

  // レーン名は messages の Role を通す（ヒーロー詳細の laneLabel と同じ形）。
  // 札に Tier と勝率と並べるので、Tier表と同じ短縮で括弧と " Lane" を落とす。
  // 「クラッシュ (Clash)」→「クラッシュ」、「Clash Lane」→「Clash」
  const shortRoleLabel = (role: string) => {
    const key = String(role || '').toLowerCase();
    if (!['clash', 'jungle', 'mid', 'farm', 'roam'].includes(key)) return role;
    return r(key).replace(/\s*\(.+\)$/, '').replace(/\s+Lane$/, '');
  };

  // 「調整前」の帯と、その意味を説明する注記はセットで出す。片方だけ出ると読者が判断できない。
  // 統計を取り直して patchBasisHeroIds が空になれば両方消える。
  // パッチ名は帯を出すヒーロー集合と同じ campStats から取る
  const prePatchIds = dataFreshness.campStats.patchBasisHeroIds as string[];
  const pendingPatch = ja ? dataFreshness.campStats.patchBasisPatchJa : dataFreshness.campStats.patchBasisPatchEn;
  const showPrePatchNote = Boolean(pendingPatch) && sections.lanes.some((l) => l.heroes.some((h) => h.isPrePatch));

  // バナーの期限判定はビルド時に済んでいるが、ページは完全な静的配信なので、
  // 期限を過ぎてもデプロイが無い間は古い判定のHTMLが出続ける。
  // サーバー用スナップショットにはサーバーの判定をそのまま返し（ハイドレーション
  // 不一致を避ける）、クライアントでは実時刻で見直す（NotFoundLinks.tsx と同じ書き方）
  const showBanner = useSyncExternalStore(
    bannerSubscribe,
    () => showAsianGamesBanner && Date.now() < Date.parse(asianGamesBannerUntil),
    () => showAsianGamesBanner,
  );

  const { patch, movers } = sections;
  const breakdown = patch
    ? ([['buff', patch.buff], ['nerf', patch.nerf], ['adjust', patch.adjust]] as const)
        .filter(([, n]) => n > 0)
        .map(([k, n]) => `${t(k === 'buff' ? 'badgeBuff' : k === 'nerf' ? 'badgeNerf' : 'badgeAdjust')}${ja ? '' : ' '}${n}`)
        .join(ja ? '・' : ', ')
    : '';

  // ショートカット8枚。同じ組み方のカードを8回書いていたのを1つにまとめた。
  // 見出しと説明の一部は messages の Home にあり、残りはここで出し分ける
  const quickLinks = [
    {
      href: '/heroes', Icon: Users, tint: 'bg-blue-50 text-blue-600', title: t('qaHerosTitle'),
      desc: ja ? `全${sections.heroCount}体のヒーローデータ` : `Data for all ${sections.heroCount} heroes`,
    },
    { href: '/patches', Icon: FileText, tint: 'bg-slate-100 text-slate-600', title: t('qaPatchTitle'), desc: t('qaPatchDesc') },
    { href: '/guide', Icon: BookOpen, tint: 'bg-teal-50 text-teal-600', title: t('qaGuideTitle'), desc: t('qaGuideDesc') },
    { href: '/tier-list', Icon: Trophy, tint: 'bg-brand-50 text-brand-700', title: t('qaTierTitle'), desc: t('qaTierDesc') },
    {
      href: '/items', Icon: ShoppingBag, tint: 'bg-amber-50 text-amber-600',
      title: ja ? 'アイテム一覧' : 'Items',
      desc: ja ? '装備のステータスと効果' : 'Item stats and effects',
    },
    {
      href: '/arcana', Icon: Hexagon, tint: 'bg-violet-50 text-violet-600',
      title: ja ? 'アルカナ一覧' : 'Arcana',
      desc: ja ? 'アルカナのステータスと効果' : 'Arcana stats and effects',
    },
    // 全ヒーローの実測ステータスを並び替えて比べられる一覧。
    // これまでヒーロー詳細からしか入口が無かった
    {
      href: '/heroes/stats', Icon: BarChart3, tint: 'bg-emerald-50 text-emerald-600',
      title: ja ? '基本ステータス比較' : 'Base Stat Rankings',
      desc: ja ? 'HP・攻撃・移動速度を並び替えて比べる' : 'Sort heroes by HP, attack and move speed',
    },
    // サイドバーではアイテム・アルカナと同格なのに、トップからの導線だけ無かった
    {
      href: '/spells', Icon: Zap, tint: 'bg-orange-50 text-orange-600',
      title: ja ? 'サモナースペル' : 'Summoner Spells',
      desc: ja ? '全11種の効果と使いどころ' : 'All 11 spells and when to take them',
    },
  ];

  // シェル（MobileAppShell）がすでに <main> を持っている。ここを main にすると
  // 読み上げのメインランドマークが2つ出るので div にする。
  // min-h-screen も外す。シェル側の min-h-[100dvh] が効いている
  return (
    <div className="pb-8 bg-background text-slate-900">

      {/* 冒頭の帯。夜の配色では、ほかのページと同じ page-hero（淡い金の光）にした（2026-09-26）。
          以前は白い背景画像（hero_banner_bg_light.jpg）に白磁のグラデーションを重ねていたが、
          暗い地では灰色のもやにしか見えず、最初に読み込む画像（24KB、priority）でもあった */}
      <header className="page-hero relative mb-8 overflow-hidden rounded-b-3xl border border-t-0 border-slate-200 px-5 pb-8 pt-4 sm:px-8">
        {/* 運営元のポータルへの導線。リンク集（noindex）にしか無く、トップからは
            辿れなかった。帯の右上に置き、サイト内ナビと混ざらないよう線の札にする。
            高さは 44px（以前は約34px） */}
        <div className="flex justify-end">
          <a
            href="https://hub-game.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 transition-colors hover:border-brand-300"
          >
            <span className="text-sm font-black tracking-wider text-slate-700">HUB-GAME</span>
            <span className="hidden text-sm font-bold text-slate-600 sm:inline">
              {ja ? '同じ運営者のゲーム攻略ポータル' : 'Our other game guides'}
            </span>
            <ExternalLink size={14} className="shrink-0 text-slate-500" />
          </a>
        </div>

        <div className="mt-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 w-fit mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            {/* 初訪問者が最初に確かめるのは「このサイトは生きているか」。出すのはサイトの最終更新日。
                統計の取得日は、その数字を出している節（すぐ下の注記）・Tier表・ヒーロー詳細・フッターに書いてある */}
            <span className="text-sm font-bold text-slate-600 tracking-wide">
              {ja ? `最終更新 ${dataFreshness.site.lastUpdated}` : `Updated ${dataFreshness.site.lastUpdated}`}
            </span>
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-[1.2] mb-2">
            Honor of Kings <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-800 to-brand-600">
              {ja ? '攻略データベース' : 'Strategy Database'}
            </span>
          </h1>

          {/* 360px では「最新のTier / 表」と語の途中で割れたので、文節で折って行の長さを揃える */}
          <p className="text-sm font-bold text-slate-600 leading-relaxed text-balance [word-break:auto-phrase]">
            {ja
              ? `全${sections.heroCount}体のヒーロー詳細データと最新のTier表`
              : `Detailed stats and tier list for all ${sections.heroCount} heroes.`}
          </p>
        </div>
      </header>

      {/* レーン別の注目ヒーロー。各レーンで Tier の高い順に3体（同じ Tier なら勝率順。Tier表と同じ並べ方）。
          2026-09-28 までは1レーン1体だった。MLBB Hub のトップ（レーンごとに3体）にならって増やした。
          並べ方を変えたら、metaLead の説明も直すこと */}
      <section className="mb-8">
        <SectionHead title={t('metaTitle')} href="/tier-list" linkLabel={ja ? 'すべて見る' : 'See all'} />
        <p className="px-4 text-sm text-slate-600 leading-relaxed [word-break:auto-phrase]">{t('metaLead')}</p>
        {/* 勝率とTierを見せる以上、いつ取ったかを添える。日付（<time>）の中では折らない */}
        <StatsFreshnessNote locale={locale} showPatchBasis={false} className="px-4 mt-1 mb-2 [word-break:auto-phrase] [&_time]:whitespace-nowrap" />

        {/* 各レーンの最上位に統計の取得後に調整されたヒーローが入った日だけ出す（該当カードの札とセット） */}
        {showPrePatchNote && (
          <div className="px-4 mb-3">
            <p className="text-sm font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed">
              {ja
                ? `「調整前」のヒーローは${pendingPatch}で調整が入った。勝率とTierは、その前に取得した数値です。`
                : `Heroes marked "Pre-patch" were adjusted in ${pendingPatch}. Their win rate and tier were taken before that change.`}{' '}
              <Link href="/tier-list" className="text-amber-900 underline underline-offset-2 whitespace-nowrap">
                {ja ? `対象の${prePatchIds.length}体を見る` : `See all ${prePatchIds.length} heroes`}
              </Link>
            </p>
          </div>
        )}

        {/* 1レーン1枚のカードに3行。2列は lg（本文が約730px）から。
            カードの幅が300px前後になる3列（xl）と sm の2列では、顔・Tier・数字を除いた名前の幅が約75pxしか残らず、
            「アンジェ / ラ」と語の途中で割れていた（2026-09-28 に 1280px で確認） */}
        <div className="grid gap-3 px-4 lg:grid-cols-2">
          {sections.lanes.map(({ lane, heroes }) => (
            <div key={lane} className="rounded-2xl border border-slate-200 bg-white p-3">
              <h3 className="flex items-center gap-1.5 px-1 pb-2 text-sm font-black text-slate-700">
                <LaneIcon lane={lane} className="h-4 w-4 shrink-0 text-brand-700" />
                {shortRoleLabel(lane)}
              </h3>
              <ul className="flex flex-col gap-1">
                {heroes.map((hero) => (
                  <li key={hero.id}>
                    <Link
                      href={`/heroes/${hero.slug}`}
                      className="flex min-h-11 items-center gap-2.5 rounded-xl px-1 py-1 transition-colors hover:bg-slate-50"
                    >
                      <HeroFace hero={hero} size={40} />
                      {/* Tier表・ヒーロー一覧と同じ素の S/A/B/C と配色（金の塗りは S だけ） */}
                      <span className={`flex h-6 min-w-6 shrink-0 items-center justify-center rounded-md border px-1 text-sm font-black leading-none ${getTierBadgeStyle(hero.tier)}`}>
                        <span className="sr-only">Tier </span>{hero.tier}
                      </span>
                      <span className="min-w-0 flex-1 text-base font-black leading-snug text-slate-900 break-keep wrap-anywhere">
                        <HeroName name={hero.name} />
                        {showPrePatchNote && hero.isPrePatch && (
                          <span className="ml-1.5 rounded-md border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-sm font-bold leading-none text-amber-800">
                            {t('metaPrePatchBadge')}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-right text-sm tabular-nums">
                        <span className="sr-only">{ja ? '勝率' : 'Win rate'} </span>
                        <span className="font-black text-emerald-700">{pct(hero.winRate)}</span>
                        <span className="text-slate-500"> / </span>
                        <span className="sr-only">{ja ? '出現率' : 'Pick rate'} </span>
                        <span className="font-bold text-slate-600">{pct(hero.pickRate)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 最新パッチの変更。調整されたヒーロー全員を、最初の変更1行と残りの件数で並べる（MLBB Hub のトップにならった）。
          2026-09-28 までは強化されたヒーローだけの横スクロールで、弱体化は出ていなかった。
          中身は公式パッチノートの書き起こし（patches.json）。要約（見出しの「— 」の後ろ）は当サイトの言葉 */}
      {patch && (
        <section className="mb-8">
          <SectionHead title={t('patchTitle')} href={`/patches/${patch.date}`} linkLabel={t('patchAll', { label: patch.label })} />
          <p className="px-4 mb-3 text-sm text-slate-600 leading-relaxed [word-break:auto-phrase]">
            {t('patchLead', { label: patch.label, count: patch.cards.length, breakdown })}
          </p>
          <ul className="grid gap-2 px-4 lg:grid-cols-2">
            {patch.cards.map((card) => (
              <li key={card.hero.id}>
                <Link
                  href={`/heroes/${card.hero.slug}`}
                  className="flex h-full flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white p-3 transition-colors hover:border-brand-300"
                >
                  <span className="flex items-center gap-2.5">
                    <HeroFace hero={card.hero} size={40} />
                    <span className="min-w-0 flex-1 text-base font-black leading-snug text-slate-900 break-keep wrap-anywhere">
                      <HeroName name={card.hero.name} />
                    </span>
                    <span className={`shrink-0 rounded-md border px-2 py-0.5 text-sm font-bold ${CHANGE_TONE[card.changeType]}`}>
                      {t(card.changeType === 'buff' ? 'badgeBuff' : card.changeType === 'nerf' ? 'badgeNerf' : 'badgeAdjust')}
                    </span>
                  </span>
                  {card.summary && (
                    <span className="text-sm font-bold leading-snug text-slate-800 [word-break:auto-phrase]">
                      {ja ? card.summary : card.summary.charAt(0).toUpperCase() + card.summary.slice(1)}
                    </span>
                  )}
                  {card.firstChange && (
                    <span className="text-sm leading-snug text-slate-600 line-clamp-3">
                      {card.firstChange.section && <span className="font-bold text-slate-700">{card.firstChange.section}: </span>}
                      {card.firstChange.text}
                    </span>
                  )}
                  {/* 残りの件数は3行で切る文の外に置く。中に入れていたときは、スマホで6枚中5枚の件数が「…」に隠れていた */}
                  {card.moreCount > 0 && (
                    <span className="text-sm font-bold text-brand-700">{t('patchMore', { count: card.moreCount })}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 前回の集計から勝率が動いたヒーロー。MLBB Hub は日次の推移から7日前と比べるが、
          HoK は公式の集計を取った回ごとの2点（hero_stats_camp_prev.json と今の分）しか持っていないので、
          「今週」ではなく日付を出して「前回から」と書く。少ない試合数の振れを拾わないよう、出現率の下限で絞る */}
      {(movers.up.length > 0 || movers.down.length > 0) && (
        <section className="mb-8">
          <SectionHead title={t('moversTitle')} href="/tier-list" linkLabel={t('tierLink')} />
          <p className="px-4 mb-3 text-sm text-slate-600 leading-relaxed [word-break:auto-phrase]">
            {t('moversLead', { from: movers.from, to: movers.to, min: sections.minPickRate })}
          </p>
          <div className="grid gap-3 px-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {([['up', movers.up], ['down', movers.down]] as const).map(([dir, list]) => (
              <div key={dir} className="rounded-2xl border border-slate-200 bg-white p-3">
                <h3 className="flex items-center gap-1.5 px-1 pb-2 text-sm font-black text-slate-700">
                  {dir === 'up'
                    ? <TrendingUp size={16} className="shrink-0 text-emerald-700" />
                    : <TrendingDown size={16} className="shrink-0 text-rose-700" />}
                  {t(dir === 'up' ? 'moversUp' : 'moversDown')}
                </h3>
                <div className="flex justify-between px-1 pb-1 text-sm font-bold text-slate-500" aria-hidden="true">
                  <span>{t('moversColHero')}</span>
                  <span>{t('moversColChange')}</span>
                </div>
                <ul className="flex flex-col gap-1">
                  {list.map((m) => (
                    <li key={m.hero.id}>
                      <Link href={`/heroes/${m.hero.slug}`} className="flex min-h-11 items-center gap-2.5 rounded-xl px-1 py-1 transition-colors hover:bg-slate-50">
                        <HeroFace hero={m.hero} size={28} />
                        <span className="min-w-0 flex-1 text-sm font-black leading-snug text-slate-900 break-keep wrap-anywhere">
                          <HeroName name={m.hero.name} />
                        </span>
                        <span className="shrink-0 text-sm font-bold tabular-nums">
                          <span className="sr-only">{ja ? '勝率 前回' : 'Win rate before'} </span>
                          <span className="text-slate-600">{pct(m.before)}</span>
                          <span className="text-slate-500"> → </span>
                          <span className="sr-only">{ja ? '今回' : 'now'} </span>
                          <span className={dir === 'up' ? 'text-emerald-700' : 'text-rose-700'}>{pct(m.after)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 勝率とBAN率の上位5体。出現率の下限（MIN_PICK_RATE）を満たすヒーローの中から選ぶ */}
      <section className="mb-8">
        <SectionHead title={t('rankTitle')} href="/tier-list" linkLabel={t('tierLink')} />
        <div className="grid gap-3 px-4 pt-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          {([['win', sections.topWin], ['ban', sections.topBan]] as const).map(([kind, list]) => (
            <div key={kind} className="rounded-2xl border border-slate-200 bg-white p-3">
              <h3 className="flex items-center gap-1.5 px-1 pb-2 text-sm font-black text-slate-700">
                {kind === 'win'
                  ? <BarChart3 size={16} className="shrink-0 text-brand-700" />
                  : <Ban size={16} className="shrink-0 text-rose-700" />}
                {t(kind === 'win' ? 'rankWin' : 'rankBan')}
              </h3>
              <ol className="flex flex-col gap-1">
                {list.map((row, i) => (
                  <li key={row.hero.id}>
                    <Link href={`/heroes/${row.hero.slug}`} className="flex min-h-11 items-center gap-2.5 rounded-xl px-1 py-1 transition-colors hover:bg-slate-50">
                      <span className="w-5 shrink-0 text-center text-sm font-black tabular-nums text-slate-500">{i + 1}</span>
                      <HeroFace hero={row.hero} size={28} />
                      <span className="min-w-0 flex-1 text-sm font-black leading-snug text-slate-900 break-keep wrap-anywhere">
                        <HeroName name={row.hero.name} />
                      </span>
                      <span className={`shrink-0 text-sm font-black tabular-nums ${kind === 'win' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {pct(row.value)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <p className="px-4 mt-2 text-sm text-slate-600 leading-relaxed [word-break:auto-phrase]">
          {t('rankNote', { count: sections.rankedCount, min: sections.minPickRate })}
        </p>
      </section>

      {/* 独自ツール。ショートカット（8枚）に混ぜない。13枚にすると1枚あたりの
          重みが落ちるうえ、ショートカットはページの後ろのほうにあるので、末尾に足すと
          いちばん見せたいものが最下部に沈む。この5本は他所には無いので、独立した節にして先に出す */}
      <section className="px-4 mb-6">
        <h2 className="section-title mb-3">
          {ja ? 'このサイトの独自ツール' : 'Tools on this site'}
        </h2>
        {/* 区切り（wbr）と break-keep で語の切れ目でだけ折る。名前を 13px から 14px に上げると
            「シミュレータ」が約84px になる。360px 幅でも入るよう、sm 未満は余白と間を詰めて 86px 取る。
            それでも入らない語は wrap-anywhere で割り、はみ出させない */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-2 sm:gap-3">
          {TOOL_LINKS.map(({ href, Icon, tint, ja: jaName, en }) => (
            <Link
              key={href}
              href={href}
              className="bg-white p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 flex min-h-14 items-center gap-2 sm:gap-3 active:scale-95 transition-transform"
            >
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${tint} flex items-center justify-center shrink-0`}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-slate-800 leading-tight break-keep wrap-anywhere">
                {ja
                  ? jaName.map((part, i) => <Fragment key={part}>{i > 0 && <wbr />}{part}</Fragment>)
                  : en}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* アジア競技大会の HoK は 2026-09-27〜28 の2日間（2026-09-26 に大会公式の日程で確認）。
          国内開催で流入が集中する時期なのでショートカットの上に出す。期限は asianGames2026.ts の bannerUntil */}
      {showBanner && (
      <section className="px-4 mb-6">
        {/* 節の見出し。読み上げの見出しジャンプでこの枠を飛ばせるようにする */}
        <h2 className="sr-only">{ja ? 'お知らせ' : 'Announcement'}</h2>
        <Link
          href="/esports/asian-games-2026"
          className="flex items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 transition-colors hover:border-amber-500 active:scale-[0.99]"
        >
          {/* 以前は amber-700→rose-700 の塗りに白文字。夜の配色では淡い橙と桃の塗りに
              暗い文字が載り、ページの中で1枚だけ明るく浮いていた（2026-09-26）。
              ほかのカードと同じ暗い面にし、琥珀の線と文字で目立たせる */}
          <div className="min-w-0">
            <div className="text-sm font-black uppercase tracking-wider text-amber-800">
              {ja ? '愛知・名古屋で開催' : 'Held in Aichi-Nagoya'}
            </div>
            <div className="mt-0.5 text-base font-black leading-snug text-slate-900">
              {ja
                ? '🏆 アジア競技大会2026のHonor of Kings — 9月27〜28日'
                : '🏆 Honor of Kings at the 2026 Asian Games — 27–28 Sept'}
            </div>
          </div>
          <ChevronRight size={18} className="shrink-0 text-amber-700" />
        </Link>
      </section>
      )}

      {/* Quick Access Grid。
          説明文は以前 10px・1行で切っていて、8枚すべてが「基本ルール、レ…」のように
          途中で切れていた。スマホは1列にして説明を切らずに出す（390px 幅で本文幅 256px、日本語は1〜2行）。
          PC も 1024px 幅の4列では本文幅が約90pxで3〜4行に割れたので、4列は xl（1280px）からにした */}
      <section className="px-4 mb-6">
        <h2 className="section-title mb-3">
          {ja ? 'ショートカット' : 'Quick Access'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
          {quickLinks.map(({ href, Icon, tint, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 flex items-center gap-3 active:scale-95 transition-transform"
            >
              <div className={`w-9 h-9 rounded-full ${tint} flex items-center justify-center shrink-0`}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 leading-tight">{title}</h3>
                {/* 文節で折る。無いと 360px で「おすすめ設 / 定解説」、PC の4列で「使いど / ころ」と割れた */}
                <p className="text-sm text-slate-600 mt-0.5 leading-snug text-pretty [word-break:auto-phrase]">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ロール別の一覧と、レーン別のTier表への入口（MLBB Hub のページ一覧にならった）。
            どちらもヒーロー一覧・Tier表の中からしか辿れず、トップからは1段深かった。高さは 44px */}
        {([
          ['pagesRoles', sections.roleLinks.map((l) => ({ key: l.slug, href: `/heroes/role/${l.slug}`, label: r(l.labelKey), icon: <RoleIcon role={l.id} className="h-4 w-4" /> }))],
          ['pagesLanes', sections.laneLinks.map((l) => ({ key: l.slug, href: `/tier-list/${l.slug}`, label: l.name, icon: <LaneIcon lane={l.lane} className="h-4 w-4 text-brand-700" /> }))],
        ] as const).map(([titleKey, chips]) => (
          <div key={titleKey} className="mt-4">
            <h3 className="mb-2 text-sm font-black text-slate-700">{t(titleKey)}</h3>
            <ul className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <li key={chip.key}>
                  <Link
                    href={chip.href}
                    className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 transition-colors hover:border-brand-300"
                  >
                    {chip.icon}
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* このサイトの中身。数字と文章の出どころを、トップの終わりに短く書く（MLBB Hub のトップにならった）。
          詳しい出典と取得の手順は /about にある */}
      <section className="px-4">
        <h2 className="section-title mb-3 flex items-center gap-2">
          {t('aboutTitle')}
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 [word-break:auto-phrase]">
          <p>{t('aboutStats', { date: dataFreshness.campStats.updatedAt })}</p>
          <p className="mt-2">{t('aboutSkills')}</p>
          <p className="mt-2">{t('aboutCommentary')}</p>
          <Link href="/about" className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-bold text-brand-700 active:text-brand-800">
            <Info size={16} className="shrink-0" />
            {t('aboutLink')}
          </Link>
        </div>
      </section>
    </div>
  );
}

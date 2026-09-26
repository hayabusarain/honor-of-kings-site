'use client';

import { Fragment, useMemo, useSyncExternalStore } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Trophy, Users, Hexagon, BookOpen, ShoppingBag, FileText, ChevronRight, Zap, BarChart3, ExternalLink, TrendingUp, SlidersHorizontal, Calculator, Swords, Sprout } from "lucide-react";
import hokHeroes from '@/data/hok_heroes.json';
import campStatsRaw from '@/data/hero_stats_camp.json';
import dataFreshness from '@/data/data_freshness.json';
import { StatsFreshnessNote } from '@/components/common/StatsFreshnessNote';
import { LaneIcon } from '@/components/icons/GameIcons';
import { normalizePatchText } from '@/lib/patchText';
import { getTierBadgeStyle } from '@/lib/tierBadge';
import type { FeaturedHero } from '@/lib/homeFeatured';

/**
 * パッチ本文の見出しは Markdown の ** で囲まれている。パッチノートページは
 * 太字として描くが、トップの2行プレビューでは記号がそのまま出てしまうので落とす。
 * 改行も1行に畳んで、カードの高さを揃える
 */
const plainPatchText = (text: string | null | undefined, locale: string) =>
  normalizePatchText(text, locale).replace(/\*\*/g, '').replace(/\s*\n+\s*/g, ' ').trim();

/**
 * カードに出す1行の要約。
 *
 * 本文の1行目は「**ルナ — スキル2の火力を大きく引き上げ、奥義は軽く回るように**」の
 * 形をしている。区切りの後ろだけを取れば要約になり、ヒーロー名はカードの h3 に
 * 既に出ているので接頭辞は要らない。日本語で13〜34字、英語で34〜91字ぶん短くなる。
 *
 * ただし全56件中20件しかこの書式に従っていない。従っていないものは
 * 今までどおり本文を畳んで返し、line-clamp で切る。
 * 書式が崩れていないかは audit の検査19が見ている。
 */
/**
 * カードの上に出すパッチ名。
 * 日本語の version は「8月27日アップデートのお知らせ」という公式の記事名なので、
 * 日付の部分だけを取って「8月27日パッチ」にする。取れなければそのまま出す。
 */
const patchLabel = (version: string, locale: string) => {
  if (!version) return '';
  const jp = version.match(/^(\d+月\d+日)/);
  if (jp) return locale === 'en' ? `${jp[1]} patch` : `${jp[1]}パッチ`;
  // 英語の版名は「September 23 Update (Season 16)」のように Update を含むので、Patch を重ねない
  if (locale === 'en') return /update|patch/i.test(version) ? version : `Patch ${version}`;
  return version;
};

/**
 * 名前を本体と括弧書きに分ける（「元流の子（マークスマン）」→「元流の子」「（マークスマン）」）。
 * 括弧の前の空白は括弧書きの側に残す（英語の「Flowborn (Marksman)」で空白が消えないように）
 */
const splitHeroName = (name: string): [string, string | null] => {
  const m = name.match(/^(.+?)(\s*[（(][^（()）]+[）)])$/);
  return m ? [m[1], m[2]] : [name, null];
};

const patchSummary = (text: string | null | undefined, locale: string) => {
  const first = plainPatchText((text || '').split('\n')[0], locale);
  const at = first.indexOf(' — ');
  if (at > 0) return first.slice(at + 3).trim();
  return plainPatchText(text, locale);
};

interface MetaPick {
  role: string;
  hero_id?: string;
  image?: string;
  hero_name_en?: string;
  hero_name: string;
  title?: string;
  winRate: number;
  tier: string;
  /** 統計を取得した後にバランス調整が入ったヒーローか */
  isPrePatch: boolean;
}

// 同じ hok_heroes.json を上で hokHeroes として import 済み。
// ここで HOK_HEROES として二重に取っていた（バンドルは1回だが、読む側が混乱する）
const getHeroSlug = (id: string) => {
  const hero = (hokHeroes as Record<string, any>[]).find((h: any) => h.id === id);
  return hero?.slug || id;
};

// 統計の取得後に調整が入ったヒーローのID。判定はヒーロー詳細（HeroDetailClient）と同じで、
// 名前や日付をコードに書かず data_freshness.json だけを見る。ピックが入れ替わっても、
// 統計を取り直して配列が空になっても、表示はこのファイルに追随する。
// 空配列になると推論が never[] に変わって .includes(string) が型エラーになるため string[] で扱う
const PRE_PATCH_HERO_IDS = dataFreshness.campStats.patchBasisHeroIds as string[];

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

export function HomeClient({ featuredHeros, showAsianGamesBanner, asianGamesBannerUntil }: {
  /**
   * 直近パッチで強化されたアイテムとヒーロー。
   * 求めるのに patches.json（184KB）と hok_items.json（108KB）が要るので、
   * サーバー側（homeFeatured.ts）で解決した結果だけを受け取る
   */
  featuredHeros: FeaturedHero[];
  /** アジア競技大会のバナーを出すか。ビルド時にサーバー側で判定した値 */
  showAsianGamesBanner: boolean;
  /** 同バナーの表示期限（ISO8601、+09:00 付き）。マウント後の再判定に使う */
  asianGamesBannerUntil: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Home");
  const r = useTranslations("Role");

  // metaPicks の role は CLASH / JUNGLE のような内部の大文字。
  // 表示は messages の Role を通す（ヒーロー詳細の laneLabel と同じ形）。
  // 札の1行目に Tier と勝率と並べるので、Tier表と同じ短縮で括弧と " Lane" を落とす。
  // 「クラッシュ (Clash)」→「クラッシュ」、「Clash Lane」→「Clash」
  const shortRoleLabel = (role: string) => {
    const key = String(role || '').toLowerCase();
    if (!['clash', 'jungle', 'mid', 'farm', 'roam'].includes(key)) return role;
    return r(key).replace(/\s*\(.+\)$/, '').replace(/\s+Lane$/, '');
  };
  // 静的にインポートした JSON だけで求まる値なので、描画時に同期的に計算する。
  // useEffect で後から埋めると初期HTMLがスケルトンのままになり、
  // クローラーや AdSense の審査ではローディング中の空箱しか見えない。
  const metaPicks = useMemo<MetaPick[]>(() => {
      const campStatsObj = (campStatsRaw as Record<string, any>) || {};
      const roles = ['CLASH', 'JUNGLE', 'MID', 'FARM', 'ROAM'];
      const picks: MetaPick[] = [];
      
      roles.forEach(role => {
        const champsInRole = (hokHeroes as Record<string, any>[]).map((champ: any) => {
          const stat = campStatsObj[champ.id];
          return stat && stat.lane === role ? { ...champ, winRate: stat.win_rate, tier: stat.tier } : null;
        }).filter(Boolean);
        
        if (champsInRole.length > 0) {
          const tierRank = (t: string) => {
            if (t === 'S') return 3;
            if (t === 'A') return 2;
            if (t === 'B') return 1;
            return 0;
          };
          
          champsInRole.sort((a, b) => {
            const rankA = tierRank(a.tier);
            const rankB = tierRank(b.tier);
            if (rankA !== rankB) return rankB - rankA;
            return b.winRate - a.winRate;
          });
          
          picks.push({
            role: role,
            hero_id: champsInRole[0].id,
            image: champsInRole[0].image,
            hero_name: locale === 'en' && champsInRole[0].name_en ? champsInRole[0].name_en : champsInRole[0].name,
            title: champsInRole[0].title,
            winRate: champsInRole[0].winRate,
            tier: champsInRole[0].tier,
            isPrePatch: PRE_PATCH_HERO_IDS.includes(String(champsInRole[0].id)),
          });
        }
      });
      
      return picks;
  }, [locale]);

  // 「調整前」の帯と、その意味を説明する注記はセットで出す。片方だけ出ると読者が判断できない。
  // 統計を取り直して patchBasisHeroIds が空になれば両方消える
  // パッチ名は帯を出すヒーロー集合と同じ campStats から取る。
  // skillData.pendingPatch* は「スキルの書き起こしが未了のパッチ」という別の意味なので、
  // 書き起こしが終わっても値が残り、ここに使うと意味がずれる
  const pendingPatch = locale === 'en'
    ? dataFreshness.campStats.patchBasisPatchEn
    : dataFreshness.campStats.patchBasisPatchJa;
  const showPrePatchNote = Boolean(pendingPatch) && metaPicks.some(pick => pick.isPrePatch);

  // バナーの期限判定はビルド時に済んでいるが、ページは完全な静的配信なので、
  // 期限を過ぎてもデプロイが無い間は古い判定のHTMLが出続ける。
  // サーバー用スナップショットにはサーバーの判定をそのまま返し（ハイドレーション
  // 不一致を避ける）、クライアントでは実時刻で見直す。
  // useEffect + setState でも同じことはできるが、描画を2回に分ける必要がないため
  // useSyncExternalStore で読む（NotFoundLinks.tsx と同じ書き方）。
  // 返すのは真偽値なので、期限をまたぐまで値は変わらない
  const showBanner = useSyncExternalStore(
    bannerSubscribe,
    () => showAsianGamesBanner && Date.now() < Date.parse(asianGamesBannerUntil),
    () => showAsianGamesBanner,
  );

  // ショートカット8枚。同じ組み方のカードを8回書いていたのを1つにまとめた。
  // 見出しと説明の一部は messages の Home にあり、残りはここで出し分ける
  const quickLinks = [
    {
      href: '/heroes', Icon: Users, tint: 'bg-blue-50 text-blue-600', title: t('qaHerosTitle'),
      desc: locale === 'ja' ? `全${hokHeroes.length}体のヒーローデータ` : `Data for all ${hokHeroes.length} heroes`,
    },
    { href: '/patches', Icon: FileText, tint: 'bg-slate-100 text-slate-600', title: t('qaPatchTitle'), desc: t('qaPatchDesc') },
    { href: '/guide', Icon: BookOpen, tint: 'bg-teal-50 text-teal-600', title: t('qaGuideTitle'), desc: t('qaGuideDesc') },
    { href: '/tier-list', Icon: Trophy, tint: 'bg-brand-50 text-brand-700', title: t('qaTierTitle'), desc: t('qaTierDesc') },
    {
      href: '/items', Icon: ShoppingBag, tint: 'bg-amber-50 text-amber-600',
      title: locale === 'ja' ? 'アイテム一覧' : 'Items',
      desc: locale === 'ja' ? '装備のステータスと効果' : 'Item stats and effects',
    },
    {
      href: '/arcana', Icon: Hexagon, tint: 'bg-violet-50 text-violet-600',
      title: locale === 'ja' ? 'アルカナ一覧' : 'Arcana',
      desc: locale === 'ja' ? 'アルカナのステータスと効果' : 'Arcana stats and effects',
    },
    // 全ヒーローの実測ステータスを並び替えて比べられる一覧。
    // これまでヒーロー詳細からしか入口が無かった
    {
      href: '/heroes/stats', Icon: BarChart3, tint: 'bg-emerald-50 text-emerald-600',
      title: locale === 'ja' ? '基本ステータス比較' : 'Base Stat Rankings',
      desc: locale === 'ja' ? 'HP・攻撃・移動速度を並び替えて比べる' : 'Sort heroes by HP, attack and move speed',
    },
    // サイドバーではアイテム・アルカナと同格なのに、トップからの導線だけ無かった
    {
      href: '/spells', Icon: Zap, tint: 'bg-orange-50 text-orange-600',
      title: locale === 'ja' ? 'サモナースペル' : 'Summoner Spells',
      desc: locale === 'ja' ? '全11種の効果と使いどころ' : 'All 11 spells and when to take them',
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
              {locale === 'ja' ? '同じ運営者のゲーム攻略ポータル' : 'Our other game guides'}
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
            {/* 初訪問者が最初に確かめるのは「このサイトは生きているか」。
                以前ここは DATABASE ACTIVE という飾りで、更新日はフッターの最下部にしかなかった。
                出すのはサイトの最終更新日。統計の取得日（campStats.updatedAt）を出していたが、
                解説を書き足した日とずれるうえ、すぐ下のお知らせの日付とも食い違って見えていた。
                統計の取得日は、その数字を出しているTier表・ヒーロー詳細・フッターに書いてある */}
            <span className="text-sm font-bold text-slate-600 tracking-wide">
              {locale === 'ja'
                ? `最終更新 ${dataFreshness.site.lastUpdated}`
                : `Updated ${dataFreshness.site.lastUpdated}`}
            </span>
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-[1.2] mb-2">
            Honor of Kings <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-800 to-brand-600">
              {locale === 'ja' ? '攻略データベース' : 'Strategy Database'}
            </span>
          </h1>

          {/* 360px では「最新のTier / 表」と語の途中で割れたので、文節で折って行の長さを揃える */}
          <p className="text-sm font-bold text-slate-600 leading-relaxed text-balance [word-break:auto-phrase]">
            {locale === 'ja'
              ? `全${hokHeroes.length}体のヒーロー詳細データと最新のTier表`
              : `Detailed stats and tier list for all ${hokHeroes.length} heroes.`}
          </p>
        </div>
      </header>

      {/* お知らせバナーはここにあったが、手で書いた日付（8/20・8月14日版・9体）が
          9日間そのままになり、すぐ下の「2026-08-21取得」とも食い違っていた。
          伝えたい中身は「統計はいつのもので、どれが調整前か」の一点なので、
          数字を出している場所の真下（下の注記と各カードの帯）に移し、
          文言も data_freshness.json から組み立てて更新漏れが起きない形にした */}

      {/* レーンごとに Tier が最も高い1体（同じ Tier なら勝率順）。見出しは以前
          「ロール別の勝率トップ」で、ロールでも勝率1位でもなかった（勝率49%台の1体が
          「勝率トップ」として並んでいた）。選び方を変えたら見出しも直すこと */}
      <section className="mb-8">
        {/* 「すべて見る」は文字だけだと 60×16px の的だった。行の高さを44pxにして
            的を広げ、そのぶん下の余白を mb-3 から mb-1 に詰めて見出しと注記の間隔を保つ */}
        <div className="flex min-h-11 items-center justify-between gap-3 px-4 mb-1">
          <h2 className="section-title">
            {t('metaTitle')}
          </h2>
          <Link href="/tier-list" className="inline-flex min-h-11 shrink-0 items-center text-sm font-bold text-brand-700 active:text-brand-800 transition-colors">
            {locale === 'ja' ? 'すべて見る' : 'See all'}
          </Link>
        </div>

        {/* 勝率とTierを見せる以上、いつ取ったかを添える。トップは幅が狭いので
            取得日だけにし、調整対象を1体ずつ並べる注記全文はTier表とヒーロー詳細に任せる。
            ただし黙っていると、下のカードの調整前の勝率が最新の数字に見える。
            そこで該当カードに帯を出し、その意味だけをここで1行説明してTier表へ送る */}
        {/* word-break は受け継がれるので、共通部品の中の文にも効く。
            360px で「（2026-09-11取 / 得）」と割れていたのを文節の切れ目で折らせる。
            auto-phrase だけだと今度は「（2026-09- / 11取得）」とハイフンで日付が割れたので、
            日付（<time>）の中では折らない。Chrome では「（」の前で折れる（360px で実測）。
            auto-phrase の無い Safari では「取 / 得」の割れが残る。直すには部品側で括弧ごと nowrap にする */}
        <StatsFreshnessNote locale={locale} showPatchBasis={false} className="px-4 -mt-2 mb-2 [word-break:auto-phrase] [&_time]:whitespace-nowrap" />

        {/* 文言は以前 messages の metaPrePatchNote / metaPrePatchLink にあったが、
            b79c843 でキーだけ消えて呼び出しが残った。各レーンの最上位に調整前の
            ヒーローが入った日に、キー名がそのまま画面に出る。ここで持つ */}
        {showPrePatchNote && (
          <div className="px-4 mb-3">
            <p className="text-sm font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed">
              {locale === 'ja'
                ? `「調整前」のヒーローは${pendingPatch}で調整が入った。勝率とTierは、その前に取得した数値です。`
                : `Heroes marked "Pre-patch" were adjusted in ${pendingPatch}. Their win rate and tier were taken before that change.`}{' '}
              <Link
                href="/tier-list"
                className="text-amber-900 underline underline-offset-2 whitespace-nowrap"
              >
                {locale === 'ja'
                  ? `対象の${PRE_PATCH_HERO_IDS.length}体を見る`
                  : `See all ${PRE_PATCH_HERO_IDS.length} heroes`}
              </Link>
            </p>
          </div>
        )}

        {/* metaPicks は描画時に確定するため、ローディング表示は不要。
            以前は5列の顔のカード（1枚 約66px）で、レーン名 9px・名前と勝率 10px だった。
            14px にすると「クラッシュ」（約70px）がマスに入らないので、1レーン1行の札にした
            （2026-09-26）。1行目にレーンの図柄と名前、Tier と勝率、2行目にヒーロー名。
            390px で5行・約340px。PC は2〜3列に並べる。md（768px）はサイドバーが出て本文が約430px になり、
            2列だと1行目の Tier と勝率が折り返すので1列に戻す */}
        {(
          <ul className="grid gap-2 px-4 pb-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {metaPicks.map((pick) => (
              <li key={pick.role}>
                <Link
                  href={`/heroes/${getHeroSlug(pick.hero_id as string)}`}
                  className="flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 pr-3 transition-colors hover:border-brand-300"
                >
                  {/* 名前は横に文字で出すので、画像は読み上げない */}
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                    <Image
                      src={pick.image || `/images/heroes/${pick.hero_id}.webp`}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                        <LaneIcon lane={pick.role} className="h-4 w-4 shrink-0 text-brand-700" />
                        {shortRoleLabel(pick.role)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {/* Tier表・ヒーロー一覧・ヒーロー詳細はどれも素の S/A/B/C を出す。
                            ここだけ A を「TA」に変えていて、S だけ素通しで混在していた。
                            配色は Tier表と同じ getTierBadgeStyle（金の塗りは S だけ） */}
                        <span className={`flex h-6 min-w-6 items-center justify-center rounded-md border px-1 text-sm font-black leading-none ${getTierBadgeStyle(pick.tier)}`}>
                          <span className="sr-only">Tier </span>{pick.tier}
                        </span>
                        <span className="text-sm font-black tabular-nums text-slate-700">
                          <span className="sr-only">{locale === 'ja' ? '勝率' : 'Win rate'} </span>
                          {pick.winRate.toFixed(1)}%
                        </span>
                      </span>
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="break-words text-base font-black leading-snug text-slate-900">{pick.hero_name}</span>
                      {/* 調整前の札。地は amber-50 の線の札（以前は amber-700 の塗りに白文字の 9px） */}
                      {showPrePatchNote && pick.isPrePatch && (
                        <span className="rounded-md border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-sm font-bold leading-none text-amber-800">
                          {t('metaPrePatchBadge')}
                        </span>
                      )}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Featured Heros Showcase Section (Carousel) */}
      {featuredHeros.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between gap-3 px-4 mb-3">
            <div className="min-w-0">
              <h2 className="section-title">
                {locale === 'ja' ? '最新パッチ バフ対象' : 'Recent Buffs'}
              </h2>
              {/* 「Patch 8月27日アップデートのお知らせ」と出ていた。同じカードの
                  バッジが読み上げで「8月27日パッチで強化」と言うので、そちらに揃える。
                  /patches の「8月27日アップデートのお知らせ」は公式の記事名なので触らない。
                  pl-3 は見出しの金の縦線（4px＋間8px）のぶん。文字の左端を見出しに揃える */}
              <p className="text-sm text-slate-500 font-medium mt-0.5 pl-3">
                {patchLabel(featuredHeros[0]?.patchVersion || '', locale)}
              </p>
            </div>
            {/* 見出しが「最新パッチ バフ対象」なので、行き先はヒーロー一覧ではなくパッチノート */}
            <Link href="/patches" className="inline-flex min-h-11 shrink-0 items-center text-sm font-bold text-brand-700 active:text-brand-800 transition-colors">
              {locale === 'ja' ? 'すべて見る' : 'See all'}
            </Link>
          </div>

          {/* カード幅は 168px から 184px に広げた。要約を 12px から 14px に上げると、
              英語の長いもの（91字）が 168px・5行では収まらなかったため */}
          <div className="flex gap-3 px-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {featuredHeros.map((champ, idx) => (
              <Link
                key={idx}
                href={`/heroes/${getHeroSlug(champ.id)}`}
                className="flex-none w-[184px] snap-center bg-white rounded-2xl p-3 border border-slate-200 hover:border-brand-300 active:scale-95 transition-transform flex flex-col gap-2 relative"
              >
                <div className="absolute top-2 right-2 flex items-center justify-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 relative">
                  <Image
                    src={(hokHeroes as Record<string, any>[]).find(h => h.id === champ.id)?.image || `/images/heroes/${champ.id}.webp`}
                    alt={champ.hero_name}
                    fill
                    sizes="40px"
                    className="object-cover scale-110"
                  />
                </div>
                <div>
                  {/* 上のメタピック枠と違い、この枠のデータに二つ名（title）は入っていない。
                      champ.title は常に undefined で、空の span を1本描いていただけなので外した。
                      名前は切らずに括弧の前で折る。以前は truncate で、16px にすると
                      「元流の子（マークスマン）」（約192px）が本文幅160pxに入らず「元流の子（マーク…」になった。
                      break-keep で語の途中では折らず、区切り（wbr）と空白でだけ折る */}
                  <h3 className="font-black text-slate-900 text-base leading-snug break-keep wrap-anywhere">
                    {(() => {
                      const [base, qualifier] = splitHeroName(champ.hero_name);
                      return qualifier ? <>{base}<wbr />{qualifier}</> : base;
                    })()}
                  </h3>
                  {/* 接頭辞を落としても英語は91字になるものがある。140px・10px では
                      5行を超えるので、カード幅を168pxに広げた。
                      読む文なので 12px に上げ、そのぶん切る位置を5行にした。
                      2026-09-26 に 14px へ上げ、幅を 184px、切る位置を6行にした。
                      色は emerald-700（夜の配色の緑の文字）。
                      「持続ダメ / ージ」と語の途中で割れるので auto-phrase で文節で折る */}
                  <p className="text-sm text-emerald-700 font-medium line-clamp-6 mt-1 leading-snug [word-break:auto-phrase]">
                    {patchSummary(champ.patchDescription, locale)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 独自ツール。ショートカット（8枚）に混ぜない。13枚にすると1枚あたりの
          重みが落ちるうえ、ショートカットはページ最終節なので、末尾に足すと
          いちばん見せたいものが最下部に沈む。
          この5本は他所には無いので、独立した節にして先に出す */}
      <section className="px-4 mb-6">
        <h2 className="section-title mb-3">
          {locale === 'ja' ? 'このサイトの独自ツール' : 'Tools on this site'}
        </h2>
        {/* 区切り（wbr）と break-keep で語の切れ目でだけ折る。名前を 13px から 14px に上げると
            「シミュレータ」が約84px になる。360px 幅でも入るよう、sm 未満は余白と間を詰めて 86px 取る。
            それでも入らない語は wrap-anywhere で割り、はみ出させない */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-2 sm:gap-3">
          {TOOL_LINKS.map(({ href, Icon, tint, ja, en }) => (
            <Link
              key={href}
              href={href}
              className="bg-white p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 flex min-h-14 items-center gap-2 sm:gap-3 active:scale-95 transition-transform"
            >
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${tint} flex items-center justify-center shrink-0`}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-slate-800 leading-tight break-keep wrap-anywhere">
                {locale === 'ja'
                  ? ja.map((part, i) => <Fragment key={part}>{i > 0 && <wbr />}{part}</Fragment>)
                  : en}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* アジア競技大会は 2026-09-28 の1日だけ。国内開催で流入が集中する時期なので
          ショートカットの上に出す。期限は asianGames2026.ts の bannerUntil */}
      {showBanner && (
      <section className="px-4 mb-6">
        {/* 節の見出し。読み上げの見出しジャンプでこの枠を飛ばせるようにする。
            ヒーローの枠には h2 があるが、ここはバナー1枚だけで見出しが無かった */}
        <h2 className="sr-only">{locale === 'ja' ? 'お知らせ' : 'Announcement'}</h2>
        <Link
          href="/esports/asian-games-2026"
          className="flex items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 transition-colors hover:border-amber-500 active:scale-[0.99]"
        >
          {/* 以前は amber-700→rose-700 の塗りに白文字。夜の配色では淡い橙と桃の塗りに
              暗い文字が載り、ページの中で1枚だけ明るく浮いていた（2026-09-26）。
              ほかのカードと同じ暗い面にし、琥珀の線と文字で目立たせる */}
          <div className="min-w-0">
            <div className="text-sm font-black uppercase tracking-wider text-amber-800">
              {locale === 'ja' ? '愛知・名古屋で開催' : 'Held in Aichi-Nagoya'}
            </div>
            <div className="mt-0.5 text-base font-black leading-snug text-slate-900">
              {locale === 'ja'
                ? '🏆 アジア競技大会2026のHonor of Kings — 9月28日'
                : '🏆 Honor of Kings at the 2026 Asian Games — 28 Sept'}
            </div>
          </div>
          <ChevronRight size={18} className="shrink-0 text-amber-700" />
        </Link>
      </section>
      )}

      {/* Quick Access Grid。
          説明文は以前 10px・1行で切っていて、8枚すべてが「基本ルール、レ…」のように
          途中で切れていた。12px に上げると2列（本文幅 約85px）では2行でも収まらないので、
          スマホは1列にして説明を切らずに出す（390px 幅で本文幅 256px、日本語は1〜2行）。
          PC も 1024px 幅の4列では本文幅が約90pxで3〜4行に割れたので、4列は xl（1280px）からにした。
          sm の3列（本文幅 約100px）も同じ理由で2列にしている */}
      <section className="px-4">
        <h2 className="section-title mb-3">
          {locale === 'ja' ? 'ショートカット' : 'Quick Access'}
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
      </section>
      </div>
  );
}

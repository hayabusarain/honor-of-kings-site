'use client';

import { useMemo, useSyncExternalStore } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Trophy, Users, Hexagon, BookOpen, ShoppingBag, FileText, ChevronRight, Zap, BarChart3, ExternalLink, TrendingUp, SlidersHorizontal, Calculator, Swords, Sprout } from "lucide-react";
import hokHeroes from '@/data/hok_heroes.json';
import campStatsRaw from '@/data/hero_stats_camp.json';
import dataFreshness from '@/data/data_freshness.json';
import { StatsFreshnessNote } from '@/components/common/StatsFreshnessNote';
import { normalizePatchText } from '@/lib/patchText';
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
  return locale === 'en' ? `Patch ${version}` : `${version}`;
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

import HOK_HEROES from "@/data/hok_heroes.json";
const getHeroSlug = (id: string) => {
  const hero = (HOK_HEROES as Record<string, any>[]).find((h: any) => h.id === id);
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
const TOOL_LINKS = [
  { href: '/items/usage', Icon: TrendingUp, tint: 'bg-emerald-50 text-emerald-600', ja: 'アイテム採用率', en: 'Item Pick Rates' },
  { href: '/items/simulator', Icon: SlidersHorizontal, tint: 'bg-blue-50 text-blue-600', ja: '装備シミュレータ', en: 'Build Simulator' },
  { href: '/arcana/calculator', Icon: Calculator, tint: 'bg-brand-50 text-brand-700', ja: 'アルカナ計算機', en: 'Arcana Calculator' },
  { href: '/guide/bosses', Icon: Swords, tint: 'bg-amber-50 text-amber-600', ja: 'ボス攻略', en: 'Boss Guide' },
  { href: '/guide/beginner-heroes', Icon: Sprout, tint: 'bg-rose-50 text-rose-600', ja: '最初に選ぶヒーロー', en: 'Heroes to Start With' },
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
  // カードが60px前後しかないので、Tier表と同じ短縮で括弧と " Lane" を落とす。
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

  // シェル（MobileAppShell）がすでに <main> を持っている。ここを main にすると
  // 読み上げのメインランドマークが2つ出るので div にする。
  // min-h-screen も外す。シェル側の min-h-[100dvh] が効いている
  return (
    <div className="pb-8 bg-background text-slate-900">
      
      {/* Hero Banner Section */}
      <header className="relative w-full h-[280px] mb-8 overflow-hidden rounded-b-[2.5rem] shadow-sm">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0">
          <Image 
            src="/images/hero_banner_bg_light.jpg"
            alt=""
            fill
            priority
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent"></div>
        </div>

        {/* 運営元のポータルへの導線。リンク集（noindex）にしか無く、トップからは
            辿れなかった。見出しが下寄せでバナー右上が空いているのでここに置く。
            見た目は最終更新バッジと揃え、サイト内ナビと混ざらないようにする */}
        <a
          href="https://hub-game.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-slate-200/50 bg-white/60 px-3.5 py-2 shadow-sm backdrop-blur-md transition-colors hover:bg-white/90"
        >
          <span className="text-[11px] font-black tracking-wider text-slate-700">HUB-GAME</span>
          <span className="hidden text-[10px] font-bold text-slate-500 sm:inline">
            {locale === 'ja' ? '同じ運営者のゲーム攻略ポータル' : 'Our other game guides'}
          </span>
          <ExternalLink size={13} className="shrink-0 text-slate-500" />
        </a>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end px-6 pb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-slate-200/50 backdrop-blur-md w-fit mb-3 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            {/* 初訪問者が最初に確かめるのは「このサイトは生きているか」。
                以前ここは DATABASE ACTIVE という飾りで、更新日はフッターの最下部にしかなかった。
                出すのはサイトの最終更新日。統計の取得日（campStats.updatedAt）を出していたが、
                解説を書き足した日とずれるうえ、すぐ下のお知らせの日付とも食い違って見えていた。
                統計の取得日は、その数字を出しているTier表・ヒーロー詳細・フッターに書いてある */}
            <span className="text-[10px] font-bold text-slate-600 tracking-wider">
              {locale === 'ja'
                ? `最終更新 ${dataFreshness.site.lastUpdated}`
                : `Updated ${dataFreshness.site.lastUpdated}`}
            </span>
          </div>
          
          <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-[1.2] mb-2">
            Honor of Kings <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-800 to-brand-600">
              {locale === 'ja' ? '攻略データベース' : 'Strategy Database'}
            </span>
          </h1>
          
          <p className="text-[13px] font-bold text-slate-500 leading-relaxed max-w-[90%]">
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

      {/* Top Meta Picks Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
            {t('metaTitle')}
          </h2>
          <Link href="/tier-list" className="text-xs font-bold text-brand-700 active:text-brand-800 transition-colors">
            {locale === 'ja' ? 'すべて見る' : 'See all'}
          </Link>
        </div>

        {/* 勝率とTierを見せる以上、いつ取ったかを添える。トップは幅が狭いので
            取得日だけにし、調整対象を1体ずつ並べる注記全文はTier表とヒーロー詳細に任せる。
            ただし黙っていると、下のカードの調整前の勝率が最新の数字に見える。
            そこで該当カードに帯を出し、その意味だけをここで1行説明してTier表へ送る */}
        <StatsFreshnessNote locale={locale} showPatchBasis={false} className="px-4 -mt-2 mb-2" />

        {showPrePatchNote && (
          <div className="px-4 mb-3">
            <p className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed">
              {t('metaPrePatchNote', { patch: pendingPatch })}{' '}
              <Link
                href="/tier-list"
                className="text-amber-900 underline underline-offset-2 whitespace-nowrap"
              >
                {t('metaPrePatchLink', { count: PRE_PATCH_HERO_IDS.length })}
              </Link>
            </p>
          </div>
        )}

        {/* metaPicks は描画時に確定するため、ローディング表示は不要 */}
        {(
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5 px-4 pb-4">
            {metaPicks.map((pick, idx) => (
              <Link 
                href={`/heroes/${getHeroSlug(pick.hero_id as string)}`} 
                key={idx}
                className="w-full rounded-xl bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 active:scale-95 transition-transform flex flex-col"
              >
                <div className="aspect-square bg-slate-100 relative overflow-hidden group">
                  <Image 
                    src={pick.image || `/images/heroes/${pick.hero_id}.webp`}
                    alt={pick.hero_name}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
                  {/* カードは5列で1枚が60px前後しかない。左上のピルだと
                      「ジャングル」のような5文字が入りきらないので、上端いっぱいの帯にする。
                      下端は「調整前」バッジが使っているのでこちらは上端。
                      カードの高さは変わらない */}
                  <div className="absolute inset-x-0 top-0 z-10 bg-white/90 backdrop-blur-md py-0.5 text-center text-[9px] font-bold leading-tight text-slate-700 truncate">
                    {shortRoleLabel(pick.role)}
                  </div>
                  {/* 調整前バッジは下端。上端はロール名で埋まっている */}
                  {showPrePatchNote && pick.isPrePatch && (
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-amber-500/95 py-0.5 text-center text-[9px] font-bold leading-tight text-white">
                      {t('metaPrePatchBadge')}
                    </div>
                  )}
                </div>
                <div className="p-1.5 flex-1 flex flex-col justify-between">
                  <h3 className="text-[10px] font-bold text-slate-800 leading-tight truncate">
                    {locale !== 'en' && <span className="hidden text-[10px] text-slate-500 font-medium mb-0.5">{pick.title || ''}</span>}
                    {pick.hero_name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1 py-0.5 rounded">
                      {/* Tier表・ヒーロー一覧・ヒーロー詳細はどれも素の S/A/B/C を出す。
                          ここだけ A を「TA」に変えていて、S だけ素通しで混在していた */}
                      {pick.tier}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {pick.winRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Heros Showcase Section (Carousel) */}
      {featuredHeros.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between px-4 mb-3">
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                {locale === 'ja' ? '最新パッチ バフ対象' : 'Recent Buffs'}
              </h2>
              {/* 「Patch 8月27日アップデートのお知らせ」と出ていた。同じカードの
                  バッジが読み上げで「8月27日パッチで強化」と言うので、そちらに揃える。
                  /patches の「8月27日アップデートのお知らせ」は公式の記事名なので触らない */}
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {patchLabel(featuredHeros[0]?.patchVersion || '', locale)}
              </p>
            </div>
            {/* 見出しが「最新パッチ バフ対象」なので、行き先はヒーロー一覧ではなくパッチノート */}
            <Link href="/patches" className="text-xs font-bold text-brand-700 active:text-brand-800 transition-colors">
              {locale === 'ja' ? 'すべて見る' : 'See all'}
            </Link>
          </div>

          <div className="flex gap-3 px-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {featuredHeros.map((champ, idx) => (
              <Link
                key={idx}
                href={`/heroes/${getHeroSlug(champ.id)}`}
                className="flex-none w-[168px] snap-center bg-white rounded-[1.25rem] p-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 active:scale-95 transition-transform flex flex-col gap-2 relative"
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
                      champ.title は常に undefined で、空の span を1本描いていただけなので外した */}
                  <h3 className="font-bold text-slate-800 text-xs truncate">
                    {champ.hero_name}
                  </h3>
                  {/* 接頭辞を落としても英語は91字になるものがある。140px・10px では
                      5行を超えるので、カード幅を168pxに広げて4行で切る */}
                  <p className="text-[10px] text-emerald-600 font-medium line-clamp-4 mt-1 leading-snug">
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
        <h2 className="text-[17px] font-bold text-slate-900 tracking-tight mb-3">
          {locale === 'ja' ? 'このサイトの独自ツール' : 'Tools on this site'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3">
          {TOOL_LINKS.map(({ href, Icon, tint, ja, en }) => (
            <Link
              key={href}
              href={href}
              className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform"
            >
              <div className={`w-9 h-9 rounded-full ${tint} flex items-center justify-center shrink-0`}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-bold text-slate-800 leading-tight">
                {locale === 'ja' ? ja : en}
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
          className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 p-4 text-white shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
        >
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-100">
              {locale === 'ja' ? '愛知・名古屋で開催' : 'Held in Aichi-Nagoya'}
            </div>
            <div className="text-sm font-black leading-snug">
              {locale === 'ja'
                ? '🏆 アジア競技大会2026のHonor of Kings — 9月28日'
                : '🏆 Honor of Kings at the 2026 Asian Games — 28 Sept'}
            </div>
          </div>
          <ChevronRight size={18} className="shrink-0" />
        </Link>
      </section>
      )}

      {/* Quick Access Grid */}
      <section className="px-4">
        <h2 className="text-[17px] font-bold text-slate-900 tracking-tight mb-3">
          {locale === 'ja' ? 'ショートカット' : 'Quick Access'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/heroes" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaHerosTitle')}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                {locale === 'ja' ? `全${hokHeroes.length}体のヒーローデータ` : `Data for all ${hokHeroes.length} heroes`}
              </p>
            </div>
          </Link>

          <Link href="/patches" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <FileText size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaPatchTitle')}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{t('qaPatchDesc')}</p>
            </div>
          </Link>

          <Link href="/guide" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <BookOpen size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaGuideTitle')}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{t('qaGuideDesc')}</p>
            </div>
          </Link>
          
          <Link href="/tier-list" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
              <Trophy size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaTierTitle')}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{t('qaTierDesc')}</p>
            </div>
          </Link>

          <Link href="/items" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShoppingBag size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{locale === 'ja' ? 'アイテム一覧' : 'Items'}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{locale === 'ja' ? '装備のステータスと効果' : 'Item stats and effects'}</p>
            </div>
          </Link>

          <Link href="/arcana" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Hexagon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{locale === 'ja' ? 'アルカナ一覧' : 'Arcana'}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{locale === 'ja' ? 'アルカナのステータスと効果' : 'Arcana stats and effects'}</p>
            </div>
          </Link>

          {/* 全ヒーローの実測ステータスを並び替えて比べられる一覧。
              これまでヒーロー詳細からしか入口が無かった */}
          <Link href="/heroes/stats" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <BarChart3 size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{locale === 'ja' ? '基本ステータス比較' : 'Base Stat Rankings'}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{locale === 'ja' ? 'HP・攻撃・移動速度を並び替えて比べる' : 'Sort heroes by HP, attack and move speed'}</p>
            </div>
          </Link>

          {/* サイドバーではアイテム・アルカナと同格なのに、トップからの導線だけ無かった */}
          <Link href="/spells" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{locale === 'ja' ? 'サモナースペル' : 'Summoner Spells'}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{locale === 'ja' ? '全11種の効果と使いどころ' : 'All 11 spells and when to take them'}</p>
            </div>
          </Link>
          </div>
        </section>
      </div>
  );
}

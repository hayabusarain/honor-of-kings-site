 
'use client';

import { useState, useEffect } from 'react';
import { Trophy, ArrowDownWideNarrow, Camera } from 'lucide-react';
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ListNotes } from "@/components/ListNotes";
import { ShareButton } from "@/components/common/ShareButton";
import Image from 'next/image';
import HOK_HEROES from "@/data/hok_heroes.json";
import dataFreshness from "@/data/data_freshness.json";
import { PatchChangeBadge, patchBadgeLegend, formatPatchDateJa } from '@/components/common/PatchChangeBadge';
// type-only import なので patches.json はクライアントバンドルに載らない
import type { LatestPatchChanges } from '@/lib/patchBadges';
import { LANE_TIER_PAGES } from '@/content/laneTierPages';

interface HeroStat {
  id: number | string;
  hero_name: string;
  nameEn: string;
  winRate: number;
  pickRate: number;
  banRate: number;
  tier: string;
  role: string[];
  lane: string;
  updated_at: string;
  key?: string;
  image?: string;
}

interface TierListClientProps {
  stats: HeroStat[];
  /** 直近パッチの調整ヒーロー。サーバー側（page.tsx）で patches.json から導出して渡される */
  patchChanges: LatestPatchChanges;
  /**
   * レーン別ページ（/tier-list/[lane]）から渡す。指定するとそのレーンに固定し、
   * タブはボタンではなく各レーンページへのリンクになる。
   * 総合ページ（/tier-list）は従来どおりタブで即切り替えるため未指定
   */
  lockedLane?: string;
  /** レーン別ページの見出し。未指定なら共通の「Tier表」を出す */
  heading?: { title: string; subtitle: string };
  /** 見出し直下に出す本文（レーン別ページの導入文） */
  lead?: string;
}

const getHeroSlug = (id: string) => {
  const hero = (HOK_HEROES as any[]).find((h: any) => h.id === id);
  return hero?.slug || id;
};

/** 5レーンをまとめて出すタブのID。レーンIDと衝突しない値にする */
const ALL_LANES = 'ALL';

type SortKey = 'winRate' | 'pickRate' | 'banRate';

export function TierListClient({ stats, patchChanges, lockedLane, heading, lead }: TierListClientProps) {
  const t = useTranslations("TierList");
  const r = useTranslations("Role");
  const h = useTranslations("Home");
  const locale = useLocale();
  // 総合ページの初期表示は全レーン。クラッシュを既定にしていたときは、
  // 「全レーンのTier表」と名乗りながら開いた瞬間に見えるのは1レーン分だけだった
  const [activeTab, setActiveTab] = useState(lockedLane ?? ALL_LANES);
  const [sortKey, setSortKey] = useState<SortKey>('winRate');
  const [isMounted, setIsMounted] = useState(false);
  // スクショ用の「共有用表示」。ONの間はフィルタ・ソート・注記を隠し、
  // 選択中レーンだけをアイコン+名前の縦長グリッドに切り替える（CSS/条件描画のみ）
  const [shareMode, setShareMode] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    // レーン別ページでは URL がレーンを決めるので、前回のタブを復元しない
    if (lockedLane) return;
    const savedTab = sessionStorage.getItem('tierListActiveTab');
    if (savedTab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(savedTab);
    }
  }, [lockedLane]);

  useEffect(() => {
    if (isMounted && !lockedLane) {
      sessionStorage.setItem('tierListActiveTab', activeTab);
    }
  }, [activeTab, isMounted, lockedLane]);

  const getRoleName = (role: string) => {
    switch(role) {
      case ALL_LANES: return locale === 'ja' ? '全レーン' : 'All Lanes';
      case 'CLASH': return r('clash');
      case 'JUNGLE': return r('jungle');
      case 'MID': return r('mid');
      case 'FARM': return r('farm');
      case 'ROAM': return r('roam');
      default: return role;
    }
  };

  const roles = [
    { id: 'CLASH' },
    { id: 'JUNGLE' },
    { id: 'MID' },
    { id: 'FARM' },
    { id: 'ROAM' }
  ];

  if (stats.length === 0) {
    return (
      <div className="w-full p-4 bg-slate-50 min-h-screen">
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-100">
          <Trophy className="mx-auto h-12 w-12 text-slate-200 mb-3" />
          <h3 className="text-lg font-black text-slate-800">{t('noData')}</h3>
          <p className="mt-2 text-xs font-bold text-slate-400">
            {t('noDataDesc')}
          </p>
        </div>
      </div>
    );
  }

  // Tier のグルーピングは維持しつつ、各 Tier 内を選択中の指標で降順ソートする
  const tiers = ['S', 'A', 'B', 'C'];
  const groupedStatsFor = (laneId: string) => tiers.map(tier => ({
    tier,
    heros: stats
      .filter(c => c.lane === laneId && c.tier === tier)
      .sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0))
  })).filter(g => g.heros.length > 0);

  const isAllLanes = activeTab === ALL_LANES;

  // 総合ページは5レーンすべてを HTML に出す。「全レーン」を選んでいる間は全部見せ、
  // 1レーンを選んだときだけ選択中以外を CSS で隠す。
  // gzip 後の転送量は繰り返しマークアップのためほとんど増えない
  // （実測: 30体でも16体でも 25KB）。
  // レーン別ページは自分のレーンだけ出す（総合ページの縮小版にしない）
  const lanesToRender = lockedLane ? [lockedLane] : roles.map(r => r.id);

  // タブは「全レーン」＋5レーン。レーン別ページでは各レーンの固定URLへのリンクになり、
  // 「全レーン」は総合ページへ戻る導線になる
  const tabs = [ALL_LANES, ...roles.map(r => r.id)];

  // 共有用表示に出すレーン。「全レーン」のときは5枚を縦に並べる
  const shareLanes = lockedLane ? [lockedLane] : isAllLanes ? roles.map(r => r.id) : [activeTab];

  // 用語はヒーロー詳細ページに合わせて「出現率」に統一する（旧: ピック率／採用率）
  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'winRate', label: locale === 'ja' ? '勝率' : 'Win Rate' },
    { key: 'pickRate', label: locale === 'ja' ? '出現率' : 'Pick Rate' },
    { key: 'banRate', label: locale === 'ja' ? 'BAN率' : 'Ban Rate' },
  ];

  // 玉璽の序列: S=金（塗り）→ A=翡翠 → B以下=石。
  // ※S+ は廃止し S に統合（4段階: S/A/B/C）
  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'S': return 'bg-brand-600 text-white border-brand-600';
      case 'A': return 'bg-jade-50 text-jade-700 border-jade-300';
      case 'B': return 'bg-slate-100 text-slate-500 border-slate-300';
      case 'C': return 'bg-slate-100 text-slate-400 border-slate-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const getWinRateColor = (wr: number) => {
    if (wr >= 52) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (wr >= 50) return 'text-brand-600 bg-brand-50 border-brand-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  // 直近パッチの調整バッジ。統計の取得日より新しい情報なので、
  // 凡例で「統計値には未反映」と明示する。描画は共通部品 PatchChangeBadge に任せる
  const hasPatchBadges = Object.keys(patchChanges.changes).length > 0;

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      {/* Header。共有用表示中はスクロールで固定せず、スクショに他要素が被らないようにする */}
      <div className={`${shareMode ? '' : 'sticky top-14 md:top-0 z-20'} bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4 sm:py-6 px-4 md:px-8 shadow-xs`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{heading?.title ?? t('title')}</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">{heading?.subtitle ?? t('subtitle')}</p>
          </div>
          <div className="flex items-center justify-end gap-2 sm:gap-3 flex-wrap">
            {/* 取得日は data_freshness.json を正とする。文言に日付を直書きすると更新漏れが起きるため */}
            <span className="inline-block text-[11px] font-bold text-slate-500">
              {h('metaUpdated', { date: dataFreshness.campStats.updatedAt })}
            </span>
            {!shareMode && (
              <ShareButton title={locale === 'ja' ? '【オナーオブキングス】最新Tier表' : 'Honor of Kings Tier List'} />
            )}
            {/* スクショ用の表示切替。ONの間はUIを隠したコンパクト表示になる */}
            <button
              onClick={() => setShareMode(v => !v)}
              aria-pressed={shareMode}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-colors focus-visible:outline-2 focus-visible:outline-brand-500 ${
                shareMode
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Camera size={14} />
              <span>
                {shareMode
                  ? locale === 'ja' ? '通常表示に戻す' : 'Exit share view'
                  : locale === 'ja' ? '共有用表示' : 'Share view'}
              </span>
            </button>
            {/* ボタンが増えたため、狭い画面では装飾アイコンを畳んで横幅を確保する */}
            <div className="hidden sm:block bg-amber-100 p-2.5 rounded-2xl text-amber-600 shadow-inner">
              <Trophy size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* レーン別ページの導入文。総合ページと本文が同じにならないよう、
          そのレーンで何が求められるかを最初に置く（内容はマクロガイドと揃えている） */}
      {!shareMode && lead && (
        <div className="px-4 md:px-8 pt-4">
          <p className="max-w-7xl mx-auto text-[13px] font-medium text-slate-600 leading-relaxed">{lead}</p>
        </div>
      )}

      {/* 統計を取得した後にバランス調整が入っている場合の注記。
          同じサイトのパッチノートが「后羿のスキル1持続が5秒→4秒」と書いている一方で
          Tier表が調整前の勝率を出している、という食い違いを読者に伝える。
          統計を取り直したら data_freshness.json の patchBasis を空にすれば消える */}
      {!shareMode && dataFreshness.campStats.patchBasisJa && (
        <div className="px-4 md:px-8 pt-4">
          <p className="max-w-7xl mx-auto text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 leading-relaxed">
            {locale === 'en' ? dataFreshness.campStats.patchBasisEn : dataFreshness.campStats.patchBasisJa}
          </p>
        </div>
      )}

      {/* ↑↓バッジの凡例。バッジは統計の取得日（8/11）より新しいパッチ情報なので、
          「統計値には未反映」をここで明示する */}
      {!shareMode && hasPatchBadges && (
        <div className="px-4 md:px-8 pt-2">
          <p className="max-w-7xl mx-auto text-[11px] font-bold text-slate-500">
            {patchBadgeLegend(patchChanges, locale)}
          </p>
        </div>
      )}

      {/* Role Navigation Bar + Sort Control（共有用表示中は隠す） */}
      {!shareMode && (
      <div className="py-4 bg-slate-50 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* 総合ページはその場で切り替える。レーン別ページでは各レーンの固定URLへ移る
                （リンクにしておくとクローラが5レーン分のページを辿れる） */}
            {tabs.map(tabId => {
              const cls = `py-2 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === tabId
                  ? 'bg-slate-900 text-white shadow-md scale-100'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 active:scale-95'
              }`;
              if (lockedLane) {
                const laneSlug = LANE_TIER_PAGES.find(l => l.id === tabId)?.slug;
                const href = tabId === ALL_LANES ? '/tier-list' : laneSlug ? `/tier-list/${laneSlug}` : null;
                if (!href) return null;
                return (
                  <Link key={tabId} href={href} className={cls}>
                    {getRoleName(tabId)}
                  </Link>
                );
              }
              return (
                <button key={tabId} onClick={() => setActiveTab(tabId)} className={cls}>
                  {getRoleName(tabId)}
                </button>
              );
            })}
          </div>

          {/* Tier内の並び替え（勝率 / 出現率 / BAN率） */}
          <div className="flex items-center gap-1.5">
            <ArrowDownWideNarrow size={14} className="text-slate-400" />
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-xs">
              {sortOptions.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortKey(opt.key)}
                  className={`py-1.5 px-3 rounded-[10px] font-bold text-[11px] sm:text-xs transition-all ${
                    sortKey === opt.key
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 共有用表示: 表示中レーンのS〜Cをアイコン+名前だけの縦長グリッドに畳み、
          最下部に出典（サイトURLと統計取得日）を焼き込む。
          出典は各レーンの枠に入れる。1レーンだけ切り出して貼っても出所が残るように */}
      {shareMode ? (
        <div className="max-w-md mx-auto px-4 mt-4 space-y-3">
          {shareLanes.map(laneId => (
          <div key={laneId} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-baseline justify-between pb-1 border-b border-slate-100">
              <span className="text-sm font-black text-slate-900">{getRoleName(laneId)}</span>
              <span className="text-[10px] font-bold text-slate-500">
                {locale === 'ja' ? 'Tier表' : 'Tier List'}
              </span>
            </div>
            {groupedStatsFor(laneId).map(({ tier, heros }) => (
              <div key={tier} className="flex gap-2.5">
                <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-black text-sm border shadow-xs ${getTierBadgeStyle(tier)}`}>
                  {tier}
                </div>
                <div className="flex-1 grid grid-cols-5 gap-x-1.5 gap-y-2 pt-0.5">
                  {heros.map((hero) => (
                    <div key={hero.id} className="flex flex-col items-center min-w-0">
                      {/* バッジはアイコン枠の overflow-hidden で切れないよう、1段外に置く */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl overflow-hidden relative bg-slate-100 shadow-inner">
                          <Image
                            src={hero.image || `/images/heroes/${hero.key || hero.id}.webp`}
                            alt={hero.hero_name || String(hero.id)}
                            fill
                            sizes="40px"
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.srcset = '';
                              e.currentTarget.src = '/images/heroes/default.webp';
                            }}
                          />
                        </div>
                        <PatchChangeBadge
                          patch={patchChanges}
                          heroId={String(hero.id)}
                          locale={locale}
                          className="absolute -top-1 -right-1 z-10 text-[8px] px-0.5 py-0.5"
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 truncate w-full text-center mt-0.5">
                        {hero.hero_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-100 text-center text-[10px] font-bold text-slate-500">
              {locale === 'ja'
                ? `hok.hub-game.com ／ HoK Camp統計 ${dataFreshness.campStats.updatedAt}取得`
                : `hok.hub-game.com / HoK Camp stats as of ${dataFreshness.campStats.updatedAt}`}
              {/* スクショ単体で見ても ↑↓ の意味が分かるよう、バッジがあるときだけ凡例を焼き込む */}
              {hasPatchBadges && (
                <div className="mt-0.5 font-medium">
                  {locale === 'ja'
                    ? `↑↓＝${formatPatchDateJa(patchChanges.date)}パッチ調整（統計未反映）`
                    : `↑↓ = changed in the ${patchChanges.versionEn} (not yet in the stats)`}
                </div>
              )}
            </div>
          </div>
          ))}
        </div>
      ) : (

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-2 space-y-6">
        {lanesToRender.map(laneId => (
        <section
          key={laneId}
          aria-label={getRoleName(laneId)}
          className={`space-y-6 ${isAllLanes || laneId === activeTab ? '' : 'hidden'}`}
        >
        {/* 5レーンを続けて出すので、どこからどこまでがどのレーンか分かる見出しを置く。
            レーン別ページは h1 がレーン名なので出さない */}
        {!lockedLane && (
          <div className="flex items-baseline justify-between gap-3 pt-2">
            <h2 className="text-lg font-black tracking-tight text-slate-900">{getRoleName(laneId)}</h2>
            {LANE_TIER_PAGES.find(l => l.id === laneId) && (
              <Link
                href={`/tier-list/${LANE_TIER_PAGES.find(l => l.id === laneId)!.slug}`}
                className="shrink-0 text-[11px] font-bold text-brand-600 hover:underline"
              >
                {locale === 'ja' ? 'このレーンだけのページ' : 'Lane page'}
              </Link>
            )}
          </div>
        )}
        {groupedStatsFor(laneId).map(({ tier, heros }) => (
          <div key={tier} className="flex flex-col gap-3 bg-white/60 p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-base border shadow-xs ${getTierBadgeStyle(tier)}`}>
                  {tier}
                </div>
                <h2 className="text-base font-black text-slate-800">Tier {tier}</h2>
              </div>
              <span className="text-[10px] font-black text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-xs">
                {t('tier', { count: heros.length })}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 pt-1">
              {heros.map((hero) => (
                <Link
                  key={hero.id}
                  href={`/heroes/${getHeroSlug(String(hero.id))}`}
                  className="relative flex flex-col bg-white rounded-2xl p-3 shadow-xs border border-slate-200/70 hover:border-slate-300 hover:shadow-md transition-all group"
                >
                  {/* 直近パッチで調整されたヒーローに ↑↓/調整 の小バッジを出す */}
                  <PatchChangeBadge patch={patchChanges} heroId={String(hero.id)} locale={locale} />
                  {/* alt は内部IDではなくヒーロー名。IDを読み上げても意味がない */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-slate-100 rounded-2xl overflow-hidden mb-2 relative shadow-inner group-hover:scale-105 transition-transform duration-200">
                    <Image
                      src={hero.image || `/images/heroes/${hero.key || hero.id}.webp`}
                      alt={hero.hero_name || String(hero.id)}
                      fill
                      sizes="64px"
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.srcset = '';
                        e.currentTarget.src = '/images/heroes/default.webp';
                      }}
                    />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 text-center truncate w-full mb-2 group-hover:text-brand-600 transition-colors">
                    {hero.hero_name}
                  </h3>
                  {/* 3指標を常時表示する。以前は並び替えで選んだ1つしか出しておらず、
                      勝率だけを見て判断される作りになっていた。BAN率は「対処しづらいか」、
                      出現率は「どれだけ使われているか」で、勝率とは別のことを示す。
                      並び替え中の指標だけ色を付けて、どれで並んでいるかが分かるようにする */}
                  <div className="mt-auto space-y-0.5">
                    {sortOptions.map(opt => {
                      const active = sortKey === opt.key;
                      const tone = active
                        ? (opt.key === 'winRate'
                          ? getWinRateColor(hero.winRate)
                          : 'text-brand-700 bg-brand-50 border-brand-200')
                        : 'text-slate-500 bg-slate-50/70 border-transparent';
                      return (
                        <div
                          key={opt.key}
                          className={`rounded-md py-0.5 px-1.5 flex items-center justify-between border ${tone}`}
                        >
                          <span className="text-[9px] font-bold opacity-70">{opt.label}</span>
                          <span className={`font-bold tabular-nums ${active ? 'text-[11px]' : 'text-[10px]'}`}>
                            {(hero[opt.key] || 0).toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
        </section>
        ))}
      </div>
      )}

      {!shareMode && <ListNotes page="tierList" locale={locale} />}
    </div>
  );
}

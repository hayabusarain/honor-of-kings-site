'use client';

import Image from 'next/image';

import { Link } from "@/i18n/routing";
import { useEffect, useState, useMemo } from 'react';
import { Search, Users, Target, Shield, Zap, Crosshair, HeartPulse, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HokHero, HeroCampStats } from '@/types/database';
import hokHeroes from "@/data/hok_heroes.json";
import campStatsRaw from "@/data/hero_stats_camp.json";
import { ListNotes } from '@/components/ListNotes';
import { StatsFreshnessNote } from '@/components/common/StatsFreshnessNote';
import { subRoleLabel } from '@/content/subRoleNames';
import { DIFFICULTY_IDS, difficultyLabel } from '@/content/heroDifficulty';
import { PatchChangeBadge, patchBadgeLegend } from '@/components/common/PatchChangeBadge';
// type-only import はコンパイル時に消えるため、patches.json（156KB）が
// クライアントバンドルへ載ることはない。値の import は禁止
import type { LatestPatchChanges } from '@/lib/patchBadges';


interface HeroData {
  id: string;
  key: string;
  // canonical と sitemap は slug 側を正としている。ここに slug を持たせないと
  // 一覧の全リンクが数値IDに落ち、正規URLへの内部リンクがサイトから消える
  slug?: string;
  name: string;
  name_en?: string;
  title: string;
  blurb: string;
  tags: string[];
  search_alias?: string;
  title_alias?: string;
  name_ja?: string;
  image?: string;
}

interface Props {
  locale: string;
  /** 直近パッチの調整ヒーロー。サーバー側（page.tsx）で patches.json から導出して渡される */
  patchChanges: LatestPatchChanges;
  /** hero_id → 難易度ラベル（イージー/ノーマル/ハード/ベリーハード）。公式表記のあるヒーローのみ */
  difficultyById: Record<string, string>;
  /** hero_id → 正規化済みの戦い方タイプ。sub_role を持つヒーローのみ */
  subRoleById: Record<string, string>;
}


// campStats のキーはヒーローIDそのものだったり hero_NNN 形式だったりする。
// 一覧の絞り込みと並び替えでも同じ引き方が要るので、描画側から切り出した
const getCampStats = (hero: { id: string; key: string }): HeroCampStats | undefined => {
  const raw = campStatsRaw as Record<string, HeroCampStats>;
  if (raw[hero.id]) return raw[hero.id];
  const padded = raw[`hero_${String(hero.key).padStart(3, '0')}`];
  if (padded) return padded;
  const flat = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const found = Object.keys(raw).find(
    (key) => key.toLowerCase() === hero.id.toLowerCase() || flat(key) === flat(hero.id)
  );
  return found ? raw[found] : undefined;
};

const TIER_RANK: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };

export function HeroesListClient({ locale, patchChanges, difficultyById, subRoleById }: Props) {
  const t = useTranslations("Heroes");
  const r = useTranslations("Role");


  const initialHeros = useMemo(() => {
    const list: HeroData[] = [];

    for (const hero of hokHeroes as HokHero[]) {
      list.push({
        id: hero.id,
        key: hero.id,
        slug: hero.slug,
        name: locale === 'en' && hero.name_en ? hero.name_en : hero.name,
        name_en: hero.name_en,
        title: hero.title || 'Honor of Kings Hero',
        blurb: '',
        tags: hero.role || ['Fighter'],
        search_alias: hero.search_alias || '',
        title_alias: hero.title_alias || '',
        name_ja: hero.name,
        image: hero.image,
      });
    }

    return list;
  }, [locale]);

  const [heros] = useState<HeroData[]>(initialHeros);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [laneFilter, setLaneFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [subRoleFilter, setSubRoleFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'tier' | 'winRate'>('name');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFilter = sessionStorage.getItem('heroesActiveFilter');
      const savedSearch = sessionStorage.getItem('heroesSearchQuery');
      if (savedFilter) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveFilter(savedFilter);
      }
      if (savedSearch) {

        setSearchQuery(savedSearch);
      }

      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      sessionStorage.setItem('heroesActiveFilter', activeFilter);
      sessionStorage.setItem('heroesSearchQuery', searchQuery);
    }
  }, [activeFilter, searchQuery, isMounted]);

  useEffect(() => {
    // Already populated by mock data directly. No need to query Supabase or DataDragon right now.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, [locale]);

  // レーンで絞れるようにする。実際のプレイヤーは「今日はジャングルをやる」から
  // ヒーローを探すが、これまでの絞り込みは職業タグだけだった。
  // レーンは campStats に元から入っていて、カードのTierバッジ表示に使っていた
  const lanes = [
    { id: 'All', label: locale === 'ja' ? '全レーン' : 'All Lanes' },
    { id: 'CLASH', label: r('clash') },
    { id: 'JUNGLE', label: r('jungle') },
    { id: 'MID', label: r('mid') },
    { id: 'FARM', label: r('farm') },
    { id: 'ROAM', label: r('roam') },
  ];

  const roles = [
    { id: 'All', label: r('all'), icon: <Users size={16} /> },
    { id: 'Fighter', label: r('fighter'), icon: <Target size={16} /> },
    { id: 'Tank', label: r('tank'), icon: <Shield size={16} /> },
    { id: 'Mage', label: r('mage'), icon: <Sparkles size={16} /> },
    { id: 'Assassin', label: r('assassin'), icon: <Zap size={16} /> },
    { id: 'Marksman', label: r('marksman'), icon: <Crosshair size={16} /> },
    { id: 'Support', label: r('support'), icon: <HeartPulse size={16} /> },
  ];

  // 難易度フィルタの選択肢。id は skills/ja.json の difficulty の値そのもの
  const difficulties = [
    { id: 'All', label: locale === 'ja' ? '全難易度' : 'All difficulties' },
    ...DIFFICULTY_IDS.map(id => ({ id: id as string, label: difficultyLabel(id, locale) })),
  ];
  // 難易度未掲載のヒーローが選択時に消える理由を伝える注記に使う件数
  const difficultyCount = Object.keys(difficultyById).length;

  // ロールが選ばれているときだけ出す二段目の絞り込み。
  // そのロールに実在する戦い方タイプだけを並べ、空振りする選択肢を出さない
  const subRoleOptions = useMemo(() => {
    if (activeFilter === 'All') return [];
    const seen = new Set<string>();
    for (const hero of heros) {
      if (!hero.tags.includes(activeFilter)) continue;
      const subRole = subRoleById[hero.id];
      if (subRole) seen.add(subRole);
    }
    // 並び順は表示ラベル基準。英語表示のときに日本語の五十音順で並ぶと
    // ランダムに見えてしまう
    return [...seen].sort((a, b) =>
      subRoleLabel(a, locale).localeCompare(subRoleLabel(b, locale), locale)
    );
  }, [heros, activeFilter, subRoleById, locale]);

  // 直近パッチの調整バッジがあるときだけ凡例を出す（統計値との時差を伝える）
  const hasPatchBadges = Object.keys(patchChanges.changes).length > 0;

  const filteredHeros = useMemo(() => {
    const result = heros.filter(champ => {
      const cleanStr = (s: string) => (s || '').replace(/[\s\u3000・]+/g, '').toLowerCase();
      // 別名はひらがなで持っているが、利用者はカタカナで打つことが多い。
      // 「ムーラン」で花木蘭が引けるよう、カタカナをひらがなに寄せてから比べる。
      const norm = (s: string) =>
        cleanStr(s).replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
      const query = norm(searchQuery);
      const matchesSearch = norm(champ.name).includes(query) ||
                            norm(champ.name_ja || '').includes(query) ||
                            norm(champ.name_en || '').includes(query) ||
                            norm(champ.id).includes(query) ||
                            (champ.title && norm(champ.title).includes(query)) ||
                            (champ.title_alias && norm(champ.title_alias).includes(query)) ||
                            (champ.search_alias && norm(champ.search_alias).includes(query));
      const matchesFilter = activeFilter === 'All' || champ.tags.includes(activeFilter);
      const matchesLane = laneFilter === 'All' || getCampStats(champ)?.lane === laneFilter;
      // 難易度・戦い方タイプはデータの無いヒーローが選択時に自動で外れる。
      // その旨はフィルタ横の注記で伝える
      const matchesDifficulty = difficultyFilter === 'All' || difficultyById[champ.id] === difficultyFilter;
      const matchesSubRole = subRoleFilter === 'All' || subRoleById[champ.id] === subRoleFilter;
      return matchesSearch && matchesFilter && matchesLane && matchesDifficulty && matchesSubRole;
    });

    // 統計が無いヒーローは、並び替えても常に末尾に置く
    const byStat = (pick: (s: HeroCampStats) => number | undefined) => (a: HeroData, b: HeroData) => {
      const av = pick(getCampStats(a) as HeroCampStats) ?? -1;
      const bv = pick(getCampStats(b) as HeroCampStats) ?? -1;
      if (av !== bv) return bv - av;
      return (a.name || '').localeCompare(b.name || '');
    };

    if (sortBy === 'tier') {
      result.sort(byStat((s) => (s ? TIER_RANK[s.tier] : undefined)));
    } else if (sortBy === 'winRate') {
      result.sort(byStat((s) => s?.win_rate));
    } else {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [heros, searchQuery, activeFilter, laneFilter, difficultyFilter, subRoleFilter, sortBy, difficultyById, subRoleById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 pt-8 pb-4 px-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
            <p className="text-xs font-bold text-slate-500 mt-1">{t('subtitle')}</p>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-2xl text-slate-700 shadow-inner">
            <Users size={20} />
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-transparent rounded-2xl focus:border-slate-300 focus:bg-white outline-none text-slate-800 placeholder-slate-400 font-bold text-sm transition-all"
          />
        </div>
      </div>

      {/* レーン絞り込みと並び替え。カードにTierバッジを出しながら
          Tier順に並べられず、Tier表へ行き直す必要があったのを解消する */}
      <div className="pt-4 bg-slate-50 px-4 flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {lanes.map(lane => (
            <button
              key={lane.id}
              onClick={() => setLaneFilter(lane.id)}
              aria-pressed={laneFilter === lane.id}
              className={`shrink-0 whitespace-nowrap py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                laneFilter === lane.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 active:scale-95'
              }`}
            >
              {lane.label}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          aria-label={locale === 'ja' ? '並び替え' : 'Sort by'}
          className="sm:ml-auto shrink-0 py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs outline-none focus:border-slate-300 cursor-pointer"
        >
          <option value="name">{locale === 'ja' ? '名前順' : 'By name'}</option>
          <option value="tier">{locale === 'ja' ? 'Tierが高い順' : 'By tier'}</option>
          <option value="winRate">{locale === 'ja' ? '勝率が高い順' : 'By win rate'}</option>
        </select>
      </div>

      {/* 勝率ソート・Tierバッジを出しているのに、その数字がいつ時点かが
          このページだけ無かった。取得日と調整前注記をソートUIの直下に置く */}
      <div className="pt-2 bg-slate-50 px-4">
        <StatsFreshnessNote locale={locale} />
        {/* ↑↓バッジの凡例。バッジは統計の取得日より新しいパッチ情報なので、
            Tier表と同じ文言で「統計値には未反映」を明示する */}
        {hasPatchBadges && (
          <p className="mt-1.5 text-[11px] font-bold text-slate-500">
            {patchBadgeLegend(patchChanges, locale)}
          </p>
        )}
      </div>

      {/* Role Filters - 3 Column Grid */}
      <div className="pt-3 pb-2 bg-slate-50 px-4">
        <div className="flex flex-wrap gap-2">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => {
                setActiveFilter(role.id);
                // 二段目はロールに従属する絞り込みなので、ロールを替えたら必ず解除する
                // （前のロールのタイプが残ると0件表示になる）
                setSubRoleFilter('All');
              }}
              aria-pressed={activeFilter === role.id}
              className={`flex items-center gap-1.5 justify-center py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                activeFilter === role.id
                  ? 'bg-slate-900 text-white shadow-md scale-100'
                  : 'bg-white text-slate-600 border border-slate-200 scale-[0.98] active:scale-95'
              }`}
            >
              {role.icon}
              <span>{role.label}</span>
            </button>
          ))}
        </div>

        {/* 戦い方タイプの二段絞り込み。ロール未選択時は全24種が並んで
            選びようがないため、ロールを選んだときだけ出す */}
        {activeFilter !== 'All' && subRoleOptions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <button
              onClick={() => setSubRoleFilter('All')}
              aria-pressed={subRoleFilter === 'All'}
              className={`py-1.5 px-2.5 rounded-lg font-bold text-[11px] transition-all ${
                subRoleFilter === 'All'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-500 border border-slate-200 active:scale-95'
              }`}
            >
              {locale === 'ja' ? '全タイプ' : 'All types'}
            </button>
            {subRoleOptions.map(subRole => (
              <button
                key={subRole}
                onClick={() => setSubRoleFilter(subRole)}
                aria-pressed={subRoleFilter === subRole}
                className={`py-1.5 px-2.5 rounded-lg font-bold text-[11px] transition-all ${
                  subRoleFilter === subRole
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 text-slate-500 border border-slate-200 active:scale-95'
                }`}
              >
                {subRoleLabel(subRole, locale)}
              </button>
            ))}
          </div>
        )}

        {/* 難易度絞り込み。値は skills/ja.json の公式表記そのもの */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {difficulties.map(difficulty => (
            <button
              key={difficulty.id}
              onClick={() => setDifficultyFilter(difficulty.id)}
              aria-pressed={difficultyFilter === difficulty.id}
              className={`py-1.5 px-2.5 rounded-lg font-bold text-[11px] transition-all ${
                difficultyFilter === difficulty.id
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-500 border border-slate-200 active:scale-95'
              }`}
            >
              {difficulty.label}
            </button>
          ))}
          {/* 難易度未掲載のヒーローが選択時に消える理由を、消えるときだけ伝える */}
          {difficultyFilter !== 'All' && (
            <span className="text-[10px] font-medium text-slate-500">
              {locale === 'ja'
                ? `難易度は公式表記のある${difficultyCount}体のみ`
                : `Only the ${difficultyCount} heroes with an official difficulty rating`}
            </span>
          )}
        </div>
      </div>

      {/* Heros Grid */}
      <div className="px-4 mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-3 gap-y-5">
        {filteredHeros.map((hero, idx) => {
          const tier = getCampStats(hero)?.tier;
          const subRole = subRoleById[hero.id];

          return (
            <Link
              key={hero.id}
              href={`/heroes/${hero.slug || hero.id}`}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform relative group"
            >
              <div className="relative w-[76px] h-[76px] sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
                <Image
                  src={hero.image || `/images/heroes/default.webp`}
                  alt={hero.name}
                  width={80}
                  height={80}
                  // 初期ビューポートに入る先頭行だけ先に読む。全件 lazy だと
                  // LCP候補の描画が1往復ぶん遅れる
                  priority={idx < 8}
                  className="w-full h-full object-cover scale-[1.05]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).srcset = '';
                    (e.target as HTMLImageElement).src = `/images/heroes/default.webp`;
                  }}
                />
                {tier && (
                  <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-bl-lg">
                    {tier}
                  </div>
                )}
                {/* 直近パッチで調整されたヒーローの目印。Tierバッジ（右上）と
                    重ならないよう左上に置く。className は既定（右上）を丸ごと上書きする */}
                <PatchChangeBadge
                  patch={patchChanges}
                  heroId={hero.id}
                  locale={locale}
                  className="absolute top-0 left-0 z-10 text-[10px] px-1 py-0.5 rounded-br-lg"
                />
              </div>
              <div className="flex flex-col items-center w-full px-1">
                <span className="text-[11px] font-bold text-slate-800 text-center w-full truncate leading-tight group-hover:text-brand-600 transition-colors">
                  {hero.name}
                </span>
                {locale !== 'en' && hero.title && hero.title !== 'Honor of Kings Hero' && (
                  <span className="text-[10px] font-medium text-slate-500 text-center w-full truncate leading-tight mt-0.5">
                    {hero.title}
                  </span>
                )}
                {/* 戦い方タイプ。「メイジ」だけでは砲台型かポーク型か
                    区別がつかないため、カードの時点で見分けられるようにする */}
                {subRole && (
                  // カード幅76pxでは「重砲型マークスマン」等が切れるため、全文は title で読める
                  <span
                    title={subRoleLabel(subRole, locale)}
                    className="mt-0.5 max-w-full truncate rounded-md bg-slate-100 px-1.5 py-px text-[10px] font-bold leading-tight text-slate-500"
                  >
                    {subRoleLabel(subRole, locale)}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        {filteredHeros.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200 mt-4 shadow-sm">
            <Users className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-black text-slate-800">{locale === 'en' ? 'Not Found' : '見つかりませんでした'}</h3>
            <p className="text-xs font-bold text-slate-500 mt-1">{locale === 'en' ? 'No heroes match your search criteria.' : '検索条件に一致するヒーローがいません。'}</p>
          </div>
        )}
      </div>

      <div className="px-4">
        <ListNotes page="heroes" locale={locale} />
      </div>
    </div>
  );
}

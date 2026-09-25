'use client';

import Image from 'next/image';

import { Link } from "@/i18n/routing";
import { useEffect, useState, useMemo } from 'react';
import { Search, Users, BarChart3, MapIcon, Gauge, Layers, ArrowDownWideNarrow } from 'lucide-react';
import { LaneIcon, RoleIcon } from '@/components/icons/GameIcons';
import { useTranslations } from 'next-intl';
import { HokHero, HeroCampStats } from '@/types/database';
import { searchNormalize } from '@/utils/searchNormalize';
import { getTierBadgeStyle } from '@/lib/tierBadge';
import { readQuery, replaceQuery, pickEnum } from '@/lib/urlState';
import hokHeroes from "@/data/hok_heroes.json";
import campStatsRaw from "@/data/hero_stats_camp.json";
import { ListNotes } from '@/components/ListNotes';
import { StatsFreshnessNote } from '@/components/common/StatsFreshnessNote';
import { subRoleLabel } from '@/content/subRoleNames';
import { DIFFICULTY_IDS, difficultyLabel } from '@/content/heroDifficulty';
import { PatchChangeBadge } from '@/components/common/PatchChangeBadge';
import { Dropdown, type DropdownOption } from '@/components/common/Dropdown';
import { ROLE_LANDINGS } from '@/content/roleLandings';
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
  /** 名前のふりがな。日本語ページで漢字名にだけ添える */
  reading?: string;
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


// camp のキーは公式 heroId そのもの（sync_camp_tier.js が heroId で書く）。
// 絞り込み・並び替え・描画の3か所で引くので関数にしてある
const getCampStats = (hero: { id: string }): HeroCampStats | undefined =>
  (campStatsRaw as Record<string, HeroCampStats>)[hero.id];

/**
 * URLに載せる値。一度貼られたURLは壊せないので、表示ラベルとは切り離して固定する。
 * 難易度だけは値が日本語なので ASCII のスラッグに置き換える。
 * 対応表に無い値が来たらそのパラメータを捨てる（既定へ落とす）。
 */
const ROLE_IDS = ['All', 'Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'] as const;
const LANE_IDS = ['All', 'CLASH', 'JUNGLE', 'MID', 'FARM', 'ROAM'] as const;
const SORT_IDS = ['name', 'tier', 'winRate'] as const;
type SortId = (typeof SORT_IDS)[number];
const DIFFICULTY_TO_SLUG: Record<string, string | null> = {
  All: null,
  'イージー': 'easy',
  'ノーマル': 'normal',
  'ハード': 'hard',
  'ベリーハード': 'very-hard',
};
const DIFFICULTY_FROM_SLUG: Record<string, string> = {
  easy: 'イージー',
  normal: 'ノーマル',
  hard: 'ハード',
  'very-hard': 'ベリーハード',
};

const TIER_RANK: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };

/** ロールの値（Tank など）→ ロール別ページの slug。'All' など対応の無い値は undefined */
const roleSlugOf = (roleId: string): string | undefined =>
  ROLE_LANDINGS.find((r) => r.id === roleId)?.slug;

/**
 * 名前を本体と括弧書きに分ける（「元流の子（メイジ）」「Flowborn (Mage)」）。
 * 1行に収めると 390px のカード（名前の枠103px）で括弧の中が切れ、
 * 英語では Mage と Marksman がどちらも「Flowborn (M…」になって見分けられなかった。
 * 括弧書きは2行目に分けて出す。ふりがなも本体にだけ振る
 */
const splitName = (name: string): [string, string | null] => {
  const m = name.match(/^(.+?)\s*([（(][^（()）]+[）)])$/);
  return m ? [m[1], m[2]] : [name, null];
};

/**
 * 戦い方タイプの表示。14px にすると 390px の1枚（約95px）に1行で入らないので2行まで折り返すが、
 * 素直に折ると「突撃型フ／ァイター」のように語の途中で切れた。日本語は「〜型」「〜系」の後ろ
 * （タンクマークスマンはタンクの後ろ）だけで折れるようにする。英語は空白で折れるのでそのまま
 */
function SubRoleText({ label, ja }: { label: string; ja: boolean }) {
  const m = ja ? label.match(/^(.+?[型系])(.+)$/) ?? label.match(/^(タンク)(マークスマン)$/) : null;
  if (!m) return <>{label}</>;
  return (
    <>
      <span className="whitespace-nowrap">{m[1]}</span>
      <wbr />
      <span className="whitespace-nowrap">{m[2]}</span>
    </>
  );
}

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
        reading: hero.reading,
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
  const [sortBy, setSortBy] = useState<SortId>('name');
  const [isMounted, setIsMounted] = useState(false);

  // 絞り込んだ画面をURLで共有できるようにする。
  // 出どころは URL > sessionStorage の順。クエリで指定された項目はURLを採り、
  // 指定の無い項目だけ sessionStorage で埋める。埋めた結果もクエリへ書き戻すので、
  // 「URLは素の /heroes なのに画面は絞られている」状態は作らない。
  //
  // useSearchParams は使わない。使うとページが Suspense 境界を要求し、
  // 静的生成から外れる（items/page.tsx と同じ理由）。
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const q = readQuery();
    const saved = {
      filter: sessionStorage.getItem('heroesActiveFilter'),
      search: sessionStorage.getItem('heroesSearchQuery'),
    };
    /* eslint-disable react-hooks/set-state-in-effect --
     * サーバー側では location も sessionStorage も読めないので、
     * 初期 state ではなくマウント後に入れるしかない */
    const role = pickEnum(q?.get('role') ?? saved.filter, ROLE_IDS, 'All');
    setActiveFilter(role);
    setSearchQuery(q?.get('q') ?? saved.search ?? '');
    setLaneFilter(pickEnum(q?.get('lane'), LANE_IDS, 'All'));
    setDifficultyFilter(DIFFICULTY_FROM_SLUG[q?.get('difficulty') ?? ''] ?? 'All');
    setSortBy(pickEnum(q?.get('sort'), SORT_IDS, 'name'));
    /* eslint-enable react-hooks/set-state-in-effect */
    setIsMounted(true);
  }, []);

  // 変更のたびに書き戻す。replaceState なので戻るボタンの履歴は汚れない。
  // 検索語は打鍵ごとに書かず 300ms 待つ。
  // type（戦い方タイプ）はURLに載せない。値が skills/ja.json の日本語IDで、
  // 英語ページのURLに日本語が入る。role さえ載っていれば共有先で選び直せる
  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => {
      replaceQuery({
        q: searchQuery || null,
        role: activeFilter === 'All' ? null : activeFilter,
        lane: laneFilter === 'All' ? null : laneFilter,
        difficulty: DIFFICULTY_TO_SLUG[difficultyFilter] ?? null,
        sort: sortBy === 'name' ? null : sortBy,
      });
      sessionStorage.setItem('heroesActiveFilter', activeFilter);
      sessionStorage.setItem('heroesSearchQuery', searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter, laneFilter, difficultyFilter, sortBy, isMounted]);

  useEffect(() => {
    // Already populated by mock data directly. No need to query Supabase or DataDragon right now.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, [locale]);

  // レーンで絞れるようにする。実際のプレイヤーは「今日はジャングルをやる」から
  // ヒーローを探すが、これまでの絞り込みは職業タグだけだった。
  // レーンは campStats に元から入っていて、カードのTierバッジ表示に使っていた。
  // messages の Role.* は「ジャングル (Jungle)」「Clash Lane」のように括弧や Lane が付いていて、
  // 390px では横スクロールの列が中身697px／枠334pxになり途中で切れていた。
  // Tier表（TierListClient の getShortRoleName）と同じ規則で短くする
  const laneName = (key: string) => r(key).replace(/\s*\(.+\)$/, '').replace(/\s+Lane$/, '');
  const iconCls = 'text-slate-500';
  // レーンとロールの図柄は GameIcons（Tier表のタブと共通）。ロールは色付き
  const lanes: DropdownOption<string>[] = [
    { value: 'All', label: locale === 'ja' ? '全レーン' : 'All lanes', icon: <LaneIcon lane="ALL" className={`h-[18px] w-[18px] ${iconCls}`} /> },
    ...(['CLASH', 'JUNGLE', 'MID', 'FARM', 'ROAM'] as const).map((id) => ({
      value: id as string,
      label: laneName(id.toLowerCase()),
      icon: <LaneIcon lane={id} className={`h-[18px] w-[18px] ${iconCls}`} />,
    })),
  ];

  // 「すべて」だけだとボタンに出たとき何のすべてか分からないので、ロールと明記する
  const roles: DropdownOption<string>[] = [
    { value: 'All', label: locale === 'ja' ? '全ロール' : 'All roles', icon: <Users size={18} className={iconCls} /> },
    ...(['Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'] as const).map((id) => ({
      value: id as string,
      label: r(id.toLowerCase()),
      icon: <RoleIcon role={id} className="h-[18px] w-[18px]" />,
    })),
  ];

  // 難易度フィルタの選択肢。value は skills/ja.json の difficulty の値そのもの
  const difficulties: DropdownOption<string>[] = [
    // 英語の 'All difficulties' は 390px の半幅ボタン（文字の枠86px）に入らず「All difficul…」になった
    { value: 'All', label: locale === 'ja' ? '全難易度' : 'Difficulty' },
    ...DIFFICULTY_IDS.map(id => ({ value: id as string, label: difficultyLabel(id, locale) })),
  ];

  // 「Tierが高い順」「By win rate」は 360px の半幅ボタン（文字の枠70px）で切れた。
  // 並びは高い順しか無く、ボタンの読み上げは「並び替え: 勝率順」「Sort by: Win rate」になる
  const sortOptions: DropdownOption<SortId>[] = [
    { value: 'name', label: locale === 'ja' ? '名前順' : 'Name' },
    { value: 'tier', label: locale === 'ja' ? 'Tier順' : 'Tier' },
    { value: 'winRate', label: locale === 'ja' ? '勝率順' : 'Win rate' },
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
  const showType = activeFilter !== 'All' && subRoleOptions.length > 0;
  // タイプの欄はロールの欄から離れた段に出るので、どのロールのタイプかを文言で示す
  const activeRoleLabel = roles.find(role => role.value === activeFilter)?.label ?? '';
  const typeOptions: DropdownOption<string>[] = [
    { value: 'All', label: locale === 'ja' ? `${activeRoleLabel}の全タイプ` : `All ${activeRoleLabel} types` },
    ...subRoleOptions.map(subRole => ({ value: subRole, label: subRoleLabel(subRole, locale) })),
  ];

  // 直近パッチの調整バッジがあるときだけ凡例を出す（統計値との時差を伝える）
  const hasPatchBadges = Object.keys(patchChanges.changes).length > 0;
  // 二つ名はスマホのカードでは隠している。二つ名（読みを含む）で検索して当たったカードだけは出す。
  // 「聖騎士」で検索してアーサーが出たとき、なぜ当たったかをカードで分かるようにするため
  const normQuery = searchNormalize(searchQuery);
  const titleMatches = (hero: HeroData) =>
    normQuery !== '' &&
    (searchNormalize(hero.title).includes(normQuery) || searchNormalize(hero.title_alias || '').includes(normQuery));

  const filteredHeros = useMemo(() => {
    const result = heros.filter(champ => {
      // 正規化は横断検索とパッチ表と共有する（src/utils/searchNormalize.ts）。
      // 片方だけ直すと「一覧では出るのに検索では出ない」がまた起きる
      const norm = searchNormalize;
      const query = norm(searchQuery);
      // name_ja は hok_heroes.json に1件も無い死んだ式だったので落とした（実測0件）
      const matchesSearch = norm(champ.name).includes(query) ||
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
      // 言語を渡さないと、サーバー（ビルド環境）とブラウザで辞書順が変わり、
      // 並びが食い違ってハイドレーションが失敗する（React #418）
      return (a.name || '').localeCompare(b.name || '', locale);
    };

    if (sortBy === 'tier') {
      result.sort(byStat((s) => (s ? TIER_RANK[s.tier] : undefined)));
    } else if (sortBy === 'winRate') {
      result.sort(byStat((s) => s?.win_rate));
    } else {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || '', locale));
    }

    return result;
  }, [heros, searchQuery, activeFilter, laneFilter, difficultyFilter, subRoleFilter, sortBy, difficultyById, subRoleById, locale]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      {/* 題名の帯。固定するのは下の検索欄だけにしてある。
          以前は題名・説明・検索欄をまとめた高さ179pxの帯を sticky top-0 で固定していて、
          スマホでは上の AppBar（56px）の裏に題名が潜り、残りが画面の2割を埋めていた */}
      <div className="page-hero border-b border-slate-200 pt-6 pb-5 px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
            <p className="text-sm font-bold text-slate-600 mt-1">{t('subtitle')}</p>
          </div>
          {/* 一覧を眺めに来た人が「数値で比べたい」に移れるようにする。
              ステータス比較の入口はヒーロー詳細だけだった */}
          <Link
            href="/heroes/stats"
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <BarChart3 size={14} />
            {locale === 'ja' ? '数値で比べる' : 'Compare stats'}
          </Link>
        </div>
      </div>

      {/* 検索欄。スマホでは AppBar の下（top-14）に、PC では画面の上端に貼り付く */}
      <div className="sticky top-14 md:top-0 z-20 bg-background/90 backdrop-blur-xl border-b border-slate-200 pt-3 pb-3 px-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-slate-300 outline-none text-slate-800 placeholder-slate-400 font-bold text-sm transition-all"
          />
        </div>
      </div>

      {/* 絞り込みと並び替え。以前はボタンを段に並べていて、390px ではレーンの横スクロール列・
          ロール7個（3段）・難易度5個（2段）が積み重なり、最初のヒーローの顔は画面の下端で
          上半分しか見えなかった（メイジを選ぶとタイプの段が加わり、顔より上のボタンが30個）。
          プルダウンにまとめて、スマホでは2列×2段に収める。
          タイプはロールに従属する絞り込みなので、ロールを選んだときだけ最後の段に2列ぶんの幅で出す。
          半幅だと文字の枠が86pxしかなく、「高ダメージ型アサシン」「Ambush Mage」が省略された。
          最後に足すので、ほかの4つの位置はロールを選んでも動かない */}
      <div className="pt-4 bg-background px-4">
        {/* 絞り込みは1枚のカードにまとめる（MLBB Hub と同じ組み方、2026-09-26） */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 xl:grid-cols-4">
          <Dropdown
            label={locale === 'ja' ? 'ロール' : 'Role'}
            icon={<Users size={18} className={iconCls} />}
            options={roles}
            value={activeFilter}
            defaultValue="All"
            onChange={(role) => {
              setActiveFilter(role);
              // タイプはロールに従属するので、ロールを替えたら必ず解除する
              // （前のロールのタイプが残ると0件表示になる）
              setSubRoleFilter('All');
            }}
          />
          <Dropdown
            label={locale === 'ja' ? 'レーン' : 'Lane'}
            icon={<MapIcon size={18} className={iconCls} />}
            options={lanes}
            value={laneFilter}
            defaultValue="All"
            onChange={setLaneFilter}
          />
          {/* 値は skills/ja.json の公式表記そのもの */}
          <Dropdown
            label={locale === 'ja' ? '難易度' : 'Difficulty'}
            icon={<Gauge size={18} className={iconCls} />}
            options={difficulties}
            value={difficultyFilter}
            defaultValue="All"
            onChange={setDifficultyFilter}
          />
          {/* カードにTierバッジを出しながらTier順に並べられず、
              Tier表へ行き直す必要があったのを解消する */}
          <Dropdown
            label={locale === 'ja' ? '並び替え' : 'Sort by'}
            icon={<ArrowDownWideNarrow size={18} className={iconCls} />}
            options={sortOptions}
            value={sortBy}
            defaultValue="name"
            onChange={setSortBy}
          />
          {/* ロール未選択時に出すと全24種が並んで選びようがない */}
          {showType && (
            <Dropdown
              className="col-span-2"
              label={locale === 'ja' ? '戦い方タイプ' : 'Type'}
              icon={<Layers size={18} className={iconCls} />}
              options={typeOptions}
              value={subRoleFilter}
              defaultValue="All"
              onChange={setSubRoleFilter}
            />
          )}
        </div>
        {/* 難易度未掲載のヒーローが選択時に消える理由を、消えるときだけ伝える */}
        {difficultyFilter !== 'All' && (
          <p className="mt-2 text-sm font-medium text-slate-500">
            {locale === 'ja'
              ? `ゲーム内に難易度が表示されているのは${difficultyCount}体です`
              : `${difficultyCount} heroes have a difficulty rating in-game`}
          </p>
        )}
        {/* ロールを選んだときだけ、そのロールの固定ページ（/heroes/role/<role>）への導線を出す。
            既定（全ロール）では何も出さないので、絞り込み欄の高さは変わらない */}
        {roleSlugOf(activeFilter) && (
          <Link
            href={`/heroes/role/${roleSlugOf(activeFilter)}`}
            className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-brand-700 hover:underline"
          >
            {locale === 'ja'
              ? `${activeRoleLabel}のTier・レーン・難易度の内訳`
              : `${activeRoleLabel} heroes at a glance`}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      {/* 勝率ソート・Tierバッジを出しているのに、その数字がいつ時点かが
          このページだけ無かった。取得日と調整前注記を並び替えの直下に置く */}
      <div className="pt-3 bg-background px-4">
        {/* ↑↓バッジの凡例は、Tier表と同じく調整前の注記の中に畳む（注記の部品が組み立てる）。
            以前は凡例だけ畳んだ枠の外に残り、本文の前が1行ぶん長かった */}
        <StatsFreshnessNote locale={locale} patchChanges={hasPatchBadges ? patchChanges : undefined} />
      </div>

      {/* ヒーローの格子。カード1枚の幅を約100px以上に保つ列数にしてある。
          以前は md:6 / lg:8 / xl:10 列で、サイドバーの分を引くとカードが 1024px で76px、
          1280px で84px（実測）しかなく、14pxの名前は6字までしか入らない。
          768px では計算上62pxで、80pxの画像より狭かった */}
      <div className="px-4 mt-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-x-3 gap-y-5">
        {filteredHeros.map((hero, idx) => {
          const tier = getCampStats(hero)?.tier;
          const subRole = subRoleById[hero.id];
          const [nameBase, nameQualifier] = splitName(hero.name);

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
                  // Tier の値によらず金固定で、C評価もSと同じ色だった。
                  // 共通の配色に寄せる。border は helper が持つので枠を付ける
                  <div className={`absolute top-0 right-0 border text-sm leading-none font-black px-1.5 py-1 rounded-bl-lg shadow-xs ${getTierBadgeStyle(tier)}`}>
                    {tier}
                  </div>
                )}
                {/* 直近パッチで調整されたヒーローの目印。Tierバッジ（右上）と
                    重ならないよう左上に置く。className は既定（右上）を丸ごと上書きする */}
                <PatchChangeBadge
                  patch={patchChanges}
                  heroId={hero.id}
                  locale={locale}
                  className="absolute top-0 left-0 z-10 text-sm leading-none px-1 py-1 rounded-br-lg"
                />
              </div>
              {/* 横の余白は格子の gap-x-3 が持つ。ここに px-1 を足すと、390px で名前に使える幅が95pxに減り
                  「マルコ・ポーロ」（14px×7字＝98px）が省略された。
                  flex-1 で段の高さまで伸ばし、タイプは mt-auto で下端に置く。名前が2行になるカード
                  （元流の子・Gao Changgong など）があっても、同じ段のタイプの位置が揃う */}
              <div className="flex w-full flex-1 flex-col items-center gap-0.5">
                {/* 漢字名には読みを添える。ふりがなの有無で名前の高さが変わると、
                    下の二つ名の行が同じ段の中で食い違うので、日本語ページでは
                    ルビ1行ぶんの高さを常に確保して下端を揃える。
                    名前は11pxだと一覧の文字の大半が14px未満になっていたので14pxにする */}
                <span className={`flex w-full flex-col items-center justify-end text-sm font-bold text-slate-800 leading-tight group-hover:text-brand-700 transition-colors ${locale === 'en' ? '' : 'min-h-[30px]'}`}>
                  {/* 英語名は空白で2行に折る。1行に詰めると 390px で「Gao Changg…」「Ukyo Tachib…」に切れた。
                      日本語のカタカナ名は語の途中で折れると読みにくいので、1行のまま省略する */}
                  <span className={`w-full text-center ${locale === 'en' ? 'line-clamp-2 break-words' : 'truncate'}`}>
                    {locale !== 'en' && hero.reading ? (
                      // 「元流の子（メイジ）」の読みは「元流の子」の部分だけのもの
                      <ruby>
                        {nameBase}
                        <rp>（</rp>
                        <rt className="text-[8px] font-bold text-slate-500">{hero.reading}</rt>
                        <rp>）</rp>
                      </ruby>
                    ) : nameBase}
                  </span>
                  {nameQualifier && (
                    <span className="w-full truncate text-center text-sm">{nameQualifier}</span>
                  )}
                </span>
                {/* 二つ名はヒーロー詳細の見出しにも出ている。スマホの狭いカード（約100px）では
                    名前とタイプを読める大きさにするほうを優先し、sm 以上でだけ出す（検索で当たったときは別） */}
                {locale !== 'en' && hero.title && hero.title !== 'Honor of Kings Hero' && (
                  <span className={`${titleMatches(hero) ? 'block' : 'hidden sm:block'} text-sm font-medium text-slate-500 text-center w-full truncate leading-tight`}>
                    {hero.title}
                  </span>
                )}
                {/* 戦い方タイプ。「メイジ」だけでは砲台型かポーク型か
                    区別がつかないため、カードの時点で見分けられるようにする */}
                {subRole && (
                  // 狭いカードでは「重砲型マークスマン」等が切れるため、全文は title で読める。
                  // 余白を px-1 に詰め字間も詰めて、390px なら12pxで8字（「突撃型ファイター」）まで収まる。
                  // 9〜10字のタイプは切れる（日本語で116体中、390pxで43体・360pxで75体）
                  <span
                    title={subRoleLabel(subRole, locale)}
                    className="mt-auto max-w-full line-clamp-2 rounded-md bg-slate-100 px-1.5 py-0.5 text-center text-sm font-bold leading-tight tracking-tight text-slate-600"
                  >
                    <SubRoleText label={subRoleLabel(subRole, locale)} ja={locale === 'ja'} />
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
            <p className="text-sm font-bold text-slate-500 mt-1">{locale === 'en' ? 'No heroes match your search criteria.' : '検索条件に一致するヒーローがいません。'}</p>
          </div>
        )}
      </div>

      {/* ロールごとの固定ページへの導線。6つとも初期HTMLに載せる。
          絞り込み欄の近くに並べると、スマホで最初のヒーローの顔が画面の下へ押し出されるので、格子の下に置く。
          390px の3列では「マークスマン」が切れるので、スマホは2列 */}
      <nav aria-label={locale === 'ja' ? 'ロール別のヒーロー一覧' : 'Heroes by role'} className="px-4 mt-10">
        <h2 className="text-sm font-black text-slate-800">{locale === 'ja' ? 'ロール別のヒーロー一覧' : 'Heroes by role'}</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {locale === 'ja' ? 'ロールごとに、Tier・レーン・難易度の内訳をまとめています。' : 'One page per role, with its tier, lane and difficulty breakdown.'}
        </p>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {roles.filter((role) => roleSlugOf(role.value)).map((role) => (
            <li key={role.value}>
              <Link
                href={`/heroes/role/${roleSlugOf(role.value)}`}
                className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 text-sm font-bold text-slate-700 transition-colors hover:border-brand-700 hover:text-brand-700"
              >
                {role.icon}
                <span className="truncate">{role.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4">
        <ListNotes page="heroes" locale={locale} />
      </div>
    </div>
  );
}

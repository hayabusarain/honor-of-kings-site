'use client';

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
 * ドロワーの背景とドラッグハンドルのクリックはマウス用の補助。
 * キーボードから閉じる経路は ESC（closeDrawer を呼ぶ keydown）と×ボタンで、
 * ルールはそれを見られない。
 * 新しく onClick を素の div に付けるときは、この理由に当てはまるか確認すること。
 * 当てはまらないなら button にするか、キーボードの受け口を別に作る。
 */

import Image from 'next/image';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { Search, LayoutGrid, List, X, Coins, TrendingUp, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { ListNotes } from '@/components/ListNotes';
import { useFocusTrap } from '@/components/common/useFocusTrap';
import { Dropdown } from '@/components/common/Dropdown';

type SortOrder = 'default' | 'price-asc' | 'price-desc';

/**
 * 共有の Dropdown は一覧を下へ最大 60vh で開くが、スマホの TabBar を避けない。
 * 効果の一覧（13項目）は390px幅で下端が TabBar の裏に入り、最後の1〜2項目は一覧を最後まで
 * スクロールしても隠れたままだった。そこを押すと TabBar のリンクに当たって別のページへ移る
 * （2026-09-25 実測）。開いた直後に一覧の下端を測り、TabBar の上に収まるまで画面を送る。
 * 送るのは、ボタンが上の固定帯（topReserved の位置）に潜らない所まで。
 * Dropdown 側が TabBar を避けるようになったら外す（装備シミュレータにも同じものがある）
 */
function keepListAboveTabBar(root: HTMLElement, topReserved: number) {
  if (!window.matchMedia('(max-width: 767px)').matches) return; // md 以上は TabBar が無い
  requestAnimationFrame(() => {
    const list = root.querySelector('[role="listbox"]');
    const button = list?.parentElement?.querySelector('button[aria-haspopup]');
    if (!list || !button) return;
    // 画面の下端に固定されている帯の上端。TabBar は iPhone のホームバーのぶん高くなるので決め打ちしない
    let barTop = window.innerHeight;
    for (let el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight - 2); el; el = el.parentElement) {
      if (getComputedStyle(el).position === 'fixed') { barTop = el.getBoundingClientRect().top; break; }
    }
    const by = Math.min(list.getBoundingClientRect().bottom + 8 - barTop, button.getBoundingClientRect().top - topReserved);
    if (by > 0) window.scrollBy(0, by);
  });
}

// 装備データは page.tsx（サーバー部品）が読んで props で渡す。
// ここで '@/data/hok_items.json' を import すると 105KB がクライアントの
// 共有チャンクに入り、この装備ページを見ていない訪問者にも配られる。
// 実測では 2026-09-05 時点でヒーロー詳細232ページ・トップ・初心者向け・
// アルカナ・パッチ・スペルの6ページが、使いもしないこの105KBを積んでいた。
//
// 中身は絞れない。検索はパッシブと発動効果まで見るし、下の「全アイテムの効果一覧」は
// 全文を初期HTMLに出している。だから絞るのではなく、置き場所をサーバーへ移す。
export interface Item {
  id: number;
  name: string;
  name_en?: string;
  type: number;
  price: number;
  totalPrice: number;
  stats: string;
  stats_en?: string;
  passive?: string | null;
  passive_en?: string | null;
  active?: string | null;
  active_en?: string | null;
  icon: string;
}

export function ItemsClient({ items }: { items: Item[] }) {
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const modalRef = useRef<HTMLDivElement>(null);
  // このページが自分の都合で積んだ履歴エントリの数。
  // 真偽値ではなく数にするのは、検索モーダルで連続に切り替えたときに
  // back を何回押せば /items に戻るかが合わなくなるため
  const ownedRef = useRef(0);

  // 一覧からアイテムを開く。router.push ではなく生の pushState を使う。
  // router.push だと一覧が先頭までスクロールしてしまう
  const openFromList = (item: Item) => {
    window.history.pushState(null, '', `?item=${item.id}`);
    ownedRef.current += 1;
    setSelectedItem(item);
  };

  // 閉じる導線は4つ（ESC・背景クリック・ハンドル・×ボタン）あるので1本に集約する。
  // 自分で積んだエントリがあるなら back で戻し、あとは popstate に任せる。
  // 無いなら（?item= 付きで直接着地した場合）クエリの item だけを消す。
  // pathname だけに置き換えると、外部リンクの utm_* を巻き添えで消してしまう
  const closeDrawer = () => {
    if (ownedRef.current > 0) {
      window.history.back();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete('item');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    setSelectedItem(null);
  };

  // ?item=1137 付きで来たら、そのアイテムの詳細を開いた状態で表示する。
  // トップの「注目アイテム」やグローバル検索から特定のアイテムへ直接飛ばすための入口。
  // useSearchParams ではなく location を読むのは、静的生成を Suspense 境界なしで維持するため
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('item');
    if (!requested) return;
    const target = items.find((it) => String(it.id) === requested);
    // サーバー側では location を読めないため、初期stateではなくマウント後に開く
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (target) setSelectedItem(target);
  }, []);

  // 戻るボタンの受け口。URL の item を読み直し、あれば開き、無ければ閉じる。
  // 存在しないIDのときは何も開かず、クエリもそのまま残す。
  // replaceState で消すと、共有された壊れリンクの原因が読者から見えなくなる
  useEffect(() => {
    const onPopState = () => {
      const requested = new URLSearchParams(window.location.search).get('item');
      const target = requested
        ? items.find((it) => String(it.id) === requested)
        : null;
      ownedRef.current = Math.max(0, ownedRef.current - 1);
      setSelectedItem(target ?? null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // ESC でドロワーを閉じる。検索モーダルは ESC で閉じられるのに
  // アイテム詳細だけ閉じられない不統一があった。
  // 開いているときだけ登録する。常時登録だと、ドロワーの上に検索モーダルを
  // 重ねた状態のESC 1回で両方が同時に閉じてしまう（TabBarと同じ方式）
  useEffect(() => {
    if (!selectedItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedItem]);

  // すでに /items にいる状態で検索モーダルからアイテムを選んだ場合の受け口。
  // App Router は同一パスへのクエリ変更でページを再マウントしないため、
  // 上の「マウント時に ?item= を読む」だけでは何も起きない。
  // 検索モーダルが遷移と同時にこのイベントを投げてくる
  useEffect(() => {
    const onOpenItem = (e: Event) => {
      const requested = String((e as CustomEvent).detail ?? '');
      const target = items.find((it) => String(it.id) === requested);
      if (!target) return;
      // ここで history を触らないこと。GlobalSearchModal の handleSelect が
      // すでに router.push(result.url) を呼んでいて、Next.js 側でエントリが
      // 1つ増えている。カウンタだけ合わせる
      ownedRef.current += 1;
      setSelectedItem(target);
    };
    window.addEventListener('hok:open-item', onOpenItem);
    return () => window.removeEventListener('hok:open-item', onOpenItem);
  }, []);

  // フォーカス管理（開いたらドロワー本体へ、閉じたら開く直前の要素へ戻す）と Tab の循環。
  // 検索モーダルと同じ hook を使う。開いたまま別アイテムへ切り替わったとき
  // （検索モーダル経由）に復帰先を上書きしないよう、開閉の真偽値だけを渡す
  const isDrawerOpen = selectedItem !== null;
  const { onKeyDown: handleTrapKeyDown } = useFocusTrap(modalRef, isDrawerOpen);

  // scope は判定にどこまで見るか。既定の stats はステータス欄だけを見る。
  // 装備名まで見ると Blade の ad、Boots の説明にある upgraded の ad のように、
  // 効果と関係のない一致で拾ってしまう（実測で物理攻撃が35種→56種に膨らんでいた）。
  // effect はパッシブと発動効果も見る。貫通とライフスティールはステータス欄に出ないため。
  // 判定の基準は装備シミュレータ（ItemSimulatorClient）と同じにしてある。
  // 英語のラベルはチップの幅に合わせて AD・CD と略していたが、プルダウンにして幅の制約が
  // 無くなったので、装備のステータス欄（stats_en）と同じ語に戻した
  const STAT_FILTERS = useMemo(() => [
    { id: 'all', label: locale === 'ja' ? '全アイテム' : 'All items', keywords: [], scope: 'stats' },
    { id: 'tier_high', label: locale === 'ja' ? '上位アイテム' : 'Advanced', keywords: [], scope: 'stats' },
    { id: 'tier_low', label: locale === 'ja' ? '下位アイテム' : 'Basic', keywords: [], scope: 'stats' },
    { id: 'ad', label: locale === 'ja' ? '物理攻撃' : 'Physical Attack', keywords: ['物理攻撃', 'physical attack'], scope: 'stats' },
    { id: 'ap', label: locale === 'ja' ? '魔法攻撃' : 'Magical Attack', keywords: ['魔法攻撃', 'magical attack'], scope: 'stats' },
    { id: 'def', label: locale === 'ja' ? '防御' : 'Defense', keywords: ['物理防御', '魔法防御', 'defense'], scope: 'stats' },
    { id: 'hp', label: locale === 'ja' ? 'HP' : 'Max Health', keywords: ['最大hp', 'max health'], scope: 'stats' },
    { id: 'crit', label: locale === 'ja' ? 'クリティカル' : 'Critical Rate', keywords: ['クリティカル', 'critical'], scope: 'stats' },
    { id: 'pierce', label: locale === 'ja' ? '貫通' : 'Pierce', keywords: ['貫通', 'penetration', 'pierce'], scope: 'effect' },
    { id: 'lifesteal', label: locale === 'ja' ? 'ライフスティール' : 'Lifesteal', keywords: ['ライフスティール', 'lifesteal'], scope: 'effect' },
    { id: 'cd', label: locale === 'ja' ? 'クールダウン短縮' : 'Cooldown Reduction', keywords: ['クールダウン短縮', 'cooldown reduction'], scope: 'stats' },
    { id: 'speed', label: locale === 'ja' ? '移動速度' : 'Movement Speed', keywords: ['移動速度', 'movement speed'], scope: 'stats' },
    { id: 'atk_speed', label: locale === 'ja' ? '攻撃速度' : 'Attack Speed', keywords: ['攻撃速度', 'attack speed'], scope: 'stats' },
  ], [locale]);

  const processedItems = useMemo(() => {
    const result = items.filter(item => {
      const name = locale === 'en' && item.name_en ? item.name_en : item.name;
      const stats = locale === 'en' && item.stats_en ? item.stats_en : item.stats;
      const passive = locale === 'en' && item.passive_en ? item.passive_en : item.passive;
      const active = locale === 'en' && item.active_en ? item.active_en : item.active;

      // 検索ボックスは今までどおり全部を見る。名前でも効果でも引けたほうがよい
      const searchStr = [name, item.name, stats, passive, active].filter(Boolean).join(' ').toLowerCase();
      // チップの判定はここを見る。日英どちらのロケールでも同じ結果になるよう両方入れる
      const statsStr = [item.stats, item.stats_en].filter(Boolean).join(' ').toLowerCase();
      // 貫通と吸収はステータス欄に出ずパッシブに書かれるため、これだけ効果文も見る
      const effectStr = [statsStr, item.passive, item.passive_en, item.active, item.active_en]
        .filter(Boolean).join(' ').toLowerCase();
      
      // Text search
      const query = searchQuery.toLowerCase();
      if (query && !searchStr.includes(query)) return false;

      // Filter chips
      if (activeFilter === 'tier_high') {
        if (item.totalPrice < 1700) return false;
      } else if (activeFilter === 'tier_low') {
        if (item.totalPrice >= 1700) return false;
      } else if (activeFilter !== 'all') {
        const filter = STAT_FILTERS.find(f => f.id === activeFilter);
        if (filter && filter.keywords.length > 0) {
          const target = filter.scope === 'effect' ? effectStr : statsStr;
          const match = filter.keywords.some(kw => target.includes(kw.toLowerCase()));
          if (!match) return false;
        }
      }

      return true;
    });
    
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.totalPrice - a.totalPrice);
    }
    
    
    return result;
  }, [searchQuery, items, sortOrder, activeFilter, locale, STAT_FILTERS]);

  // Strip HTML tags for clean display
  const stripHtml = (html: string) => {
    if (!html) return '';
    const str = typeof html === 'string' ? html : String(html);
    return str.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
  };

  return (
    <div className="w-full bg-background font-sans text-slate-800">
      
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? 'アイテム一覧' : 'Items', path: '/items' }]} />

      {/* Header Banner */}
      {/* スマホでは固定しない。上に高さ56pxの AppBar（sticky top-0 z-40）があり、
          top-0 で貼り付くと題名がその裏に潜る。題名とリンクだけの帯を AppBar の下に
          固定し直しても、画面を狭くするだけなので、固定はPC（AppBar が無い幅）に限る */}
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 md:sticky md:top-0 z-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {locale === 'ja' ? 'アイテム一覧' : 'Items List'}
          </h1>
          {/* 一覧は「何ができるか」を並べているだけ。実際に何が組まれているかは採用率で見せる */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              href="/items/usage"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              <TrendingUp size={14} />
              {locale === 'ja' ? '採用率ランキング' : 'Pick rate rankings'}
            </Link>
            <Link
              href="/items/simulator"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              <SlidersHorizontal size={14} />
              {locale === 'ja' ? '装備シミュレータ' : 'Build simulator'}
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* 絞り込み。効果のチップ13個を横スクロールで並べていたが、スクロールバーが無く
            最初の画面に見えるのは3つだけで、「物理攻撃」「貫通」で絞れること自体が読めなかった。
            チップ・検索・並び替え・表示切り替えで枠が約230pxを占めていたのを、
            検索と表示切り替えの1段、効果と並び替えのプルダウンの1段、の2段にまとめた（2026-09-25）。
            並び替えの幅を固定するのは、390px幅で効果の側に「クールダウン短縮」が省略されずに入る幅を残すため。
            PC幅（1280px以上）では4つを1段に並べる */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:p-3 xl:grid-cols-[minmax(0,1fr)_13rem_11rem_auto]">
          <div className="relative min-w-0 xl:order-first">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="search"
              aria-label={locale === 'ja' ? 'アイテムを検索' : 'Search items'}
              placeholder={locale === 'ja' ? '名前や効果で検索' : 'Search items'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full pl-9 pr-3 bg-slate-100 border border-transparent rounded-xl focus:border-slate-300 focus:bg-white outline-none text-slate-800 font-bold placeholder:text-slate-500 text-sm transition-all"
            />
          </div>

          {/* 表示の切り替え。文字付きのボタン2つで1段を使っていたので、アイコンだけにして検索欄の横へ寄せた */}
          <div role="group" aria-label={locale === 'ja' ? '表示の形' : 'Layout'} className="flex gap-1 xl:order-last">
            {([
              ['compact', LayoutGrid, locale === 'ja' ? 'シンプル表示' : 'Compact view'],
              ['detailed', List, locale === 'ja' ? '詳細表示' : 'Detailed view'],
            ] as const).map(([mode, Icon, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                aria-pressed={viewMode === mode}
                aria-label={label}
                title={label}
                className={`flex h-11 w-10 items-center justify-center rounded-xl border transition-colors sm:w-11 ${
                  viewMode === mode
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} aria-hidden="true" />
              </button>
            ))}
          </div>

          {/* 上の固定帯は AppBar（56px）だけなので、ボタンは 64px まで送ってよい */}
          <div
            className="col-span-2 grid grid-cols-[minmax(0,1fr)_8.75rem] gap-2 sm:grid-cols-[14rem_12rem] xl:grid-cols-[13rem_11rem]"
            onClickCapture={(e) => keepListAboveTabBar(e.currentTarget, 64)}
            onKeyDownCapture={(e) => keepListAboveTabBar(e.currentTarget, 64)}
          >
            <Dropdown
              label={locale === 'ja' ? '効果で絞り込む' : 'Filter by effect'}
              options={STAT_FILTERS.map((f) => ({ value: f.id, label: f.label }))}
              value={activeFilter}
              onChange={setActiveFilter}
              defaultValue="all"
            />
            <Dropdown<SortOrder>
              label={locale === 'ja' ? '並び替え' : 'Sort by'}
              options={[
                { value: 'default', label: locale === 'ja' ? 'デフォルト順' : 'Default' },
                { value: 'price-asc', label: locale === 'ja' ? '価格が安い順' : 'Lowest price' },
                { value: 'price-desc', label: locale === 'ja' ? '価格が高い順' : 'Highest price' },
              ]}
              value={sortOrder}
              onChange={setSortOrder}
              defaultValue="default"
            />
          </div>
        </div>

        {/* Items Grid */}
        {/* シンプル表示は列数を幅から決める。スマホで4列にすると1マス約70pxで、
            10pxの名前でも115件中77件が「シャド…」のように切れ、シャドーアックスと
            シャドーブレードの区別がつかなかった（2026-09-25 実測）。
            1マスの幅をスマホで92px以上、それより広い画面で104px以上に保ち、名前を省略せずに出す。
            390px幅で3列、PC幅（1280px）で8列になる（従来は4列と10列） */}
        <div className={`grid ${viewMode === 'compact' ? 'grid-cols-[repeat(auto-fill,minmax(5.75rem,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] sm:gap-3' : 'gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {processedItems.map(item => {
            const name = locale === 'en' && item.name_en ? item.name_en : item.name;
            const stats = locale === 'en' && item.stats_en ? item.stats_en : item.stats;
            const passive = locale === 'en' && item.passive_en ? item.passive_en : item.passive;
            const active = locale === 'en' && item.active_en ? item.active_en : item.active;

            return viewMode === 'compact' ? (
              <button
                key={item.id}
                onClick={() => openFromList(item)}
                className="group bg-white border border-slate-200 rounded-2xl p-1.5 flex flex-col items-center justify-start text-center active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0 mb-1.5 p-1 flex items-center justify-center">
                  <Image 
                    src={item.icon}
                    alt={name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => { 
                      (e.currentTarget as HTMLImageElement).srcset = '';
                      (e.currentTarget as HTMLImageElement).src = '/images/heroes/default.webp'; 
                    }}
                  />
                </div>
                {/* 上端を揃えるため、ボタンは justify-start。2行の名前と1行の名前が同じ段に並んでも、アイコンの高さがずれない。
                    日本語は14pxで2行に全115件が収まる。line-break:strict は「ー」を行頭に送らないため（スパークダガ｜ー）。
                    英語は「Crimson Shadow - Redemption」のように末尾の語で見分ける名前があり、2行で切ると
                    その語が消える。13pxで3行まで出すと390px幅で全件が省略なしで入る。
                    360px幅は13pxだと Bloodweepe｜r のように5件が単語の途中で折れるので12pxにする。
                    text-balance は2行の長さを揃える。付けないと「ドゥームズデ｜イ」のように2行目が1字だけになる名前が
                    390px幅で13件あり、付けると0件で、多くが「シャドー｜アックス」と語の切れ目で折れる */}
                <h3 className={`font-bold text-slate-900 leading-tight w-full break-words text-balance [line-break:strict] ${
                  locale === 'ja' ? 'text-sm line-clamp-2' : 'text-xs min-[375px]:text-[13px] line-clamp-3'
                }`}>
                  {name}
                </h3>
              </button>
            ) : (
              <button
                key={item.id}
                onClick={() => openFromList(item)}
                className="group bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-stretch text-left active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0 p-1 flex items-center justify-center">
                    <Image 
                      src={item.icon}
                      alt={name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => { 
                        (e.currentTarget as HTMLImageElement).srcset = '';
                        (e.currentTarget as HTMLImageElement).src = '/images/heroes/default.webp'; 
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-base truncate">
                      {name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 flex items-center gap-1">
                        <Coins size={10} />
                        {item.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                  {stripHtml(stats)}
                  {passive && `\n\n${stripHtml(passive)}`}
                  {active && `\n\n${stripHtml(active)}`}
                </div>
              </button>
            );
          })}
        </div>

        {/* 効果の全文を初期HTMLに出す。従来はモーダルの中だけにあり、13,000字を超える
            アイテム解説が、検索エンジンにもJSを切った環境にも一切見えていなかった。
            アイコン主体の「シンプル」表示のときだけ出す（「詳細」表示とは内容が重なるため）。
            既定は畳む。スマホ幅ではページが29画面ぶんあり、その8割がこの一覧で、
            下のFAQと注記に誰も辿り着けなかった（2026-09-25 実測）。
            畳んでも中身は初期HTMLに残るので、検索エンジンとJSを切った環境には今までどおり見える。
            summary の中に置けるのは見出し1つと文中要素だけなので、件数は p ではなく span にしてある */}
        {viewMode === 'compact' && processedItems.length > 0 && (
          <details className="group bg-white border border-slate-200 rounded-2xl shadow-sm">
            <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-3 p-5 [&::-webkit-details-marker]:hidden">
              <h2 className="text-base font-black text-slate-900 mb-1">
                {locale === 'ja' ? '全アイテムの効果一覧' : 'All Item Effects'}
              </h2>
              <ChevronDown
                size={20}
                aria-hidden="true"
                className="row-span-2 text-slate-500 transition-transform group-open:rotate-180"
              />
              <span className="text-xs font-semibold text-slate-500">
                {locale === 'ja'
                  ? `表示中の${processedItems.length}件。上の絞り込みと連動します。`
                  : `${processedItems.length} items shown, matching the filters above.`}
              </span>
            </summary>
            <dl className="divide-y divide-slate-100 px-5 pb-5">
              {processedItems.map(item => {
                const name = locale === 'en' && item.name_en ? item.name_en : item.name;
                const stats = locale === 'en' && item.stats_en ? item.stats_en : item.stats;
                const passive = locale === 'en' && item.passive_en ? item.passive_en : item.passive;
                const active = locale === 'en' && item.active_en ? item.active_en : item.active;
                return (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <dt className="flex items-baseline justify-between gap-3 mb-1">
                      <span className="font-black text-slate-900 text-sm">{name}</span>
                      {/* 価格の文字は amber-700。amber-600 は白地で 3.20 と AA に届かない（700 は 5.03） */}
                      <span className="text-[11px] font-bold text-amber-700 shrink-0">{item.totalPrice} G</span>
                    </dt>
                    <dd className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                      {stripHtml(stats)}
                      {passive && `\n${stripHtml(passive)}`}
                      {active && `\n${stripHtml(active)}`}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </details>
        )}

        <ListNotes page="items" locale={locale} />
      </div>

      {/* Modal Drawer */}
      {selectedItem && (() => {
        const modalName = locale === 'en' && selectedItem.name_en ? selectedItem.name_en : selectedItem.name;
        const modalStats = locale === 'en' && selectedItem.stats_en ? selectedItem.stats_en : selectedItem.stats;
        const modalPassive = locale === 'en' && selectedItem.passive_en ? selectedItem.passive_en : selectedItem.passive;
        const modalActive = locale === 'en' && selectedItem.active_en ? selectedItem.active_en : selectedItem.active;

        // 背景クリックで閉じる。同じサイトの検索モーダルは閉じられるのに
        // こちらは X ボタンとハンドルだけだった。
        // 高さは上限だけ決め、中身に合わせる。85vh 固定だとシャドーアックスでも
        // シートが717pxあり、中身の約500pxより下が空白になっていた（2026-09-25 実測）。
        // 長い装備は本文（flex-1 overflow-y-auto）が縮んで中でスクロールする。
        // vh はブラウザのツールバーが隠れたときの高さを基準にするので、見えている高さに合わせて dvh にする
        return (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end justify-center z-[80] p-0 pb-0 transition-opacity"
            onClick={closeDrawer}
          >
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label={modalName}
              tabIndex={-1}
              onKeyDown={handleTrapKeyDown}
              className="bg-white w-full max-w-md max-h-[85dvh] rounded-t-3xl shadow-2xl flex flex-col relative outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex justify-center py-4 cursor-pointer" onClick={closeDrawer}>
                <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between px-6 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 shrink-0 p-1.5 flex items-center justify-center">
                    <Image 
                      src={selectedItem.icon}
                      alt={modalName}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => { 
                        (e.currentTarget as HTMLImageElement).srcset = '';
                        (e.currentTarget as HTMLImageElement).src = '/images/heroes/default.webp'; 
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1 pr-2">
                    <h2 className="text-xl font-black text-slate-900 leading-tight">
                      {modalName}
                    </h2>
                    <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1">
                      <Coins size={12} className="text-amber-500" />
                      {locale === 'ja' ? '合成価格:' : 'Total Cost:'} <span className="text-amber-700 font-black">{selectedItem.totalPrice} G</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDrawer}
                  aria-label={locale === 'ja' ? '閉じる' : 'Close'}
                  className="p-2 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-slate-50">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">{locale === 'ja' ? 'ステータス / 効果' : 'Stats & Effects'}</h4>
                  <div className="text-sm text-slate-700 leading-loose font-medium whitespace-pre-wrap">
                    {stripHtml(modalStats)}
                  </div>
                  {modalPassive && (
                    <div className="text-sm text-brand-700 bg-brand-50 border border-brand-100 p-3 rounded-xl leading-loose font-medium whitespace-pre-wrap">
                      {stripHtml(modalPassive)}
                    </div>
                  )}
                  {modalActive && (
                    <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl leading-loose font-medium whitespace-pre-wrap">
                      {stripHtml(modalActive)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

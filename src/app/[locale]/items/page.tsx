'use client';

import Image from 'next/image';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { Search, LayoutGrid, List, X, Coins, ArrowUpDown, TrendingUp, SlidersHorizontal } from 'lucide-react';
import { Link } from '@/i18n/routing';
import itemsData from '@/data/hok_items.json';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { ListNotes } from '@/components/ListNotes';
import { useFocusTrap } from '@/components/common/useFocusTrap';

interface Item {
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

export default function ItemsPage() {
  const locale = useLocale();
  const [items] = useState<Item[]>(itemsData as any as Item[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');
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
    const target = (itemsData as any as Item[]).find((it) => String(it.id) === requested);
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
        ? (itemsData as any as Item[]).find((it) => String(it.id) === requested)
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
      const target = (itemsData as any as Item[]).find((it) => String(it.id) === requested);
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
  // 判定の基準は装備シミュレータ（ItemSimulatorClient）と同じにしてある
  const STAT_FILTERS = useMemo(() => [
    { id: 'all', label: locale === 'ja' ? 'すべて' : 'All', keywords: [], scope: 'stats' },
    { id: 'tier_high', label: locale === 'ja' ? '上位アイテム' : 'Advanced', keywords: [], scope: 'stats' },
    { id: 'tier_low', label: locale === 'ja' ? '下位アイテム' : 'Basic', keywords: [], scope: 'stats' },
    { id: 'ad', label: locale === 'ja' ? '物理攻撃' : 'AD', keywords: ['物理攻撃', 'physical attack'], scope: 'stats' },
    { id: 'ap', label: locale === 'ja' ? '魔法攻撃' : 'AP', keywords: ['魔法攻撃', 'magical attack'], scope: 'stats' },
    { id: 'def', label: locale === 'ja' ? '防御' : 'Defense', keywords: ['物理防御', '魔法防御', 'defense'], scope: 'stats' },
    { id: 'hp', label: locale === 'ja' ? 'HP' : 'HP', keywords: ['最大hp', 'max health'], scope: 'stats' },
    { id: 'crit', label: locale === 'ja' ? 'クリティカル' : 'Crit', keywords: ['クリティカル', 'critical'], scope: 'stats' },
    { id: 'pierce', label: locale === 'ja' ? '貫通' : 'Pierce', keywords: ['貫通', 'penetration', 'pierce'], scope: 'effect' },
    { id: 'lifesteal', label: locale === 'ja' ? 'ライフスティール' : 'Lifesteal', keywords: ['ライフスティール', 'lifesteal'], scope: 'effect' },
    { id: 'cd', label: locale === 'ja' ? 'クールダウン短縮' : 'CD', keywords: ['クールダウン短縮', 'cooldown reduction'], scope: 'stats' },
    { id: 'speed', label: locale === 'ja' ? '移動速度' : 'Speed', keywords: ['移動速度', 'movement speed'], scope: 'stats' },
    { id: 'atk_speed', label: locale === 'ja' ? '攻撃速度' : 'Atk Spd', keywords: ['攻撃速度', 'attack speed'], scope: 'stats' },
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
    <div className="w-full bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
      
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? 'アイテム一覧' : 'Items', path: '/items' }]} />

      {/* Header Banner */}
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 sticky top-0 z-20">
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
        {/* Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          
          <div className="flex overflow-x-auto snap-x hide-scrollbar gap-2 pb-1 scroll-smooth">
            {STAT_FILTERS.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  snap-start whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold select-none transition-all border shrink-0
                  ${activeFilter === filter.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 active:bg-slate-50'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder={locale === 'ja' ? 'アイテム名で検索...' : 'Search items...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-xl focus:border-slate-300 focus:bg-white outline-none text-slate-800 font-bold placeholder-slate-400 text-sm transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="flex-1 relative">
              <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select
                value={sortOrder}
                aria-label={locale === 'ja' ? '並び替え' : 'Sort by'}
                onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-300 outline-none text-slate-600 font-bold text-xs transition-all appearance-none cursor-pointer"
              >
                <option value="default">{locale === 'ja' ? 'デフォルト順' : 'Default'}</option>
                <option value="price-asc">{locale === 'ja' ? '価格が安い順' : 'Price: Low to High'}</option>
                <option value="price-desc">{locale === 'ja' ? '価格が高い順' : 'Price: High to Low'}</option>
              </select>
            </div>
            <div className="flex gap-2 flex-1">
            <button
              onClick={() => setViewMode('compact')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                viewMode === 'compact'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid size={14} />
              {locale === 'ja' ? 'シンプル' : 'Compact'}
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                viewMode === 'detailed'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <List size={14} />
              {locale === 'ja' ? '詳細' : 'Detailed'}
            </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className={`grid gap-3 ${viewMode === 'compact' ? 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {processedItems.map(item => {
            const name = locale === 'en' && item.name_en ? item.name_en : item.name;
            const stats = locale === 'en' && item.stats_en ? item.stats_en : item.stats;
            const passive = locale === 'en' && item.passive_en ? item.passive_en : item.passive;
            const active = locale === 'en' && item.active_en ? item.active_en : item.active;

            return viewMode === 'compact' ? (
              <button
                key={item.id}
                onClick={() => openFromList(item)}
                className="group bg-white border border-slate-200 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
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
                <h3 className="font-bold text-slate-900 text-[10px] leading-tight w-full truncate px-0.5">
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
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 flex items-center gap-1">
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
            アイコン主体の「シンプル」表示のときだけ出す（「詳細」表示とは内容が重なるため） */}
        {viewMode === 'compact' && processedItems.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-black text-slate-900 mb-1">
              {locale === 'ja' ? '全アイテムの効果一覧' : 'All Item Effects'}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mb-4">
              {locale === 'ja'
                ? `表示中の${processedItems.length}件。上の絞り込みと連動します。`
                : `${processedItems.length} items shown, matching the filters above.`}
            </p>
            <dl className="divide-y divide-slate-100">
              {processedItems.map(item => {
                const name = locale === 'en' && item.name_en ? item.name_en : item.name;
                const stats = locale === 'en' && item.stats_en ? item.stats_en : item.stats;
                const passive = locale === 'en' && item.passive_en ? item.passive_en : item.passive;
                const active = locale === 'en' && item.active_en ? item.active_en : item.active;
                return (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <dt className="flex items-baseline justify-between gap-3 mb-1">
                      <span className="font-black text-slate-900 text-sm">{name}</span>
                      <span className="text-[11px] font-bold text-amber-600 shrink-0">{item.totalPrice} G</span>
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
          </section>
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
        // こちらは X ボタンとハンドルだけだった
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
              className="bg-white w-full max-w-md h-[85vh] rounded-t-3xl shadow-2xl flex flex-col relative outline-none"
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
                      {locale === 'ja' ? '合成価格:' : 'Total Cost:'} <span className="text-amber-600 font-black">{selectedItem.totalPrice} G</span>
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
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
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

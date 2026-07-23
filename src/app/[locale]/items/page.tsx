'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Search, LayoutGrid, List, X, Coins, ArrowUpDown } from 'lucide-react';
import itemsData from '@/data/hok_items.json';

interface Item {
  id: number;
  name: string;
  type: number;
  price: number;
  totalPrice: number;
  stats: string;
  passive?: string | null;
  active?: string | null;
  icon: string;
}

export default function ItemsPage() {
  const locale = useLocale();
  const [items] = useState<Item[]>(itemsData as Item[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const STAT_FILTERS = [
    { id: 'all', label: locale === 'ja' ? 'すべて' : 'All', keywords: [] },
    { id: 'tier_high', label: locale === 'ja' ? '上位アイテム' : 'Advanced', keywords: [] },
    { id: 'tier_low', label: locale === 'ja' ? '下位アイテム' : 'Basic', keywords: [] },
    { id: 'ad', label: locale === 'ja' ? '物理攻撃' : 'AD', keywords: ['物理攻撃', 'ad'] },
    { id: 'ap', label: locale === 'ja' ? '魔力' : 'AP', keywords: ['魔法攻撃', '魔力', 'ap'] },
    { id: 'def', label: locale === 'ja' ? '防御' : 'Defense', keywords: ['物理防御', '魔法防御', '防御'] },
    { id: 'hp', label: locale === 'ja' ? 'HP' : 'HP', keywords: ['最大hp', 'hp'] },
    { id: 'crit', label: locale === 'ja' ? 'クリティカル' : 'Crit', keywords: ['クリティカル'] },
    { id: 'pierce', label: locale === 'ja' ? '貫通' : 'Pierce', keywords: ['貫通'] },
    { id: 'lifesteal', label: locale === 'ja' ? '吸収' : 'Lifesteal', keywords: ['ライフスティール', '吸血', '吸収'] },
    { id: 'cd', label: locale === 'ja' ? 'クールダウン' : 'CD', keywords: ['クールダウン'] },
    { id: 'speed', label: locale === 'ja' ? '移動速度' : 'Speed', keywords: ['移動速度'] },
    { id: 'atk_speed', label: locale === 'ja' ? '攻撃速度' : 'Atk Spd', keywords: ['攻撃速度'] },
  ];

  const processedItems = useMemo(() => {
    let result = items.filter(item => {
      const searchStr = [item.name, item.stats, item.passive, item.active].filter(Boolean).join(' ').toLowerCase();
      
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
          const match = filter.keywords.some(kw => searchStr.includes(kw.toLowerCase()));
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
  }, [searchQuery, items, sortOrder, activeFilter, locale]);

  // Strip HTML tags for clean display
  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 sticky top-0 z-20">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          {locale === 'ja' ? 'アイテム一覧' : 'Items List'}
        </h1>
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
                onChange={(e) => setSortOrder(e.target.value as any)}
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
          {processedItems.map(item => (
            viewMode === 'compact' ? (
              <button
                key={item.name}
                onClick={() => setSelectedItem(item)}
                className="group bg-white border border-slate-200 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0 mb-1.5 p-1 flex items-center justify-center">
                  <img 
                    src={item.icon}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => { e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'; }}
                  />
                </div>
                <h3 className="font-bold text-slate-900 text-[10px] leading-tight w-full truncate px-0.5">
                  {item.name}
                </h3>
              </button>
            ) : (
              <button
                key={item.name}
                onClick={() => setSelectedItem(item)}
                className="group bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-stretch text-left active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0 p-1 flex items-center justify-center">
                    <img 
                      src={item.icon}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => { e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-base truncate">
                      {item.name}
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
                  {stripHtml(item.stats)}
                  {item.passive && `\n\n${stripHtml(item.passive)}`}
                  {item.active && `\n\n${stripHtml(item.active)}`}
                </div>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Modal Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end justify-center z-50 p-0 pb-0 transition-opacity">
          <div className="bg-white w-full max-w-md h-[85vh] rounded-t-3xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom duration-300">
            <div className="w-full flex justify-center py-4 cursor-pointer" onClick={() => setSelectedItem(null)}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between px-6 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 shrink-0 p-1.5 flex items-center justify-center">
                  <img 
                    src={selectedItem.icon}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => { e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'; }}
                  />
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedItem.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1">
                    <Coins size={12} className="text-amber-500" />
                    {locale === 'ja' ? '合成価格:' : 'Total Cost:'} <span className="text-amber-600 font-black">{selectedItem.totalPrice} G</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-2 text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">{locale === 'ja' ? 'ステータス / 効果' : 'Stats & Effects'}</h4>
                <div className="text-sm text-slate-700 leading-loose font-medium whitespace-pre-wrap">
                  {stripHtml(selectedItem.stats)}
                </div>
                {selectedItem.passive && (
                  <div className="text-sm text-indigo-700 bg-indigo-50 border border-indigo-100 p-3 rounded-xl leading-loose font-medium whitespace-pre-wrap">
                    {stripHtml(selectedItem.passive)}
                  </div>
                )}
                {selectedItem.active && (
                  <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl leading-loose font-medium whitespace-pre-wrap">
                    {stripHtml(selectedItem.active)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

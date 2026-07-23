'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Search, LayoutGrid, List, X, Shield, Sparkles } from 'lucide-react';
import arcanasData from '@/data/hok_arcanas.json';

interface Arcana {
  id: string;
  type: string;
  grade: string;
  name: string;
  stats: string;
  icon: string;
}

export default function ArcanasPage() {
  const locale = useLocale();
  const [arcanas] = useState<Arcana[]>(arcanasData as Arcana[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArcana, setSelectedArcana] = useState<Arcana | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'red' | 'blue' | 'green'>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');

  const STAT_FILTERS = [
    { id: 'all', label: locale === 'ja' ? '効果すべて' : 'All Stats', keywords: [] },
    { id: 'ad', label: locale === 'ja' ? '物理攻撃' : 'AD', keywords: ['物理攻撃', 'ad'] },
    { id: 'ap', label: locale === 'ja' ? '魔力' : 'AP', keywords: ['魔力', 'ap'] },
    { id: 'def', label: locale === 'ja' ? '防御' : 'Defense', keywords: ['物理防御', '魔法防御', '防御'] },
    { id: 'hp', label: locale === 'ja' ? 'HP' : 'HP', keywords: ['最大hp', 'hp'] },
    { id: 'crit', label: locale === 'ja' ? 'クリティカル' : 'Crit', keywords: ['クリティカル'] },
    { id: 'pierce', label: locale === 'ja' ? '貫通' : 'Pierce', keywords: ['貫通'] },
    { id: 'lifesteal', label: locale === 'ja' ? '吸収' : 'Lifesteal', keywords: ['吸収'] },
    { id: 'cd', label: locale === 'ja' ? 'クールダウン' : 'CD', keywords: ['クールダウン'] },
    { id: 'speed', label: locale === 'ja' ? '移動速度' : 'Speed', keywords: ['移動速度'] },
    { id: 'atk_speed', label: locale === 'ja' ? '攻撃速度' : 'Atk Spd', keywords: ['攻撃速度'] },
  ];

  const processedArcanas = useMemo(() => {
    let result = arcanas.filter(arcana => {
      if (activeTab !== 'all' && arcana.type !== activeTab) return false;

      const searchStr = [arcana.name, arcana.stats].filter(Boolean).join(' ').toLowerCase();

      // Text search
      const query = searchQuery.toLowerCase();
      if (query && !searchStr.includes(query)) return false;

      // Filter chips
      if (activeFilter !== 'all') {
        const filter = STAT_FILTERS.find(f => f.id === activeFilter);
        if (filter && filter.keywords.length > 0) {
          const match = filter.keywords.some(kw => searchStr.includes(kw.toLowerCase()));
          if (!match) return false;
        }
      }
      
      return true;
    });
    
    // Sort by grade (highest first) then by name
    result.sort((a, b) => parseInt(b.grade) - parseInt(a.grade) || a.name.localeCompare(b.name));
    
    return result;
  }, [searchQuery, activeTab, activeFilter, arcanas, locale]);

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'red': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'green': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default: return 'bg-slate-100 border-slate-200 text-slate-700';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'red': return locale === 'ja' ? '赤 (Red)' : 'Red';
      case 'blue': return locale === 'ja' ? '青 (Blue)' : 'Blue';
      case 'green': return locale === 'ja' ? '緑 (Green)' : 'Green';
      default: return type;
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 sticky top-0 z-20">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          {locale === 'ja' ? 'アルカナ一覧' : 'Arcanas List'}
        </h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          
          <div className="flex overflow-x-auto snap-x hide-scrollbar gap-2 pb-1 scroll-smooth">
            {[
              { id: 'all', label: locale === 'ja' ? '全カラー' : 'All Colors' },
              { id: 'red', label: locale === 'ja' ? '赤' : 'Red' },
              { id: 'blue', label: locale === 'ja' ? '青' : 'Blue' },
              { id: 'green', label: locale === 'ja' ? '緑' : 'Green' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  snap-start whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold select-none transition-all border shrink-0
                  ${activeTab === tab.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 active:bg-slate-50'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex overflow-x-auto snap-x hide-scrollbar gap-2 pb-1 scroll-smooth">
            {STAT_FILTERS.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  snap-start whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-bold select-none transition-all border shrink-0
                  ${activeFilter === filter.id
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-white text-slate-500 border-slate-200 active:bg-slate-50'
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
              placeholder={locale === 'ja' ? 'アルカナ名で検索...' : 'Search arcanas...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-xl focus:border-slate-300 focus:bg-white outline-none text-slate-800 font-bold placeholder-slate-400 text-sm transition-all"
            />
          </div>

          <div className="flex gap-2 w-full">
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

        {/* Arcanas Grid */}
        <div className={`grid gap-3 ${viewMode === 'compact' ? 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {processedArcanas.map(arcana => (
            viewMode === 'compact' ? (
              <button
                key={arcana.id}
                onClick={() => setSelectedArcana(arcana)}
                className="group bg-white border border-slate-200 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0 mb-1.5 p-1">
                  <Image 
                    src={arcana.icon}
                    alt={arcana.name}
                    fill
                    sizes="48px"
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-bold text-slate-900 text-[10px] leading-tight w-full truncate px-0.5">
                  {arcana.name}
                </h3>
                <span className="text-[8px] text-slate-400 font-bold mt-1">
                  Lv.{arcana.grade}
                </span>
              </button>
            ) : (
              <button
                key={arcana.id}
                onClick={() => setSelectedArcana(arcana)}
                className="group bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-stretch text-left active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0 p-1">
                    <Image 
                      src={arcana.icon}
                      alt={arcana.name}
                      fill
                      sizes="56px"
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-base truncate">
                      {arcana.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-black border rounded px-1.5 py-0.5 ${getBadgeColor(arcana.type)}`}>
                        {getTypeName(arcana.type)}
                      </span>
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                        Lv.{arcana.grade}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                  {stripHtml(arcana.stats)}
                </div>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Modal Drawer */}
      {selectedArcana && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end justify-center z-50 p-0 pb-0 transition-opacity">
          <div className="bg-white w-full max-w-md h-[85vh] rounded-t-3xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom duration-300">
            <div className="w-full flex justify-center py-4 cursor-pointer" onClick={() => setSelectedArcana(null)}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between px-6 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 shrink-0 p-1.5">
                  <Image 
                    src={selectedArcana.icon}
                    alt={selectedArcana.name}
                    fill
                    sizes="64px"
                    className="object-cover rounded-xl"
                  />
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedArcana.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-black border rounded px-2 py-0.5 ${getBadgeColor(selectedArcana.type)}`}>
                      {getTypeName(selectedArcana.type)}
                    </span>
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
                      Level {selectedArcana.grade}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedArcana(null)}
                className="p-2 text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-indigo-500" />
                  {locale === 'ja' ? '効果詳細' : 'Arcana Effects'}
                </h4>
                <div className="text-sm text-slate-700 leading-loose font-medium whitespace-pre-wrap">
                  {stripHtml(selectedArcana.stats)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

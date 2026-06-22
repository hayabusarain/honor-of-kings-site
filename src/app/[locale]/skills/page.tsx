'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Search, LayoutGrid, List, X, Zap, Lock } from 'lucide-react';
import summonersData from '@/data/hok_summoners.json';

interface SummonerSkill {
  id: number;
  name: string;
  unlockLevel: string;
  description: string;
  icon: string;
}

export default function SkillsPage() {
  const locale = useLocale();
  const [skills] = useState<SummonerSkill[]>(summonersData as SummonerSkill[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<SummonerSkill | null>(null);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');

  const processedSkills = useMemo(() => {
    let result = skills.filter(skill => {
      const query = searchQuery.toLowerCase();
      if (!query) return true;
      return skill.name.toLowerCase().includes(query) || 
             (skill.description && skill.description.toLowerCase().includes(query));
    });
    return result;
  }, [searchQuery, skills]);

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 sticky top-0 z-20">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          {locale === 'ja' ? 'サモナースキル' : 'Summoner Skills'}
        </h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder={locale === 'ja' ? 'スキル名で検索...' : 'Search skills...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-xl focus:border-slate-300 focus:bg-white outline-none text-slate-800 font-bold placeholder-slate-400 text-sm transition-all"
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

        {/* Skills Grid */}
        <div className={`grid gap-3 ${viewMode === 'compact' ? 'grid-cols-4' : 'grid-cols-1'}`}>
          {processedSkills.map(skill => (
            viewMode === 'compact' ? (
              <button
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className="group bg-white border border-slate-200 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0 mb-1.5 p-1">
                  <img 
                    src={skill.icon}
                    alt={skill.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="font-bold text-slate-900 text-[10px] leading-tight w-full truncate px-0.5">
                  {skill.name}
                </h3>
              </button>
            ) : (
              <button
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className="group bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-stretch text-left active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0 p-1">
                    <img 
                      src={skill.icon}
                      alt={skill.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-base truncate">
                      {skill.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-slate-500 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 flex items-center gap-1">
                        <Lock size={10} />
                        {skill.unlockLevel}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                  {stripHtml(skill.description)}
                </div>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Modal Drawer */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end justify-center z-50 p-0 pb-0 transition-opacity">
          <div className="bg-white w-full max-w-md h-[85vh] rounded-t-3xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom duration-300">
            <div className="w-full flex justify-center py-4 cursor-pointer" onClick={() => setSelectedSkill(null)}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between px-6 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-50 shrink-0 p-1.5">
                  <img 
                    src={selectedSkill.icon}
                    alt={selectedSkill.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedSkill.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1">
                    <Lock size={12} className="text-slate-400" />
                    {selectedSkill.unlockLevel}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSkill(null)}
                className="p-2 text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} className="text-indigo-500" />
                  {locale === 'ja' ? '効果詳細' : 'Skill Effects'}
                </h4>
                <div className="text-sm text-slate-700 leading-loose font-medium whitespace-pre-wrap">
                  {stripHtml(selectedSkill.description)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

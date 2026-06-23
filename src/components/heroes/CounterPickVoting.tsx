'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ThumbsDown, Plus, X, Search, ChevronUp, ChevronDown } from 'lucide-react';
import HOK_HEROES from '@/data/hok_heroes.json';
import { useLocale } from 'next-intl';

interface CounterData {
  hero_name_en: string;
  upvotes: number;
  downvotes: number;
  isStatic?: boolean;
}

interface CounterPickVotingProps {
  heroId: string;
  staticCounters?: any;
  allHeros: any[];
  dict: {
    title: string;
    suggest: string;
    searchPlaceholder: string;
    notFound: string;
    alreadyExists: string;
    noData: string;
    cancelInstruction: string;
  };
}

export function CounterPickVoting({ heroId, staticCounters, allHeros, dict }: CounterPickVotingProps) {
  const locale = useLocale();
  const [counters, setCounters] = useState<CounterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localVotes, setLocalVotes] = useState<Record<string, 'up'|'down'|null>>({});

  useEffect(() => {
    async function fetchCounters() {
      try {
        const res = await fetch(`/api/counters?heroId=${heroId}`);
        const data = await res.json();
        
        const merged = [...(staticCounters?.weak_against || [])];
        if (data.counters) {
          data.counters.forEach((c: any) => {
            const existing = merged.find(m => m.hero_name_en === c.counter_hero_id);
            if (existing) {
              existing.upvotes += c.upvotes;
              existing.downvotes += c.downvotes;
            } else {
              merged.push({
                hero_name_en: c.counter_hero_id,
                upvotes: c.upvotes,
                downvotes: c.downvotes,
                isStatic: false
              });
            }
          });
        }
        
        merged.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        setCounters(merged);
      } catch (e) {
        console.error(e);
        setCounters(staticCounters?.weak_against || []);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCounters();
    const votes = JSON.parse(localStorage.getItem('counterVotes') || '{}');
    setLocalVotes(votes);
  }, [heroId, staticCounters]);

  const handleVote = async (counterHeroId: string, voteType: 'up' | 'down') => {
    const voteKey = `${heroId}_${counterHeroId}`;
    const currentVote = localVotes[voteKey];
    
    if (currentVote === voteType) return; // already voted

    const newVotes = { ...localVotes, [voteKey]: voteType };
    setLocalVotes(newVotes);
    localStorage.setItem('counterVotes', JSON.stringify(newVotes));

    setCounters(prev => prev.map(c => {
      if (c.hero_name_en === counterHeroId) {
        let up = c.upvotes;
        let down = c.downvotes;
        
        if (currentVote === 'up') up--;
        if (currentVote === 'down') down--;
        
        if (voteType === 'up') up++;
        if (voteType === 'down') down++;
        
        return { ...c, upvotes: up, downvotes: down };
      }
      return c;
    }).sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)));

    try {
      await fetch('/api/counters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroId,
          counterHeroId,
          voteType,
          action: currentVote ? 'change' : 'add'
        })
      });
    } catch(e) {
      console.error(e);
    }
  };

  const handleSuggest = async (counterHeroId: string) => {
    if (counters.find(c => c.hero_name_en === counterHeroId)) {
      alert(dict.alreadyExists);
      return;
    }

    setIsModalOpen(false);
    setSearchQuery('');
    
    setCounters(prev => [...prev, {
      hero_name_en: counterHeroId,
      upvotes: 1,
      downvotes: 0,
      isStatic: false
    }].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)));

    const voteKey = `${heroId}_${counterHeroId}`;
    const newVotes = { ...localVotes, [voteKey]: 'up' as const };
    setLocalVotes(newVotes);
    localStorage.setItem('counterVotes', JSON.stringify(newVotes));

    try {
      await fetch('/api/counters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroId,
          counterHeroId,
          voteType: 'up',
          action: 'add'
        })
      });
    } catch(e) {
      console.error(e);
    }
  };

  const filteredHeros = Array.from(new Map(allHeros.filter(c => {
    const enName = c.nameEn || c.hero_name_en || '';
    const jaName = c.nameJa || c.hero_name || '';
    return enName.toLowerCase() !== heroId.toLowerCase() &&
           (jaName.toLowerCase().includes(searchQuery.toLowerCase()) || 
            enName.toLowerCase().includes(searchQuery.toLowerCase()));
  }).map(c => [c.nameEn || c.hero_name_en, c])).values());

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <ThumbsDown size={16} className="text-rose-500" />
          {dict.title}
        </h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
        >
          <Plus size={14} /> {dict.suggest}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-6 text-slate-400"><div className="animate-pulse">Loading...</div></div>
      ) : counters.filter(c => {
          const score = c.upvotes - c.downvotes;
          return c.isStatic ? score >= 0 : score > 0;
        }).slice(0, 5).length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-sm font-medium">
          {dict.noData}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {counters.filter(c => {
            const score = c.upvotes - c.downvotes;
            return c.isStatic ? score >= 0 : score > 0;
          }).slice(0, 5).map(c => {
            const matchedHero = allHeros.find(h => (h.nameEn || h.hero_name_en || '').toLowerCase() === c.hero_name_en.toLowerCase());
            const heroImageId = (HOK_HEROES as any[]).find(h => h.nameEn === c.hero_name_en)?.id || c.hero_name_en;
            const displayName = matchedHero ? (locale === 'ja' && matchedHero.nameJa ? matchedHero.nameJa : (matchedHero.nameEn || matchedHero.hero_name_en)) : c.hero_name_en;
            const voteKey = `${heroId}_${c.hero_name_en}`;
            const userVote = localVotes[voteKey];

            return (
              <div key={c.hero_name_en} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0">
                    <Image src={`/images/heroes/${(HOK_HEROES as any[]).find(h => h.nameEn === heroImageId)?.id || heroImageId}.jpg`} alt={displayName} fill sizes="40px" className="object-cover" onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = '/images/heroes/default.png'; }} />
                  </div>
                  <span className="font-bold text-sm text-slate-800 capitalize">
                    {displayName}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleVote(c.hero_name_en, 'up')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${userVote === 'up' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-200 text-slate-500'}`}
                  >
                    <ChevronUp size={16} strokeWidth={3} />
                    <span className="text-xs font-black">{c.upvotes}</span>
                  </button>
                  <button 
                    onClick={() => handleVote(c.hero_name_en, 'down')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${userVote === 'down' ? 'bg-rose-100 text-rose-700' : 'hover:bg-slate-200 text-slate-500'}`}
                  >
                    <ChevronDown size={16} strokeWidth={3} />
                    <span className="text-xs font-black">{c.downvotes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  autoFocus
                  placeholder={dict.searchPlaceholder}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {filteredHeros.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm font-medium">
                  {dict.notFound}
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {filteredHeros.map(c => {
                    const enName = c.nameEn || c.hero_name_en;
                    const jaName = c.nameJa || c.hero_name;
                    return (
                    <button 
                      key={enName}
                      onClick={() => handleSuggest(enName)}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors text-left w-full"
                    >
                      <div className="relative w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex-shrink-0 overflow-hidden">
                        <Image src={`/images/heroes/${(HOK_HEROES as any[]).find(h => h.nameEn === enName)?.id || enName}.jpg`} alt={enName} fill sizes="32px" className="object-cover" onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = '/images/heroes/default.png'; }} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">
                          {locale === 'ja' ? (jaName || enName) : (enName || jaName)}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400">{c.role}</div>
                      </div>
                    </button>
                  )})}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ThumbsUp, Plus, User, Clock, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BuildSubmitModal } from './BuildSubmitModal';

interface BuildData {
  id: string;
  hero_id: string;
  title: string;
  author_name: string;
  description: string;
  items: string[];
  skills: string[];
  arcanas: {
    red?: string;
    blue?: string;
    yellow?: string;
  };
  upvotes: number;
  created_at: string;
}

interface BuildListProps {
  heroId: string;
  allItems: any[];
  allArcanas: any[];
  allSkills: any[];
}

export function BuildList({ heroId, allItems, allArcanas, allSkills }: BuildListProps) {
  const t = useTranslations('Builds');
  const [builds, setBuilds] = useState<BuildData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localVotes, setLocalVotes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem('build_votes');
    if (stored) {
      try { setLocalVotes(JSON.parse(stored)); } catch(e) {}
    }
    fetchBuilds();
  }, [heroId]);

  const fetchBuilds = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/builds?heroId=${heroId}`);
      if (res.ok) {
        const { data } = await res.json();
        setBuilds(data || []);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleVote = async (buildId: string) => {
    const isUpvoted = localVotes[buildId];
    const action = isUpvoted ? 'remove' : 'add';

    setBuilds(prev => prev.map(b => {
      if (b.id === buildId) {
        return { ...b, upvotes: isUpvoted ? Math.max(0, b.upvotes - 1) : b.upvotes + 1 };
      }
      return b;
    }));

    const newVotes = { ...localVotes };
    if (action === 'add') {
      newVotes[buildId] = true;
    } else {
      delete newVotes[buildId];
    }
    setLocalVotes(newVotes);
    localStorage.setItem('build_votes', JSON.stringify(newVotes));

    try {
      await fetch('/api/builds/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId, action })
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (buildId: string) => {
    const password = prompt(t('deletePrompt'));
    if (!password) return;

    try {
      const res = await fetch('/api/builds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: buildId, delete_password: password })
      });

      if (res.ok) {
        alert(t('deleteSuccess'));
        fetchBuilds();
      } else {
        const errorData = await res.json();
        alert(errorData.error || t('deleteError'));
      }
    } catch (error) {
      console.error(error);
      alert(t('errorOccurred'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800">{t('title')}</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          {t('submitBtn')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-slate-400">
          <div className="animate-pulse">{t('loading')}</div>
        </div>
      ) : builds.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-12 text-center">
          <div className="text-slate-400 mb-2 font-medium">{t('noBuilds')}</div>
          <p className="text-sm text-slate-500">{t('noBuildsDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {builds.map(build => (
            <div key={build.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">{build.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1"><User size={14} /> {build.author_name}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(build.created_at).toLocaleDateString('ja-JP')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleVote(build.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black transition-all ${localVotes[build.id] ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                  >
                    <ThumbsUp size={16} className={localVotes[build.id] ? 'fill-indigo-700' : ''} />
                    {build.upvotes}
                  </button>
                  <button
                    onClick={() => handleDelete(build.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors rounded-xl border border-transparent hover:border-rose-100"
                    title="この投稿を削除"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="p-5 bg-slate-50 flex flex-col lg:flex-row gap-6">
                {/* Items */}
                <div className="flex-1">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">{t('items')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {build.items?.map((itemId, idx) => {
                      const item = allItems.find(i => i.id === itemId);
                      return item ? (
                        <div key={idx} className="relative group">
                          <div className="relative w-12 h-12 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <Image src={item.icon} alt={item.name} fill sizes="48px" className="object-cover" />
                          </div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-bold">
                            {item.name}
                          </div>
                        </div>
                      ) : null;
                    })}
                    {(!build.items || build.items.length === 0) && <span className="text-sm text-slate-400">{t('noItemsSpecified')}</span>}
                  </div>
                </div>

                {/* Skills & Arcanas */}
                <div className="flex-1">
                  <div className="flex flex-col gap-6">
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">{t('skills')}</h4>
                      <div className="flex items-center gap-2">
                        {build.skills?.map((skillId, idx) => {
                          const skill = allSkills.find(s => s.id === skillId);
                          return skill ? (
                            <div key={idx} className="relative group">
                              <div className="relative w-10 h-10 rounded-lg shadow-sm overflow-hidden">
                                <Image src={skill.icon} alt={skill.name} fill sizes="40px" className="object-cover" />
                              </div>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-bold">
                                {skill.name}
                              </div>
                            </div>
                          ) : null;
                        })}
                        {(!build.skills || build.skills.length === 0) && <span className="text-sm text-slate-400">{t('noItemsSpecified')}</span>}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">{t('arcanas')}</h4>
                      <div className="flex items-center gap-3">
                        {['red', 'blue', 'yellow'].map((color, idx) => {
                          const arcanaId = build.arcanas?.[color as keyof typeof build.arcanas];
                          if (!arcanaId) return null;
                          const arcana = allArcanas.find(r => r.id === arcanaId);
                          return arcana ? (
                            <div key={idx} className="relative group">
                              <div className="relative w-12 h-12 rounded-full bg-slate-800 border-2 border-indigo-100 shadow-sm overflow-hidden">
                                <Image src={arcana.icon} alt={arcana.name} fill sizes="48px" className="object-cover" />
                              </div>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-bold">
                                {arcana.name}
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {build.description && (
                <div className="p-5 border-t border-slate-100 bg-white">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">{t('descriptionLabel')}</h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{build.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <BuildSubmitModal 
          heroId={heroId}
          allItems={allItems}
          allArcanas={allArcanas}
          allSkills={allSkills}
          onClose={() => setIsModalOpen(false)}
          onSubmitSuccess={fetchBuilds}
        />
      )}
    </div>
  );
}

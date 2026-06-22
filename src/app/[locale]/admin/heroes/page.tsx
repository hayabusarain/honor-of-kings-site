'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Search, ShieldAlert } from 'lucide-react';

interface HeroData {
  id: string;
  name: string;
  title: string;
}

export default function AdminHerosPage() {
  const locale = useLocale();
  const [heros, setHeros] = useState<HeroData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeros() {
      try {
        const langCode = locale === 'ja' ? 'ja_JP' : 'en_US';
        const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/16.10.1/data/${langCode}/hero.json`);
        const data = await res.json();
        const champsArray = Object.values(data.data) as HeroData[];
        setHeros(champsArray.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error('Error fetching heros:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHeros();
  }, [locale]);

  const filteredHeros = heros.filter(champ => 
    champ.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    champ.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shadow-inner">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">HoK専用データ管理</h1>
          <p className="text-slate-500 font-medium">ヒーローごとにアルカナやビルドを手動登録できます</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="ヒーローを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500 font-medium text-right leading-tight">
            {searchQuery ? (
              <span>検索結果: {filteredHeros.length} 件</span>
            ) : (
              <>
                <span className="block">現在実装数: 136体</span>
                <span className="block text-[10px] text-slate-400">(本家データ {filteredHeros.length} 体から検索可能)</span>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 border-t border-slate-100">
            {filteredHeros.map((champ) => (
              <Link 
                key={champ.id} 
                href={`/admin/heros/${champ.id}`}
                className="flex items-center gap-4 p-4 border-b border-r border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-colors group"
              >
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/16.10.1/img/hero/${champ.id}.png`}
                  alt={champ.name}
                  className="w-12 h-12 rounded-full border-2 border-slate-200 shadow-sm group-hover:border-indigo-400 transition-colors"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-700">{champ.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{champ.id}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

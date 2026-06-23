'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Image, Search, Link2, Check, ArrowRight, List, ShieldAlert } from 'lucide-react';
import itemsData from '@/data/physical_items_final.json';

interface Item {
  id: string;
  nameJa: string;
  nameEn: string;
  gold: number;
  description: string;
  image: string;
}

export default function AdminItemsPage() {
  const t = useTranslations('Sidebar');
  const [rawScreenshots, setRawScreenshots] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mappingInProgress, setMappingInProgress] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load raw screenshots and current mappings
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/items/map');
        if (res.ok) {
          const data = await res.json();
          setRawScreenshots(data.rawScreenshots || []);
          setMappings(data.mappings || {});
        }
      } catch (e) {
        console.error('Failed to load raw items metadata:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeScreenshot = rawScreenshots[currentIndex] || null;

  // Filter items by search query
  const filteredItems = useMemo(() => {
    return (itemsData as unknown as Item[]).filter(item => {
      const query = searchQuery.toLowerCase();
      // Filter out items that are already mapped (if desired, or show them with a checkmark)
      const isAlreadyMapped = !!mappings[item.id];
      const matchesQuery = item.nameJa.toLowerCase().includes(query) || 
                           item.nameEn.toLowerCase().includes(query) ||
                           item.id.includes(query);
      return matchesQuery;
    });
  }, [searchQuery, mappings]);

  // Handle map submission
  const handleMap = async () => {
    if (!activeScreenshot || !selectedItemId) return;
    
    setMappingInProgress(true);
    setMessage(null);
    
    try {
      const res = await fetch('/api/admin/items/map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screenshotName: activeScreenshot,
          itemId: selectedItemId
        })
      });

      if (res.ok) {
        const result = await res.json();
        // Update mappings state
        setMappings(prev => ({ ...prev, [selectedItemId]: activeScreenshot }));
        
        // Remove current screenshot from list
        setRawScreenshots(prev => prev.filter(s => s !== activeScreenshot));
        
        // Reset selection
        setSelectedItemId(null);
        setSearchQuery('');
        
        setMessage({ type: 'success', text: `Successfully mapped to ${result.itemId}!` });
        
        // Stay on same index (which is now the next screenshot) or clamp it
        if (currentIndex >= rawScreenshots.length - 1) {
          setCurrentIndex(Math.max(0, rawScreenshots.length - 2));
        }
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to map screenshot.' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Network error.' });
    } finally {
      setMappingInProgress(false);
      // Auto clear message after 3s
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <Link2 className="text-indigo-600" size={30} />
            Item Screenshot Mapper (管理者用)
          </h1>
          <p className="text-slate-500 font-bold text-sm mt-1">
            ユーザーがアップロードしたスクリーンショット画像を、DataDragonのアイテムIDに紐付けします。
          </p>
        </div>
        <Link 
          href="/items" 
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 font-black rounded-xl hover:bg-indigo-100 transition-colors"
        >
          <List size={18} />
          アイテム一覧ページを見る
        </Link>
      </div>

      {/* Main Workspace */}
      {rawScreenshots.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-3xl p-8 text-center space-y-3">
          <Check className="mx-auto text-emerald-600" size={48} />
          <h3 className="text-xl font-extrabold">すべてのスクリーンショットのマッピングが完了しました！</h3>
          <p className="text-sm text-emerald-700/80 font-bold">
            `public/images/items/raw` 内に未処理のファイルはありません。アイテム一覧ページで確認しましょう。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Image Viewer */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px] shadow-2xl">
            <div className="absolute top-4 left-4 bg-slate-800/80 text-slate-200 text-xs font-black px-3 py-1.5 rounded-full border border-slate-700 backdrop-blur-sm z-10">
              {currentIndex + 1} / {rawScreenshots.length} 枚目の未処理画像
            </div>
            
            {activeScreenshot && (
              <div className="w-full flex flex-col items-center gap-4">
                <div className="max-h-[600px] overflow-auto rounded-xl border border-slate-700 shadow-inner bg-slate-950 flex justify-center">
                  <img 
                    src={`/images/items/raw/${activeScreenshot}`} 
                    alt="Raw screenshot"
                    className="max-w-full h-auto object-contain"
                  />
                </div>
                <div className="text-slate-400 font-extrabold text-sm text-center">
                  ファイル名: <code className="text-indigo-400 bg-slate-800/50 px-2 py-0.5 rounded">{activeScreenshot}</code>
                </div>
              </div>
            )}

            {/* Carousel navigation */}
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors text-sm"
              >
                前へ
              </button>
              <button 
                onClick={() => setCurrentIndex(prev => Math.min(rawScreenshots.length - 1, prev + 1))}
                disabled={currentIndex === rawScreenshots.length - 1}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors text-sm"
              >
                次へ
              </button>
            </div>
          </div>

          {/* Right Column: Search & Selector */}
          <div className="space-y-6">
            
            {/* Action Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Link2 className="text-indigo-600" size={20} />
                紐付けるアイテムを選択
              </h3>

              {message && (
                <div className={`p-4 rounded-2xl border text-sm font-bold animate-pulse ${
                  message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="アイテム名（日本語・英語）で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-bold placeholder-slate-400 text-sm"
                />
              </div>

              {/* Grid of items */}
              <div className="max-h-[350px] overflow-y-auto border border-slate-100 rounded-2xl p-2 space-y-2 bg-slate-50/50">
                {filteredItems.length === 0 ? (
                  <div className="text-slate-400 text-center py-8 font-bold text-sm">
                    検索結果に一致するアイテムはありません。
                  </div>
                ) : (
                  filteredItems.map(item => {
                    const isSelected = selectedItemId === item.id;
                    const isMapped = !!mappings[item.id];
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItemId(item.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                          isSelected 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                            : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${item.image}`}
                            alt={item.nameJa}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                          />
                          <div>
                            <div className={`font-extrabold text-sm ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                              {item.nameJa}
                            </div>
                            <div className={`text-[10px] font-bold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                              {item.nameEn} | コスト: {item.gold}G
                            </div>
                          </div>
                        </div>
                        {isMapped && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            isSelected ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            紐付け済み
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Submit button */}
              <button
                onClick={handleMap}
                disabled={!selectedItemId || mappingInProgress}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-extrabold rounded-2xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:shadow-none hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {mappingInProgress ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Link2 size={18} />
                    選択したアイテムに画像を紐付ける
                  </>
                )}
              </button>

            </div>

            {/* Help Card */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 space-y-3">
              <h4 className="font-extrabold text-indigo-950 text-sm flex items-center gap-1.5">
                <ShieldAlert size={16} className="text-indigo-600" />
                紐付けマッピング手順
              </h4>
              <ol className="list-decimal list-inside text-xs text-indigo-900/80 font-bold space-y-2 leading-relaxed">
                <li>左側の画面に映っているアイテム説明（スクリーンショット）を確認します。</li>
                <li>右側のリストで、その画像に該当するアイテム名を選択します。</li>
                <li>「紐付ける」ボタンを押すと、画像ファイル名がアイテムIDに自動リネームされ、次の画像に移ります。</li>
                <li>これでアイテム詳細画面で正しいゲーム内スクリーンショットが自動表示されます。</li>
              </ol>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

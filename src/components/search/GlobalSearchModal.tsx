'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Search, X, Users, Package, FileText, CornerDownLeft } from 'lucide-react';
import HOK_HEROES from '@/data/hok_heroes.json';
import ITEMS_DATA from '@/data/physical_items_final.json';
import PATCHES_DATA from '@/data/patches.json';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'hero' | 'item' | 'patch';
  title: string;
  subtitle?: string;
  image?: string;
  url: string;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Handle ESC and Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const res: SearchResult[] = [];

    // 1. Search Heroes (limit 6)
    (HOK_HEROES as any[]).forEach(hero => {
      const nameJa = hero.name || '';
      const nameEn = hero.name_en || '';
      const title = hero.title || '';
      const alias = hero.search_alias || '';

      if (
        nameJa.toLowerCase().includes(q) ||
        nameEn.toLowerCase().includes(q) ||
        title.toLowerCase().includes(q) ||
        alias.toLowerCase().includes(q)
      ) {
        res.push({
          id: `hero-${hero.id}`,
          type: 'hero',
          title: locale === 'en' && hero.name_en ? hero.name_en : hero.name,
          subtitle: `${hero.title || ''} • ${(hero.role || []).join(', ')}`,
          image: hero.image,
          url: `/${locale}/heroes/${hero.slug || hero.id}`
        });
      }
    });

    // 2. Search Items (limit 6)
    (ITEMS_DATA as any[]).forEach(item => {
      const nameJa = item.nameJa || item.name || '';
      const nameEn = item.nameEn || '';
      const stats = (item.stats || []).join(' ');

      if (
        nameJa.toLowerCase().includes(q) ||
        nameEn.toLowerCase().includes(q) ||
        stats.toLowerCase().includes(q)
      ) {
        res.push({
          id: `item-${item.id}`,
          type: 'item',
          title: locale === 'en' && item.nameEn ? item.nameEn : nameJa,
          subtitle: `${item.gold ? item.gold + 'G' : ''} • ${stats}`,
          image: item.image,
          url: `/${locale}/items`
        });
      }
    });

    // 3. Search Patches (limit 4)
    (PATCHES_DATA as any[]).forEach((patch, idx) => {
      const heroName = patch.hero_name || '';
      const heroNameEn = patch.hero_name_en || '';
      const version = patch.version || '';
      const desc = patch.description || patch.description_en || '';

      if (
        heroName.toLowerCase().includes(q) ||
        heroNameEn.toLowerCase().includes(q) ||
        version.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q)
      ) {
        res.push({
          id: `patch-${idx}`,
          type: 'patch',
          title: `Patch ${version}: ${heroName}`,
          subtitle: desc.slice(0, 60) + '...',
          url: `/${locale}/patches`
        });
      }
    });

    return res.slice(0, 15);
  }, [query, locale]);

  const handleSelect = useCallback((result: SearchResult) => {
    onClose();
    router.push(result.url);
  }, [onClose, router]);

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search size={20} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={locale === 'ja' ? 'ヒーロー、アイテム、パッチ情報を検索... (ESCで閉じる)' : 'Search heroes, items, patches...'}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500">
              <p>{locale === 'ja' ? '検索キーワードを入力してください' : 'Type a keyword to search'}</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-[11px]">
                <span className="flex items-center gap-1"><Users size={12} /> ヒーロー</span>
                <span className="flex items-center gap-1"><Package size={12} /> アイテム</span>
                <span className="flex items-center gap-1"><FileText size={12} /> パッチノート</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500">
              {locale === 'ja' ? '該当する結果が見つかりませんでした' : 'No results found'}
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {result.image ? (
                        <div className="w-9 h-9 rounded-lg overflow-hidden relative shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <Image src={result.image} alt={result.title} fill className="object-cover" sizes="36px" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {result.type === 'hero' && <Users size={18} />}
                          {result.type === 'item' && <Package size={18} />}
                          {result.type === 'patch' && <FileText size={18} />}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate flex items-center gap-2">
                          <span>{result.title}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                            result.type === 'hero' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
                            result.type === 'item' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400' :
                            'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {result.type}
                          </span>
                        </div>
                        {result.subtitle && (
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                            {result.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <CornerDownLeft size={14} className={`shrink-0 ${isSelected ? 'text-blue-500 opacity-100' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-xs">↑↓</kbd> 選択</span>
            <span><kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-xs">↵</kbd> 移動</span>
          </div>
          <span><kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-xs">Cmd + K</kbd> トグル</span>
        </div>
      </div>
    </div>
  );
}

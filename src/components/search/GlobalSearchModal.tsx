'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Search, X, Users, Package, FileText, CornerDownLeft, Zap, Hexagon, BookOpen } from 'lucide-react';
import HOK_HEROES from '@/data/hok_heroes.json';
import ITEMS_DATA from '@/data/hok_items.json';
import PATCHES_DATA from '@/data/patches.json';
// スペル・アルカナ・ガイドも検索対象にする。従来は上の3データだけで、
// サイドバーが「湧き時間は検索需要が大きい」と書いているのに
// 検索ボックスで「暴君」と打っても何も出なかった。
// このモーダル自体が動的読み込みなので、初期バンドルには影響しない
import SPELLS_DATA from '@/data/hok_spells.json';
import ARCANA_DATA from '@/data/hok_arcanas.json';
import GUIDE_JA from '../../../public/data/guide/ja.json';
import GUIDE_EN from '../../../public/data/guide/en.json';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'hero' | 'item' | 'patch' | 'spell' | 'arcana' | 'guide';
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
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const res: SearchResult[] = [];

    // 1. Search Heroes (limit 6)
    (HOK_HEROES as any[]).forEach((hero: any) => {
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
    (ITEMS_DATA as any[]).forEach((item: any) => {
      const nameJa = (item.name || item.nameJa || '') as string;
      const nameEn = (item.name_en || item.nameEn || '') as string;
      const stats = (item.stats || item.stats_en || '') as string;
      const aliases = Array.isArray(item.aliases) ? item.aliases.join(' ') : '';
      const price = (item.price || item.totalPrice || item.gold || 0) as number;

      if (
        nameJa.toLowerCase().includes(q) ||
        nameEn.toLowerCase().includes(q) ||
        stats.toLowerCase().includes(q) ||
        aliases.toLowerCase().includes(q)
      ) {
        res.push({
          id: `item-${item.id}`,
          type: 'item',
          title: locale === 'en' && nameEn ? nameEn : nameJa,
          subtitle: `${price ? price + 'G' : ''} • ${stats}`,
          image: item.icon || item.image,
          // items 側に ?item= で詳細を開く入口があるのに使っていなかった。
          // 一覧の先頭に着地すると、ページ内でもう一度同じ名前を打ち直すことになる
          url: `/${locale}/items?item=${item.id}`
        });
      }
    });

    // 3. Search Patches (limit 4)
    (PATCHES_DATA as any[]).forEach((patch: any, idx: number) => {
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

    // 4. Search Summoner Spells
    (SPELLS_DATA as any[]).forEach((spell: any) => {
      const nameJa = spell.japanese_name || '';
      const nameEn = spell.english_name || '';
      const descJa = spell.japanese_description || '';
      const descEn = spell.english_description || '';
      if (
        nameJa.toLowerCase().includes(q) ||
        nameEn.toLowerCase().includes(q) ||
        descJa.toLowerCase().includes(q) ||
        descEn.toLowerCase().includes(q)
      ) {
        res.push({
          id: `spell-${spell.id}`,
          type: 'spell',
          title: locale === 'en' ? nameEn : nameJa,
          subtitle: `CD ${spell.cooldown}s`,
          image: spell.icon,
          url: `/${locale}/spells`
        });
      }
    });

    // 5. Search Arcana
    (ARCANA_DATA as any[]).forEach((arcana: any) => {
      const nameJa = arcana.name || '';
      const nameEn = arcana.name_en || '';
      const stats = `${arcana.stats || ''} ${arcana.stats_en || ''}`;
      if (
        nameJa.toLowerCase().includes(q) ||
        nameEn.toLowerCase().includes(q) ||
        stats.toLowerCase().includes(q)
      ) {
        res.push({
          id: `arcana-${arcana.id}`,
          type: 'arcana',
          title: locale === 'en' && nameEn ? nameEn : nameJa,
          subtitle: locale === 'en' && arcana.stats_en ? arcana.stats_en : arcana.stats,
          image: arcana.icon,
          url: `/${locale}/arcana`
        });
      }
    });

    // 6. Search Guide (ボスの湧き時間と用語集)
    const guide = (locale === 'ja' ? GUIDE_JA : GUIDE_EN) as any;
    (guide.objectives || []).forEach((obj: any, idx: number) => {
      const name = obj.name || '';
      if (name.toLowerCase().includes(q) || (obj.spawn_time || '').toLowerCase().includes(q)) {
        res.push({
          id: `boss-${idx}`,
          type: 'guide',
          title: name,
          subtitle: obj.spawn_time,
          url: `/${locale}/guide/bosses`
        });
      }
    });
    (guide.glossary || []).forEach((item: any, idx: number) => {
      const term = item.term || '';
      if (term.toLowerCase().includes(q)) {
        res.push({
          id: `glossary-${idx}`,
          type: 'guide',
          title: term,
          subtitle: (item.definition || '').slice(0, 60),
          url: `/${locale}/guide`
        });
      }
    });

    return res.slice(0, 15);
  }, [query, locale]);

  const handleSelect = useCallback((result: SearchResult) => {
    onClose();
    router.push(result.url);
    // すでに /items にいる場合、同一パスへのクエリ変更ではページが再マウント
    // されず ?item= の受け口が動かない。イベントでも通知して二重に保険をかける。
    // items ページ未マウント時（他ページからの遷移中）はイベントが捨てられるが、
    // その場合はマウント時の ?item= 読み取りが拾う
    if (result.type === 'item') {
      window.dispatchEvent(new CustomEvent('hok:open-item', { detail: result.id.replace('item-', '') }));
    }
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
      // 日本語IMEの変換確定Enterで先頭候補へ飛ばない
      if (e.nativeEvent.isComposing) return;
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
      <div
        role="dialog"
        aria-modal="true"
        aria-label={locale === 'ja' ? 'サイト内検索' : 'Site search'}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search size={20} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={locale === 'ja' ? 'ヒーロー、アイテム、スペル、用語などを検索...' : 'Search heroes, items, spells, terms...'}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-slate-800 text-sm placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label={locale === 'ja' ? '検索語を消す' : 'Clear search'} className="p-1 text-slate-500 hover:text-slate-700">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="py-10 text-center text-xs text-slate-400">
              <p>{locale === 'ja' ? '検索キーワードを入力してください' : 'Type a keyword to search'}</p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-3 text-[11px]">
                <span className="flex items-center gap-1"><Users size={12} /> {locale === 'ja' ? 'ヒーロー' : 'Heroes'}</span>
                <span className="flex items-center gap-1"><Package size={12} /> {locale === 'ja' ? 'アイテム' : 'Items'}</span>
                <span className="flex items-center gap-1"><FileText size={12} /> {locale === 'ja' ? 'パッチノート' : 'Patch Notes'}</span>
                <span className="flex items-center gap-1"><Zap size={12} /> {locale === 'ja' ? 'スペル' : 'Spells'}</span>
                <span className="flex items-center gap-1"><Hexagon size={12} /> {locale === 'ja' ? 'アルカナ' : 'Arcana'}</span>
                <span className="flex items-center gap-1"><BookOpen size={12} /> {locale === 'ja' ? 'ボス・用語集' : 'Bosses & Glossary'}</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
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
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {result.image ? (
                        <div className="w-9 h-9 rounded-lg overflow-hidden relative shrink-0 bg-slate-100 border border-slate-200">
                          <Image src={result.image} alt={result.title} fill className="object-cover" sizes="36px" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 text-slate-500">
                          {result.type === 'hero' && <Users size={18} />}
                          {result.type === 'item' && <Package size={18} />}
                          {result.type === 'patch' && <FileText size={18} />}
                          {result.type === 'spell' && <Zap size={18} />}
                          {result.type === 'arcana' && <Hexagon size={18} />}
                          {result.type === 'guide' && <BookOpen size={18} />}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate flex items-center gap-2">
                          <span>{result.title}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                            result.type === 'hero' ? 'bg-blue-100 text-blue-600' :
                            result.type === 'item' ? 'bg-amber-100 text-amber-600' :
                            result.type === 'spell' ? 'bg-orange-100 text-orange-600' :
                            result.type === 'arcana' ? 'bg-violet-100 text-violet-600' :
                            result.type === 'guide' ? 'bg-teal-100 text-teal-600' :
                            'bg-emerald-100 text-emerald-600'
                          }`}>
                            {result.type}
                          </span>
                        </div>
                        {result.subtitle && (
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
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
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
            <div className="flex gap-4">
              <span><kbd className="px-1 py-0.5 bg-white border rounded shadow-xs">↑↓</kbd> {locale === 'ja' ? '選択' : 'Select'}</span>
              <span><kbd className="px-1 py-0.5 bg-white border rounded shadow-xs">↵</kbd> {locale === 'ja' ? '移動' : 'Go'}</span>
            </div>
            <span><kbd className="px-1 py-0.5 bg-white border rounded shadow-xs">Cmd + K</kbd> {locale === 'ja' ? 'トグル' : 'Toggle'}</span>
        </div>
      </div>
    </div>
  );
}

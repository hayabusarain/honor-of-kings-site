'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Search, X, Users, Package, FileText, CornerDownLeft, Zap, Hexagon, BookOpen } from 'lucide-react';
import { useFocusTrap } from '@/components/common/useFocusTrap';
import { normalizePatchText } from '@/lib/patchText';
import { searchNormalize } from '@/utils/searchNormalize';
import HOK_HEROES from '@/data/hok_heroes.json';
import ITEMS_DATA from '@/data/hok_items.json';
import PATCHES_DATA from '@/data/patches.json';
// スペル・アルカナ・ガイドも検索対象にする。従来は上の3データだけで、
// サイドバーが「湧き時間は検索需要が大きい」と書いているのに
// 検索ボックスで「暴君」と打っても何も出なかった。
// このモーダル自体が動的読み込みなので、初期バンドルには影響しない
import SPELLS_DATA from '@/data/hok_spells.json';
import ARCANA_DATA from '@/data/hok_arcanas.json';
import GUIDE_JA from '@/data/guide/ja.json';
import GUIDE_EN from '@/data/guide/en.json';

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

// 表示する結果の上限。超えた分は切り捨て、件数の読み上げでは「以上」と伝える
const MAX_RESULTS = 15;

/**
 * アイテムの効果文とパッチの本文は長い。キーストロークごとに正規化すると、
 * patches.json だけで 186KB・77件を毎回1周することになる。
 * モジュールの評価時に1回だけ正規化済みの検索用文字列を作っておく。
 * このモーダル自体が dynamic import なので、初期バンドルには載らない
 */
const ITEM_INDEX = (ITEMS_DATA as any[]).map((item: any) => ({
  item,
  haystack: searchNormalize(
    [item.name, item.name_en, item.stats, item.stats_en,
     Array.isArray(item.aliases) ? item.aliases.join(' ') : ''].filter(Boolean).join(' '),
  ),
}));

const PATCH_INDEX = (PATCHES_DATA as any[]).map((patch: any, idx: number) => ({
  patch,
  idx,
  haystack: searchNormalize(
    [patch.hero_name, patch.hero_name_en, patch.version, patch.version_en,
     patch.description, patch.description_en].filter(Boolean).join(' '),
  ),
}));

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // IME 変換中かどうか。aria-live の文言を変換の途中経過で更新しないために持つ
  const [isComposing, setIsComposing] = useState(false);
  // スクリーンリーダーへ読み上げる件数文言。query 変化から少し遅らせて更新する
  const [liveMessage, setLiveMessage] = useState('');

  // フォーカス管理（開いたら input へ、閉じたら開く直前の要素へ戻す）と Tab の循環。
  // input の autoFocus 属性だとこの hook より先にフォーカスが移ってしまい
  // 復帰先を保存できないため、属性は使わず hook 側で移す
  const { onKeyDown: handleTrapKeyDown } = useFocusTrap(containerRef, isOpen, {
    initialFocusRef: inputRef,
  });

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
      setLiveMessage('');
    }
  }

  const { results, isCapped } = useMemo((): { results: SearchResult[]; isCapped: boolean } => {
    if (!query.trim()) return { results: [], isCapped: false };
    // 正規化はヒーロー一覧・パッチ表と共有する（src/utils/searchNormalize.ts）。
    // 全角と半角、空白と中黒、大文字小文字、カタカナとひらがなを畳む
    const q = searchNormalize(query);
    if (!q) return { results: [], isCapped: false };

    // タイプごとに配列を作り、それぞれ上限を掛けてから連結する。
    // 正規化を入れるとヒーローのヒットが増える（「か」11→38体、「しん」3→10体）。
    // 素直に連結して MAX_RESULTS で切ると、ヒーローが15枠を占有して
    // アイテム・パッチ・用語集が押し出される。コメントには前から
    // 「limit 6」「limit 4」と書いてあったのに実装が無かった
    const heroes: SearchResult[] = [];
    const items: SearchResult[] = [];
    const patches: SearchResult[] = [];
    const spells: SearchResult[] = [];
    const arcana: SearchResult[] = [];
    const guideHits: SearchResult[] = [];

    // 1. ヒーロー
    (HOK_HEROES as any[]).forEach((hero: any) => {
      // 照合は6項目。title_alias は正規化を入れてもなお104体で追加ヒットする、
      // ここでいちばん効く一手。reading は足さない（82体すべてで search_alias の
      // 部分文字列で、追加ヒットが0件）。
      // id だけは完全一致にする。部分一致だと「1」で87体、「2」で25体が並ぶ
      const hit =
        searchNormalize(hero.name || '').includes(q) ||
        searchNormalize(hero.name_en || '').includes(q) ||
        searchNormalize(hero.title || '').includes(q) ||
        searchNormalize(hero.title_alias || '').includes(q) ||
        searchNormalize(hero.search_alias || '').includes(q) ||
        searchNormalize(String(hero.id)) === q;
      if (!hit) return;
      heroes.push({
        id: `hero-${hero.id}`,
        type: 'hero',
        title: locale === 'en' && hero.name_en ? hero.name_en : hero.name,
        subtitle: `${hero.title || ''} • ${(hero.role || []).join(', ')}`,
        image: hero.image,
        url: `/${locale}/heroes/${hero.slug || hero.id}`,
      });
    });

    // 2. アイテム
    ITEM_INDEX.forEach(({ item, haystack }) => {
      if (!haystack.includes(q)) return;
      const nameJa = (item.name || '') as string;
      const nameEn = (item.name_en || '') as string;
      const stats = (item.stats || item.stats_en || '') as string;
      const price = (item.price || item.totalPrice || 0) as number;
      items.push({
        id: `item-${item.id}`,
        type: 'item',
        title: locale === 'en' && nameEn ? nameEn : nameJa,
        subtitle: `${price ? price + 'G' : ''} • ${stats}`,
        image: item.icon,
        // items 側に ?item= で詳細を開く入口がある。一覧の先頭に着地すると、
        // ページ内でもう一度同じ名前を打ち直すことになる
        url: `/${locale}/items?item=${item.id}`,
      });
    });

    // 3. パッチ
    PATCH_INDEX.forEach(({ patch, idx, haystack }) => {
      if (!haystack.includes(q)) return;
      const isEn = locale === 'en';
      const heroName = patch.hero_name || '';
      const heroNameEn = patch.hero_name_en || '';
      const version = patch.version || '';
      const rawDesc = (isEn ? patch.description_en || patch.description : patch.description || patch.description_en) || '';
      patches.push({
        id: `patch-${idx}`,
        type: 'patch',
        title: `Patch ${isEn ? patch.version_en || version : version}: ${isEn ? heroNameEn || heroName : heroName}`,
        subtitle: normalizePatchText(rawDesc, locale).slice(0, 60) + '...',
        // アンカーにはしない。過去バージョンは閉じた <details> の中にあり、
        // id を振っても飛べない。代わりに検索語をそのまま渡し、
        // パッチ表側の横断検索モードで絞り込ませる。
        // ヒーロー名ではなく読者が打った文字列を渡すこと（システム項目には
        // hero_name が無いため）
        url: `/${locale}/patches?q=${encodeURIComponent(query.trim())}`,
      });
    });

    // 4. サモナースペル
    (SPELLS_DATA as any[]).forEach((spell: any) => {
      const hit =
        searchNormalize(spell.japanese_name || '').includes(q) ||
        searchNormalize(spell.english_name || '').includes(q) ||
        searchNormalize(spell.japanese_description || '').includes(q) ||
        searchNormalize(spell.english_description || '').includes(q);
      if (!hit) return;
      spells.push({
        id: `spell-${spell.id}`,
        type: 'spell',
        title: locale === 'en' ? spell.english_name : spell.japanese_name,
        subtitle: `CD ${spell.cooldown}s`,
        image: spell.icon,
        url: `/${locale}/spells#spell-${spell.id}`,
      });
    });

    // 5. アルカナ
    (ARCANA_DATA as any[]).forEach((a: any) => {
      const hit =
        searchNormalize(a.name || '').includes(q) ||
        searchNormalize(a.name_en || '').includes(q) ||
        searchNormalize(`${a.stats || ''} ${a.stats_en || ''}`).includes(q);
      if (!hit) return;
      arcana.push({
        id: `arcana-${a.id}`,
        type: 'arcana',
        title: locale === 'en' && a.name_en ? a.name_en : a.name,
        subtitle: locale === 'en' && a.stats_en ? a.stats_en : a.stats,
        image: a.icon,
        url: `/${locale}/arcana#arcana-${a.id}`,
      });
    });

    // 6. ガイド（オブジェクトと用語集）
    const guide = (locale === 'ja' ? GUIDE_JA : GUIDE_EN) as any;
    (guide.objectives || []).forEach((obj: any, idx: number) => {
      const name = obj.name || '';
      if (!searchNormalize(name).includes(q) && !searchNormalize(obj.spawn_time || '').includes(q)) return;
      // 8件のうち /guide/bosses に本文があるのは先頭3件（タイラント・
      // オーバーロード・テンペストドラゴン）だけ。残り5件（赤バフ／青バフ・
      // 川の精霊・ワープポイントと精霊・ファイアホーク・ゴールドオブジェクト）は
      // bosses ページに1語も出てこないので、/guide の該当節へ送る（実測で確認）
      const isBoss = idx < 3;
      guideHits.push({
        id: `boss-${idx}`,
        type: 'guide',
        title: name,
        subtitle: obj.spawn_time,
        url: isBoss ? `/${locale}/guide/bosses` : `/${locale}/guide#objectives`,
      });
    });
    (guide.glossary || []).forEach((item: any, idx: number) => {
      const term = item.term || '';
      // 定義文も見る。用語名だけだと、サイトが標準にしている語（「ラストヒット」など）が
      // 別の見出し（CS）の定義の中にあるとき0件になる
      if (!searchNormalize(term).includes(q) && !searchNormalize(item.definition || '').includes(q)) return;
      guideHits.push({
        id: `glossary-${idx}`,
        type: 'guide',
        title: term,
        subtitle: (item.definition || '').slice(0, 60),
        url: `/${locale}/guide#glossary`,
      });
    });

    // 上限の合計は MAX_RESULTS を超える。少ないタイプの枠を余らせないためで、
    // あふれた分は従来どおり末尾を切る
    const res = [
      ...heroes.slice(0, 6),
      ...items.slice(0, 6),
      ...patches.slice(0, 4),
      ...spells.slice(0, 3),
      ...arcana.slice(0, 3),
      ...guideHits.slice(0, 4),
    ];
    return { results: res.slice(0, MAX_RESULTS), isCapped: res.length > MAX_RESULTS };
  }, [query, locale]);

  // 件数の読み上げ文言。1文字打つたびに読み上げると耳障りなので約200ms 待って更新し、
  // IME 変換中（未確定文字列で結果が揺れる間）は更新しない。確定後にまとめて1回読み上げる
  useEffect(() => {
    if (isComposing) return;
    const timer = setTimeout(() => {
      if (query.trim() === '') {
        setLiveMessage('');
      } else if (results.length === 0) {
        setLiveMessage(locale === 'ja' ? '結果なし' : 'No results');
      } else if (isCapped) {
        setLiveMessage(locale === 'ja' ? `${MAX_RESULTS}件以上の結果` : `${MAX_RESULTS}+ results`);
      } else {
        setLiveMessage(locale === 'ja' ? `${results.length}件の結果` : `${results.length} results`);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query, results.length, isCapped, isComposing, locale]);

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

    // 同じページにいる状態でアンカー付きURLへ push しても、ブラウザが
    // ハッシュだけの変化とみなさずスクロールしないことがある。
    // 遷移先が今いるパスと同じときだけ、こちらで該当要素まで送る。
    // 別ページへの遷移では Next.js 側がハッシュを処理するので何もしない
    const hash = result.url.includes('#') ? result.url.slice(result.url.indexOf('#') + 1) : '';
    if (!hash) return;
    const targetPath = result.url.slice(0, result.url.indexOf('#'));
    if (targetPath !== window.location.pathname) return;
    // router.push のコミット後に測りたいので1フレーム待つ
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: 'start' });
    });
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={locale === 'ja' ? 'サイト内検索' : 'Site search'}
        onKeyDown={handleTrapKeyDown}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* 結果件数をスクリーンリーダーへ通知する。視覚的にはリスト表示で分かるため sr-only。
            文言は上の effect でデバウンスして更新している */}
        <div aria-live="polite" className="sr-only">
          {liveMessage}
        </div>
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
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder={locale === 'ja' ? 'ヒーロー、アイテム、スペル、用語などを検索...' : 'Search heroes, items, spells, terms...'}
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-slate-800 text-sm placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label={locale === 'ja' ? '検索語を消す' : 'Clear search'} className="p-1 text-slate-500 hover:text-slate-700">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-slate-600 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="py-10 text-center text-xs text-slate-500">
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
            <div className="py-10 text-center text-xs text-slate-500">
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
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
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
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
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

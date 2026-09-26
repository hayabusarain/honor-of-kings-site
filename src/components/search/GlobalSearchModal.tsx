'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Search, X, Users, Package, FileText, CornerDownLeft, Zap, Hexagon, BookOpen, Sparkles } from 'lucide-react';
import { useFocusTrap } from '@/components/common/useFocusTrap';
import { SELECTED } from '@/components/common/tones';
import { normalizePatchText } from '@/lib/patchText';
import { searchNormalize } from '@/utils/searchNormalize';
import HOK_HEROES from '@/data/hok_heroes.json';
import ITEMS_DATA from '@/data/hok_items.json';
import PATCHES_DATA from '@/data/patches.json';
import PATCH_METAS from '@/data/patch_meta.json';
// スペル・アルカナ・ガイドも検索対象にする。従来は上の3データだけで、
// サイドバーが「湧き時間は検索需要が大きい」と書いているのに
// 検索ボックスで「暴君」と打っても何も出なかった。
// このモーダル自体が動的読み込みなので、初期バンドルには影響しない
import SPELLS_DATA from '@/data/hok_spells.json';
import ARCANA_DATA from '@/data/hok_arcanas.json';
import GUIDE_JA from '@/data/guide/ja.json';
import GUIDE_EN from '@/data/guide/en.json';
// スキル名の索引（scripts/build_skill_index.mjs が skills/*.json から作る、35KB）。
// スキル名からヒーローにたどり着けなかったので足した（2026-09-25）
import SKILL_INDEX from '@/data/generated/skill_index.json';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'hero' | 'item' | 'patch' | 'spell' | 'arcana' | 'guide' | 'skill';
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

/** version → 版ページのスラッグ（created_at の YYYY-MM-DD） */
const PATCH_DATE_BY_VERSION: Record<string, string> = Object.fromEntries(
  (PATCH_METAS as { version: string; created_at: string }[])
    .map((m) => [m.version, m.created_at.slice(0, 10)]),
);

const PATCH_INDEX = (PATCHES_DATA as any[]).map((patch: any, idx: number) => ({
  patch,
  idx,
  haystack: searchNormalize(
    [patch.hero_name, patch.hero_name_en, patch.version, patch.version_en,
     patch.description, patch.description_en].filter(Boolean).join(' '),
  ),
}));

const HERO_BY_ID = new Map((HOK_HEROES as { id: string; slug?: string; name: string; name_en?: string; image?: string }[])
  .map((h) => [String(h.id), h]));

/** スキルは日英どちらの名前でも引けるようにする。英語の画面で日本語名を打つ人もいる */
const SKILL_SEARCH = (SKILL_INDEX as { h: string; s: string; ja: string; en: string }[])
  .filter((row) => HERO_BY_ID.has(row.h))
  .map((row) => ({ row, haystack: searchNormalize(`${row.ja} ${row.en}`) }));

const skillSlotLabel = (slot: string, locale: string) => {
  if (slot === 'passive') return locale === 'ja' ? 'パッシブ' : 'Passive';
  const n = slot.replace('skill', '');
  return locale === 'ja' ? `スキル${n}` : `Skill ${n}`;
};

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
    const skills: SearchResult[] = [];
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
        // 二つ名（title）は日本語しか無い（hok_heroes.json に英語の二つ名は0体）。
        // 英語の画面ではロールだけにする。以前は「詩仙剣侠 • Assassin」と日本語が混じっていた
        subtitle: locale === 'en'
          ? (hero.role || []).join(', ')
          : `${hero.title || ''} • ${(hero.role || []).join(', ')}`,
        image: hero.image,
        url: `/${locale}/heroes/${hero.slug || hero.id}`,
      });
    });

    // 1b. スキル名。行は「スキル名 — ヒーロー名」で、ヒーロー詳細のスキル欄へ送る
    SKILL_SEARCH.forEach(({ row, haystack }) => {
      if (!haystack.includes(q)) return;
      const hero = HERO_BY_ID.get(row.h)!;
      const heroName = locale === 'en' && hero.name_en ? hero.name_en : hero.name;
      skills.push({
        id: `skill-${row.h}-${row.s}`,
        type: 'skill',
        title: locale === 'en' && row.en ? row.en : row.ja,
        subtitle: `${heroName} • ${skillSlotLabel(row.s, locale)}`,
        image: hero.image,
        url: `/${locale}/heroes/${hero.slug || hero.id}#skills`,
      });
    });

    // 2. アイテム
    ITEM_INDEX.forEach(({ item, haystack }) => {
      if (!haystack.includes(q)) return;
      const nameJa = (item.name || '') as string;
      const nameEn = (item.name_en || '') as string;
      // 英語の画面では英語の効果を先に取る。以前は日英とも stats（日本語）が先で、
      // 英語の画面に「+80 物理攻撃」と出ていた
      const stats = ((locale === 'en' ? item.stats_en || item.stats : item.stats || item.stats_en) || '') as string;
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
        // 本文の見出しは Markdown の ** で囲まれている。補足は1行の抜粋なので記号だけ落とす
        // （「**修正と最適化** ・…」と記号がそのまま出ていた。トップの plainPatchText と同じ扱い）
        subtitle: normalizePatchText(rawDesc, locale).replace(/\*\*/g, '').slice(0, 60) + '...',
        // 版ページができたので、その版の該当エントリへ直接送る。
        // 版が分からないものだけ、これまでどおり検索語を渡して
        // パッチ表側の横断検索モードで絞り込ませる（ヒーロー名ではなく
        // 読者が打った文字列を渡すこと。システム項目には hero_name が無い）
        url: PATCH_DATE_BY_VERSION[version]
          ? `/${locale}/patches/${PATCH_DATE_BY_VERSION[version]}#${patch.id}`
          : `/${locale}/patches?q=${encodeURIComponent(query.trim())}`,
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
    // もう一方の言語の同じ項目名でも引く。日本語のガイドは 2026-09-25 に
    // 「タイラント (Tyrant)」の英語併記を外したので、日本語ページで tyrant と打っても当たらなくなっていた。
    // objectives は日英で同じ並び（8件）
    const otherGuide = (locale === 'ja' ? GUIDE_EN : GUIDE_JA) as any;
    (guide.objectives || []).forEach((obj: any, idx: number) => {
      const name = obj.name || '';
      const otherName = otherGuide.objectives?.[idx]?.name || '';
      if (
        !searchNormalize(name).includes(q) &&
        !searchNormalize(otherName).includes(q) &&
        !searchNormalize(obj.spawn_time || '').includes(q)
      ) return;
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
        // 用語集のその語へ直接飛ぶ。アンカーの形は src/app/[locale]/guide/glossary/anchor.ts と揃える
        url: `/${locale}/guide/glossary#term-${item.id}`,
      });
    });

    // 上限の合計は MAX_RESULTS を超える。少ないタイプの枠を余らせないためで、
    // あふれた分は従来どおり末尾を切る
    const res = [
      ...heroes.slice(0, 6),
      ...skills.slice(0, 4),
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
    // 暗幕は bg-black/60。slate-900 の60%だと夜の配色へ写し替えると白い膜になる（2026-09-26）
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm">
      {/* 背景クリックは補助。キーボードは ESC で閉じる */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={locale === 'ja' ? 'サイト内検索' : 'Site search'}
        onKeyDown={handleTrapKeyDown}
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-300 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* 結果件数をスクリーンリーダーへ通知する。視覚的にはリスト表示で分かるため sr-only。
            文言は上の effect でデバウンスして更新している */}
        <div aria-live="polite" className="sr-only">
          {liveMessage}
        </div>
        {/* Input Bar */}
        {/* 入力欄の文字は、スマホでは globals.css が 16px にする（iPhone の拡大を止めるため）。
            PC では 16px（text-base）。以前は 14px。
            rounded-lg は焦点の枠（globals.css の :focus-visible の金の線）の角を丸めるため。
            開くとすぐ入力欄に焦点が当たるので、角ばった枠が丸い窓の中で目立っていた */}
        <div className="flex items-center pl-4 pr-2 py-2 border-b border-slate-200 gap-3">
          <Search size={20} className="text-slate-500 shrink-0" />
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
            placeholder={locale === 'ja' ? 'ヒーロー、スキル名、アイテム、用語などを検索...' : 'Search heroes, skills, items, terms...'}
            ref={inputRef}
            className="h-11 min-w-0 flex-1 rounded-lg bg-transparent border-none outline-none text-slate-800 text-base placeholder:text-slate-500"
          />
          {/* 消すボタンは 44px 角（以前は約24px） */}
          {query && (
            <button onClick={() => setQuery('')} aria-label={locale === 'ja' ? '検索語を消す' : 'Clear search'} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700">
              <X size={18} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex shrink-0 items-center gap-1 mr-2 px-2 py-1 text-sm leading-none font-semibold text-slate-600 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2">
          {query.trim() === '' ? (
            // 案内と対象の一覧は 12px・11px だったのを 14px にした（2026-09-26）
            <div className="py-8 px-2 text-center text-sm text-slate-500">
              <p className="text-slate-600">{locale === 'ja' ? '検索キーワードを入力してください' : 'Type a keyword to search'}</p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4">
                <span className="flex items-center gap-1.5"><Users size={14} /> {locale === 'ja' ? 'ヒーロー' : 'Heroes'}</span>
                <span className="flex items-center gap-1.5"><Sparkles size={14} /> {locale === 'ja' ? 'スキル名' : 'Skill names'}</span>
                <span className="flex items-center gap-1.5"><Package size={14} /> {locale === 'ja' ? 'アイテム' : 'Items'}</span>
                <span className="flex items-center gap-1.5"><FileText size={14} /> {locale === 'ja' ? 'パッチノート' : 'Patch Notes'}</span>
                <span className="flex items-center gap-1.5"><Zap size={14} /> {locale === 'ja' ? 'スペル' : 'Spells'}</span>
                <span className="flex items-center gap-1.5"><Hexagon size={14} /> {locale === 'ja' ? 'アルカナ' : 'Arcana'}</span>
                <span className="flex items-center gap-1.5"><BookOpen size={14} /> {locale === 'ja' ? 'ボス・用語集' : 'Bosses & Glossary'}</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-600">
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
                    // 選択中は金の線と淡い塗り（tones.ts の SELECTED）。以前は青の塗りで、
                    // サイトのほかの「選択中」と色が違っていた。枠の太さで行が動かないよう、選ばれていない行も透明の線を持つ
                    className={`w-full flex items-center justify-between gap-2 p-2.5 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? SELECTED
                        : 'border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {result.image ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0 bg-slate-100 border border-slate-200">
                          <Image src={result.image} alt={result.title} fill className="object-cover" sizes="40px" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 text-slate-500">
                          {result.type === 'hero' && <Users size={18} />}
                          {result.type === 'item' && <Package size={18} />}
                          {result.type === 'patch' && <FileText size={18} />}
                          {result.type === 'spell' && <Zap size={18} />}
                          {result.type === 'arcana' && <Hexagon size={18} />}
                          {result.type === 'guide' && <BookOpen size={18} />}
                          {result.type === 'skill' && <Sparkles size={18} />}
                        </div>
                      )}
                      {/* 名前 14px・補足 14px（以前は 12px・11px、種別の札は 10px）。
                          長い名前（パッチの記事名）は名前だけを省略し、種別の札は削らない。
                          以前は行全体に truncate を付けていたが、flex の子は省略されず、枠の右へはみ出していた */}
                      <div className="min-w-0">
                        <div className="text-sm font-bold flex items-center gap-2 min-w-0">
                          <span className="truncate">{result.title}</span>
                          <span className={`shrink-0 text-sm leading-none px-1.5 py-1 rounded font-semibold uppercase ${
                            result.type === 'hero' ? 'bg-blue-100 text-blue-700' :
                            result.type === 'item' ? 'bg-amber-100 text-amber-700' :
                            result.type === 'spell' ? 'bg-orange-100 text-orange-700' :
                            result.type === 'arcana' ? 'bg-violet-100 text-violet-700' :
                            result.type === 'guide' ? 'bg-teal-100 text-teal-700' :
                            result.type === 'skill' ? 'bg-slate-100 text-slate-600' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {result.type}
                          </span>
                        </div>
                        {result.subtitle && (
                          <div className="text-sm text-slate-600 truncate mt-0.5">
                            {result.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <CornerDownLeft size={14} className={`shrink-0 ${isSelected ? 'text-brand-700 opacity-100' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        {/* キー操作の案内。キーボードのあるPC幅（sm 以上）だけに出す。
            スマホでは押せない案内が結果の表示域を1行ぶん削っていた。文字は 11px から 14px に */}
        <div className="hidden sm:flex px-4 py-2 bg-slate-50 border-t border-slate-200 text-sm text-slate-600 items-center justify-between">
            <div className="flex gap-4">
              <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">↑↓</kbd> {locale === 'ja' ? '選択' : 'Select'}</span>
              <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">↵</kbd> {locale === 'ja' ? '移動' : 'Go'}</span>
            </div>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">Cmd + K</kbd> {locale === 'ja' ? 'トグル' : 'Toggle'}</span>
        </div>
      </div>
    </div>
  );
}

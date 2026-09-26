'use client';

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
 * 背景の暗幕を押したら閉じる。キーボードでは Esc で閉じられるので、暗幕にキー操作は持たせない。
 * 中身の onClick は暗幕へのクリックの伝わりを止めているだけ
 */

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { Dropdown } from '@/components/common/Dropdown';
import { SELECTED } from '@/components/common/tones';
import { useFocusTrap } from '@/components/common/useFocusTrap';
import { searchNormalize } from '@/utils/searchNormalize';
// 型だけを取る。compare.ts は src/data の JSON を読むので値は import しない
import type { CompareHero, CompareLocale, RoleId } from '@/lib/compare';

/**
 * 比較する1体を選ぶ画面。名前（よみ・英語名も可）で検索し、ロールで絞れる。
 *
 * 枠ごとに開き直す（呼び出し側が key に枠番号を渡す）。1体目を選ぶと2体目の枠へ
 * 切り替わるが、そのとき検索語と絞り込みが前の枠のまま残らないようにするため。
 * 絞り込みはURLに載せない。共有したいのは「誰と誰か」であって、選ぶ途中の条件ではない。
 *
 * 開いたときの焦点は検索欄ではなくダイアログ自体に置く。スマホで検索欄に置くと
 * キーボードが開いて一覧が隠れる。一覧から顔で選ぶ人のほうが多い想定。
 */

type RoleFilter = 'all' | RoleId;

const ROLE_ORDER: RoleId[] = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

export const ROLE_LABEL: Record<RoleId, Record<CompareLocale, string>> = {
  Tank: { ja: 'タンク', en: 'Tank' },
  Fighter: { ja: 'ファイター', en: 'Fighter' },
  Assassin: { ja: 'アサシン', en: 'Assassin' },
  Mage: { ja: 'メイジ', en: 'Mage' },
  Marksman: { ja: 'マークスマン', en: 'Marksman' },
  Support: { ja: 'サポート', en: 'Support' },
};

/**
 * 名前を本体と括弧書きに分ける（「元流の子（サポート）」→「元流の子」「（サポート）」）。
 * 14px で1マスに1行では入らず、素直に折ると「元流の子（サ／ポート）」のように語の途中で切れる。
 * 括弧書きは2行目に分けて出す（ヒーロー一覧の splitName と同じ規則）
 */
export const splitName = (name: string): [string, string | null] => {
  const m = name.match(/^(.+?)\s*([（(][^（()）]+[）)])$/);
  return m ? [m[1], m[2]] : [name, null];
};

type Props = {
  locale: CompareLocale;
  heroes: CompareHero[];
  /** 選んでいる枠（0 = 1体目） */
  slot: 0 | 1;
  /** この枠に今入っているヒーロー */
  current: string | null;
  /** もう一方の枠に入っているヒーロー。同じヒーロー同士は比べられないので押せなくする */
  taken: string | null;
  onPick: (slug: string) => void;
  onClear: () => void;
  onClose: () => void;
};

export function HeroPickerDialog({ locale, heroes, slot, current, taken, onPick, onClear, onClose }: Props) {
  const ja = locale === 'ja';
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<RoleFilter>('all');
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const { onKeyDown: trapKeyDown } = useFocusTrap(panelRef, true);

  // 開いているあいだは裏のページを動かさない。一覧の終わりまで指で送ったとき、
  // 勢いで下のページまで流れると、閉じたときに表の位置が変わっている
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  const list = useMemo(() => {
    const q = searchNormalize(query);
    return heroes.filter((h) => (role === 'all' || h.roles.includes(role)) && (!q || h.search.includes(q)));
  }, [heroes, query, role]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // プルダウンが開いているときの Esc はプルダウンが先に受けて閉じる（defaultPrevented になる）
    if (e.key === 'Escape' && !e.defaultPrevented) {
      e.preventDefault();
      onClose();
      return;
    }
    trapKeyDown(e);
  };

  const title = ja ? `${slot + 1}体目を選ぶ` : `Pick hero ${slot + 1}`;
  // スマホは高さを固定する（h-[85dvh]）。中身に合わせると、1文字打つたびに
  // 候補の数で板の高さが変わり、検索欄が上下に跳ねる
  const filtered = query !== '' || role !== 'all';

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onClick={(e) => e.stopPropagation()}
        // 暗い地では影が見えないので、板の縁は線で出す
        className="flex h-[85dvh] w-full flex-col rounded-t-3xl border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] outline-none md:h-auto md:max-h-[80vh] md:max-w-2xl md:rounded-3xl md:border md:pb-0"
      >
        <div className="flex items-center justify-between gap-2 pt-2 pr-2 pl-4">
          <h2 id={titleId} className="text-lg font-black text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={ja ? '閉じる' : 'Close'}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="flex gap-2 px-4 pt-1">
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500"
            />
            {/* スマホは16px。iPhone は16px未満の入力欄を押すと画面を拡大する */}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={ja ? 'ヒーローを名前で検索' : 'Search heroes by name'}
              placeholder={ja ? '名前・よみ・英語名' : 'Hero name'}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-base font-bold text-slate-800 outline-none placeholder:text-slate-500 focus:border-brand-500 md:text-sm"
            />
          </div>
          {/* アイコンは付けない。幅144pxにアイコンを入れると文字の幅が66pxしか残らず、選んだ
              「ファイター」（70px）「マークスマン」（84px）「Marksman」（72px）が省略された。
              外すと94px。幅を広げるほうは、左の検索欄の「名前・よみ・英語名」が390pxでも切れるので採らない */}
          <Dropdown
            label={ja ? 'ロール' : 'Role'}
            className="w-36 shrink-0"
            options={[
              { value: 'all' as RoleFilter, label: ja ? '全ロール' : 'All roles' },
              ...ROLE_ORDER.map((r) => ({ value: r as RoleFilter, label: ROLE_LABEL[r][locale] })),
            ]}
            value={role}
            defaultValue="all"
            onChange={setRole}
          />
        </div>

        {/* 件数は絞っているときだけ出す。絞っていないときの総数は読む人の判断に使わない */}
        <p aria-live="polite" className="min-h-7 px-4 pt-2 text-sm font-bold text-slate-600">
          {filtered && list.length > 0 ? (ja ? `${list.length}体` : `${list.length} heroes`) : ''}
        </p>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pt-1 pb-3">
          {list.length === 0 ? (
            <p className="px-2 py-10 text-center text-sm font-bold text-slate-600">
              {ja ? '該当するヒーローがいません' : 'No heroes match'}
            </p>
          ) : (
            // 名前は 14px。1マスの文字幅は 390px で約86px（6字）あり、6字を超える
            // 「マルコ・ポーロ」「フロレンティーノ」だけが省略になる（ヒーロー一覧と同じ扱い）
            <ul className="grid grid-cols-4 gap-x-1 gap-y-1.5 sm:grid-cols-6">
              {list.map((hero) => {
                const isCurrent = hero.slug === current;
                const isTaken = hero.slug === taken;
                const [base, qualifier] = splitName(hero.name);
                return (
                  <li key={hero.slug} className="flex">
                    {/* この枠で選択中のヒーローは、ほかの選択中と同じ金の線と淡い塗り */}
                    <button
                      type="button"
                      onClick={() => onPick(hero.slug)}
                      disabled={isTaken}
                      className={`flex w-full flex-col items-center gap-1 rounded-xl border px-0.5 py-1.5 transition-colors ${
                        isCurrent ? SELECTED : 'border-transparent'
                      } ${isTaken ? 'cursor-not-allowed opacity-40' : isCurrent ? '' : 'hover:bg-slate-100'}`}
                    >
                      <Image
                        src={hero.image}
                        alt=""
                        width={48}
                        height={48}
                        className={`h-12 w-12 rounded-xl bg-slate-100 object-cover ring-1 ${
                          isCurrent ? 'ring-brand-500' : 'ring-slate-200'
                        }`}
                      />
                      <span
                        className={`w-full text-center text-sm leading-tight ${
                          isCurrent ? 'font-black text-brand-700' : 'font-bold text-slate-700'
                        }`}
                      >
                        <span className={`block ${ja ? 'truncate' : 'line-clamp-2 break-words'}`}>{base}</span>
                        {qualifier && <span className="block truncate">{qualifier}</span>}
                        {isCurrent && <span className="sr-only">{ja ? '（この枠で選択中）' : ' (in this slot)'}</span>}
                        {isTaken && <span className="sr-only">{ja ? '（もう一方の枠で選択中）' : ' (in the other slot)'}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {current && (
          <div className="border-t border-slate-100 px-4 py-2">
            <button
              type="button"
              onClick={onClear}
              className="h-11 rounded-xl px-3 text-sm font-bold text-slate-700 underline underline-offset-2 hover:bg-slate-100"
            >
              {ja ? 'この枠を空にする' : 'Clear this slot'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

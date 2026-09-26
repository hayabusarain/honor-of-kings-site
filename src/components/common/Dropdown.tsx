'use client';

/**
 * アイコン付きのプルダウン（単一選択・複数選択）。
 *
 * 標準の <select> は選択肢にアイコンを出せず、iPhone では文字が16px未満だと
 * 押した瞬間に画面が拡大される。そこで button ＋ listbox で自作した。
 * 絞り込みのボタンを縦に何段も並べていたのを、1段のプルダウンにまとめるための部品。
 * MLBB Hub の同名の部品（2026-09-24）を HoK に写した（2026-09-25）。2026-09-26 から夜の配色（墨）の上で使っている。
 *
 * 配色: 既定の値から変えたときは brand-700 の線だけで示し、塗らない
 * （AGENTS.md「金は線が既定、塗りは Tier S だけ」）。選んでいる行は明るい文字（slate-900）とチェックで示す。
 *
 * 操作:
 *   押す / Enter / Space / ↓ で開く。↑↓ Home End で移動、Enter か Space で選ぶ。
 *   Esc と外側のタップで閉じる。単一選択は選んだら閉じ、複数選択は開いたまま。
 * 画面の右端や下端に近いときは、左右・上下を反転して開く。
 */
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type DropdownOption<T extends string | number> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type Common<T extends string | number> = {
  /** 何を選ぶプルダウンか。読み上げとボタンの title に使う（例: ランク帯） */
  label: string;
  options: DropdownOption<T>[];
  /** ボタンの左に出す既定のアイコン。選んだ選択肢にアイコンがあればそちらを出す */
  icon?: ReactNode;
  className?: string;
};

type SingleProps<T extends string | number> = Common<T> & {
  multiple?: false;
  value: T;
  onChange: (value: T) => void;
  /** これ以外を選んでいるときにボタンを金の縁で目立たせる（既定の値） */
  defaultValue?: T;
};

type MultiProps<T extends string | number> = Common<T> & {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
  /** 何も選んでいないときの表示（例: 全ロール）。一覧の先頭にも「すべて」として出す */
  allLabel: string;
};

export type DropdownProps<T extends string | number> = SingleProps<T> | MultiProps<T>;

const ITEM_H = 44;

export function Dropdown<T extends string | number>(props: DropdownProps<T>) {
  const { label, options, icon, className = '' } = props;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState<{ right: boolean; up: boolean; maxHeight?: number }>({ right: false, up: false });
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  const multiple = props.multiple === true;
  const selected: T[] = multiple ? (props as MultiProps<T>).value : [(props as SingleProps<T>).value];
  /** 複数選択の直近の結果。同じ描画のうちに続けて押されても、前の選択を消さずに積む */
  const latest = useRef<T[]>(selected);
  useEffect(() => {
    latest.current = selected;
  });
  /** 複数選択は先頭に「すべて」を置く。行の番号は -1 */
  const rows: { value: T | null; label: string; icon?: ReactNode }[] = multiple
    ? [{ value: null, label: (props as MultiProps<T>).allLabel }, ...options]
    : options;

  const isSelected = (v: T | null) => (v === null ? selected.length === 0 : selected.includes(v));

  /* ボタンの中身 */
  let text: string;
  let shownIcon: ReactNode = icon;
  if (multiple) {
    const picked = options.filter((o) => selected.includes(o.value));
    if (picked.length === 0) text = (props as MultiProps<T>).allLabel;
    else if (picked.length === 1) {
      text = picked[0].label;
      shownIcon = picked[0].icon ?? icon;
    } else text = picked.map((o) => o.label).join('・');
  } else {
    const cur = options.find((o) => o.value === (props as SingleProps<T>).value);
    text = cur?.label ?? '';
    shownIcon = cur?.icon ?? icon;
  }
  const changed = multiple
    ? selected.length > 0
    : (props as SingleProps<T>).defaultValue !== undefined && (props as SingleProps<T>).value !== (props as SingleProps<T>).defaultValue;

  const close = useCallback((focusButton: boolean) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  }, []);

  const openList = () => {
    const r = buttonRef.current?.getBoundingClientRect();
    if (r) {
      // スマホ（md 未満）は上に AppBar（56px）、下に TabBar（66px）がある。
      // 以前は一覧の高さを 60vh で頭打ちにする前の値で上下を決め、下の余白も見ていなかったので、
      // 12項目の一覧が TabBar の裏へ 67px 潜っていた（390px、2026-09-25 の検証で実測）
      const mobile = window.innerWidth < 768;
      const want = Math.min(rows.length * ITEM_H + 16, window.innerHeight * 0.6);
      const below = (mobile ? window.innerHeight - 76 : window.innerHeight - 8) - r.bottom - 8;
      const above = r.top - 8 - (mobile ? 64 : 8);
      const up = want > below && above > below;
      setPlacement({
        right: r.left + 260 > window.innerWidth - 8,
        up,
        // 入りきらないときは一覧の中をスクロールさせる。最低でも3行は見せる
        maxHeight: Math.max(ITEM_H * 3 + 16, Math.min(want, up ? above : below)),
      });
    }
    const first = rows.findIndex((row) => isSelected(row.value));
    setActive(first < 0 ? 0 : first);
    setOpen(true);
  };

  /* 外側を押したら閉じる */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, close]);

  /* 開いたら一覧に焦点を移す */
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const choose = (v: T | null) => {
    if (multiple) {
      const p = props as MultiProps<T>;
      const cur = latest.current;
      // 押した順ではなく options の並びに戻す。同じ選択なら常に同じ並びになる
      const next = v === null ? [] : options.map((o) => o.value).filter((x) => (x === v ? !cur.includes(v) : cur.includes(x)));
      latest.current = next;
      p.onChange(next);
    } else {
      if (v !== null) (props as SingleProps<T>).onChange(v);
      close(true);
    }
  };

  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((i) => Math.min(rows.length - 1, i + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(rows.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(rows[active].value);
        break;
      case 'Escape':
        e.preventDefault();
        close(true);
        break;
      case 'Tab':
        close(false);
        break;
    }
  };

  const onButtonKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openList();
    }
  };

  const listId = `${id}-list`;
  const optionId = (i: number) => `${id}-opt-${i}`;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${text}`}
        title={label}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onButtonKey}
        className={`flex h-11 w-full items-center gap-2 rounded-xl border px-3 text-left text-sm font-bold transition-colors ${
          changed
            ? 'border-brand-700 bg-white text-slate-900'
            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
        } ${open ? 'ring-2 ring-slate-300' : ''}`}
      >
        {shownIcon && <span className="flex h-5 w-5 shrink-0 items-center justify-center">{shownIcon}</span>}
        <span className="min-w-0 flex-1 truncate">{text}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-multiselectable={multiple || undefined}
          aria-activedescendant={optionId(active)}
          onKeyDown={onListKey}
          style={{ maxHeight: placement.maxHeight }}
          className={`absolute z-30 max-h-[60vh] min-w-full w-max max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/15 outline-none ${
            placement.right ? 'right-0' : 'left-0'
          } ${placement.up ? 'bottom-full mb-2' : 'top-full mt-2'}`}
        >
          {rows.map((row, i) => {
            const on = isSelected(row.value);
            return (
              // キーボードは親の ul が受ける（aria-activedescendant の listbox）。行ごとには持たせない
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <li
                key={String(row.value ?? '__all')}
                id={optionId(i)}
                role="option"
                aria-selected={on}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(row.value)}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-base font-bold ${
                  i === active ? 'bg-slate-100' : ''
                } ${on ? 'text-slate-900' : 'text-slate-600'}`}
              >
                {row.icon && <span className="flex h-6 w-6 shrink-0 items-center justify-center">{row.icon}</span>}
                <span className="flex-1 whitespace-nowrap">{row.label}</span>
                <Check className={`h-4 w-4 shrink-0 ${on ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

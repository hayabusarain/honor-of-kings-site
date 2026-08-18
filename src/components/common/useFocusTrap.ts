'use client';

import { useLayoutEffect, useRef, type KeyboardEvent, type RefObject } from 'react';

/**
 * モーダル／ドロワー用のフォーカス管理をまとめた hook。
 *
 * 検索モーダルとアイテム詳細ドロワーが同じ処理を別々に持っていたため、ここに集約した。
 * 役割は2つ。
 *   1. 開いた瞬間にフォーカス元を覚えて container（または initialFocusRef）へ移し、
 *      閉じたら元の要素へ戻す。復帰先がページ遷移などで DOM から消えていれば何もしない
 *   2. Tab / Shift+Tab を container 内の focusable 要素で循環させる onKeyDown を返す
 *
 * useLayoutEffect なのは、開くクリックと同じタスク内で focus() を呼ばないと
 * iOS Safari がソフトキーボードを出さないことがあるため（input へ移す用途がある）。
 * 呼び出し側は、閉じているときに container を描画しなくてよい（ref が null でも動く）。
 */
export function useFocusTrap<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  isOpen: boolean,
  options: { initialFocusRef?: RefObject<HTMLElement | null> } = {}
) {
  const { initialFocusRef } = options;
  // 閉じたときにフォーカスを戻す先（開く直前にフォーカスされていた要素）
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 依存に ref オブジェクトを入れているが、useRef の戻り値は同一なので実質 isOpen でしか動かない。
  // 開いたまま中身が切り替わる（アイテム詳細ドロワーで別アイテムへ移る）ケースで
  // 復帰先を上書きしないため、isOpen 以外の値に依存させないこと
  useLayoutEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const target = initialFocusRef?.current ?? containerRef.current;
    target?.focus();
    return () => {
      // ページ遷移などで復帰先が DOM から消えていたら何もしない
      const prev = previousFocusRef.current;
      if (prev && prev.isConnected) prev.focus();
    };
  }, [isOpen, containerRef, initialFocusRef]);

  // 矢印キーや Enter は呼び出し側の input が扱うので、ここでは Tab だけ見る
  const onKeyDown = (e: KeyboardEvent<T>) => {
    if (e.key !== 'Tab') return;
    // IME 変換中の Tab（候補選択に使う IME がある）を奪わない
    if (e.nativeEvent.isComposing) return;
    const container = containerRef.current;
    if (!container) return;
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    // container 自体（tabIndex=-1）にフォーカスがある状態からの後退も末尾へ回す
    if (e.shiftKey && (active === first || active === container)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return { onKeyDown };
}

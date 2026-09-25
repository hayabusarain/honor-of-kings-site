'use client';

import { useEffect } from 'react';
import { glossaryAnchor } from './anchor';

// 語の行の id の頭（term-）。形は anchor.ts が決める
const PREFIX = glossaryAnchor('');

/**
 * URL の #term-… が指す語の行に data-current を付ける。page.tsx は data-current: で金の線を引く。
 *
 * 以前は CSS の :target で線を引いていた。:target が付くのはアドレスバーから開いたときだけで、
 * /guide のチップや横断検索から来たときは線が出なかった（どちらも history.pushState で移るため）。
 * そこで URL のハッシュを読んで印を付け直す。何も描かないので、初期HTMLとハイドレーションには関わらない。
 *
 * 付け直す契機は3つ。
 *   - マウント時: 直接開いたときと、別のページから移ってきたとき
 *   - スクロール: このページにいるまま検索で別の語を選ぶと pushState しか起きず、popstate も
 *     hashchange も鳴らない。飛んだ先へのスクロールは必ず起きるので、そこでハッシュを見比べる
 *     （戻る・進むとアドレスバーでの書き換えも、スクロールを伴うのでここで拾える）
 *   - Navigation API の currententrychange: 使えるブラウザでは、スクロールが起きない移動も拾う
 */
export function CurrentTermMark() {
  useEffect(() => {
    let marked: HTMLElement | null = null;
    let lastHash: string | null = null;
    let frame = 0;

    const sync = () => {
      frame = 0;
      const hash = window.location.hash;
      if (hash === lastHash) return;
      lastHash = hash;
      const id = hash.slice(1);
      const el = id.startsWith(PREFIX) ? document.getElementById(id) : null;
      if (el === marked) return;
      marked?.removeAttribute('data-current');
      el?.setAttribute('data-current', '');
      marked = el;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener('scroll', schedule, { passive: true });
    const nav = (window as Window & { navigation?: EventTarget }).navigation;
    nav?.addEventListener('currententrychange', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      nav?.removeEventListener('currententrychange', schedule);
      if (frame) cancelAnimationFrame(frame);
      marked?.removeAttribute('data-current');
    };
  }, []);

  return null;
}

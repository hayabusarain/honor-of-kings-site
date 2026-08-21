'use client';

import { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

// ヒーロー詳細・Tier表・パッチノートに置く共有ボタン。
// OG/Twitterカードは buildPageMetadata で全ページ整備済みなのに、
// 共有を起こすUIが無かった。モバイルはOSの共有シート（navigator.share）、
// 非対応環境はXへの投稿とURLコピーの2択ポップオーバーにフォールバックする。
export function ShareButton({ title, className = '' }: { title: string; className?: string }) {
  const locale = useLocale();
  const ja = locale === 'ja';
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 外側クリック・ESC で閉じる。ESC のときはトリガーへフォーカスを戻す
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleClick = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (e) {
        // ユーザーが共有シートを閉じただけ（AbortError）なら何もしない。
        // それ以外の失敗（権限・未対応の URL 等）はポップオーバーへ落とす
        if (e instanceof DOMException && e.name === 'AbortError') return;
      }
    }
    setOpen(v => !v);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1200);
    } catch {
      // クリップボードが使えない環境ではポップオーバーを開いたままにする
    }
  };

  const postToX = () => {
    const intent = new URL('https://x.com/intent/post');
    intent.searchParams.set('text', title);
    intent.searchParams.set('url', window.location.href);
    window.open(intent.toString(), '_blank', 'noopener');
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      // ポップオーバーの基準にするため既定は relative。ただし呼び出し側が
      // absolute を渡すことがあり、素朴に連結すると Tailwind の出力順で
      // relative が勝って配置が効かなくなる（ヒーロー詳細で実際に起きた）。
      // cn（tailwind-merge）は同じ種類の指定を後勝ちで1つに畳む
      className={cn('relative', className)}
      // Tab でポップオーバーの外へ出たら閉じる（React の onBlur は focusout 相当でバブルする）
      onBlur={e => {
        if (open && ref.current && !ref.current.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        onClick={handleClick}
        aria-label={ja ? 'このページを共有' : 'Share this page'}
        aria-expanded={open}
        className="flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-brand-500"
      >
        <Share2 size={14} />
        <span>{ja ? '共有' : 'Share'}</span>
      </button>
      {/* コピー完了をスクリーンリーダーにも伝える */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? (ja ? 'URLをコピーしました' : 'URL copied') : ''}
      </span>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-40 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5">
          <button
            onClick={postToX}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink size={13} />
            <span>{ja ? 'Xに投稿' : 'Post to X'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copied ? (ja ? 'コピーしました' : 'Copied') : (ja ? 'URLをコピー' : 'Copy URL')}</span>
          </button>
        </div>
      )}
    </div>
  );
}

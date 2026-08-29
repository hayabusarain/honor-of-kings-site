'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

/**
 * 同意画面をもう一度開くためのリンク。
 *
 * Google の CMP（Funding Choices）が読み込まれ、同意データが利用できるときだけ表示する。
 * 同意を求めない地域では CMP 自体が動かないため、このリンクも出ない。
 * プライバシーポリシーの記述も「同意画面が出た場合はフッターに表示される」という
 * 書き方に揃えてあるので、出ない地域でも記述と実態がずれない。
 *
 * 注意: showRevocationMessage は CMP が配信されて初めて呼べる。
 * AdSense 管理画面で GDPR メッセージを作成・公開するまでは、この導線は表示されない。
 */

type GoogleFc = {
  callbackQueue?: unknown[];
  showRevocationMessage?: () => void;
};

export function PrivacySettingsLink({ className }: { className?: string }) {
  const locale = useLocale();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // CMP のスクリプトは afterInteractive で後から載るため、この時点では
    // googlefc がまだ無い。以前は無ければ早期 return していたが、それだと
    // 後から載っても気づけず、同意撤回の導線が一度も出なかった。
    // Funding Choices の作法どおり、無ければ器を先に作ってキューに積む
    const w = window as unknown as { googlefc?: GoogleFc };
    const fc: GoogleFc = w.googlefc || (w.googlefc = {});
    fc.callbackQueue = fc.callbackQueue || [];
    fc.callbackQueue.push({
      CONSENT_DATA_READY: () => {
        // 撤回用の画面を持っている場合だけ導線を出す
        if (typeof w.googlefc?.showRevocationMessage === 'function') setReady(true);
      },
    });
  }, []);

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={() => {
        (window as unknown as { googlefc?: GoogleFc }).googlefc?.showRevocationMessage?.();
      }}
      className={className}
    >
      {locale === 'ja' ? 'プライバシー設定' : 'Privacy settings'}
    </button>
  );
}

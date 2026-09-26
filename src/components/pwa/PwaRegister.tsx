'use client';

import { useEffect } from 'react';
import { PwaInstallBanner } from './PwaInstallBanner';
import { withBasePath } from '@/lib/basePath';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // 登録成功のログは出さない。全ページ共通レイアウトから読むため、
      // 本番の全訪問者のコンソールに毎回出ていた
      navigator.serviceWorker
        // 統合後は /hok/sw.js を範囲 /hok/ で登録する。範囲を / にすると、同じドメインのポータルや MLBB まで支配下に入る
        .register(withBasePath('/sw.js'), { scope: withBasePath('/') })
        .catch((err) => console.warn('PWA ServiceWorker registration failed:', err));
    }
  }, []);

  return <PwaInstallBanner />;
}

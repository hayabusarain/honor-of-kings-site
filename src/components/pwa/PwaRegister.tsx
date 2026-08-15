'use client';

import { useEffect } from 'react';
import { PwaInstallBanner } from './PwaInstallBanner';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // 登録成功のログは出さない。全ページ共通レイアウトから読むため、
      // 本番の全訪問者のコンソールに毎回出ていた
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.warn('PWA ServiceWorker registration failed:', err));
    }
  }, []);

  return <PwaInstallBanner />;
}

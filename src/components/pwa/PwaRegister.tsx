'use client';

import { useEffect } from 'react';
import { PwaInstallBanner } from './PwaInstallBanner';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA ServiceWorker registered:', reg.scope))
        .catch((err) => console.warn('PWA ServiceWorker registration failed:', err));
    }
  }, []);

  return <PwaInstallBanner />;
}

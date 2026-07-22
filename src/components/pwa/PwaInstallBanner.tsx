'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare } from 'lucide-react';
import { useLocale } from 'next-intl';

export function PwaInstallBanner() {
  const locale = useLocale();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check standalone mode
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    
    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Check dismissal history
    const dismissed = localStorage.getItem('hok_pwa_banner_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Suppress for 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    setIsIos(ios);

    if (ios) {
      // Show iOS banner after 3 seconds
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt (Android / Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setShowIosGuide(false);
    localStorage.setItem('hok_pwa_banner_dismissed', Date.now().toString());
  };

  if (isStandalone || !isVisible) return null;

  return (
    <>
      {/* Floating Bottom Installation Banner */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:w-96 bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-indigo-500/30 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shrink-0 shadow-md">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                {locale === 'ja' ? 'HoK Hub アプリを追加' : 'Install HoK Hub App'}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                {locale === 'ja'
                  ? 'ホーム画面に追加してフルスクリーンで快適アクセス'
                  : 'Add to home screen for full-screen fast access'}
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Download size={15} />
            <span>{locale === 'ja' ? 'アプリとして追加' : 'Add to Home Screen'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            {locale === 'ja' ? 'あとで' : 'Later'}
          </button>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Smartphone className="text-indigo-400" size={20} />
                <span>{locale === 'ja' ? 'iOSでの追加手順' : 'iOS Installation Guide'}</span>
              </h3>
              <button
                onClick={() => setShowIosGuide(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-100 mb-1 flex items-center gap-1.5">
                    Safari画面下の <Share size={15} className="text-blue-400 inline" /> 「共有」
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {locale === 'ja' ? '画面下部の中央にある共有アイコンをタップします。' : 'Tap the Share icon at the bottom of Safari.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-100 mb-1 flex items-center gap-1.5">
                    <PlusSquare size={15} className="text-emerald-400 inline" /> 「ホーム画面に追加」
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {locale === 'ja' ? 'メニューをスクロールして「ホーム画面に追加」を選択します。' : 'Scroll down and select "Add to Home Screen".'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="mt-5 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 rounded-xl transition-colors"
            >
              {locale === 'ja' ? '閉じる' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

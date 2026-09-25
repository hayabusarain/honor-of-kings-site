'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Smartphone, Download, X, Share, PlusSquare } from 'lucide-react';
import { useLocale } from 'next-intl';

type InstallPromptEvent = Event & { prompt: () => void, userChoice: Promise<{ outcome: string }> };

// 案内を出すのは、この訪問で3ページ目を開いてから。
// 以前は初めて来た人にも3秒後に出していて、スマホでは読み始めた本文の下半分を覆っていた。
// 数えるのは sessionStorage で、タブを閉じれば消える（どこにも送らない）
const MIN_PAGE_VIEWS = 3;
const PAGE_VIEWS_KEY = 'hok_pwa_page_views';

export function PwaInstallBanner() {
  const locale = useLocale();
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  // null のあいだは出さない。出すと決めたら iOS かどうかも一緒に持つ
  // （navigator はレンダー中に読めない。読むと SSR の HTML と食い違う）
  const [banner, setBanner] = useState<{ ios: boolean } | null>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);

  // Android / Chrome の beforeinstallprompt はページの読み込み直後に1回しか来ない。
  // 3ページ目まで待ってから受け口を作ると取り逃すので、受け取りだけは最初から行う
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // ページを開くたびに数え、3ページ目から案内を出す
  useEffect(() => {
    let views = 0;
    try {
      views = Number(sessionStorage.getItem(PAGE_VIEWS_KEY) || '0') + 1;
      sessionStorage.setItem(PAGE_VIEWS_KEY, String(views));
    } catch {
      // 数えられない環境では出さない
      return;
    }
    if (views < MIN_PAGE_VIEWS) return;

    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandaloneMode) return;

    // サイトデータを拒否している環境では投げるので、読めなければ
    // 「閉じた履歴なし」として続ける（TabBar と同じ扱い）
    let dismissed: string | null = null;
    try {
      dismissed = localStorage.getItem('hok_pwa_banner_dismissed');
    } catch {
      dismissed = null;
    }
    // 閉じたら7日間は出さない
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 7 * 24 * 60 * 60 * 1000) return;

    const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    // 開いた直後に被せず、読み始めてから出す
    const timer = setTimeout(() => setBanner({ ios }), 3000);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleInstallClick = async () => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setBanner(null);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setBanner(null);
    setShowIosGuide(false);
    try {
      localStorage.setItem('hok_pwa_banner_dismissed', Date.now().toString());
    } catch {
      // 保存できなくても、この場で閉じる動作は成立する
    }
  };

  // Android では、ブラウザが追加を受け付ける状態（beforeinstallprompt が来た）でなければ出さない
  if (!banner || (!banner.ios && !deferredPrompt)) return null;

  return (
    <>
      {/* Floating Bottom Installation Banner */}
      {/* 下に固定の帯があるページ（アルカナ計算機の集計帯）では、その高さぶん上へ逃がす。
          --hok-bottom-bar は globals.css が [data-bottom-bar] の有無から決める */}
      <div className="fixed bottom-[calc(80px+var(--hok-bottom-bar,0px)+env(safe-area-inset-bottom,0px))] left-4 right-4 z-[65] md:bottom-[calc(24px+var(--hok-bottom-bar,0px))] md:left-auto md:right-6 md:w-96 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-brand-500/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center shrink-0 shadow-md">
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
            className="flex-1 bg-gradient-to-r from-brand-700 to-blue-600 hover:from-brand-800 hover:to-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
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
        <div className="fixed inset-0 z-[80] bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Smartphone className="text-brand-400" size={20} />
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
                <div className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold shrink-0">
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
                <div className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold shrink-0">
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

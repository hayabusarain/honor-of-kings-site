'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    // Check if the user has already accepted cookies
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const content = locale === 'en' ? {
    message: "We use cookies to personalize content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you've provided to them or that they've collected from your use of their services.",
    privacyLink: "Privacy Policy",
    acceptButton: "Accept"
  } : {
    message: "当サイトでは、サービスの提供や利用状況の分析、広告配信のためにクッキー（Cookie）を使用しています。本サイトをご利用いただくことで、Cookieの使用に同意したものとみなされます。詳細についてはプライバシーポリシーをご確認ください。",
    privacyLink: "プライバシーポリシー",
    acceptButton: "同意する"
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-700 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-slate-300 leading-relaxed max-w-5xl">
        {content.message}{' '}
        <a href={`/${locale}/privacy`} className="text-blue-400 hover:text-blue-300 underline underline-offset-2 ml-1">
          {content.privacyLink}
        </a>
      </div>
      <button 
        onClick={handleAccept}
        className="shrink-0 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/50"
      >
        {content.acceptButton}
      </button>
    </div>
  );
}

'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Home, Users, Trophy, FileText } from 'lucide-react';

// カスタム404。デフォルトの英語のみ・ナビ無し404は
// ユーザーを行き止まりにし、AdSense審査でも印象が悪いため差し替え
export default function NotFound() {
  const locale = useLocale();
  const isJa = locale === 'ja';

  const links = [
    { href: '/', icon: Home, label: isJa ? 'ホーム' : 'Home' },
    { href: '/heroes', icon: Users, label: isJa ? 'ヒーロー一覧' : 'Heroes' },
    { href: '/tier-list', icon: Trophy, label: isJa ? 'Tier表' : 'Tier List' },
    { href: '/patches', icon: FileText, label: isJa ? 'パッチノート' : 'Patch Notes' },
  ] as const;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 pt-14 md:pt-16">
      <div className="text-center max-w-md">
        <p className="text-7xl font-black text-brand-200 mb-4">404</p>
        <h1 className="text-2xl font-black text-slate-800 mb-3">
          {isJa ? 'ページが見つかりません' : 'Page Not Found'}
        </h1>
        <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
          {isJa
            ? 'お探しのページは移動または削除された可能性があります。以下のリンクからお探しください。'
            : 'The page you are looking for may have been moved or removed. Try one of the links below.'}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {links.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-brand-300 hover:text-brand-600 shadow-sm transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

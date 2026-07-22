'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AmazonProductCard } from './AmazonProductCard';

export function CollapsibleAdBanner() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 pt-3 pb-1 transition-all duration-300">
      <div className="relative">
        <AmazonProductCard />
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors shadow-xs z-10"
          aria-label="閉じる"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon, Laptop } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}>
      <button
        onClick={() => setTheme('light')}
        title="Light Mode"
        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
          theme === 'light'
            ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-xs'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <Sun size={15} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        title="Dark Mode"
        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
          theme === 'dark'
            ? 'bg-slate-900 text-indigo-400 shadow-xs'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <Moon size={15} />
      </button>
      <button
        onClick={() => setTheme('system')}
        title="System Preference"
        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
          theme === 'system'
            ? 'bg-white dark:bg-slate-700 text-blue-500 shadow-xs'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <Laptop size={15} />
      </button>
    </div>
  );
}

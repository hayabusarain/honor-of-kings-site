'use client';

import { createContext, useContext, useEffect } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    // サイトデータを拒否している環境（プライベートモード等）では setItem が投げる。
    // このコンポーネントは layout から全ページを包んでいるので、投げると
    // [locale]/error.tsx では受けられず global-error まで上がってページごと落ちる
    try {
      localStorage.setItem('theme', 'light');
    } catch {
      // 保存できなくても light 固定なので表示に影響しない
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {}, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

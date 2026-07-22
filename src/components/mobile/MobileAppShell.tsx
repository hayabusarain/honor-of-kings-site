"use client";

import { useState } from "react";
import { TabBar } from "./TabBar";
import { AppBar } from "./AppBar";
import { Sidebar } from "../layout/Sidebar";
import { Footer } from "../layout/Footer";
import { ThemeProvider } from "../theme/ThemeProvider";
import { GlobalSearchModal } from "../search/GlobalSearchModal";
import { CollapsibleAdBanner } from "../common/CollapsibleAdBanner";

interface MobileAppShellProps {
  children: React.ReactNode;
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex w-full mx-auto min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
          <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative w-full overflow-x-hidden md:pl-64">
          {/* Mobile App Bar */}
          <div className="md:hidden">
            <AppBar onOpenSearch={() => setIsSearchOpen(true)} />
          </div>
          
          <main className="flex-1 flex flex-col pb-20 md:pb-0">
            {/* Header Amazon Product Banner (Random) */}
            <CollapsibleAdBanner />

            <div className="flex-1 max-w-7xl mx-auto w-full">
              {children}
            </div>
            <Footer />
          </main>

          {/* Mobile Tab Bar */}
          <div className="md:hidden">
            <TabBar />
          </div>
        </div>

        {/* Global Search Modal */}
        <GlobalSearchModal 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      </div>
    </ThemeProvider>
  );
}

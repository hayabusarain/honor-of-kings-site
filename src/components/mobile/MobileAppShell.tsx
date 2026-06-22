"use client";

import { TabBar } from "./TabBar";
import { AppBar } from "./AppBar";

interface MobileAppShellProps {
  children: React.ReactNode;
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  return (
    <div className="w-full max-w-md mx-auto min-h-[100dvh] flex flex-col relative bg-slate-50 shadow-2xl md:border-x md:border-slate-200 overflow-x-hidden selection:bg-blue-100">
      <AppBar />
      <main className="flex-1 flex flex-col pb-20">
        <div className="flex-1">
          {children}
        </div>
      </main>
      <TabBar />
    </div>
  );
}

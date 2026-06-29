"use client";

import { TabBar } from "./TabBar";
import { AppBar } from "./AppBar";
import { Sidebar } from "../layout/Sidebar";

interface MobileAppShellProps {
  children: React.ReactNode;
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  return (
    <div className="flex w-full mx-auto min-h-[100dvh] bg-slate-50 selection:bg-blue-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-50 bg-white border-r border-slate-200">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full overflow-x-hidden md:pl-64">
        {/* Mobile App Bar */}
        <div className="md:hidden">
          <AppBar />
        </div>
        
        <main className="flex-1 flex flex-col pb-20 md:pb-0">
          <div className="flex-1 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Mobile Tab Bar */}
        <div className="md:hidden">
          <TabBar />
        </div>
      </div>
    </div>
  );
}

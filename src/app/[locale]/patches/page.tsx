'use client';

import { History } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PatchTable } from '@/components/patches/PatchTable';

export default function PatchesPage() {
  const t = useTranslations('PatchTable');

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 sticky top-0 z-20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
          <History className="text-brand-600" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none mb-1">
            Patch Notes
          </h1>
          <p className="text-slate-500 text-[10px] font-bold leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        <PatchTable />
      </div>
    </div>
  );
}

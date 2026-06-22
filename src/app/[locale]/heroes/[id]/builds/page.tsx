import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import heroStats from '@/data/hero_stats.json';
import { BuildList } from '@/components/builds/BuildList';
import { HeroImage } from '@/components/heroes/HeroImage';
import allArcanas from '@/data/hok_arcanas.json';
import allItems from '@/data/hok_items.json';
import allSkills from '@/data/hok_summoners.json';

export default async function HeroBuildsPage({ params }: { params: Promise<{ locale: string; id: string }> | { locale: string; id: string } }) {
  // Await params to support Next.js 15
  const resolvedParams = await params;
  const { locale, id } = resolvedParams;
  const t = await getTranslations('Builds');
  
  if (!id) {
    notFound();
  }
  
  const queryId = id.toLowerCase();
  const hero = (heroStats as any)[queryId] || null;
  
  if (!hero) {
    notFound();
  }

  const heroId = id;
  const heroName = locale === 'ja' 
    ? (hero.hero_name || hero.hero_name_en || id)
    : (hero.hero_name_en || hero.hero_name || id);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/heros/${id}`} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 flex items-center gap-2">
            <ArrowLeft size={20} />
            <span className="text-sm font-bold">{t('backToHero', { name: heroName })}</span>
          </Link>
          <div className="font-black text-slate-800 text-sm">
            {t('title')}
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 sm:p-6 mt-4">
        <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <HeroImage 
            heroId={heroId} 
            heroName={heroName} 
            id={id}
          />
          <div>
            <h1 className="text-2xl font-black text-slate-800">{heroName}</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{heroId}</p>
          </div>
        </div>

        <BuildList 
          heroId={heroId}
          allItems={allItems}
          allArcanas={allArcanas}
          allSkills={allSkills}
        />
      </div>
    </div>
  );
}

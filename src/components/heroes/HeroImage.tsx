'use client';

interface HeroImageProps {
  heroId: string;
  heroName: string;
  id: string; // Original URL ID for fallback
  className?: string;
}

import HOK_HEROES from '@/data/hok_heroes.json';

export function HeroImage({ heroId, heroName, id, className = "w-16 h-16 rounded-full border-2 border-indigo-100 shadow-sm" }: HeroImageProps) {
  const heroImage = (HOK_HEROES as any[]).find(h => h.id === heroId)?.image || `/images/heroes/${heroId}.jpg`;
  return (
    <img 
      src={heroImage} 
      alt={heroName} 
      className={className}
      onError={(e) => { 
        (e.target as HTMLImageElement).src = `/images/heroes/default.png`; 
      }}
    />
  );
}

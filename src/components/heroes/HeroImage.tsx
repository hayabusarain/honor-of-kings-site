'use client';

interface HeroImageProps {
  heroId: string;
  heroName: string;
  className?: string;
}

import Image from 'next/image';
import { HokHero } from '@/types/database';
import HOK_HEROES from '@/data/hok_heroes.json';

export function HeroImage({ heroId, heroName, className = "w-16 h-16 rounded-full border-2 border-brand-100 shadow-sm" }: HeroImageProps) {
  const heroImage = (HOK_HEROES as HokHero[]).find(h => h.id === heroId)?.image || `/images/heroes/${heroId}.jpg`;
  return (
    <Image 
      src={heroImage} 
      alt={heroName} 
      className={className}
      width={64}
      height={64}
      onError={(e) => { 
        (e.target as HTMLImageElement).src = `/images/heroes/default.png`; 
      }}
    />
  );
}

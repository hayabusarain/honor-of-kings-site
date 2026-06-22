'use client';

interface HeroImageProps {
  heroId: string;
  heroName: string;
  id: string; // Original URL ID for fallback
  className?: string;
}

export function HeroImage({ heroId, heroName, id, className = "w-16 h-16 rounded-full border-2 border-indigo-100 shadow-sm" }: HeroImageProps) {
  return (
    <img 
      src={`/images/heroes/${heroId}.jpg`} 
      alt={heroName} 
      className={className}
      onError={(e) => { 
        (e.target as HTMLImageElement).src = `/images/heroes/default.png`; 
      }}
    />
  );
}

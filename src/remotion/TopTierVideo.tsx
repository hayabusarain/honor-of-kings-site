import React, { useMemo } from 'react';
import { AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate, random } from 'remotion';
import topTierData from '../data/top_tier.json';
import { ShadowbanPreventer } from './utils/ShadowbanPreventer';

interface TopTierVideoProps {
  seed?: number;
}

const HeroCard: React.FC<{ hero: any; index: number; seed: number }> = ({ hero, index, seed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Randomize timing slightly to prevent identical videos
  const stagger = 15 + Math.floor(random(`stagger-${seed}-${index}`) * 5); 
  const startFrame = index * stagger;

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const translateY = interpolate(entrance, [0, 1], [500, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const ddName = hero.hero_name_en.replace(/[^a-zA-Z0-9]/g, '');
  const imageUrl = hero.hero_name_en === 'Norra' 
    ? 'http://localhost:3000/images/heros/Norra.avif' // Use public folder route if running Next.js or direct file
    : `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/hero/${ddName}.png`;

  return (
    <div
      style={{
        position: 'absolute',
        top: 300 + index * 220,
        left: 100,
        width: 880,
        height: 180,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderRadius: 40,
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        transform: `translateY(${translateY}px)`,
        opacity,
        border: '4px solid rgba(79, 70, 229, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div style={{ fontSize: 80, fontWeight: 'bold', color: '#fff', marginRight: 40, width: 80 }}>
        {index + 1}
      </div>
      <Img 
        src={imageUrl} 
        style={{ width: 120, height: 120, borderRadius: '50%', border: '4px solid #fff', marginRight: 40 }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 60, fontWeight: '900', color: '#fff' }}>{hero.hero_name}</div>
        <div style={{ fontSize: 40, color: '#94a3b8', fontWeight: 'bold' }}>Win Rate: <span style={{ color: '#34d399' }}>{hero.win_rate}%</span></div>
      </div>
      <div style={{
        fontSize: 70,
        fontWeight: '900',
        color: hero.tier.includes('S') ? '#f59e0b' : '#a855f7',
        backgroundColor: hero.tier.includes('S') ? 'rgba(245, 158, 11, 0.2)' : 'rgba(168, 85, 247, 0.2)',
        padding: '20px 40px',
        borderRadius: 30,
        border: `4px solid ${hero.tier.includes('S') ? '#f59e0b' : '#a855f7'}`
      }}>
        {hero.tier}
      </div>
    </div>
  );
};

export const TopTierVideo: React.FC<TopTierVideoProps> = ({ seed = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle background zoom
  const bgScale = interpolate(frame, [0, 450], [1, 1.1]);
  // Random start offset for background
  const bgOffsetX = (random(`bgX-${seed}`) - 0.5) * 50;
  const bgOffsetY = (random(`bgY-${seed}`) - 0.5) * 50;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden' }}>
      <Img 
        src="https://ddragon.leagueoflegends.com/cdn/img/hero/splash/Darius_0.jpg"
        style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          objectFit: 'cover',
          opacity: 0.3,
          filter: 'blur(10px)',
          transform: `scale(${bgScale}) translate(${bgOffsetX}px, ${bgOffsetY}px)`,
        }}
      />
      
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          marginTop: 120, 
          textAlign: 'center', 
          fontSize: 80, 
          fontWeight: '900', 
          color: '#fff',
          textShadow: '0 10px 20px rgba(0,0,0,0.5)'
        }}>
          CLASHレーン<br/>
          <span style={{ color: '#818cf8', fontSize: 100 }}>最強Tierランキング</span>
        </div>

        {topTierData.slice(0, 5).map((champ, i) => (
          <HeroCard key={champ.hero_name_en} hero={champ} index={i} seed={seed} />
        ))}
      </AbsoluteFill>

      <ShadowbanPreventer seed={seed} />
    </AbsoluteFill>
  );
};

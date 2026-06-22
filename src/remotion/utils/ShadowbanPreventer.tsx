import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, random } from 'remotion';

interface ShadowbanPreventerProps {
  seed: number;
}

export const ShadowbanPreventer: React.FC<ShadowbanPreventerProps> = ({ seed }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate slightly random hue shift based on seed (-3deg to +3deg)
  const hueShift = useMemo(() => (random(`hue-${seed}`) - 0.5) * 6, [seed]);
  
  // Random opacity for a very faint noise overlay (0.5% to 1.5%)
  const baseOpacity = useMemo(() => 0.005 + random(`opacity-${seed}`) * 0.01, [seed]);
  
  // Create a slight jitter for the noise overlay that moves every frame
  const noiseX = (random(`x-${seed}-${frame}`) - 0.5) * 10;
  const noiseY = (random(`y-${seed}-${frame}`) - 0.5) * 10;

  return (
    <>
      <style>
        {`
          .shadowban-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: ${width}px;
            height: ${height}px;
            pointer-events: none;
            mix-blend-mode: overlay;
            filter: hue-rotate(${hueShift}deg);
            z-index: 9999;
          }
        `}
      </style>
      <div className="shadowban-wrapper">
        <svg
          style={{
            position: 'absolute',
            width: '120%',
            height: '120%',
            left: '-10%',
            top: '-10%',
            transform: `translate(${noiseX}px, ${noiseY}px)`,
            opacity: baseOpacity,
          }}
        >
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="1" />
        </svg>
      </div>
    </>
  );
};

import React, { useMemo } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

export function GlobalMap() {
  // Mock attack points
  const attackPoints = useMemo(() => [
    { x: '25%', y: '35%', origin: 'RU', strength: 80 },
    { x: '75%', y: '45%', origin: 'CN', strength: 95 },
    { x: '15%', y: '50%', origin: 'US', strength: 40 },
    { x: '45%', y: '70%', origin: 'BR', strength: 60 },
    { x: '55%', y: '30%', origin: 'EU', strength: 55 },
  ], []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black/40 group">
      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 z-10">
         <div className="flex items-center gap-2 text-[9px] font-mono text-accent font-bold uppercase tracking-widest">
           <Globe className="w-3 h-3 animate-spin-slow" />
           Global_Attack_Vectors
         </div>
      </div>

      {/* Stylized SVG Map */}
      <svg 
        viewBox="0 0 800 400" 
        className="w-full h-full opacity-40 group-hover:opacity-60 transition-opacity duration-700 p-8"
        preserveAspectRatio="xMidYMid slice"
      >
        <path 
          fill="currentColor" 
          className="text-border/40"
          d="M130,105 L150,110 L140,125 L120,120 Z M250,80 L280,75 L290,95 L260,110 L240,90 Z M450,150 L480,140 L500,160 L470,180 L440,170 Z M600,100 L630,90 L650,120 L620,130 Z M300,250 L330,240 L340,270 L310,280 Z M650,280 L680,270 L690,300 L660,310 Z" 
        />
        {/* Mock continental blobs */}
        <ellipse cx="200" cy="120" rx="80" ry="50" fill="currentColor" className="text-white/[0.03]" />
        <ellipse cx="500" cy="150" rx="120" ry="70" fill="currentColor" className="text-white/[0.03]" />
        <ellipse cx="650" cy="250" rx="60" ry="40" fill="currentColor" className="text-white/[0.03]" />
        <ellipse cx="250" cy="280" rx="70" ry="50" fill="currentColor" className="text-white/[0.03]" />
      </svg>

      {/* Ring / Grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      {/* Dynamic Attack Points */}
      {attackPoints.map((point, idx) => (
        <div 
          key={idx}
          className="absolute"
          style={{ left: point.x, top: point.y }}
        >
          <div className={cn(
            "w-3 h-3 rounded-full bg-accent relative flex items-center justify-center",
            point.strength > 70 ? "bg-warning shadow-[0_0_10px_rgba(255,75,75,0.8)]" : "bg-accent shadow-[0_0_10px_rgba(59,130,246,0.8)]"
          )}>
            <div className="absolute inset-0 rounded-full border border-current animate-ping opacity-50" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
               {point.origin} // Lvl_{point.strength}
            </div>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
         <div className="flex items-center gap-2 text-[8px] font-mono uppercase opacity-40">
           <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Low_Intensity
         </div>
         <div className="flex items-center gap-2 text-[8px] font-mono uppercase opacity-40">
           <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" /> Critical_Origin
         </div>
      </div>
    </div>
  );
}

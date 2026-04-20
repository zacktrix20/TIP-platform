import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const NEWS_MOCK = [
  "CRITICAL: New Zero-Day vulnerability detected in major web server software. Patch 14.1 internally validated.",
  "INTEL: Russian-nexus APT group 'NightShade' active in APAC region. Target: Semiconductor manufacturing.",
  "STATUS: TIP Intelligence Fusion node synchronized. 5,200 new indicators ingested in last 24h.",
  "ADVISORY: Ransomware strain 'CryptoVile' 2.0 observed using stolen certificates for signed payloads.",
  "NOTICE: Global BGP hijacking attempts observed targeting financial routing gateways.",
  "AI_ANALYSIS: Anomaly detection sublayer reporting 12% increase in polymorphic URL patterns."
];

export function NewsTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % NEWS_MOCK.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-6 bg-accent/5 border-y border-border flex items-center px-6 overflow-hidden shrink-0">
      <div className="flex items-center gap-2 mr-6 shrink-0">
        <AlertCircle className="w-3 h-3 text-warning animate-pulse" />
        <span className="text-[9px] font-bold font-mono text-warning uppercase whitespace-nowrap">TACTICAL_FEED // LIVE</span>
      </div>
      <div className="flex-1 overflow-hidden relative h-full">
         <div 
           key={index}
           className="absolute inset-0 flex items-center animate-ticker-slide"
         >
            <span className="text-[9px] font-mono text-text-secondary opacity-60 uppercase tracking-widest whitespace-nowrap">
              {NEWS_MOCK[index]}
            </span>
         </div>
      </div>
      <div className="ml-6 shrink-0 flex items-center gap-2">
         <span className="text-[8px] font-mono opacity-20 uppercase tracking-widest">Buffer_Sync: 100%</span>
         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
      </div>
    </div>
  );
}

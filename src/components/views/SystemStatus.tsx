import React from 'react';
import { Terminal as TerminalIcon, Database, Activity, Server, Cpu, Globe } from 'lucide-react';
import { Stats } from '../../types';
import { cn } from '../../lib/utils';

interface SystemStatusProps {
  stats: Stats | null;
}

export function SystemStatus({ stats }: SystemStatusProps) {
  const systems = [
    { name: 'Core_Kernel', status: 'Online', load: '12%', icon: Cpu },
    { name: 'OSINT_Relay', status: 'Active', load: '42%', icon: Globe },
    { name: 'Database_Sublayer', status: 'Syncing', load: '8%', icon: Database },
    { name: 'AI_Engine_v3', status: 'Ready', load: '0%', icon: Activity },
    { name: 'Ingest_Pipe', status: 'Wait', load: '2%', icon: Server },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-bg overflow-y-auto lg:overflow-hidden font-mono relative custom-scrollbar">
      <div className="h-14 border-b border-border bg-card/40 backdrop-blur-md flex items-center px-6 shrink-0 justify-between">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-3 text-emerald-500">
          <TerminalIcon className="w-4 h-4 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          System_Kernel_Monitor // Localhost_Console
        </h2>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <span className="text-[9px] opacity-30 uppercase tracking-widest">Uptime:</span>
              <span className="text-[10px] text-emerald-500 font-bold">42D 12H 04M</span>
           </div>
           <div className="w-px h-3 bg-border" />
           <div className="flex items-center gap-2 text-[10px]">
              <span className="opacity-30 uppercase tracking-widest">Ingest_Rate:</span>
              <span className="text-white font-bold">12.4 PKTS/S</span>
           </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-px bg-border overflow-hidden">
        <div className="col-span-12 lg:col-span-4 bg-card/20 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar border-r border-border">
           <section className="space-y-4">
              <h3 className="text-[9px] uppercase tracking-widest text-text-secondary opacity-30 border-b border-white/5 pb-2">Subsystem_Inventory</h3>
              <div className="space-y-1">
                {systems.map((s) => (
                  <div key={s.name} className="flex items-center justify-between py-3 px-4 bg-white/[0.01] border border-white/5 hover:border-accent/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <s.icon className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:text-accent transition-all" />
                      <span className="text-[10px] text-white/60 uppercase tracking-wider group-hover:text-white">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[9px] opacity-20 font-mono">{s.load}</span>
                       <span className={cn(
                         "text-[9px] uppercase font-bold tracking-widest",
                         s.status === 'Online' || s.status === 'Active' || s.status === 'Ready' ? "text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]" : "text-warning"
                       )}>{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
           </section>

           <section className="space-y-4">
              <h3 className="text-[9px] uppercase tracking-widest text-text-secondary opacity-30 border-b border-white/5 pb-2">Telemetry_Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white/[0.01] border border-white/5 p-4 bento-card border-none hover:bg-white/[0.03]">
                    <span className="block text-[8px] opacity-30 uppercase mb-2 tracking-widest">Total_Storage</span>
                    <span className="text-sm font-bold tech-value">128.4 MB</span>
                 </div>
                 <div className="bg-white/[0.01] border border-white/5 p-4 bento-card border-none hover:bg-white/[0.03]">
                    <span className="block text-[8px] opacity-30 uppercase mb-2 tracking-widest">IO_Threads</span>
                    <span className="text-sm font-bold tech-value">16 ACTIVE</span>
                 </div>
              </div>
           </section>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-black/40 flex flex-col overflow-hidden relative">
          {/* Terminal Scanline Overlay */}
          <div className="scanline" />
          <div className="flex-1 p-8 text-[11px] text-emerald-500/60 overflow-y-auto custom-scrollbar leading-[1.8] font-mono whitespace-pre-wrap selection:bg-emerald-500/20 selection:text-emerald-400">
             {`> [BOOTING] SECTOR CHECK: OK
> [BOOTING] MEMORY_ALLOC: 4GB
> [BOOTING] CRYPTO_INIT: SHA256_ACTIVE
> [NET] LISTENING ON 0.0.0.0:3000
> [DB] LOADING LOCAL_DB_RELAY...
> [DB] SUCCESS: 4 INDICATORS LOADED
> [AI] INITIALIZING GEMINI_SUBSYSTEM...
> [AI] READY: MODEL=gemini-3-flash-preview
> [SYNC] RUNNING POLLING_LOOP (INTERVAL=30000ms)
> [SYNC] FETCHING OSINT_DATA: SUCCESS
> [SYNC] NORMALIZING_PAYLOAD: [185.156.177.214, secure-login-bank.xyz, ...]
> [SYNC] SCORING_PAYLOAD: COMPLETE
> [API] GET /api/stats 200 OK
> [API] GET /api/indicators 200 OK
> [KERNEL] SYSTEM NOMINAL
> [LISTENER] INCOMING PACKET STREAM ATTACHED
> [WATCHDOG] MONITORING CORE PROCESSORS
> [ALARM] NO CRITICAL FAILURES DETECTED`}
          </div>
          <div className="h-10 bg-black/60 border-t border-border flex items-center px-6 gap-2 text-[10px]">
             <span className="text-emerald-500 font-bold">root@threatcore:~$</span>
             <span className="w-2 h-4 bg-emerald-500/40 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

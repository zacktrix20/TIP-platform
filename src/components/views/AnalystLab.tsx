import React, { useState, useEffect } from 'react';
import { Microscope, Bot, Zap, Files, MessageSquare, Sparkles, Terminal, Activity, Shield, Cpu, ArrowUpRight, Database } from 'lucide-react';
import { Indicator } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AnalystLabProps {
  indicators: Indicator[];
}

export function AnalystLab({ indicators }: AnalystLabProps) {
  const [scanIndex, setScanIndex] = useState(0);
  const topPriority = [...indicators].sort((a, b) => b.riskScore - a.riskScore).slice(0, 8);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanIndex(prev => (prev + 1) % topPriority.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [topPriority.length]);

  return (
    <div className="flex-1 flex flex-col h-full bg-bg overflow-y-auto lg:overflow-hidden relative custom-scrollbar">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] z-0" />
      
      {/* View Header */}
      <div className="p-8 border-b border-border bg-card/30 backdrop-blur-sm z-10 shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-accent mb-1">
            <Microscope className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase">Laboratory_Environment // V3.2.0</span>
          </div>
          <h2 className="text-3xl font-bold uppercase tracking-tighter flex items-center gap-4 text-white">
            Analyst_Lab <span className="text-text-secondary opacity-30 font-light">/</span> <span className="text-accent underline underline-offset-8 decoration-accent/30">AI_Priority_Queue</span>
          </h2>
          <div className="flex items-center gap-6 mt-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-500 uppercase font-bold tracking-widest">Neural_Sync_Active</span>
             </div>
             <div className="flex items-center gap-2 text-[9px] font-mono text-text-secondary opacity-40 uppercase tracking-widest">
                <Terminal className="w-3 h-3" />
                Session_Time: 04:32:11
             </div>
             <div className="flex items-center gap-2 text-[9px] font-mono text-text-secondary opacity-40 uppercase tracking-widest">
                <Shield className="w-3 h-3" />
                Privilege: Root_Analyst
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-12 z-10">
        {/* Main Content Area */}
        <div className="col-span-8 flex flex-col border-r border-border overflow-y-auto custom-scrollbar p-8 gap-8">
          
          {/* AI PRIORITY QUEUE SECTION */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/10 border border-accent/20 flex items-center justify-center">
                   <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                   <h3 className="text-sm font-bold uppercase tracking-widest text-white">Top_Threat_Escalations</h3>
                   <span className="text-[9px] font-mono text-text-secondary opacity-40 uppercase">Queue_Status: Processing_High_Risk_Anomalies</span>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="tech-button tech-button-outline px-4 text-[9px]">Export_Full_Log</button>
                 <button className="tech-button tech-button-primary px-4 text-[9px]">Re-Prioritize</button>
              </div>
            </div>

            <div className="grid gap-3">
              {topPriority.length === 0 ? (
                <div className="py-20 border border-dashed border-border/30 rounded-sm flex flex-col items-center justify-center opacity-20 italic font-mono text-xs">
                   No prioritized IOCs in current buffer...
                </div>
              ) : (
                topPriority.map((ind, idx) => (
                  <motion.div 
                    key={ind.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "group relative bg-card/40 border transition-all duration-300 cursor-pointer overflow-hidden",
                      scanIndex === idx ? "border-accent ring-1 ring-accent/20" : "border-border hover:border-accent/40"
                    )}
                  >
                    {scanIndex === idx && (
                      <motion.div 
                        initial={{ left: '-100%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-accent/10 to-transparent pointer-events-none z-0"
                      />
                    )}
                    
                    <div className="relative flex items-center p-5 z-10">
                      <div className="mr-6 flex items-center gap-4">
                         <span className="text-[10px] font-mono opacity-20 font-bold">{String(idx + 1).padStart(2, '0')}</span>
                         <div className={cn(
                           "w-1 h-10 transition-colors duration-500",
                           scanIndex === idx ? "bg-accent" : "bg-border"
                         )} />
                      </div>

                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-3">
                           <span className={cn(
                             "text-base font-bold font-mono tracking-tighter truncate transition-colors",
                             scanIndex === idx ? "text-accent" : "text-white"
                           )}>
                             {ind.value}
                           </span>
                           <span className="text-[8px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-text-secondary uppercase tracking-[0.2em]">
                             {ind.type}
                           </span>
                        </div>
                        <div className="flex items-center gap-4 text-[9px] text-text-secondary opacity-40 uppercase font-mono tracking-widest">
                           <span>Origin: {ind.source}</span>
                           <span>/</span>
                           <span>Observed: {new Date(ind.lastSeen).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 ml-6 shrink-0">
                        <div className="flex flex-col items-end">
                           <span className="text-[8px] text-text-secondary opacity-30 uppercase font-bold">Severity_Score</span>
                           <div className="flex items-baseline gap-1">
                              <span className={cn(
                                "text-xl font-bold font-mono",
                                ind.riskScore > 80 ? "text-warning" : "text-accent"
                              )}>{ind.riskScore}</span>
                              <span className="text-[9px] opacity-20 font-mono">/100</span>
                           </div>
                        </div>
                        <div className="h-10 w-px bg-border/40" />
                        <button className="w-10 h-10 flex items-center justify-center bg-transparent border border-border group-hover:bg-accent group-hover:border-accent group-hover:text-bg transition-all rounded-sm">
                           <ArrowUpRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Secondary Lab Widgets */}
          <div className="grid grid-cols-2 gap-8 mt-4">
            <div className="bg-card/40 border border-border p-6 flex flex-col gap-5 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-border group-hover:bg-accent transition-colors" />
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-mono text-accent uppercase font-bold tracking-[0.2em]">External_Ingestion_Unit</h4>
                <Database className="w-3 h-3 opacity-20" />
              </div>
              <div className="flex-1 py-10 border border-dashed border-border/30 flex flex-col items-center justify-center gap-3 bg-black/20 group-hover:bg-accent/5 transition-colors cursor-pointer">
                 <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-accent group-hover:scale-110 transition-all duration-500">
                    <Files className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:text-accent" />
                 </div>
                 <div className="text-center">
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-text-primary">Staging_Area_Empty</span>
                    <span className="text-[9px] text-text-secondary opacity-30 uppercase font-mono mt-1 block">Drop_PCAP_Or_JSON_Archive</span>
                 </div>
              </div>
              <button className="tech-button h-10 text-[9px] uppercase font-bold tracking-widest w-full">Initialize_Import_Sublayer</button>
            </div>

            <div className="bg-accent/5 border border-accent/20 p-6 flex flex-col gap-6 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                 <Bot className="w-32 h-32" />
              </div>
              <div className="flex items-center gap-3 text-accent">
                 <Sparkles className="w-4 h-4 animate-pulse" />
                 <h4 className="text-[10px] font-mono uppercase font-bold tracking-[0.2em]">Neural_Forecast_Engine</h4>
              </div>
              <div className="space-y-4 relative z-10">
                <p className="text-xs font-mono leading-relaxed text-accent/80 bg-accent/5 p-4 border border-accent/10">
                  <span className="opacity-40">{'>'}</span> ALERT: 14% delta increase in C2-orchestrated probing from RU/CN regions identified in t-minus 12H. 
                  Recommending egress-block on port <span className="text-white font-bold brightness-125 underline decoration-accent/40">5060/5061</span> globally.
                </p>
                <div className="flex items-center gap-4 text-[9px] font-mono text-accent/50 uppercase">
                   <span className="flex items-center gap-2 truncate"><Activity className="w-3 h-3" /> Model_Confidence: 94.2%</span>
                   <span className="flex items-center gap-2 shrink-0"><Cpu className="w-3 h-3" /> V4_Synapse</span>
                </div>
              </div>
              <button className="mt-auto tech-button tech-button-accent h-10 text-[9px] uppercase font-bold tracking-widest">Apply_Predictive_Ruleset</button>
            </div>
          </div>
        </div>

        {/* Tactical Thread Sidebar */}
        <div className="col-span-4 flex flex-col bg-card/20 backdrop-blur-sm overflow-hidden">
           <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                 <Terminal className="w-4 h-4 text-accent" />
                 <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Live_Tactical_Thread</span>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
           </div>
           
           <div className="flex-1 p-6 overflow-y-auto custom-scrollbar font-mono text-[9px] space-y-4">
              {[...Array(25)].map((_, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="opacity-10 shrink-0 group-hover:opacity-40 transition-opacity">[{new Date().toLocaleTimeString()}]</span>
                  <div className="flex flex-col gap-1">
                     <span className="text-emerald-500/80 group-hover:text-emerald-400 transition-colors">
                        {i % 4 === 0 ? "SYSTEM_LINK_SECURED" : 
                         i % 3 === 0 ? "QUERY_EXECUTION: ANALYZING_STAGED_IOCS" :
                         i % 2 === 0 ? "BUFFER_FLUSH_COMPLETE: STANDBY" :
                         "TELEMETRY_STREAM: NO_LATENCY_DETECTED"}
                     </span>
                     {i % 5 === 0 && (
                       <div className="my-2 p-2 bg-white/[0.02] border border-white/5 opacity-40">
                          RAW_HEX: 0x4A 0x65 0x6D 0x69 0x6E 0x69 0x5F 0x50 0x52 0x4F
                       </div>
                     )}
                  </div>
                </div>
              ))}
           </div>
           
           <div className="p-6 border-t border-border bg-black/40 shrink-0">
              <div className="flex items-center justify-between mb-4">
                 <span className="text-[8px] font-mono opacity-30 uppercase tracking-widest">Lab_Health_Telemetry</span>
                 <span className="text-[8px] font-mono text-emerald-500 uppercase">99.9% Uptime</span>
              </div>
              <div className="flex gap-1 h-3">
                 {[...Array(40)].map((_, i) => (
                   <div key={i} className={cn(
                     "flex-1 transition-all duration-1000",
                     Math.random() > 0.1 ? "bg-accent/20" : "bg-warning/40 h-full"
                   )} style={{ height: `${Math.random() * 100}%` }} />
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

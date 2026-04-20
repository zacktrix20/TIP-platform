import React from 'react';
import { 
  Settings, 
  Shield, 
  Zap, 
  Globe, 
  Database, 
  Lock, 
  Eye, 
  Bell, 
  Terminal,
  Save,
  RefreshCcw,
  Cpu,
  Monitor
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export function ConfigPanel() {
  return (
    <div className="h-full w-full flex flex-col bg-bg overflow-hidden relative">
      {/* Decorative Matrix Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Header */}
      <div className="p-8 border-b border-border bg-card/30 backdrop-blur-sm z-10">
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <div className="w-12 h-12 bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Settings className="w-6 h-6 text-accent animate-[spin_8s_linear_infinite]" />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tighter">TIP System_Configuration // CORE_PARAMETERS</h2>
            <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest mt-1">Adjust environmental variables and operational protocols</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
          
          {/* Section: General Intelligence */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border/50 pb-2">
              <Zap className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Intelligence_Parameters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Auto_Deduplication', desc: 'Automatically merge identical IOCs', status: 'ENABLED' },
                { label: 'Stream_Inference', desc: 'Real-time AI analysis of incoming data', status: 'ACTIVE' },
                { label: 'Risk_Threshold', desc: 'Minimum score to trigger critical alerts', status: '75' },
                { label: 'Cache_Persistence', desc: 'Duration of local telemetry storage', status: '24H' },
              ].map((item, idx) => (
                <div key={idx} className="bg-card/50 border border-border p-4 flex items-center justify-between group hover:border-accent/40 transition-colors">
                  <div>
                    <div className="text-[11px] font-bold text-white mb-1 uppercase tracking-tight">{item.label}</div>
                    <div className="text-[9px] font-mono opacity-40 uppercase">{item.desc}</div>
                  </div>
                  <div className="text-[10px] font-mono text-accent font-bold px-2 py-1 bg-accent/5 border border-accent/10">
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Security & Privacy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border/50 pb-2">
              <Lock className="w-4 h-4 text-warning" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Sentinel_Security</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { icon: Shield, label: 'Neural_Firewall', status: 'MAXIMUM_STRENGTH', color: 'text-emerald-500' },
                { icon: Eye, label: 'Anonymize_Telemetry', status: 'OBLIGATORY', color: 'text-accent' },
                { icon: Terminal, label: 'Audit_Logging', status: 'VERBOSE', color: 'text-white' },
              ].map((item, idx) => (
                <div key={idx} className="bg-card/50 border border-border p-4 flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center">
                    <item.icon className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-bold text-white uppercase tracking-tight">{item.label}</div>
                    <div className={cn("text-[8px] font-mono uppercase mt-0.5", item.color)}>// Status: {item.status}</div>
                  </div>
                  <div className="w-10 h-5 bg-border relative cursor-pointer overflow-hidden rounded-full">
                     <div className="absolute top-1 left-1 w-3 h-3 bg-accent rounded-full translate-x-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Subsystem Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="bg-accent/5 border border-accent/20 p-6 flex flex-col items-center text-center space-y-3">
              <RefreshCcw className="w-6 h-6 text-accent opacity-60" />
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest">Master_Sync</div>
              <button className="text-[9px] bg-accent text-white px-4 py-2 hover:bg-accent/80 transition-colors uppercase font-bold tracking-widest">Sync_Now</button>
            </div>
            <div className="bg-warning/5 border border-warning/20 p-6 flex flex-col items-center text-center space-y-3">
              <Database className="w-6 h-6 text-warning opacity-60" />
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest">Purge_Vault</div>
              <button className="text-[9px] border border-warning text-warning px-4 py-2 hover:bg-warning/10 transition-colors uppercase font-bold tracking-widest">Execute</button>
            </div>
            <div className="bg-white/[0.02] border border-border p-6 flex flex-col items-center text-center space-y-3">
              <Cpu className="w-6 h-6 opacity-20" />
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest">Rebuild_Neural</div>
              <button className="text-[9px] border border-border text-text-secondary px-4 py-2 hover:bg-white/5 transition-colors uppercase font-bold tracking-widest">Start_Process</button>
            </div>
          </div>

          <div className="pt-12 border-t border-border flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">System_Ready // All_Configurations_Stable</span>
            </div>
            <button className="flex items-center gap-2 bg-accent text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all">
              <Save className="w-4 h-4" />
              Commit_Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

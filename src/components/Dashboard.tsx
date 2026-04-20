import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  Search, 
  Activity, 
  RefreshCw, 
  ExternalLink,
  Terminal,
  Database,
  Menu,
  X,
  ChevronLeft,
  Minimize2
} from 'lucide-react';
import { Indicator, Stats, Severity } from '../types';
import { cn } from '../lib/utils';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

import { AIChat } from './AIChat';
import { enrichIndicator } from '../services/aiService';
import { Sidebar, ViewType } from './layout/Sidebar';
import { NewsTicker } from './ui/NewsTicker';
import { OverviewDashboard } from './views/OverviewDashboard';
import { IntelExplorer } from './views/IntelExplorer';
import { AnalystLab } from './views/AnalystLab';
import { SystemStatus } from './views/SystemStatus';
import { NetworkTopology } from './views/NetworkTopology';
import { ChatSupport } from './views/ChatSupport';
import { DataScienceLab } from './views/DataScienceLab';
import { ConfigPanel } from './views/ConfigPanel';

export function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [enriching, setEnriching] = useState(false);

  useEffect(() => {
    const enrichSelected = async () => {
      if (selectedIndicator && !selectedIndicator.analysis && !enriching) {
        setEnriching(true);
        try {
          const analysis = await enrichIndicator(selectedIndicator);
          await api.patch(`/api/indicators/${encodeURIComponent(selectedIndicator.id)}`, { analysis });
          
          setSelectedIndicator(prev => prev ? { ...prev, analysis } : null);
          setIndicators(prev => prev.map(ind => ind.id === selectedIndicator.id ? { ...ind, analysis } : ind));
        } catch (err) {
          console.error('Enrichment failed:', err);
        } finally {
          setEnriching(false);
        }
      }
    };
    enrichSelected();
  }, [selectedIndicator]);

  const api = axios.create({
    timeout: 10000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  const fetchWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> => {
    try {
      return await fn();
    } catch (err: any) {
      if (retries <= 0) throw err;
      console.warn(`[Dashboard] Request failed, retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(fn, retries - 1, delay * 2);
    }
  };

  const fetchIndicators = async () => {
    try {
      const response = await fetchWithRetry(() => api.get('/api/indicators'));
      setIndicators(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('[Dashboard] Failed to fetch indicators after retries:', error.message);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetchWithRetry(() => api.get('/api/stats'));
      setStats(response.data);
    } catch (error: any) {
      console.error('[Dashboard] Failed to fetch stats after retries:', error.message);
    }
  };

  useEffect(() => {
    fetchIndicators();
    fetchStats();
    const interval = setInterval(() => {
      fetchIndicators();
      fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const syncFeeds = async () => {
    setSyncing(true);
    try {
      await fetchWithRetry(() => api.get('/api/sync'));
      await fetchIndicators();
      await fetchStats();
    } catch (error: any) {
      console.error('[Dashboard] Sync failed after retries:', error.message);
    } finally {
      setSyncing(false);
    }
  };

  const renderActiveView = () => {
    const commonProps = {
      indicators,
      onSelect: setSelectedIndicator,
      searchQuery,
      setSearchQuery,
      typeFilter,
      setTypeFilter,
      onViewChange: setActiveView
    };

    switch (activeView) {
      case 'overview':
        return <OverviewDashboard {...commonProps} stats={stats} />;
      case 'explorer':
        return <IntelExplorer {...commonProps} />;
      case 'analyst':
        return <AnalystLab indicators={indicators} />;
      case 'datascience':
        return <DataScienceLab indicators={indicators} stats={stats} />;
      case 'settings':
        return <ConfigPanel />;
      case 'topology':
        return <NetworkTopology indicators={indicators} />;
      case 'chat':
        return <ChatSupport onBack={() => setActiveView('overview')} />;
      case 'system':
        return <SystemStatus stats={stats} />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center opacity-20">
             <div className="text-center font-mono uppercase tracking-[0.4em]">Subsystem_Initializing...</div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-bg text-text-primary font-sans flex overflow-hidden relative selection:bg-accent/30 selection:text-white">
      {/* Background Visual Layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.1),transparent_70%)]" />
        <div className="scanline" />
      </div>

      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-14 border-b border-border bg-card/60 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setSidebarOpen(true)}
               className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-white"
             >
               <Menu className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-2 hidden lg:flex">
                <div className="relative">
                  <Shield className="w-5 h-5 text-accent drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-card animate-pulse" />
                </div>
             </div>
             <h1 className="font-bold text-sm tracking-tighter uppercase whitespace-nowrap">
               Threat Intelligence Platform (TIP) <span className="text-text-secondary opacity-30 font-mono font-normal ml-1">v2.5.0</span>
             </h1>
             <div className="h-4 w-px bg-border mx-2 hidden sm:block" />
             <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-text-secondary">
               <Activity className="w-3 h-3 text-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
               <span className="opacity-30 uppercase tracking-widest">Status:</span>
               <span className="text-emerald-500 uppercase font-bold tracking-widest">Active_Link</span>
             </div>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-[400px] mx-4 sm:mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary opacity-40" />
              <input 
                type="text" 
                placeholder="Search intel archive..."
                className="w-full bg-black/20 border border-border py-1.5 px-9 text-[10px] font-mono focus:outline-none focus:border-accent transition-all placeholder:opacity-30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button 
              onClick={syncFeeds}
              disabled={syncing}
              className="tech-button tech-button-primary flex items-center gap-2 h-8 shrink-0"
            >
              <RefreshCw className={cn("w-3 h-3", syncing && "animate-spin")} />
              <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync Intel'}</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto lg:overflow-hidden relative custom-scrollbar">
           {renderActiveView()}
        </div>

        <NewsTicker />
        <footer className="h-8 border-t border-border flex items-center justify-between px-6 bg-card text-[9px] font-mono text-text-secondary uppercase tracking-[0.2em] opacity-40 shrink-0">
          <div>Threat Intelligence Platform (TIP)</div>
          <div className="flex gap-4">
            <span>SEC_LEVEL: 10</span>
            <span>© 2026 TIP_DEFENSE_NETWORK</span>
          </div>
        </footer>
      </div>

      {/* Indicator Detail Overlay */}
      <AnimatePresence>
        {selectedIndicator && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/90 backdrop-blur-md"
             onClick={() => setSelectedIndicator(null)}
           >
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-card tech-grid max-w-2xl w-full flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="tech-grid-header flex justify-between items-center bg-[#18181B]">
                   <div className="flex items-center gap-3">
                     <button 
                       onClick={() => setSelectedIndicator(null)}
                       className="flex items-center gap-1 text-accent hover:text-white transition-colors group"
                     >
                       <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                       <span className="text-[9px] font-bold tracking-widest uppercase">Back</span>
                     </button>
                     <div className="h-3 w-px bg-border/40 mx-1" />
                     <span>IOC_Investigation_Module // {selectedIndicator.id}</span>
                   </div>
                   <button onClick={() => setSelectedIndicator(null)} className="hover:text-accent">
                      <Minimize2 className="w-3 h-3" />
                   </button>
                </div>
                
                <div className="p-8 overflow-y-auto custom-scrollbar max-h-[85vh]">
                   <div className="mb-8">
                     <span className="tech-grid-header px-0 border-none opacity-20 mb-1 block">Indicator_Target</span>
                     <h2 className="text-2xl font-bold tracking-tighter text-white break-all">{selectedIndicator.value}</h2>
                   </div>

                   <div className="grid grid-cols-4 gap-6 py-6 border-y border-border mb-8">
                     <div>
                       <span className="tech-grid-header px-0 border-none opacity-40 mb-1 block text-[9px]">Priority_Score</span>
                       <span className={cn(
                         "font-mono text-lg font-bold tracking-tighter",
                         (selectedIndicator.riskScore || 0) > 80 ? 'text-warning' : 'text-accent'
                       )}>
                         {selectedIndicator.riskScore || 0}/100
                       </span>
                     </div>
                     <div>
                        <span className="tech-grid-header px-0 border-none opacity-40 mb-1 block text-[9px]">Exploitability</span>
                        <span className="font-mono text-lg text-text-primary tracking-tighter">{selectedIndicator.exploitability || 0}/10</span>
                     </div>
                     <div>
                        <span className="tech-grid-header px-0 border-none opacity-40 mb-1 block text-[9px]">Activity_Recv</span>
                        <span className="font-mono text-lg text-emerald-500 font-bold tracking-tighter">{selectedIndicator.activityCount || 0}</span>
                     </div>
                     <div>
                        <span className="tech-grid-header px-0 border-none opacity-40 mb-1 block text-[9px]">Confidence</span>
                        <span className="font-mono text-lg text-emerald-400 opacity-60 font-medium tracking-tighter">{selectedIndicator.confidence}%</span>
                     </div>
                   </div>

                   <div className="space-y-6">
                     <div>
                       <span className="tech-grid-header px-0 border-none opacity-40 mb-3 block">Gemini_Deep_Analysis</span>
                       <div className="bg-bg border border-border p-6 font-mono text-xs text-text-secondary leading-relaxed custom-scrollbar max-h-[300px] overflow-y-auto">
                         <div className="prose prose-invert prose-xs max-w-none opacity-80">
                           {enriching ? (
                             <div className="flex flex-col items-center justify-center py-8 gap-4">
                               <RefreshCw className="w-6 h-6 animate-spin text-accent" />
                               <span className="text-[10px] uppercase tracking-widest animate-pulse">Running AI Deep Analysis Sublayer...</span>
                             </div>
                           ) : (
                             <ReactMarkdown>
                               {selectedIndicator.analysis || 'Analysis pending system processing...'}
                             </ReactMarkdown>
                           )}
                         </div>
                       </div>
                     </div>
                     <div className="flex gap-4">
                        <button className="flex-1 tech-button tech-button-primary h-12">Export_to_SIEM</button>
                        <button className="flex-1 tech-button tech-button-outline h-12">Reporting_Complete</button>
                     </div>
                   </div>
                </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


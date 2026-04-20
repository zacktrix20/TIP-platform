import React, { useMemo } from 'react';
import { Shield, Activity, Database, RefreshCw, TrendingUp } from 'lucide-react';
import { Indicator, Stats } from '../../types';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

import { ViewType } from '../layout/Sidebar';
import { GlobalMap } from './GlobalMap';

interface OverviewDashboardProps {
  indicators: Indicator[];
  stats: Stats | null;
  onSelect: (ind: Indicator) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  onViewChange: (view: ViewType) => void;
}

export function OverviewDashboard({ 
  indicators, 
  stats, 
  onSelect,
  searchQuery,
  typeFilter,
  setTypeFilter,
  onViewChange
}: OverviewDashboardProps) {
  const filteredIndicators = indicators
    .filter(ind => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
                            (ind.value || '').toLowerCase().includes(query) || 
                            (ind.description || '').toLowerCase().includes(query) ||
                            (ind.tags || []).some(t => t.toLowerCase().includes(query));
      const matchesType = typeFilter === 'all' || ind.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .slice(0, 50);

  // Derive Pie Chart Data for Severity
  const severityData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Critical', value: stats.critical, color: '#f59e0b' },
      { name: 'High', value: stats.high, color: '#f97316' },
      { name: 'Medium', value: stats.medium, color: '#3b82f6' },
      { name: 'Low', value: stats.low, color: '#94a3b8' },
    ];
  }, [stats]);

  // Derive Bar Chart Data for Types
  const typeData = useMemo(() => {
    if (!stats?.byType) return [];
    return Object.entries(stats.byType).map(([name, value]) => ({ 
      name: name.toUpperCase(), 
      value 
    }));
  }, [stats]);

  // Mock Time Series for Activity Sparkline
  const activityData = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      time: i,
      value: Math.floor(Math.random() * 40) + 10
    }));
  }, []);

  return (
    <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-6 gap-px bg-border border-b border-border h-full overflow-y-auto lg:overflow-hidden custom-scrollbar">
      {/* Metric 1 */}
      <div className="lg:col-span-3 lg:row-span-1 bento-card border-none overflow-hidden relative">
        <span className="bento-card-title">Total_Indicators_Live</span>
        <div className="flex items-baseline gap-2 z-10">
          <div className="bento-card-value tech-value">{stats?.total.toLocaleString() || '0'}</div>
          <span className="text-[10px] font-mono text-emerald-500/80 flex items-center gap-1">
             <TrendingUp className="w-3 h-3" />
             8.2%
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-12 opacity-30 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="lg:col-span-3 lg:row-span-1 bento-card border-none group relative overflow-hidden">
        <span className="bento-card-title">Average_Risk_Score</span>
        <div className="flex items-baseline gap-2 z-10">
          <div className="bento-card-value tech-value">{stats?.avgRiskScore || '0'}</div>
          <span className="text-[10px] font-mono text-accent/80">/100</span>
        </div>
        <div className="absolute bottom-4 left-6 right-6 h-1 bg-white/5 overflow-hidden">
          <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${stats?.avgRiskScore || 0}%` }} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-8 opacity-20 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData.map(d => ({ ...d, value: Math.max(30, d.value + (Math.random() * 10)) }))}>
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="lg:col-span-3 lg:row-span-1 bento-card border-none">
        <span className="bento-card-title">Deduplication_Rate</span>
        <div className="bento-card-value tech-value">12.5%</div>
      </div>

      {/* Metric 4 */}
      <div className="lg:col-span-3 lg:row-span-1 bento-card border-none">
        <span className="bento-card-title">Collector_Status</span>
        <div className="flex items-center gap-2 mt-4">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-500">System_Nominal</span>
        </div>
      </div>

      {/* Intelligence Stream - Main Feed */}
      <div className="lg:col-span-6 lg:row-span-5 bg-card flex flex-col overflow-hidden">
        <div className="tech-grid-header flex justify-between items-center">
          <span>Intelligence_Stream // Real-Time_Feed</span>
          <span className="text-accent opacity-100 flex items-center gap-2">
            <span className="w-1 h-1 bg-accent rounded-full animate-pulse" />
            LIVE_DATA_STREAM
          </span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-card z-10 border-b border-border">
              <tr className="tech-grid-header border-none">
                <th className="py-2 px-4 font-normal">Indicator_Value</th>
                <th className="py-2 px-4 font-normal text-center">Threat_Score</th>
                <th className="py-2 px-4 font-normal">Classification</th>
                <th className="py-2 px-4 font-normal text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredIndicators.map((indicator) => (
                <tr 
                  key={indicator.id}
                  onClick={() => onSelect(indicator)}
                  className="hover:bg-[#18181B] cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 tech-value text-[12px] group-hover:text-accent transition-colors">
                    {indicator.value}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn(
                        "text-[11px] font-bold tech-value",
                        (indicator.riskScore || 0) > 80 ? 'text-warning' : 
                        (indicator.riskScore || 0) > 50 ? 'text-orange-500' : 'text-accent'
                      )}>
                        {indicator.riskScore || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "text-[9px] font-mono px-1.5 py-0.5 border uppercase tracking-widest",
                      indicator.severity === 'critical' ? 'text-warning border-warning/20 bg-warning/5' : 
                      indicator.severity === 'high' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' :
                      'text-text-secondary border-border bg-white/[0.02]'
                    )}>
                      {indicator.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-[10px] text-text-secondary opacity-40 font-mono">
                    {formatDistanceToNow(new Date(indicator.lastSeen), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories / Visualizations */}
      <div className="lg:col-span-3 lg:row-span-5 bg-card border-l border-border flex flex-col">
        <div className="tech-grid-header flex justify-between">
          <span>Threat_Analytics_Engine</span>
          {typeFilter !== 'all' && (
            <button 
              onClick={() => setTypeFilter('all')}
              className="text-accent hover:underline text-[9px]"
            >
              RESET
            </button>
          )}
        </div>
        <div className="flex-1 p-6 flex flex-col space-y-8">
          
          <div className="h-40 w-full relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-xs font-mono font-bold text-accent">{stats?.total}</div>
                <div className="text-[8px] font-mono opacity-40 uppercase">Total_IOC</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
             <div className="tech-grid-header px-0 mb-2 border-none bg-transparent opacity-40">Classification_Distribution</div>
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      hide
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', fontSize: '10px' }}
                    />
                    <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#8b5cf6" opacity={0.6} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
             
             <div className="grid grid-cols-2 gap-2 pb-4">
                {typeData.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="bg-white/[0.02] border border-border/50 p-2 text-center">
                    <div className="text-[8px] font-mono opacity-40 uppercase mb-1">{item.name}</div>
                    <div className="text-xs font-mono font-bold text-accent">{item.value}</div>
                  </div>
                ))}
             </div>
          </div>

          <div className="pt-4 border-t border-border mt-auto">
             <div className="tech-grid-header px-0 mb-4 bg-transparent border-none opacity-40 uppercase tracking-widest text-[9px]">Spatio-Temporal_Threat_Detection</div>
             <div className="h-44 w-full border border-white/5 rounded-sm overflow-hidden">
                <GlobalMap />
             </div>
          </div>
        </div>
      </div>

      {/* Intelligence Briefing & Analysis */}
      <div className="lg:col-span-3 lg:row-span-5 bg-card border-l border-border flex flex-col overflow-hidden">
        <div className="tech-grid-header flex justify-between items-center">
           <div className="flex items-center gap-2">
             <Shield className="w-3 h-3 text-accent" />
             <span>Intelligence_Briefing</span>
           </div>
           <span className="text-[8px] font-mono px-1.5 py-0.5 bg-accent/10 border border-accent/20 text-accent rounded-full animate-pulse">AI_ANALYSIS_ACTIVE</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          <section className="space-y-3">
             <div className="tech-grid-header px-0 mb-1 border-none bg-transparent opacity-40">Situation_Report</div>
             <p className="text-[11px] font-mono leading-relaxed text-text-secondary">
               System analysis of current <span className="text-white font-bold">{stats?.total} indicators</span> shows a <span className={cn("font-bold", (stats?.critical || 0) > 0 ? "text-warning" : "text-emerald-500")}>{(stats?.critical || 0) > 5 ? "Elevated" : "Nominal"}</span> threat posture. 
               The majority of telemetry is focused on <span className="text-accent underline decoration-accent/30">{typeData[0]?.name || 'Unknown'}</span> vectors.
             </p>
          </section>

          <section className="space-y-4">
             <div className="tech-grid-header px-0 mb-1 border-none bg-transparent opacity-40">AI_Insight // Critical_Anomalies</div>
             <div className="space-y-2">
                <div className="bg-white/5 border-l-2 border-warning p-3">
                   <div className="text-[9px] font-bold text-warning uppercase mb-1">Observation_01</div>
                   <p className="text-[10px] font-mono text-text-secondary leading-normal">
                     Increased deduplication rate identified in last sync. Suggests concentrated campaign targeting core IP ranges.
                   </p>
                </div>
                <div className="bg-white/5 border-l-2 border-accent p-3">
                   <div className="text-[9px] font-bold text-accent uppercase mb-1">Observation_02</div>
                   <p className="text-[10px] font-mono text-text-secondary leading-normal">
                     Average risk score stabilized at {stats?.avgRiskScore}. Mitigation protocols currently effective against active payloads.
                   </p>
                </div>
             </div>
          </section>

          <section className="space-y-3">
             <div className="tech-grid-header px-0 mb-1 border-none bg-transparent opacity-40">Actionable_Intel</div>
             <ul className="space-y-2">
                {[
                  'Verify egress filters for high-risk IPs.',
                  'Audit system logs for anomalous DNS queries.',
                  'Update local vault with recent STIX exports.'
                ].map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[10px] font-mono text-text-secondary group">
                    <span className="text-accent mt-0.5 group-hover:translate-x-1 transition-transform">→</span>
                    <span className="group-hover:text-white transition-colors">{action}</span>
                  </li>
                ))}
            </ul>
          </section>
        </div>

        <div className="p-4 border-t border-border bg-black/20">
          <div className="flex items-center justify-between text-[9px] font-mono mb-2">
            <span className="opacity-40 uppercase">Threat_Level_Indicator</span>
            <span className={cn("font-bold", (stats?.critical || 0) > 0 ? "text-warning" : "text-emerald-500")}>
              {(stats?.critical || 0) > 5 ? 'STRIKE_DETECTED' : 'LOW_LEVEL_SCANNING'}
            </span>
          </div>
          <div className="flex gap-1 h-1.5">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex-1 transition-all duration-500",
                  i < ((stats?.critical || 0) * 2) ? "bg-warning shadow-[0_0_5px_rgba(255,75,75,0.5)]" : "bg-white/5"
                )} 
              />
            ))}
          </div>
          <button className="w-full tech-button tech-button-accent mt-4 h-8 text-[9px]">Generate_Full_Report</button>
        </div>
      </div>
    </main>
  );
}

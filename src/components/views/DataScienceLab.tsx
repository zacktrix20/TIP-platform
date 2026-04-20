import React from 'react';
import { 
  Shield, 
  Activity, 
  Database, 
  BarChart2, 
  PieChart as PieIcon, 
  TrendingUp, 
  Zap,
  Cpu,
  Globe,
  Layers
} from 'lucide-react';
import { Indicator, Stats } from '../../types';
import { cn } from '../../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

interface DataScienceLabProps {
  indicators: Indicator[];
  stats: Stats | null;
}

export function DataScienceLab({ indicators, stats }: DataScienceLabProps) {
  // Process data for charts
  const typeData = stats?.byType ? Object.entries(stats.byType).map(([name, value]) => ({ 
    name: name.toUpperCase(), 
    value 
  })) : [];

  const severityData = [
    { name: 'CRITICAL', value: stats?.critical || 0, color: '#f59e0b' },
    { name: 'HIGH', value: stats?.high || 0, color: '#f97316' },
    { name: 'MEDIUM', value: stats?.medium || 0, color: '#3b82f6' },
    { name: 'LOW', value: stats?.low || 0, color: '#10b981' },
  ];

  // Mock time-series data for trends
  const trendData = [
    { time: '00:00', threats: 12, risk: 45 },
    { time: '04:00', threats: 18, risk: 52 },
    { time: '08:00', threats: 45, risk: 78 },
    { time: '12:00', threats: 32, risk: 65 },
    { time: '16:00', threats: 67, risk: 89 },
    { time: '20:00', threats: 48, risk: 72 },
    { time: '23:59', threats: 35, risk: 60 },
  ];

  const radarData = [
    { subject: 'Exploitability', A: 85, fullMark: 150 },
    { subject: 'Persistence', A: 65, fullMark: 150 },
    { subject: 'Stealth', A: 90, fullMark: 150 },
    { subject: 'Blast Radius', A: 70, fullMark: 150 },
    { subject: 'Velocity', A: 45, fullMark: 150 },
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="h-full w-full flex flex-col bg-bg overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />
      
      {/* Neural Header */}
      <div className="p-8 border-b border-border bg-card/50 backdrop-blur-md z-10 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-accent/10 border border-accent/20 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <PieIcon className="w-6 h-6 text-accent relative z-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                Neural_Data_Science_Lab // VISUAL_INTELLIGENCE
              </h2>
              <div className="flex items-center gap-4 text-[10px] font-mono opacity-40 mt-1">
                <span className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-emerald-500" /> Accuracy: 99.8%</span>
                <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-accent" /> Mode: Predictive_Modeling</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex gap-4 items-center">
            <div className="text-right">
              <div className="text-[10px] font-mono opacity-30 uppercase tracking-widest">Compute_Load</div>
              <div className="text-xs font-mono text-accent">HEAVY [78.4 TFlops]</div>
            </div>
            <div className="w-12 h-1 bg-accent/20 relative overflow-hidden">
               <div className="absolute inset-0 bg-accent w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 pb-12">
          
          {/* Main Distribution Chart */}
          <div className="col-span-12 lg:col-span-8 bg-card border border-border flex flex-col min-h-[400px]">
            <div className="tech-grid-header flex justify-between">
              <span>Threat_Vector_Distribution // Neural_Weights</span>
              <BarChart2 className="w-3 h-3 opacity-40" />
            </div>
            <div className="flex-1 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff10', fontSize: '10px', fontFamily: 'monospace' }}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Severity Cycle */}
          <div className="col-span-12 lg:col-span-4 bg-card border border-border flex flex-col min-h-[400px]">
             <div className="tech-grid-header flex justify-between">
              <span>Severity_Invariants // Circular_Logic</span>
              <Layers className="w-3 h-3 opacity-40" />
            </div>
            <div className="flex-1 p-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff10', fontSize: '10px', fontFamily: 'monospace' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-[10px] font-mono opacity-30 uppercase">System_Load</span>
                 <span className="text-xl font-bold tech-value text-accent">{stats?.total || 0}</span>
              </div>
            </div>
            <div className="p-4 border-t border-border grid grid-cols-2 gap-4">
               {severityData.map(s => (
                 <div key={s.name} className="flex flex-col">
                    <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest">{s.name}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: s.color }}>{s.value}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Real-Time Risk Lifecycle */}
          <div className="col-span-12 lg:col-span-6 bg-card border border-border flex flex-col h-[350px]">
            <div className="tech-grid-header flex justify-between">
              <span>Risk_Lifecycle_Waveforms // 24H_CYCLE</span>
              <Activity className="w-3 h-3 opacity-40" />
            </div>
            <div className="flex-1 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="time" stroke="#ffffff20" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff20" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff10', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="risk" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={2} />
                  <Line type="monotone" dataKey="threats" stroke="#10b981" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tactical Radar */}
          <div className="col-span-12 lg:col-span-6 bg-card border border-border flex flex-col h-[350px]">
            <div className="tech-grid-header flex justify-between">
              <span>Threat_Signature_Geometry // RADAR_VIEW</span>
              <Globe className="w-3 h-3 opacity-40" />
            </div>
            <div className="flex-1 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#ffffff10" />
                  <PolarAngleAxis dataKey="subject" stroke="#ffffff40" fontSize={9} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar
                    name="Threat Alpha"
                    dataKey="A"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff10', fontSize: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Science Stats Grid */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
             {[
               { label: 'Neural_Entropy', value: '1.42 bits', sub: 'Calculated Variance', icon: Cpu },
               { label: 'Signal_Stable', value: '98.5%', sub: 'Nozzle Integrity', icon: Zap },
               { label: 'Data_Density', value: '14.2 GB/s', sub: 'Inbound Telemetry', icon: Globe },
               { label: 'Model_Epoch', value: '7,402', sub: 'Refinement Cycles', icon: Activity },
             ].map((item, idx) => (
                <div key={idx} className="bg-card border border-border p-5 flex items-start justify-between relative overflow-hidden group">
                  <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <item.icon className="w-20 h-20" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest block">{item.label}</span>
                    <div className="text-xl font-bold tech-value text-white">{item.value}</div>
                    <span className="text-[8px] font-mono text-accent uppercase opacity-60 block mt-1">{">>"} {item.sub}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-accent/40" />
                  </div>
                </div>
             ))}
          </div>

        </div>
      </div>
    </div>
  );
}

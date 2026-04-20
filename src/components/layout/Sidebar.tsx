import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Fingerprint, 
  Microscope, 
  Network, 
  Terminal as TerminalIcon,
  Settings,
  ChevronRight,
  MessageSquare,
  BarChart2
} from 'lucide-react';
import { cn } from '../../lib/utils';

export type ViewType = 'overview' | 'explorer' | 'analyst' | 'topology' | 'system' | 'chat' | 'datascience' | 'settings';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
  { id: 'explorer', label: 'Intel Vault', icon: Fingerprint },
  { id: 'analyst', label: 'Analyst Lab', icon: Microscope },
  { id: 'datascience', label: 'Data Science', icon: BarChart2 },
  { id: 'topology', label: 'Network Topo', icon: Network },
  { id: 'chat', label: 'AI Support', icon: MessageSquare },
  { id: 'system', label: 'System Health', icon: TerminalIcon },
] as const;

export function Sidebar({ activeView, onViewChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-[70] w-64 border-r border-border bg-card/80 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-14 border-b border-border flex items-center px-5 justify-between gap-3 bg-black/20">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-accent drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="font-bold text-[10px] uppercase tracking-tighter leading-tight">Threat Intelligence Platform (TIP)</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/5 order-last">
            <ChevronRight className="w-4 h-4 rotate-180 opacity-40" />
          </button>
        </div>
      
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        <div className="px-4 py-2 mb-2">
          <span className="text-[8px] font-bold font-mono text-text-secondary/30 uppercase tracking-[0.3em]">Main_Subsystems</span>
        </div>
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onViewChange(item.id as ViewType);
              onClose();
            }}
            className={cn(
              "nav-item w-full",
              activeView === item.id && "nav-item-active"
            )}
          >
            <item.icon className={cn("w-4 h-4 transition-transform duration-300", activeView === item.id ? "scale-110" : "opacity-40")} />
            <span className="flex-1 text-left">{item.label}</span>
            {activeView === item.id && (
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            )}
          </button>
        ))}
      </nav>
      
      <div className="p-2 border-t border-border bg-black/20">
         <button 
           onClick={() => {
             onViewChange('settings');
             onClose();
           }}
           className={cn(
             "nav-item w-full",
             activeView === 'settings' && "nav-item-active"
           )}
         >
           <Settings className={cn("w-4 h-4", activeView === 'settings' ? "text-accent animate-spin-slow" : "opacity-40")} />
           <span>Config_Panel</span>
         </button>
      </div>
    </aside>
    </>
  );
}

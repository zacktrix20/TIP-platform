import React, { useState } from 'react';
import { Indicator } from '../../types';
import { Search, Filter, Download, ExternalLink, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

import { ViewType } from '../layout/Sidebar';

interface IntelExplorerProps {
  indicators: Indicator[];
  onSelect: (ind: Indicator) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
}

export function IntelExplorer({ 
  indicators, 
  onSelect, 
  searchQuery, 
  setSearchQuery, 
  typeFilter, 
  setTypeFilter 
}: IntelExplorerProps) {
  const filtered = indicators.filter(ind => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
                          (ind.value || '').toLowerCase().includes(query) || 
                          (ind.description || '').toLowerCase().includes(query) ||
                          (ind.tags || []).some(t => t.toLowerCase().includes(query));
    const matchesType = typeFilter === 'all' || ind.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-bg overflow-hidden">
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-tighter flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            Intel_Vault // Global_IOC_Archive
          </h2>
          <div className="h-4 w-px bg-border mx-2" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary opacity-40" />
            <input 
              type="text" 
              placeholder="Query archive..."
              className="bg-black/20 border border-border py-1.5 px-9 text-[10px] font-mono focus:outline-none focus:border-accent w-64 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <select 
             className="bg-black/20 border border-border text-[10px] font-mono px-3 py-1 focus:outline-none focus:border-accent"
             value={typeFilter}
             onChange={(e) => setTypeFilter(e.target.value)}
           >
             <option value="all">ALL_TYPES</option>
             <option value="ip">IP_ADDR</option>
             <option value="domain">DOMAIN</option>
             <option value="hash">FILE_HASH</option>
             <option value="url">URL_LINK</option>
           </select>
           <button className="tech-button h-8 px-4 flex items-center gap-2">
             <Download className="w-3 h-3" />
             <span className="text-[10px]">EXPORT_STIX</span>
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="border border-border bg-card overflow-hidden">
          <table className="w-full text-left border-collapse text-[11px] font-mono">
            <thead>
              <tr className="bg-black/40 border-b border-border">
                <th className="py-3 px-4 font-normal text-text-secondary uppercase opacity-60">Status</th>
                <th className="py-3 px-4 font-normal text-text-secondary uppercase opacity-60">Indicator</th>
                <th className="py-3 px-4 font-normal text-text-secondary uppercase opacity-60">Type</th>
                <th className="py-3 px-4 font-normal text-text-secondary uppercase opacity-60 text-center">Risk</th>
                <th className="py-3 px-4 font-normal text-text-secondary uppercase opacity-60">Source</th>
                <th className="py-3 px-4 font-normal text-text-secondary uppercase opacity-60 text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((ind) => (
                <tr 
                  key={ind.id}
                  onClick={() => onSelect(ind)}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-4">
                    {ind.riskScore > 70 ? (
                      <ShieldAlert className="w-3 h-3 text-warning animate-pulse" />
                    ) : (
                      <ShieldCheck className="w-3 h-3 text-accent" />
                    )}
                  </td>
                  <td className="py-4 px-4 font-bold text-white group-hover:text-accent transition-colors">
                    {ind.value}
                  </td>
                  <td className="py-4 px-4 uppercase text-text-secondary opacity-60">
                    {ind.type}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 border rounded-none text-[9px]",
                      ind.riskScore > 70 ? "border-warning/30 text-warning bg-warning/5" : "border-accent/30 text-accent bg-accent/5"
                    )}>
                      {ind.riskScore}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-text-secondary">
                    {ind.source}
                  </td>
                  <td className="py-4 px-4 text-right opacity-40">
                    <div className="flex flex-col items-end gap-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(ind.lastSeen), { addSuffix: true })}
                      </span>
                      <span className="text-[9px] uppercase tracking-tighter">Recv: {ind.activityCount}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center opacity-20">
               <ShieldAlert className="w-12 h-12 mb-4" />
               <p className="font-mono text-sm uppercase tracking-[0.3em]">No indicators matched the query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

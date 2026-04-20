import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Network, Shield, AlertTriangle, Zap, Info } from 'lucide-react';
import { Indicator } from '../../types';
import { cn } from '../../lib/utils';

interface NetworkTopologyProps {
  indicators: Indicator[];
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'central' | 'ip' | 'domain' | 'url' | 'hash';
  riskScore: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
  reliability: number;
}

export function NetworkTopology({ indicators }: NetworkTopologyProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || indicators.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Data Preparation
    const nodes: Node[] = [
      { id: 'central-shield', label: 'COMMAND_CENTER', type: 'central', riskScore: 0 }
    ];

    const links: Link[] = [];

    // Create unique nodes from indicators
    indicators.slice(0, 30).forEach(ind => {
      nodes.push({
        id: ind.id,
        label: ind.value,
        type: ind.type as any,
        riskScore: ind.riskScore
      });

      // Connect to central for demo purposes or cluster by type
      links.push({
        source: 'central-shield',
        target: ind.id,
        reliability: ind.confidence / 100
      });
    });

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    const link = svg.append("g")
      .attr("stroke", "var(--color-border)")
      .attr("stroke-opacity", 0.2)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => (d as any).reliability * 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any)
      .on("click", (event, d) => setSelectedNode(d));

    // Node Circles
    node.append("circle")
      .attr("r", d => d.type === 'central' ? 24 : 8)
      .attr("fill", d => {
        if (d.type === 'central') return "#10b981";
        if (d.riskScore > 70) return "#ef4444";
        return "#3b82f6";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .attr("class", d => d.riskScore > 70 ? "animate-pulse" : "");

    // Node Labels
    node.append("text")
      .attr("dy", d => d.type === 'central' ? 35 : 20)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.4)")
      .attr("font-size", "9px")
      .attr("font-family", "monospace")
      .text(d => d.label);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [indicators]);

  return (
    <div className="flex-1 flex overflow-hidden bg-bg relative" ref={containerRef}>
      {/* HUD Info */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <h2 className="text-2xl font-bold uppercase tracking-tighter flex items-center gap-3 mb-2">
          <Network className="w-8 h-8 text-accent" />
          Network_Topology // Graph_View
        </h2>
        <div className="flex items-center gap-4 text-[10px] font-mono opacity-40">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Secure_Node</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Neutral_Node</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Threat_Actor</span>
        </div>
      </div>

      {/* Selected Node Panel */}
      {selectedNode && (
        <div className="absolute top-8 right-8 z-20 w-72 bg-card border border-accent/30 p-6 shadow-2xl backdrop-blur-md">
           <div className="flex justify-between items-start mb-6">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-text-secondary hover:text-white transition-colors">
                <Zap className="w-4 h-4 rotate-45" />
              </button>
           </div>
           
           <h3 className="text-sm font-bold uppercase mb-1">{selectedNode.label}</h3>
           <p className="text-[10px] font-mono opacity-40 mb-4">{selectedNode.type.toUpperCase()}_ID: {selectedNode.id}</p>

           <div className="space-y-4">
              <div className="py-3 border-y border-border/50">
                 <div className="flex justify-between text-[10px] mb-2">
                    <span className="opacity-40 uppercase">Threat_Level</span>
                    <span className={cn(
                      "font-bold",
                      selectedNode.riskScore > 70 ? "text-warning" : "text-accent"
                    )}>{selectedNode.riskScore}%</span>
                 </div>
                 <div className="h-1 bg-border w-full overflow-hidden">
                    <div 
                      className={cn("h-full", selectedNode.riskScore > 70 ? "bg-warning" : "bg-accent")} 
                      style={{ width: `${selectedNode.riskScore}%` }} 
                    />
                 </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5">
                 <Info className="w-4 h-4 opacity-40" />
                 <span className="text-[9px] font-mono leading-tight opacity-60 uppercase">
                    Graph simulation stable. Inter-node latency at 12ms. No packet loss detected.
                 </span>
              </div>

              <button className="tech-button w-full h-10 flex items-center justify-center gap-2">
                 <Zap className="w-3 h-3" />
                 <span className="text-[10px]">ISOLATE_NODE</span>
              </button>
           </div>
        </div>
      )}

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}

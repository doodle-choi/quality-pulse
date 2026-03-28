"use client";

import React, { useMemo } from "react";
import { IssueAttr } from "@/components/dashboard/IssueCard";

interface ComponentMatrixProps {
  issues: IssueAttr[];
  onComponentClick: (component: string) => void;
  selectedComponent: string;
}

export function ComponentMatrix({ issues, onComponentClick, selectedComponent }: ComponentMatrixProps) {
  // Aggregate issues by failed_component
  const componentStats = useMemo(() => {
    const stats: Record<string, { count: number; severity: string; categories: Set<string> }> = {};
    
    issues.forEach(issue => {
      if (!issue.failed_component || issue.failed_component.toLowerCase() === "null") return;
      
      const comp = issue.failed_component;
      if (!stats[comp]) {
        stats[comp] = { count: 0, severity: "Low", categories: new Set() };
      }
      
      stats[comp].count += 1;
      stats[comp].categories.add(issue.product_category);
      
      const sevLevels = ["Low", "Medium", "High", "Critical"];
      if (sevLevels.indexOf(issue.severity) > sevLevels.indexOf(stats[comp].severity)) {
        stats[comp].severity = issue.severity;
      }
    });

    // Convert to array and sort by count descending
    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        count: data.count,
        severity: data.severity,
        categories: Array.from(data.categories),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12); // Top 12 components
  }, [issues]);

  const getSeverityColors = (severity: string, isSelected: boolean) => {
    if (isSelected) return "bg-primary text-white border-primary shadow-lg shadow-primary/20";
    
    switch (severity) {
      case "Critical": return "bg-critical/10 border-critical/30 text-critical hover:bg-critical/20";
      case "High": return "bg-high/10 border-high/30 text-high hover:bg-high/20";
      case "Medium": return "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20";
      default: return "bg-surface-alt border-border text-text-secondary hover:bg-surface-alt/80";
    }
  };

  if (componentStats.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center h-[200px] text-center">
        <div className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center mb-3">
          <span className="text-text-muted font-mono text-xs">N/A</span>
        </div>
        <p className="text-[13px] font-bold text-text-secondary">No Component Data Yet</p>
        <p className="text-[11px] text-text-muted mt-1 max-w-[250px]">The AI is waiting for new incidents to extract specific component failures.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border-light pb-3">
        <div className="flex flex-col">
          <h3 className="text-[14px] font-black text-text flex items-center gap-2">
            Component Risk Matrix
            <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-widest">SBOM</span>
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">Industry-wide component vulnerability</p>
        </div>
        {selectedComponent && (
          <button 
            onClick={() => onComponentClick("")}
            className="text-[10px] font-bold text-text-secondary hover:text-text bg-surface-alt px-2 py-1 rounded"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {componentStats.map((comp) => {
          const isSelected = selectedComponent === comp.name;
          return (
            <button
              key={comp.name}
              onClick={() => onComponentClick(isSelected ? "" : comp.name)}
              className={`text-left p-3 rounded-lg border transition-all duration-200 group flex flex-col justify-between h-full min-h-[80px] ${getSeverityColors(comp.severity, isSelected)}`}
              aria-label={`Filter by component ${comp.name}, ${comp.count} issues`}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="text-[12px] font-bold leading-tight line-clamp-2">
                  {comp.name}
                </span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-sm ${isSelected ? 'bg-white/20' : 'bg-surface/50'}`}>
                  x{comp.count}
                </span>
              </div>
              <div className="mt-auto flex flex-wrap gap-1">
                {comp.categories.slice(0, 2).map(cat => (
                  <span key={cat} className={`text-[9px] font-medium px-1 py-0.5 rounded uppercase tracking-tighter ${isSelected ? 'text-white/80 bg-black/10' : 'text-text-muted bg-surface/50'}`}>
                    {cat}
                  </span>
                ))}
                {comp.categories.length > 2 && (
                  <span className={`text-[9px] font-medium px-1 py-0.5 rounded ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>
                    +{comp.categories.length - 2}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

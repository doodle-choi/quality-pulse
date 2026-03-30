"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { ComparisonView, AnalyticalPanel } from "@/components/analytics/ComparisonView";
import { ConfigSidebar } from "@/components/analytics/ConfigSidebar";
import { DataInspector, InspectorPoint } from "@/components/analytics/DataInspector";
import { MultiMetricChart } from "@/components/analytics/MultiMetricChart";
import { ScatterAnomalyChart, ScatterPoint } from "@/components/analytics/ScatterAnomalyChart";

// === Dynamic Mock Data Setup ===
const MOCK_TIMELINE = [
  { date: "Oct 20", volume: 15, riskScore: 42 },
  { date: "Oct 21", volume: 22, riskScore: 48 },
  { date: "Oct 22", volume: 18, riskScore: 45 },
  { date: "Oct 23", volume: 45, riskScore: 88 }, // Spike
  { date: "Oct 24", volume: 30, riskScore: 65 },
  { date: "Oct 25", volume: 14, riskScore: 40 },
  { date: "Oct 26", volume: 21, riskScore: 50 },
];

const MOCK_SCATTER: ScatterPoint[] = [
  { id: "LOG-A12", name: "Thermal Sensor Event", x: 80, y: 75, size: 45, isAnomaly: true },
  { id: "LOG-A13", name: "Battery UI Glitch", x: 20, y: 30, size: 80 },
  { id: "LOG-A14", name: "Network Disconnect", x: 40, y: 25, size: 120 },
  { id: "LOG-A15", name: "Power Surge Report", x: 85, y: 90, size: 30, isAnomaly: true },
  { id: "LOG-A16", name: "Display Artifacts", x: 60, y: 50, size: 65 },
  { id: "LOG-A17", name: "Audio Desync", x: 30, y: 40, size: 150 },
  { id: "LOG-A18", name: "Motor Stall", x: 70, y: 80, size: 25, isAnomaly: true },
];

export default function VisualAnalyticsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [splitMode, setSplitMode] = useState<"single" | "split">("split");
  const [inspectedPoint, setInspectedPoint] = useState<InspectorPoint | null>(null);

  // Inspector format mapper
  const handlePointClick = (point: ScatterPoint) => {
     setInspectedPoint({ 
       id: point.id, 
       name: point.name, 
       status: point.isAnomaly ? "critical" : point.y > 60 ? "high" : "safe", 
       impact: point.x, 
       riskScore: point.y, 
       volume: point.size 
     });
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row overflow-hidden bg-background">
      {/* 1. Left Data Configuration Sidebar */}
      <ConfigSidebar 
         isOpen={isSidebarOpen} 
         onClose={() => setIsSidebarOpen(false)} 
         className="z-10"
      />

      {/* 2. Main Analytics Canvas */}
      <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300">
        
        {/* Header Toolbar */}
        <div className="flex justify-between items-center p-4 border-b border-outline/10 bg-surface/50 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
             {!isSidebarOpen && (
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-1.5 rounded bg-surface border border-outline/20 text-text hover:bg-surface-high transition-colors"
                  aria-label="Open Configuration"
                >
                  <MaterialIcon name="menu_open" size="md" />
                </button>
             )}
             <div>
                <h1 className="text-xl font-bold tracking-tight text-text font-headline flex items-center gap-2">
                   <MaterialIcon name="insert_chart_outlined" className="text-primary" /> 
                   Analytics Workspace
                </h1>
             </div>
          </div>

          <div className="flex items-center bg-surface border border-outline/10 rounded-md p-1 shadow-sm">
             <button
               onClick={() => setSplitMode("single")}
               className={`p-1.5 rounded transition-colors ${splitMode === "single" ? "bg-surface-high text-primary shadow-sm" : "text-text-muted hover:text-text"}`}
               aria-label="Single View"
               title="Focus Mode (Single View)"
             >
               <MaterialIcon name="crop_square" size="sm" />
             </button>
             <button
               onClick={() => setSplitMode("split")}
               className={`p-1.5 rounded transition-colors ${splitMode === "split" ? "bg-surface-high text-primary shadow-sm" : "text-text-muted hover:text-text"}`}
               aria-label="Split View"
               title="Comparison Mode (Split View)"
             >
               <MaterialIcon name="view_week" size="sm" />
             </button>
          </div>
        </div>

        {/* Dynamic Grid / Split View Area */}
        <div className="flex-1 overflow-hidden p-6 relative bg-surface-lowest">
           <ComparisonView splitMode={splitMode}>
              
              {/* Left/Main Panel: Trend Analysis */}
              <AnalyticalPanel 
                 title="Multi-Metric Trend Analysis" 
                 subtitle="Volume vs Risk Trajectory (Last 7 Days)"
                 headerRight={<button className="text-primary hover:bg-primary/10 p-1 rounded-sm transition-colors text-xs font-semibold uppercase tracking-wider">Export</button>}
              >
                 <div className="absolute inset-0 pt-4">
                    <MultiMetricChart data={MOCK_TIMELINE} />
                 </div>
              </AnalyticalPanel>

              {/* Right/Secondary Panel: Anomaly Scatter (Hidden if Single Mode) */}
              {splitMode === "split" && (
                 <AnalyticalPanel 
                   title="Risk Pattern Distribution" 
                   subtitle="Correlation: Impact vs Severity Probability"
                   headerRight={<span className="text-xs bg-tertiary/10 text-tertiary px-2 py-1 rounded font-mono border border-tertiary/20">3 Anomalies</span>}
                 >
                   <div className="absolute inset-0 pt-4">
                      <ScatterAnomalyChart data={MOCK_SCATTER} onPointClick={handlePointClick} />
                   </div>
                 </AnalyticalPanel>
              )}
           </ComparisonView>
        </div>
      </div>

      {/* 3. Right Slide-over Inspector */}
      <DataInspector 
         isOpen={inspectedPoint !== null} 
         point={inspectedPoint} 
         onClose={() => setInspectedPoint(null)} 
      />
    </div>
  );
}


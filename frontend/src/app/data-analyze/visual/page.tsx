"use client";

import { useState } from "react";
import { MaterialIcon } from "../../../components/ui/MaterialIcon";

// Mock data for the Dense Data Table
const TOP_INCIDENTS = [
  { id: "INC-9482", date: "2023-10-24", severity: "critical", trend: "+12%", confidence: "94%" },
  { id: "INC-9481", date: "2023-10-24", severity: "high", trend: "+5%", confidence: "88%" },
  { id: "INC-9475", date: "2023-10-23", severity: "critical", trend: "+20%", confidence: "97%" },
  { id: "INC-9460", date: "2023-10-22", severity: "safe", trend: "-2%", confidence: "91%" },
  { id: "INC-9452", date: "2023-10-21", severity: "high", trend: "+1%", confidence: "85%" },
];

export default function VisualAnalyticsPage() {
  const [isCompareMode, setIsCompareMode] = useState(false);

  return (
    <div className="h-full w-full flex flex-col space-y-8 p-6 bg-background animate-in fade-in duration-500 overflow-y-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text font-headline">
            Visual Analytics
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Advanced Cross-Metric Comparison
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-outline/20 rounded-md hover:bg-surface-high focus-visible:ring-2 focus-visible:outline-none transition-colors duration-200"
            aria-label="Saved Views"
          >
            <MaterialIcon name="bookmark_border" size="sm" />
            <span>Saved Views</span>
            <MaterialIcon name="expand_more" size="sm" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-md shadow-sm hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none transition-colors duration-200"
            aria-label="Export Data"
          >
            <MaterialIcon name="download" size="sm" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* 2. Local Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-surface p-4 rounded-lg">
        {/* Compare Toggle */}
        <div className="flex items-center gap-2 mr-4">
          <label htmlFor="compare-toggle" className="text-sm font-medium text-text">
            Compare
          </label>
          <button
            id="compare-toggle"
            role="switch"
            aria-checked={isCompareMode}
            tabIndex={0}
            onClick={() => setIsCompareMode(!isCompareMode)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsCompareMode(!isCompareMode);
              }
            }}
            className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none ${
              isCompareMode ? "bg-primary" : "bg-outline/30"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                isCompareMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Metric Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            className="text-sm bg-transparent border border-outline/20 rounded-md py-1.5 px-3 focus-visible:ring-2 focus-visible:outline-none cursor-pointer hover:bg-surface-high transition-colors"
            aria-label="Select primary metric"
          >
            <option>Issue Volume</option>
            <option>Risk Score</option>
            <option>Resolution Time</option>
          </select>
          <span className="text-text-muted text-sm font-medium">vs</span>
          <select
            className="text-sm bg-transparent border border-outline/20 rounded-md py-1.5 px-3 focus-visible:ring-2 focus-visible:outline-none cursor-pointer hover:bg-surface-high transition-colors"
            aria-label="Select secondary metric"
          >
            <option>Risk Score</option>
            <option>Issue Volume</option>
            <option>Customer Impact</option>
          </select>
        </div>

        {/* Date Range Picker Placeholder */}
        <div className="ml-auto flex items-center gap-2">
           <button
             type="button"
             className="flex items-center gap-2 text-sm bg-transparent border border-outline/20 rounded-md py-1.5 px-3 hover:bg-surface-high focus-visible:ring-2 focus-visible:outline-none transition-colors"
             aria-label="Select Date Range"
           >
             <MaterialIcon name="date_range" size="sm" className="text-text-muted" />
             <span>Last 30 Days</span>
             <MaterialIcon name="expand_more" size="sm" />
           </button>
        </div>
      </div>

      {/* 3. Dense Data Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Widget 1: Multi-dimensional Trend Analysis (Wide) */}
        <div className="lg:col-span-2 bg-surface rounded-xl p-5 flex flex-col min-h-[320px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-text">Trend Analysis</h3>
            <button aria-label="More options" className="text-text-muted hover:text-text rounded p-1 focus-visible:ring-2">
                <MaterialIcon name="more_vert" size="sm" />
            </button>
          </div>
          <div className="flex-1 w-full bg-surface-low rounded-md border-0 flex items-center justify-center relative overflow-hidden">
             {/* Abstract representation of a chart */}
             <div className="absolute inset-x-0 bottom-4 h-1/2 flex items-end justify-between px-4 opacity-40">
                {[40, 60, 30, 80, 50, 90, 45, 70, 35, 65, 20, 75].map((h, i) => (
                   <div key={i} className="w-[4%] bg-primary rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
             </div>
             {/* Critical Threshold line */}
             <div className="absolute top-[30%] left-0 right-0 h-px border-t border-dashed border-[var(--critical,rgb(220,38,38))] z-10 opacity-70">
                <span className="absolute -top-5 right-2 text-[10px] font-mono text-[var(--critical,rgb(220,38,38))]">CRITICAL THRESHOLD</span>
             </div>
             <p className="text-sm text-text-muted font-medium z-20">Multi-line Chart Visualization</p>
          </div>
        </div>

        {/* Widget 2: Risk Distribution (Narrow) */}
        <div className="col-span-1 bg-surface rounded-xl p-5 flex flex-col min-h-[320px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-text">Risk by Region</h3>
            <MaterialIcon name="pie_chart" size="sm" className="text-text-muted" />
          </div>
          <div className="flex-1 w-full flex flex-col gap-4 justify-center">
             {/* Abstract Stacked Bar Chart */}
             <div className="w-full flex flex-col gap-1">
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-text-muted">North America</span>
                 <span className="font-mono text-text">1,420</span>
               </div>
               <div className="w-full h-3 rounded-full flex overflow-hidden">
                 <div className="h-full bg-[var(--critical,rgb(220,38,38))]" style={{ width: '15%' }}></div>
                 <div className="h-full bg-amber-500" style={{ width: '35%' }}></div>
                 <div className="h-full bg-emerald-500" style={{ width: '50%' }}></div>
               </div>
             </div>

             <div className="w-full flex flex-col gap-1">
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-text-muted">Europe</span>
                 <span className="font-mono text-text">840</span>
               </div>
               <div className="w-full h-3 rounded-full flex overflow-hidden">
                 <div className="h-full bg-[var(--critical,rgb(220,38,38))]" style={{ width: '5%' }}></div>
                 <div className="h-full bg-amber-500" style={{ width: '20%' }}></div>
                 <div className="h-full bg-emerald-500" style={{ width: '75%' }}></div>
               </div>
             </div>

             <div className="w-full flex flex-col gap-1">
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-text-muted">Asia Pacific</span>
                 <span className="font-mono text-text">650</span>
               </div>
               <div className="w-full h-3 rounded-full flex overflow-hidden">
                 <div className="h-full bg-[var(--critical,rgb(220,38,38))]" style={{ width: '25%' }}></div>
                 <div className="h-full bg-amber-500" style={{ width: '40%' }}></div>
                 <div className="h-full bg-emerald-500" style={{ width: '35%' }}></div>
               </div>
             </div>
          </div>
          {/* Legend */}
          <div className="flex justify-between mt-4 pt-4 border-t border-outline/10 text-xs">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--critical,rgb(220,38,38))]"></span>Critical</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>High</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Safe</div>
          </div>
        </div>

        {/* Widget 3: Anomaly Scatter Plot (Narrow) */}
        <div className="col-span-1 bg-surface rounded-xl p-5 flex flex-col min-h-[320px]">
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-text">Anomaly Detection</h3>
            <span className="text-xs bg-surface-low px-2 py-1 rounded text-text-muted border border-outline/10">Risk vs Impact</span>
          </div>
          <div className="flex-1 w-full bg-surface-low rounded-md border-0 relative flex items-center justify-center">
             {/* Scatter Dots Simulation */}
             <div className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-emerald-500/60"></div>
             <div className="absolute bottom-1/3 left-1/2 w-2 h-2 rounded-full bg-amber-500/60"></div>
             <div className="absolute top-1/2 left-1/3 w-2 h-2 rounded-full bg-amber-500/60"></div>

             {/* Critical Anomaly */}
             <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-[var(--critical,rgb(220,38,38))] ring-4 ring-[var(--critical,rgba(220,38,38,0.2))] animate-pulse"></div>

             <p className="text-sm text-text-muted font-medium z-10">Scatter Plot Visualization</p>
          </div>
        </div>

        {/* Widget 4: Dense Data Table (Wide) */}
        <div className="lg:col-span-2 bg-surface rounded-xl p-5 flex flex-col min-h-[320px] overflow-hidden">
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-text">Top Incidents</h3>
            <button className="text-sm text-primary hover:underline font-medium focus-visible:ring-2 focus-visible:outline-none rounded px-1">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs text-text-muted border-b border-outline/10">
                <tr>
                  <th scope="col" className="pb-3 pr-4 font-medium">Incident ID</th>
                  <th scope="col" className="pb-3 px-4 font-medium">Date Detected</th>
                  <th scope="col" className="pb-3 px-4 font-medium">Severity</th>
                  <th scope="col" className="pb-3 px-4 font-medium">Trend</th>
                  <th scope="col" className="pb-3 pl-4 font-medium text-right">Root Cause Conf.</th>
                </tr>
              </thead>
              <tbody className="divide-y-0 text-text">
                {TOP_INCIDENTS.map((incident) => (
                  <tr key={incident.id} className="hover:bg-surface-high transition-colors group cursor-pointer">
                    <td className="py-3 pr-4">
                      <span className="font-mono text-xs bg-surface-low px-1.5 py-0.5 rounded border border-outline/10 text-text-muted group-hover:border-outline/30 transition-colors">
                        {incident.id}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{incident.date}</td>
                    <td className="py-3 px-4">
                       <div className="flex items-center gap-2">
                         <span className={`w-2 h-2 rounded-full ${
                           incident.severity === 'critical' ? 'bg-[var(--critical,rgb(220,38,38))] shadow-[0_0_8px_var(--critical,rgb(220,38,38))]' :
                           incident.severity === 'high' ? 'bg-amber-500' : 'bg-emerald-500'
                         }`}></span>
                         <span className="text-xs capitalize">{incident.severity}</span>
                       </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-mono text-xs ${incident.trend.startsWith('+') ? 'text-[var(--critical,rgb(220,38,38))]' : 'text-emerald-500'}`}>
                        {incident.trend}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right font-mono text-xs">{incident.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

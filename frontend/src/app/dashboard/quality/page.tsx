"use client";

import { useState, useMemo } from 'react';
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { QualityIndicatorChart } from "@/components/analytics/QualityIndicatorChart";
import { fetchMockQualityData, Granularity, MetricType } from "@/shared/mockDataQuality";
import { clsx } from 'clsx';
import { useTranslation } from "react-i18next";

export default function QualityPage() {
  const { t } = useTranslation();

  // Selected State
  const [activeYears, setActiveYears] = useState<number[]>([new Date().getFullYear() - 1, new Date().getFullYear()]);
  const [metric, setMetric] = useState<MetricType>('total_issues');
  const [granularity, setGranularity] = useState<Granularity>('month');
  const [region, setRegion] = useState<string>('Global');

  // Generate Data based on State
  const chartData = useMemo(() => {
    return fetchMockQualityData(activeYears.sort(), metric, granularity, region);
  }, [activeYears, metric, granularity, region]);

  // Derived KPIs for Quick View (Top Cards)
  const currentYearData = chartData.series.find(s => s.year === new Date().getFullYear());
  const currentTarget = chartData.targets.find(t => t.year === new Date().getFullYear())?.value || 0;
  
  // Calculate Current vs Target difference if we have data
  let projectionStatus = 'ON TRACK';
  let statusColor = 'text-green-500';
  let diffPercentage = 0;

  if (currentYearData) {
      // Find the last projected value to show where we'll end up
      const lastProjected = currentYearData.data[currentYearData.data.length - 1]?.value || 0;
      if (lastProjected > currentTarget && metric === 'total_issues') {
        projectionStatus = 'AT RISK';
        statusColor = 'text-red-500';
      }
      diffPercentage = ((lastProjected - currentTarget) / currentTarget) * 100;
  }

  const toggleYear = (y: number) => {
    setActiveYears(prev => prev.includes(y) ? prev.filter(v => v !== y) : [...prev, y]);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 animate-fade-in-up bg-surface">
      {/* Header & Controls Layout */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-text tracking-tight flex items-center gap-2">
            <MaterialIcon name="speed" size="lg" className="text-primary" />
            {t("navigation.Quality Indicator Status", "Quality Indicator Status")}
          </h1>
          <p className="text-sm font-medium text-text-muted mt-1">
            Dynamic YoY Tracking & Target Projections
          </p>
        </div>

        {/* Control Panel */}
        <div className="flex flex-wrap gap-2 items-center bg-surface-low border border-border-ghost/10 p-1.5 rounded-xl">
          
          {/* Metric Selector */}
          <div className="flex bg-surface rounded-lg p-0.5 border border-border-ghost/10">
            <button onClick={() => setMetric('total_issues')} className={clsx("px-3 py-1.5 text-xs font-bold rounded-md transition-colors", metric === 'total_issues' ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface-high")}>Issues</button>
            <button onClick={() => setMetric('defect_rate')} className={clsx("px-3 py-1.5 text-xs font-bold rounded-md transition-colors", metric === 'defect_rate' ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface-high")}>Defect Rate</button>
          </div>

          <div className="w-px h-6 bg-border-ghost/20 mx-1"></div>

          {/* Granularity Selector */}
          <div className="flex bg-surface rounded-lg p-0.5 border border-border-ghost/10">
            <button onClick={() => setGranularity('week')} className={clsx("px-3 py-1.5 text-xs font-bold rounded-md transition-colors", granularity === 'week' ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface-high")}>W</button>
            <button onClick={() => setGranularity('month')} className={clsx("px-3 py-1.5 text-xs font-bold rounded-md transition-colors", granularity === 'month' ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface-high")}>M</button>
          </div>

          <div className="w-px h-6 bg-border-ghost/20 mx-1"></div>

          {/* Dynamic Year Toggles */}
          <div className="flex gap-1 items-center px-2">
            <MaterialIcon name="calendar_month" size="sm" className="text-text-muted mr-1" />
            {[2024, 2025, 2026].map(y => (
              <button 
                key={y}
                onClick={() => toggleYear(y)} 
                className={clsx(
                  "px-2 py-1 text-xs font-bold rounded-md border transition-all cursor-pointer", 
                  activeYears.includes(y) 
                    ? "bg-secondary/10 border-secondary/30 text-secondary" 
                    : "bg-surface border-border-ghost/10 text-text-muted opacity-50 hover:opacity-100"
                )}
              >
                {y}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0 h-full">
        
        {/* Core Chart (Span 3 Cols) */}
        <div className="lg:col-span-3 bg-surface-low border border-border-ghost/5 rounded-2xl flex flex-col shadow-sm min-h-[500px]">
          <div className="px-6 py-4 border-b border-border-ghost/5 flex justify-between items-center">
            <h3 className="font-bold text-sm text-text-muted uppercase tracking-widest">
              Performance Trajectory ({region})
            </h3>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                <span className="w-2 h-0.5 bg-primary rounded-full"></span> Actual
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                <span className="w-2 h-0.5 bg-primary rounded-full border-b border-dashed"></span> Projected
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                <span className="w-2 h-0.5 border-b border-dashed border-gray-400"></span> Target
              </span>
            </div>
          </div>
          <div className="flex-1 p-2">
             <QualityIndicatorChart data={chartData} />
          </div>
        </div>

        {/* Vertical Side Insights */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Main KPI Card */}
          <div className="bg-surface-low rounded-2xl border border-border-ghost/5 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <MaterialIcon name="monitoring" className="text-orange-500" />
              </div>
              <span className={clsx("text-xs font-black px-2.5 py-1 rounded-full", metric === 'total_issues' && diffPercentage > 0 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500")}>
                {statusColor === 'text-red-500' ? "AT RISK" : "ON TRACK"}
              </span>
            </div>
            <h4 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">YE Projection vs Target</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-text">{diffPercentage > 0 ? '+' : ''}{diffPercentage.toFixed(1)}%</span>
            </div>
            <p className="text-xs text-text-muted mt-2 font-medium">
              Based on the current run rate, the projected year-end value is significantly deviating from the established KPI limits.
            </p>
          </div>

          {/* Regional Toggles */}
          <div className="bg-surface-low rounded-2xl border border-border-ghost/5 p-6 shadow-sm flex-1">
             <h4 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-4">Region Filtration</h4>
             <div className="flex flex-col gap-2">
               {['Global', 'NA', 'EMEA', 'APAC'].map(r => (
                 <button 
                  key={r}
                  onClick={() => setRegion(r)}
                  className={clsx(
                    "flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-bold",
                    region === r 
                      ? "bg-surface-highest border-border-ghost/20 text-text shadow-sm" 
                      : "bg-transparent border-transparent text-text-muted hover:bg-surface-high/50"
                  )}
                 >
                   <span>{r}</span>
                   {region === r && <MaterialIcon name="check_circle" size="sm" className="text-primary" />}
                 </button>
               ))}
             </div>
          </div>

        </div>
      </div>

      {/* Raw Data Tables Section */}
      <div className="mt-6 flex flex-col gap-4">
        <h3 className="font-black text-lg text-text tracking-tight flex items-center gap-2">
          <MaterialIcon name="table_chart" className="text-primary" />
          Raw Data Explorer ({metric.replace('_', ' ').toUpperCase()})
        </h3>
        
        <div 
          className="grid grid-cols-1 gap-6 items-start"
          style={{ gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))` }}
        >
          {chartData.series.map(yearData => {
            const targetEntry = chartData.targets.find(t => t.year === yearData.year);
            const targetVal = targetEntry?.value || 0;

            return (
              <div key={yearData.year} className="bg-surface-low border border-border-ghost/10 rounded-2xl overflow-hidden shadow-sm flex flex-col max-h-[400px]">
                <div className="bg-surface px-4 py-3 border-b border-border-ghost/10 flex justify-between items-center sticky top-0 z-10">
                  <h4 className="font-bold text-sm text-text">{yearData.year} Data</h4>
                  <span className="text-xs font-semibold text-text-muted bg-surface-high px-2 py-1 rounded-md">
                    Target: {targetVal.toFixed(2)}
                  </span>
                </div>
                <div className="overflow-y-auto flex-1 p-0">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-surface-high/30 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">Period</th>
                        <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider text-right">Value</th>
                        <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-ghost/5">
                      {yearData.data.map((row, idx) => {
                        const isUnderTarget = metric === 'total_issues' || metric === 'resolution_time' || metric === 'defect_rate' 
                          ? row.value <= targetVal 
                          : row.value >= targetVal;
                        
                        return (
                          <tr key={idx} className="hover:bg-surface-high/30 transition-colors">
                            <td className="px-4 py-2.5 font-medium text-text">{row.date} {row.isProjected && <span className="text-[10px] text-primary ml-1">(Est)</span>}</td>
                            <td className="px-4 py-2.5 text-right font-mono text-text">{row.value.toFixed(2)}</td>
                            <td className="px-4 py-2.5 text-center">
                              {row.isProjected ? (
                                <span className={clsx("text-xs font-bold", isUnderTarget ? "text-green-500/70" : "text-amber-500/70")}>-</span>
                              ) : isUnderTarget ? (
                                <span className="inline-flex items-center text-green-500"><MaterialIcon name="check_circle" size="sm" /></span>
                              ) : (
                                <span className="inline-flex items-center text-red-500"><MaterialIcon name="warning" size="sm" /></span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

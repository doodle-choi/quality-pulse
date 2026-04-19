"use client";

import { useMemo, useState, useEffect } from "react";
import { RiskChart } from "@/components/dashboard/RiskChart";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { SparklineChart } from "@/components/dashboard/SparklineChart";
import { IssueAttr } from "@/components/dashboard/IssueCard";
import { AutoRefresh } from "@/components/AutoRefresh";
import { MaterialIcon } from "../ui/MaterialIcon";
import {
  MOCK_RISK_DATA,
  MOCK_TIMELINE_DATA,
  MOCK_KPI_STATS,
  MOCK_REGIONAL_DATA,
  MOCK_EVENTS,
} from "@/shared/mockData";

import { useTranslation } from "react-i18next";

export function DashboardContainer({ initialIssues }: { initialIssues: IssueAttr[] }) {
  const { t } = useTranslation();
  const hasData = initialIssues && initialIssues.length > 0;
  
  // For LIVE SYNC timestamp
  const [stamp, setStamp] = useState<string>("");
  useEffect(() => {
    setStamp(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setStamp(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const riskData = useMemo(() => {
    if (!hasData) return MOCK_RISK_DATA;
    return [
      { name: "Critical Hazards", value: initialIssues.filter(i => i.severity === "Critical").length },
      { name: "High Risks", value: initialIssues.filter(i => i.severity === "High").length },
      { name: "Medium Quality", value: initialIssues.filter(i => i.severity === "Medium").length },
      { name: "Low/Monitoring", value: initialIssues.filter(i => i.severity === "Low").length },
    ].filter(d => d.value > 0);
  }, [initialIssues, hasData]);

  const timelineData = useMemo(() => {
    if (!hasData) return MOCK_TIMELINE_DATA;
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });
    return last7Days.map(date => {
      const count = initialIssues.filter(i => {
        const compareDate = i.published_at ? i.published_at.split("T")[0] : i.created_at.split("T")[0];
        return compareDate === date;
      }).length;
      return { date: date.slice(5), count };
    });
  }, [initialIssues, hasData]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <AutoRefresh interval={15000} />

      {/* ---- Header & Period Comparison Controls ---- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-text font-headline">
              {t("dashboard.Performance Ecosystem", "Performance Ecosystem")}
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
              {t("dashboard.Live Sync", "LIVE SYNC")}
              <span className="ml-1 opacity-60 font-mono">{stamp}</span>
            </div>
          </div>
          <p className="text-text-muted font-medium text-sm mt-2">
            {t("dashboard.Real-time analytical layer", "Real-time analytical layer for")} {t("dashboard.quality intelligence", "quality intelligence")}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-surface-low rounded-xl p-1.5 border border-border-ghost/5">
          <button className="px-4 py-2 bg-surface-lowest shadow-sm rounded-lg text-xs font-bold text-text">{t("dashboard.Last 30 Days", "Last 30 Days")}</button>
          <button className="px-4 py-2 text-xs font-bold text-text-muted hover:text-text transition-colors">{t("dashboard.Quarterly", "Quarterly")}</button>
          <button className="px-4 py-2 text-xs font-bold text-text-muted hover:text-text transition-colors">{t("dashboard.Yearly", "Yearly")}</button>
          <div className="w-px h-6 bg-border-ghost/30 mx-1" />
          <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-lg text-xs font-bold active:scale-95 transition-all">
            <MaterialIcon name="calendar_today" size="sm" />
            {t("dashboard.Custom Range", "Custom Range")}
          </button>
        </div>
      </div>

      {/* ---- KPI Cards Grid (Stitch Bento) ---- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_KPI_STATS.map((kpi, idx) => (
          <div 
            key={idx} 
            className="bg-surface-lowest dark:bg-surface-container rounded-xl p-6 shadow-sm flex flex-col justify-between hover:bg-surface-high/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6"
            style={{ animationFillMode: "both", animationDelay: `${idx * 150}ms`, animationDuration: "700ms" }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-surface-high rounded-lg text-text">
                <MaterialIcon name={kpi.icon} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                kpi.changeType === "positive"
                  ? "text-tertiary-fixed-dim bg-tertiary-container"
                  : kpi.changeType === "negative"
                    ? "text-error bg-error-container"
                    : "text-tertiary-fixed-dim bg-tertiary-container"
              }`}>
                {kpi.changeType === "positive" && <MaterialIcon name="arrow_upward" size="sm" />}
                {kpi.changeType === "negative" && <MaterialIcon name="arrow_downward" size="sm" />}
                {kpi.changeType === "neutral" && <MaterialIcon name="auto_graph" size="sm" />}
                {kpi.change}
              </div>
            </div>
            
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{kpi.label}</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-black text-text font-headline">{kpi.value}</h3>
                  {kpi.unit && <span className="text-sm font-bold text-text-muted uppercase">{kpi.unit}</span>}
                </div>
              </div>
              
              {kpi.sparklineData && (
                <div className="w-24 h-12 opacity-80">
                  <SparklineChart data={kpi.sparklineData} color={kpi.changeType} />
                </div>
              )}
            </div>

            {/* If no sparkline but has progress, fallback to bar */}
            {!kpi.sparklineData && kpi.progress !== undefined && (
              <div className="mt-5 w-full bg-surface-high h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all duration-1000 ease-out" style={{ width: `${kpi.progress}%` }} />
              </div>
            )}
            
            {kpi.note && (
              <p className="mt-4 text-[10px] text-text-muted font-medium bg-surface-alt/50 p-2 rounded">{kpi.note}</p>
            )}
          </div>
        ))}
      </div>

      {/* ---- Main Data Visual Row (12-col Bento Grid) ---- */}
      <div className="grid grid-cols-12 gap-6">
        {/* Period-over-period Chart (8 cols) */}
        <div 
          className="col-span-12 lg:col-span-8 bg-surface-lowest dark:bg-surface-container rounded-xl p-6 md:p-8 shadow-sm flex flex-col animate-in fade-in slide-in-from-bottom-8"
          style={{ animationFillMode: "both", animationDelay: "300ms", animationDuration: "700ms" }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-text font-headline">{t("dashboard.Analytical Trajectory", "Analytical Trajectory")}</h3>
              <p className="text-xs text-text-muted mt-0.5">{t("dashboard.7-day volume trend", "7-day volume trend cross-referenced globally")}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-text-muted uppercase">{t("dashboard.Current", "Current")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-surface-highest border border-border/50" />
                <span className="text-[10px] font-bold text-text-muted uppercase">{t("dashboard.Previous", "Previous")}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[250px]">
            <TimelineChart data={timelineData} />
          </div>
        </div>

        {/* Right Column (4 cols) — Efficiency + Insight */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Donut Risk Chart */}
          <div 
            className="bg-surface-low dark:bg-surface-container rounded-xl p-6 flex-1 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 overflow-hidden"
            style={{ animationFillMode: "both", animationDelay: "450ms", animationDuration: "700ms" }}
          >
            <h3 className="text-lg font-bold text-text font-headline mb-2">{t("dashboard.Severity Distribution", "Severity Distribution")}</h3>
            <div className="w-full h-52 relative">
              <RiskChart data={riskData} />
            </div>
          </div>

          {/* Active Insight Card (Dark accent) */}
          <div 
            className="bg-primary-container rounded-xl p-6 text-white overflow-hidden relative animate-in fade-in slide-in-from-bottom-8"
            style={{ animationFillMode: "both", animationDelay: "600ms", animationDuration: "700ms" }}
          >
            <div className="relative z-10">
              <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-widest">{t("dashboard.Active Insight", "Active Insight")}</p>
              <h4 className="text-lg font-bold mb-4 font-headline">{t("dashboard.Issue volume increased", "Issue volume increased by 14% this morning.")}</h4>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <MaterialIcon name="flash_on" className="text-tertiary-fixed" size="sm" />
                </div>
                <span className="text-xs font-medium text-on-surface-variant flex-1">{t("dashboard.Investigation recommended", "Investigation recommended.")}</span>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-tertiary-fixed/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ---- Bottom Row: Regional Distribution + Events ---- */}
      <div className="grid grid-cols-12 gap-6">
        {/* Regional Distribution */}
        <div 
          className="col-span-12 lg:col-span-4 bg-surface-lowest dark:bg-surface-container rounded-xl p-6 shadow-sm flex flex-col animate-in fade-in slide-in-from-bottom-8"
          style={{ animationFillMode: "both", animationDelay: "750ms", animationDuration: "700ms" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text font-headline">{t("dashboard.Regional Distribution", "Regional Distribution")}</h3>
            <MaterialIcon name="public" size="sm" className="text-text-muted" />
          </div>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {MOCK_REGIONAL_DATA.map((r, i) => (
              <div key={r.region} className="flex items-center gap-4 group">
                <span className="text-[11px] font-bold text-text-muted w-10 uppercase tracking-wider">{r.region}</span>
                <div className="flex-1 h-2.5 bg-surface-high rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110" 
                    style={{ width: `${r.percentage}%`, animationDelay: `${i * 100}ms` }} 
                  />
                </div>
                <span className="text-xs font-black text-text w-10 text-right">{r.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events List */}
        <div 
          className="col-span-12 lg:col-span-8 bg-surface-lowest dark:bg-surface-container rounded-xl shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8"
          style={{ animationFillMode: "both", animationDelay: "900ms", animationDuration: "700ms" }}
        >
          <div className="p-6 border-b border-border-ghost/10 flex justify-between items-center">
            <h3 className="text-lg font-bold text-text font-headline">{t("dashboard.Recent Quality Events", "Recent Quality Events")}</h3>
            <button className="text-xs font-bold text-text-muted hover:text-text flex items-center gap-1 transition-colors px-2 py-1 bg-surface-alt rounded-md">
              <MaterialIcon name="filter_list" size="sm" />
              {t("dashboard.Filter", "Filter")}
            </button>
          </div>
          <div className="divide-y divide-border-ghost/5 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {MOCK_EVENTS.map((event, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-high/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    event.statusType === "success"
                      ? "bg-tertiary-container/50 border border-tertiary-container"
                      : event.statusType === "error"
                        ? "bg-error-container/50 border border-error-container"
                        : "bg-surface-high/50 border border-surface-highest"
                  }`}>
                    <MaterialIcon
                      name={event.icon}
                      className={
                        event.statusType === "success"
                          ? "text-tertiary-fixed"
                          : event.statusType === "error"
                            ? "text-error"
                            : "text-text-muted"
                      }
                      size="md"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text leading-tight">{event.title}</p>
                    <p className="text-[11px] text-text-muted mt-1 font-medium">{event.subtitle}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right ml-14 sm:ml-0">
                  <span className={`px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-sm ${
                    event.statusType === "success"
                      ? "bg-tertiary-container text-tertiary-fixed-dim"
                      : event.statusType === "error"
                        ? "bg-error-container text-error"
                        : "bg-surface-high text-text-muted"
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* FAB removed for cleaner Command Center aesthetic */}
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { RiskChart } from "@/components/dashboard/RiskChart";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
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
    <div className="flex flex-col gap-8">
      <AutoRefresh interval={15000} />

      {/* ---- Header & Period Comparison Controls ---- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text font-headline">
            Performance Ecosystem
          </h1>
          <p className="text-text-muted font-medium text-sm mt-1">
            Real-time analytical layer for {t("dashboard.quality intelligence", "quality intelligence")}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-surface-low dark:bg-surface-low p-1.5 rounded-xl">
          <button className="px-4 py-2 bg-white dark:bg-surface-high shadow-sm rounded-lg text-xs font-bold text-text">{t("dashboard.Last 30 Days", "Last 30 Days")}</button>
          <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">{t("dashboard.Quarterly", "Quarterly")}</button>
          <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">{t("dashboard.Yearly", "Yearly")}</button>
          <div className="w-px h-6 bg-slate-300 dark:bg-outline-variant mx-1" />
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold active:scale-95 transition-transform">
            <MaterialIcon name="calendar_today" size="sm" />
            {t("dashboard.Custom Range", "Custom Range")}
          </button>
        </div>
      </div>

      {/* ---- KPI Cards Grid (Stitch Bento) ---- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_KPI_STATS.map((kpi, idx) => (
          <div key={idx} className="bg-surface-lowest dark:bg-surface-container rounded-xl p-6 shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-100 dark:bg-surface-high rounded-lg">
                <MaterialIcon name={kpi.icon} className="text-text" />
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
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-text-muted uppercase tracking-wider mb-1">{kpi.label}</p>
              <h3 className="text-2xl font-black text-text font-headline">
                {kpi.value} <span className="text-sm font-normal text-slate-400 ml-1">{kpi.unit}</span>
              </h3>
            </div>
            {kpi.progress !== undefined && (
              <div className="mt-4 w-full bg-slate-100 dark:bg-surface-high h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all duration-500" style={{ width: `${kpi.progress}%` }} />
              </div>
            )}
            {kpi.note && (
              <p className="mt-4 text-[10px] text-slate-400 dark:text-text-muted font-medium">{kpi.note}</p>
            )}
          </div>
        ))}
      </div>

      {/* ---- Main Data Visual Row (12-col Bento Grid) ---- */}
      <div className="grid grid-cols-12 gap-6">
        {/* Period-over-period Chart (8 cols) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-lowest dark:bg-surface-container rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-text font-headline">{t("dashboard.Analytical Trajectory", "Analytical Trajectory")}</h3>
              <p className="text-xs text-slate-500 dark:text-text-muted mt-0.5">{t("dashboard.7-day volume trend", "7-day volume trend cross-referenced globally")}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-text-muted uppercase">{t("dashboard.Current", "Current")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-outline-variant" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-text-muted uppercase">{t("dashboard.Previous", "Previous")}</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <TimelineChart data={timelineData} />
          </div>
        </div>

        {/* Right Column (4 cols) — Efficiency + Insight */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Donut Risk Chart */}
          <div className="bg-surface-low dark:bg-surface-low rounded-xl p-6 flex-1 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-text font-headline mb-4">{t("dashboard.Severity Distribution", "Severity Distribution")}</h3>
            <div className="w-full h-52">
              <RiskChart data={riskData} />
            </div>
          </div>

          {/* {t("dashboard.Active Insight", "Active Insight")} Card (Dark accent) */}
          <div className="bg-primary-container rounded-xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">{t("dashboard.Active Insight", "Active Insight")}</p>
              <h4 className="text-lg font-bold mb-4 font-headline">{t("dashboard.Issue volume increased", "Issue volume increased by 14% this morning.")}</h4>
              <div className="flex items-center gap-2">
                <MaterialIcon name="flash_on" className="text-tertiary-fixed" size="sm" />
                <span className="text-xs font-medium text-slate-300">{t("dashboard.Investigation recommended", "Investigation recommended.")}</span>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-tertiary-fixed/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      {/* ---- Bottom Row: Regional Distribution + Events ---- */}
      <div className="grid grid-cols-12 gap-6">
        {/* Regional Distribution */}
        <div className="col-span-12 lg:col-span-4 bg-surface-lowest dark:bg-surface-container rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-text font-headline mb-6">{t("dashboard.Regional Distribution", "Regional Distribution")}</h3>
          <div className="space-y-4">
            {MOCK_REGIONAL_DATA.map((r) => (
              <div key={r.region} className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-500 dark:text-text-muted w-12">{r.region}</span>
                <div className="flex-1 h-3 bg-slate-100 dark:bg-surface-high rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${r.percentage}%` }} />
                </div>
                <span className="text-xs font-black text-text">{r.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events List */}
        <div className="col-span-12 lg:col-span-8 bg-surface-lowest dark:bg-surface-container rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-outline-variant/10 flex justify-between items-center">
            <h3 className="font-bold text-text font-headline">{t("dashboard.Recent Quality Events", "Recent Quality Events")}</h3>
            <button className="text-xs font-bold text-slate-500 dark:text-text-muted hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
              <MaterialIcon name="filter_list" size="sm" />
              {t("dashboard.Filter", "Filter")}
            </button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-outline-variant/5">
            {MOCK_EVENTS.map((event, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-surface-high/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    event.statusType === "success"
                      ? "bg-tertiary-container"
                      : "bg-slate-100 dark:bg-surface-high"
                  }`}>
                    <MaterialIcon
                      name={event.icon}
                      className={
                        event.statusType === "success"
                          ? "text-tertiary-fixed"
                          : "text-slate-400 dark:text-text-muted"
                      }
                      size="md"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">{event.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-text-muted">{event.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${
                    event.statusType === "success"
                      ? "bg-tertiary-container text-tertiary-fixed-dim"
                      : event.statusType === "error"
                        ? "bg-error-container text-error"
                        : "bg-slate-100 dark:bg-surface-high text-slate-500 dark:text-text-muted"
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Quick Action Button (Stitch FAB) */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <MaterialIcon name="add" size="lg" />
      </button>
    </div>
  );
}

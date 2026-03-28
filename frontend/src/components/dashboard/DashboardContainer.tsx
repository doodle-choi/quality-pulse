"use client";

import { useMemo } from "react";
import { RiskChart } from "@/components/dashboard/RiskChart";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { IssueAttr } from "@/components/dashboard/IssueCard";
import { AutoRefresh } from "@/components/AutoRefresh";

export function DashboardContainer({ initialIssues }: { initialIssues: IssueAttr[] }) {
  // ⚡ Bolt: Single O(N) pass to calculate riskData, timelineData, and kpiStats
  // Prevents ~14 redundant array traversals and costly string splits per render
  const { riskData, timelineData, kpiStats } = useMemo(() => {
    const riskCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };

    // Pre-calculate the last 7 days for O(1) timeline lookup map
    const last7DaysMap: Record<string, number> = {};
    const d = new Date();
    for (let i = 6; i >= 0; i--) {
      const dateStr = new Date(d.getTime() - i * 86400000).toISOString().slice(0, 10);
      last7DaysMap[dateStr] = 0;
    }

    let kpiCritical = 0;
    let kpiRecall = 0;
    let kpiSafety = 0;

    // Single pass over initialIssues
    for (const issue of initialIssues) {
      // 1. Risk Data
      if (issue.severity in riskCounts) {
        riskCounts[issue.severity as keyof typeof riskCounts]++;
      }

      // 2. Timeline Data (avoiding .split() by using .slice())
      const issueDateRaw = issue.published_at || issue.created_at;
      const issueDateStr = issueDateRaw ? issueDateRaw.slice(0, 10) : "";
      if (issueDateStr in last7DaysMap) {
        last7DaysMap[issueDateStr]++;
      }

      // 3. KPI Data
      if (issue.severity === "Critical") kpiCritical++;
      if (issue.issue_type.includes("Recall")) kpiRecall++;
      if (issue.issue_type.includes("Safety")) kpiSafety++;
    }

    return {
      riskData: [
        { name: "Critical Hazards", value: riskCounts.Critical, color: "var(--critical)" },
        { name: "High Risks", value: riskCounts.High, color: "var(--high)" },
        { name: "Medium Quality", value: riskCounts.Medium, color: "var(--medium)" },
        { name: "Low/Monitoring", value: riskCounts.Low, color: "var(--low)" },
      ].filter(d => d.value > 0),

      timelineData: Object.entries(last7DaysMap).map(([date, count]) => ({
        date: date.slice(5), // MM-DD format
        count,
      })),

      kpiStats: [
        { label: "Total Monitored Issues", value: initialIssues.length, color: "text-text", sub: "Across all global sources" },
        { label: "Critical Risks", value: kpiCritical, color: "text-critical", sub: "Immediate response needed" },
        { label: "Recalls Detected", value: kpiRecall, color: "text-primary", sub: "Official safety recalls" },
        { label: "Safety Hazards", value: kpiSafety, color: "text-high", sub: "Potential risks identified" },
      ]
    };
  }, [initialIssues]);

  return (
    <div className="flex flex-col gap-8">
      <AutoRefresh interval={15000} />
      
      {/* 1. Dashboard Title Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-black tracking-tight text-text">Quality Intelligence Dashboard</h1>
        <p className="text-[13px] text-text-muted font-medium">Real-time global quality and safety overview</p>
      </div>

      {/* 2. KPI Summary Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((kpi, idx) => (
          <div key={idx} className="bg-surface border border-border shadow-sm rounded-xl p-[20px_24px] transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">{kpi.label}</div>
            <div className={`text-[36px] font-black leading-[1.1] ${kpi.color} tracking-tight`}>{kpi.value}</div>
            <div className="text-[11.5px] font-medium text-text-secondary mt-1.5 opacity-70">{kpi.sub}</div>
          </div>
        ))}
      </section>

      {/* 3. Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm h-[380px] flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-border-light pb-4">
            <h3 className="text-[15px] font-bold">Severity Risk Distribution</h3>
            <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">Current Status</span>
          </div>
          <div className="flex-1 min-h-0">
            <RiskChart data={riskData} />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm h-[380px] flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-border-light pb-4">
            <h3 className="text-[15px] font-bold">7-Day Trend Analysis</h3>
            <span className="text-[10px] font-black bg-surface-alt text-text-muted px-2 py-0.5 rounded uppercase tracking-wider">Volume Trend</span>
          </div>
          <div className="flex-1 min-h-0">
            <TimelineChart data={timelineData} />
          </div>
        </div>
      </div>

      {/* 4. Insight Board Shortcut */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-bold text-text">Want to deep dive?</h3>
          <p className="text-[13px] text-text-secondary">Explore the interactive Insight Board for geographic hotspots and detailed engineering feeds.</p>
        </div>
        <a 
          href="/insights" 
          className="bg-primary text-white text-xs font-black px-6 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 whitespace-nowrap"
        >
          OPEN INSIGHT BOARD
        </a>
      </div>
    </div>
  );
}

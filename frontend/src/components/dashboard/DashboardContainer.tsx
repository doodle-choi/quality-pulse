"use client";

import { useMemo } from "react";
import { RiskChart } from "@/components/dashboard/RiskChart";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { IssueAttr } from "@/components/dashboard/IssueCard";
import { AutoRefresh } from "@/components/AutoRefresh";

export function DashboardContainer({ initialIssues }: { initialIssues: IssueAttr[] }) {
  // Risk Chart data calculation
  const riskData = useMemo(() => {
    const counts = {
      Critical: initialIssues.filter(i => i.severity === "Critical").length,
      High: initialIssues.filter(i => i.severity === "High").length,
      Medium: initialIssues.filter(i => i.severity === "Medium").length,
      Low: initialIssues.filter(i => i.severity === "Low").length,
    };

    return [
      { name: "Critical Hazards", value: counts.Critical, color: "var(--critical)" },
      { name: "High Risks", value: counts.High, color: "var(--high)" },
      { name: "Medium Quality", value: counts.Medium, color: "var(--medium)" },
      { name: "Low/Monitoring", value: counts.Low, color: "var(--low)" },
    ].filter(d => d.value > 0);
  }, [initialIssues]);

  // Timeline data calculation (recent 7 days)
  const timelineData = useMemo(() => {
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
      return { date: date.slice(5), count }; // MM-DD format
    });
  }, [initialIssues]);

  // Real-time KPI calculation
  const kpiStats = useMemo(() => {
    return [
      { 
        label: "Total Monitored Issues", 
        value: initialIssues.length, 
        color: "text-text", 
        sub: "Across all global sources" 
      },
      { 
        label: "Critical Risks", 
        value: initialIssues.filter(i => i.severity === "Critical").length, 
        color: "text-critical", 
        sub: "Immediate response needed" 
      },
      { 
        label: "Recalls Detected", 
        value: initialIssues.filter(i => i.issue_type.includes("Recall")).length, 
        color: "text-primary", 
        sub: "Official safety recalls" 
      },
      { 
        label: "Safety Hazards", 
        value: initialIssues.filter(i => i.issue_type.includes("Safety")).length, 
        color: "text-high", 
        sub: "Potential risks identified" 
      },
    ];
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

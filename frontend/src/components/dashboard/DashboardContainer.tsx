"use client";

import { useState, useMemo } from "react";
import { RiskChart } from "@/components/dashboard/RiskChart";
import { IssueFeed } from "@/components/dashboard/IssueFeed";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { IssueAttr } from "@/components/dashboard/IssueCard";

export function DashboardContainer({ initialIssues }: { initialIssues: IssueAttr[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // 필터 옵션 추출
  const brands = useMemo(() => Array.from(new Set(initialIssues.map(i => i.brand))).sort(), [initialIssues]);
  const categories = useMemo(() => Array.from(new Set(initialIssues.map(i => i.product_category))).sort(), [initialIssues]);
  const severities = ["Critical", "High", "Medium", "Low"];

  // 필터링 및 정렬 비즈니스 로직
  const filteredIssues = useMemo(() => {
    const filtered = initialIssues.filter(issue => {
      const matchesSearch = 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === "" || issue.brand === selectedBrand;
      const matchesCategory = selectedCategory === "" || issue.product_category === selectedCategory;
      const matchesSeverity = selectedSeverity === "" || issue.severity === selectedSeverity;

      return matchesSearch && matchesBrand && matchesCategory && matchesSeverity;
    });

    // 정렬 로직
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [initialIssues, searchQuery, selectedBrand, selectedCategory, selectedSeverity, sortBy]);

  // Risk Chart 데이터 실시간 계산
  const riskData = useMemo(() => {
    const counts = {
      Critical: filteredIssues.filter(i => i.severity === "Critical").length,
      High: filteredIssues.filter(i => i.severity === "High").length,
      Medium: filteredIssues.filter(i => i.severity === "Medium").length,
      Low: filteredIssues.filter(i => i.severity === "Low").length,
    };

    return [
      { name: "Critical Hazards", value: counts.Critical, color: "var(--critical)" },
      { name: "High Risks", value: counts.High, color: "var(--high)" },
      { name: "Medium Quality", value: counts.Medium, color: "var(--medium)" },
      { name: "Low/Monitoring", value: counts.Low, color: "var(--low)" },
    ].filter(d => d.value > 0);
  }, [filteredIssues]);

  // Timeline 데이터 계산 (최근 7일)
  const timelineData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    return last7Days.map(date => {
      const count = filteredIssues.filter(i => i.created_at.startsWith(date)).length;
      return { date: date.slice(5), count }; // MM-DD format
    });
  }, [filteredIssues]);

  // 실시간 KPI 계산
  const kpiStats = useMemo(() => {
    return [
      { 
        label: "Total Filtered Issues", 
        value: filteredIssues.length, 
        color: "text-text", 
        sub: "현재 필터 조건 일치" 
      },
      { 
        label: "Critical / High Risks", 
        value: filteredIssues.filter(i => i.severity === "Critical" || i.severity === "High").length, 
        color: "text-critical", 
        sub: "즉각 대응 요망" 
      },
      { 
        label: "Recalls & Lawsuits", 
        value: filteredIssues.filter(i => i.issue_type.includes("Recall") || i.issue_type.includes("Lawsuit")).length, 
        color: "text-primary", 
        sub: "리콜 및 법적 분쟁" 
      },
      { 
        label: "Quality & Safety", 
        value: filteredIssues.filter(i => i.issue_type.includes("Quality") || i.issue_type.includes("Safety") || i.issue_type.includes("Service")).length, 
        color: "text-high", 
        sub: "소비자 안전/품질 불만" 
      },
    ];
  }, [filteredIssues]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. 상단 KPI 요약 카드 (다이내믹) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((kpi, idx) => (
          <div key={idx} className="bg-surface border border-border shadow-sm rounded-xl p-[18px_20px] transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">{kpi.label}</div>
            <div className={`text-[36px] font-black leading-[1.1] ${kpi.color} tracking-tight`}>{kpi.value}</div>
            <div className="text-[11.5px] font-medium text-text-secondary mt-1.5 opacity-70">{kpi.sub}</div>
          </div>
        ))}
      </section>

      {/* 2. Search & Filter Bar */}
      <FilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        brands={brands}
        categories={categories}
        severities={severities}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Left: Feed */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-text">Intelligent Feed</h2>
            <span className="text-xs font-medium text-text-muted bg-surface-alt px-2.5 py-1 rounded-md border border-border">
              {filteredIssues.length} matches
            </span>
          </div>
          <IssueFeed issues={filteredIssues} />
        </div>

        {/* Right: Charts */}
        <aside className="flex flex-col gap-6 sticky top-24">
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm h-[320px] flex flex-col">
            <h3 className="text-[14px] font-bold mb-3 border-b border-border-light pb-3">Risk Distribution</h3>
            <div className="flex-1 min-h-0">
              <RiskChart data={riskData} />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm h-[280px] flex flex-col">
            <div className="flex items-center justify-between mb-3 border-b border-border-light pb-3">
              <h3 className="text-[14px] font-bold">Trend Analysis</h3>
              <span className="text-[10px] font-bold text-text-muted bg-surface-alt px-2 py-0.5 rounded uppercase">7 Days</span>
            </div>
            <div className="flex-1 min-h-0">
              <TimelineChart data={timelineData} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

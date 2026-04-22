"use client";

import { useTranslation } from "react-i18next";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { clsx } from "clsx";

export default function PerformanceDashboard() {
  const { t } = useTranslation();

  // Mock data reflecting the image structure
  const kpiData = {
    total: { value: 248, trend: "+12% from last quarter", icon: "assignment" },
    completed: { value: 142, rate: 57, icon: "check_circle", color: "bg-green-500" },
    inProgress: { value: 84, rate: 34, icon: "sync", color: "bg-blue-500" },
    delayed: { value: 22, alert: "Requires attention", icon: "report_problem", color: "text-red-600" },
  };

  const categories = [
    { name: "Market Expansion", total: 65, completed: 60, inProgress: 30, delayed: 10 },
    { name: "Operational Efficiency", total: 82, completed: 45, inProgress: 40, delayed: 15 },
    { name: "Product Innovation", total: 45, completed: 70, inProgress: 25, delayed: 5 },
    { name: "Talent Acquisition", total: 56, completed: 50, inProgress: 35, delayed: 15 },
  ];

  const departments = [
    { name: "Engineering", initial: "E", percentage: 35, count: 86, color: "bg-blue-100 text-blue-600" },
    { name: "Marketing", initial: "M", percentage: 25, count: 62, color: "bg-slate-100 text-slate-500" },
    { name: "Sales", initial: "S", percentage: 22, count: 54, color: "bg-orange-100 text-orange-600" },
    { name: "HR", initial: "H", percentage: 18, count: 46, color: "bg-slate-100 text-slate-500" },
  ];

  return (
    <div className="flex flex-col gap-8 p-1 animate-in fade-in duration-700">
      {/* Header Optional - but keeping for context */}
      <header className="flex flex-col gap-1 mb-2">
        <h1 className="text-2xl font-headline font-extrabold text-text tracking-tight">
          {t("strategy.performanceTitle", "Business Strategy Improvement Action Item and Plan")}
        </h1>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Action Items */}
        <div className="p-6 bg-surface-lowest rounded-2xl shadow-sm border border-border-ghost/5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Total Action Items</span>
              <h3 className="text-4xl font-headline font-black text-text">248</h3>
            </div>
            <div className="p-2.5 bg-surface-high rounded-xl text-primary/70">
              <MaterialIcon name="assignment" size="md" />
            </div>
          </div>
          <p className="text-[12px] font-medium text-green-600 flex items-center gap-1">
            <MaterialIcon name="trending_up" size="xs" />
            {kpiData.total.trend}
          </p>
        </div>

        {/* Completed */}
        <div className="p-6 bg-surface-lowest rounded-2xl shadow-sm border border-border-ghost/5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Completed</span>
              <h3 className="text-4xl font-headline font-black text-text">142</h3>
            </div>
            <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
              <MaterialIcon name="check_circle" size="md" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "57%" }} />
            </div>
            <span className="text-[11px] text-text-muted font-semibold text-right">57% completion rate</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="p-6 bg-surface-lowest rounded-2xl shadow-sm border border-border-ghost/5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">In Progress</span>
              <h3 className="text-4xl font-headline font-black text-text">84</h3>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <MaterialIcon name="sync" size="md" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "34%" }} />
            </div>
            <span className="text-[11px] text-text-muted font-semibold text-right">34% active rate</span>
          </div>
        </div>

        {/* Delayed */}
        <div className="p-6 bg-surface-lowest rounded-2xl shadow-sm border border-border-ghost/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Delayed</span>
              <h3 className="text-4xl font-headline font-black text-red-600">22</h3>
            </div>
            <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
              <MaterialIcon name="report_problem" size="md" />
            </div>
          </div>
          <p className="text-[12px] font-bold text-red-600 flex items-center gap-1.5 mt-auto">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            Requires attention
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status by Strategic Category */}
        <div className="lg:col-span-2 p-8 bg-surface-lowest rounded-3xl shadow-sm border border-border-ghost/5 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-headline font-bold text-text">Status by Strategic Category</h3>
            <button className="p-1.5 hover:bg-surface-high rounded-full transition-colors">
              <MaterialIcon name="more_vert" size="sm" className="text-text-muted" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {categories.map((cat) => (
              <div key={cat.name} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-[13px] font-bold text-text">{cat.name}</span>
                  <span className="text-[11px] font-bold text-text-muted">{cat.total} Items</span>
                </div>
                <div className="h-2.5 w-full bg-surface-high rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500" style={{ flexGrow: cat.completed }} />
                  <div className="h-full bg-blue-500" style={{ flexGrow: cat.inProgress }} />
                  <div className="h-full bg-red-400" style={{ flexGrow: cat.delayed }} />
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-4 pt-4 border-t border-border-ghost/5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              <span className="text-[11px] font-semibold text-text-muted">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
              <span className="text-[11px] font-semibold text-text-muted">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
              <span className="text-[11px] font-semibold text-text-muted">Delayed</span>
            </div>
          </div>
        </div>

        {/* Department Load */}
        <div className="p-8 bg-surface-lowest rounded-3xl shadow-sm border border-border-ghost/5 flex flex-col gap-8">
          <h3 className="text-lg font-headline font-bold text-text">Department Load</h3>
          
          <div className="flex flex-col gap-6">
            {departments.map((dept) => (
              <div key={dept.name} className="flex items-center gap-4 group">
                <div className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-transform group-hover:scale-110",
                  dept.color
                )}>
                  {dept.initial}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-bold text-text">{dept.name}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] font-black text-text">{dept.percentage}%</span>
                      <span className="text-[11px] font-bold text-text-muted">{dept.count} items</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delayed Action Item Management */}
      <div className="p-8 bg-surface-lowest rounded-3xl shadow-sm border border-border-ghost/5 flex flex-col gap-6 animate-in slide-in-from-bottom duration-700 delay-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <MaterialIcon name="pending_actions" size="md" />
            </div>
            <div>
              <h3 className="text-lg font-headline font-bold text-text">Delayed Action Item Management</h3>
              <p className="text-[11px] text-text-muted font-medium">Critical items requiring immediate strategic intervention</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-surface-high hover:bg-surface-highest rounded-xl text-[12px] font-bold text-text-muted transition-colors flex items-center gap-2">
            <MaterialIcon name="filter_list" size="xs" />
            Filter Delayed
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { tag: "MKT", title: "Global Brand Identity Renewal", due: "2024-03-15", owner: "Marketing Strategy", priority: "High" },
            { tag: "DEV", title: "Legacy DB Migration (Core-01)", due: "2024-03-22", owner: "Core Platform", priority: "Critical" },
            { tag: "OPS", title: "North America Logistics Audit", due: "2024-04-05", owner: "Global Logistics", priority: "High" },
            { tag: "HR", title: "Strategic Hires - AI Research", due: "2024-02-28", owner: "Talent Acquisition", priority: "Critical" },
          ].map((item, i) => (
            <div key={item.title} className="flex items-center gap-5 p-5 bg-surface-container rounded-2xl hover:translate-x-1 transition-transform group cursor-pointer border border-border-ghost/5">
              <div className={clsx(
                "px-3 py-1.5 rounded-lg font-black text-[10px] tracking-widest",
                item.tag === "MKT" ? "bg-pink-100 text-pink-600" :
                item.tag === "DEV" ? "bg-blue-100 text-blue-600" :
                item.tag === "OPS" ? "bg-orange-100 text-orange-600" :
                "bg-purple-100 text-purple-600"
              )}>
                {item.tag}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-[14px] font-bold text-text truncate group-hover:text-primary transition-colors">{item.title}</p>
                <div className="flex items-center gap-4 text-[11px] text-text-muted font-medium mt-1">
                  <span className="flex items-center gap-1.5"><MaterialIcon name="person" size="xs" className="opacity-60" /> {item.owner}</span>
                  <span className="flex items-center gap-1.5"><MaterialIcon name="calendar_today" size="xs" className="opacity-60" /> Due: {item.due}</span>
                </div>
              </div>
              <div className={clsx(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                item.priority === "Critical" ? "border-red-200 bg-red-50 text-red-600" : "border-orange-200 bg-orange-50 text-orange-600"
              )}>
                {item.priority}
              </div>
              <MaterialIcon name="chevron_right" size="sm" className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

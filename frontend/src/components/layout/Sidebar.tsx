"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { API_BASE_URL } from "@/config";
import { NAV_ITEMS } from "@/config/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function Sidebar() {
  const pathname = usePathname();
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const [nextRun, setNextRun] = useState<string | null>(null);
  const [schedulerActive, setSchedulerActive] = useState(false);

  useEffect(() => {
    const fetchScheduler = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/scheduler/status`);
        if (res.ok) {
          const data = await res.json();
          setSchedulerActive(data.is_running);
          if (data.next_run_time) {
            const d = new Date(data.next_run_time);
            setNextRun(d.toTimeString().split(' ')[0]);
          }
        }
      } catch { setSchedulerActive(false); }
    };
    fetchScheduler();
    const interval = setInterval(fetchScheduler, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar — Stitch "Curator Pro" Layout */}
      <aside className={clsx(
        "fixed left-0 top-0 bottom-0 flex flex-col p-4 z-50 w-64 transition-transform duration-300 ease-in-out md:translate-x-0",
        "bg-surface-low shadow-[1px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.02)]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
            <MaterialIcon name="analytics" filled className="text-tertiary-fixed" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[17px] font-black tracking-tight text-text leading-tight">Quality Pulse</h2>
            <p className="text-[9px] uppercase tracking-[0.2em] text-text-muted font-bold opacity-70">Enterprise Analytics</p>
          </div>
          {/* Mobile Close */}
          <button
            className="md:hidden ml-auto text-text-muted hover:text-text p-1 rounded-md"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <MaterialIcon name="close" size="md" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1 sidebar-scroll">
          {NAV_ITEMS.map((group) => (
            <div key={group.label} className="mb-6">
              <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-3 mb-2 opacity-50">
                {group.label}
              </h3>
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const isPlaceholder = item.href === "#";
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200",
                      isActive
                        ? "bg-surface-highest text-text shadow-sm border border-border-ghost/5"
                        : isPlaceholder
                          ? "text-text-muted/40 cursor-default"
                          : "text-text-muted hover:text-text hover:bg-surface-high/50"
                    )}
                    onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
                  >
                    <MaterialIcon name={item.icon} size="md" />
                    <span className={clsx("font-headline", isActive ? "font-bold" : "font-semibold")}>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/5">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Section — Generate Report Button & Status */}
        <div className="mt-auto pt-6 border-t border-border-ghost/5 space-y-4">
          <button className="w-full py-2.5 bg-primary text-on-primary text-xs font-bold rounded-lg shadow-lg hover:scale-[0.98] transition-transform active:scale-95">
            Generate Report
          </button>

          {/* Scheduler Status */}
          <div className="px-1 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className={`w-2 h-2 rounded-full ${schedulerActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
                {schedulerActive && (
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
                )}
              </div>
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {schedulerActive ? "Active" : "Scheduler Off"}
              </span>
            </div>
            <div className="text-[10px] text-text-muted font-medium flex justify-between">
              <span>Next Run</span>
              <span className="font-mono text-primary font-bold">
                {nextRun || "--:--:--"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

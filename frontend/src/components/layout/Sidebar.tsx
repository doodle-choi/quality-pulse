"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Activity, 
  X
} from "lucide-react";
import { clsx } from "clsx";
import { API_BASE_URL } from "@/config";
import { NAV_ITEMS } from "@/config/navigation";
import { useSidebar } from "@/contexts/SidebarContext";

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
      
      {/* Sidebar */}
      <aside className={clsx(
        "fixed left-0 top-0 h-screen w-[210px] bg-surface border-right border-border flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section */}
        <div className="p-5 border-bottom border-border-light flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="text-primary w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-black tracking-tight text-text leading-none uppercase">Quality Pulse</span>
              <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase mt-0.5 opacity-60">Intelligence</span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button 
            className="md:hidden text-text-muted hover:text-text p-1 rounded-md active:bg-surface-alt"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-4 pt-6 flex flex-col gap-8">
          {NAV_ITEMS.map((group) => (
            <div key={group.label} className="flex flex-col gap-1.5">
              <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-3 mb-1 opacity-50">
                {group.label}
              </h3>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const isPlaceholder = item.href === "#";
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all group",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : isPlaceholder
                          ? "text-text-secondary opacity-40 cursor-default"
                          : "text-text-secondary hover:bg-surface-alt hover:text-text"
                    )}
                    onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
                  >
                    <Icon className={clsx(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-primary" : "text-text-muted group-hover:text-text"
                    )} />
                    {item.name}
                    {item.badge && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter bg-primary/20 text-primary">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Status Section */}
        <div className="p-5 border-top border-border-light bg-surface-alt/30">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className={`w-2 h-2 rounded-full ${schedulerActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
                {schedulerActive && (
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
                )}
              </div>
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                {schedulerActive ? "Scheduler Active" : "Scheduler Off"}
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

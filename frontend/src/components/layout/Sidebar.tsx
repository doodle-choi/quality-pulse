"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { NAV_ITEMS } from "@/config/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import { MaterialIcon } from "../ui/MaterialIcon";
import { useTranslation } from "react-i18next";
import { fetchStatusAction } from "@/app/admin/scheduler/actions";

export function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isMobileOpen, setIsMobileOpen, isDesktopOpen, toggleDesktop } = useSidebar();
  const [nextRun, setNextRun] = useState<string | null>(null);
  const [schedulerActive, setSchedulerActive] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (e: React.UIEvent, name: string, isCurrentlyActive: boolean, preventDefault = true) => {
    if (preventDefault) e.preventDefault();
    e.stopPropagation();
    setExpandedMenus(prev => ({ 
      ...prev, 
      [name]: prev[name] !== undefined ? !prev[name] : !isCurrentlyActive 
    }));
  };

  useEffect(() => {
    const fetchScheduler = async () => {
      try {
        const data = await fetchStatusAction();
        setSchedulerActive(data.is_running);
        if (data.next_run_time) {
          const d = new Date(data.next_run_time);
          setNextRun(d.toTimeString().split(' ')[0]);
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
        "fixed left-0 top-0 bottom-0 flex flex-col p-4 z-50 transition-all duration-300 ease-in-out md:translate-x-0 group",
        isDesktopOpen ? "w-64" : "w-16 md:w-16 -translate-x-full md:translate-x-0",
        "bg-surface-low shadow-[1px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.02)]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section */}
        <div className={clsx("flex items-center gap-3 mb-8", isDesktopOpen ? "px-2" : "px-0 flex-col")}>
          {!isDesktopOpen && (
            <button
              className="hidden md:flex text-text-muted hover:text-text p-1 rounded-md active:bg-surface-high w-full justify-center"
              onClick={toggleDesktop}
              aria-label="Expand sidebar"
            >
              <MaterialIcon name="chevron_right" size="md" />
            </button>
          )}
          <Link href="/" className="flex items-center gap-3 shrink-0 group/logo">
            <div className="w-10 h-10 shrink-0 bg-primary-container rounded-lg flex items-center justify-center group-hover/logo:bg-primary transition-colors">
              <MaterialIcon name="analytics" filled className="text-tertiary-fixed group-hover/logo:text-on-primary" />
            </div>
            {isDesktopOpen && (
              <div className="flex flex-col whitespace-nowrap overflow-hidden">
                <h2 className="text-[17px] font-black tracking-tight text-text leading-tight group-hover/logo:text-primary transition-colors">G-NEXUS</h2>
                <p className="text-[9px] uppercase tracking-[0.2em] text-text-muted font-bold opacity-70">Global CS TEAM</p>
              </div>
            )}
          </Link>
          {/* Desktop Toggle */}
          {isDesktopOpen && (
            <button
              className="hidden md:flex ml-auto text-text-muted hover:text-text p-1 rounded-md active:bg-surface-high"
              onClick={toggleDesktop}
              aria-label="Collapse sidebar"
            >
              <MaterialIcon name="chevron_left" size="md" />
            </button>
          )}
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
              {isDesktopOpen ? (
                <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] px-3 mb-2 opacity-50 whitespace-nowrap">
                  {t(`navigation.${group.label}`, group.label)}
                </h3>
              ) : (
                <div className="h-4" />
              )}
              {group.items.map((item) => {
                const isSubItemActive = !!item.subItems?.some(sub => pathname === sub.href);
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) || isSubItemActive;
                const isPlaceholder = item.href === "#";
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = expandedMenus[item.name] !== undefined ? expandedMenus[item.name] : (isActive || isSubItemActive);

                return (
                  <div key={item.name} className="flex flex-col w-full">
                    <div
                      className={clsx(
                        clsx("group flex items-center rounded-xl text-[13px] transition-all duration-200", isDesktopOpen ? "pr-2" : "justify-center mb-1"),
                        isActive && !hasSubItems
                          ? "bg-surface-highest text-text shadow-sm border border-border-ghost/5"
                          : isExpanded && hasSubItems 
                            ? "bg-surface-high/40 text-text"
                            : isPlaceholder
                              ? "text-text-muted/40"
                              : "text-text-muted hover:text-text hover:bg-surface-high/50"
                      )}
                    >
                      <Link
                        href={item.href}
                        className={clsx("flex items-center flex-1", isDesktopOpen ? "gap-3 pl-3 py-2.5" : "justify-center p-2")}
                        onClick={(e) => {
                          if (hasSubItems && isDesktopOpen) {
                            // If it's a placeholder, prevent default to avoid scrolling/refresh
                            // If it's a real link (Dashboard '/'), don't prevent default so it navigates
                            toggleSubMenu(e, item.name, isActive, isPlaceholder);
                          } else if (isPlaceholder) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <MaterialIcon name={item.icon} size="md" />
                        {isDesktopOpen && (
                          <span className={clsx("font-headline whitespace-nowrap flex-1", (isActive && !hasSubItems) || isExpanded ? "font-bold" : "font-semibold")}>
                            {t(`navigation.${item.name}`, item.name)}
                          </span>
                        )}
                        {item.badge && isDesktopOpen && !hasSubItems && (
                          <span className="ml-auto px-2 py-0.5 mr-2 rounded-full text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/5">
                            {t(`badges.${item.badge}`, item.badge)}
                          </span>
                        )}
                      </Link>

                      {hasSubItems && isDesktopOpen && (
                        <button
                          onClick={(e) => toggleSubMenu(e, item.name, isActive)}
                          className="p-1 hover:bg-surface-high rounded-md transition-colors active:scale-95 ml-1 mr-1"
                        >
                          <MaterialIcon name={isExpanded ? "expand_less" : "expand_more"} size="sm" className="opacity-50" />
                        </button>
                      )}
                    </div>
                    
                    {/* Accordion Sub Menu */}
                    {hasSubItems && isExpanded && isDesktopOpen && (
                      <div className="flex flex-col gap-1 mt-1 mb-2 ml-10 border-l-2 border-border-ghost/10 pl-2 relative">
                        {item.subItems!.map(sub => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={clsx(
                                "flex items-center text-[12px] py-1.5 px-3 rounded-lg transition-all relative font-headline",
                                isSubActive ? "text-primary bg-primary/5 font-bold" : "text-text-muted hover:text-text hover:bg-surface-high/50"
                              )}
                            >
                              {isSubActive && <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-1.5 h-3 bg-primary rounded-r-md" />}
                              {t(`navigation.${sub.name}`, sub.name)}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Section — Generate Report Button & Status (Hidden per request) */}
        <div className="mt-auto pt-6 border-t border-border-ghost/5 space-y-4">
          {/* 
          {isDesktopOpen ? (
            <button className="w-full py-2.5 bg-primary text-on-primary text-xs font-bold rounded-lg shadow-lg hover:scale-[0.98] transition-transform active:scale-95 whitespace-nowrap">
              {t("sidebar.Generate Report", "Generate Report")}
            </button>
          ) : (
            <button className="w-full aspect-square bg-primary text-on-primary text-xs font-bold rounded-lg shadow-lg hover:scale-[0.98] transition-transform active:scale-95 flex items-center justify-center">
              <MaterialIcon name="summarize" size="sm" />
            </button>
          )} 
          */}

          {/* Scheduler Status */}
          <div className="px-1 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className={`w-2 h-2 rounded-full ${schedulerActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
                {schedulerActive && (
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
                )}
              </div>
              {isDesktopOpen && (
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider whitespace-nowrap">
                  {schedulerActive ? t("sidebar.Active", "Active") : t("sidebar.Scheduler Off", "Scheduler Off")}
                </span>
              )}
            </div>
            {isDesktopOpen && (
              <div className="text-[10px] text-text-muted font-medium flex justify-between whitespace-nowrap">
                <span>{t("sidebar.Next Run", "Next Run")}</span>
                <span className="font-mono text-primary font-bold">
                  {nextRun || "--:--:--"}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

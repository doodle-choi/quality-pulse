"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import { NAV_ITEMS } from "@/config/navigation";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { toggleMobile } = useSidebar();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Determine active breadcrumb based on pathname
  let breadcrumb = { group: "System", item: "Overview" };
  for (const group of NAV_ITEMS) {
    for (const item of group.items) {
      if (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) {
        breadcrumb = { group: group.label, item: item.name };
      }
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-bottom border-border h-14 flex items-center shrink-0">
      <div className="w-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Breadcrumb/Context */}
        <div className="flex items-center gap-3">
          <button 
            aria-label="Toggle mobile menu"
            className="md:hidden text-text-secondary hover:text-text p-1 -ml-1 rounded-md active:bg-surface-alt"
            onClick={toggleMobile}
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded hidden sm:inline-block">Live</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary whitespace-nowrap">
              <span className="opacity-50">{breadcrumb.group}</span>
              <span className="opacity-30">/</span>
              <span className="text-text">{breadcrumb.item}</span>
            </div>
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider leading-none">Status</span>
            <span className="text-[11px] font-mono text-green-500 font-black">Connected</span>
          </div>
          
          <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 bg-surface text-text font-bold border border-border hover:border-primary px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm active:scale-95"
          >
            {mounted && theme === "dark" ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-indigo-500" />}
            <span className="hidden sm:inline">{mounted && theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

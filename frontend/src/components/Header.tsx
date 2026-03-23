"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-bottom border-border h-14 flex items-center shrink-0">
      <div className="w-full px-6 flex items-center justify-between gap-4">
        {/* Left: Breadcrumb/Context */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded">Live</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
            <span className="opacity-50">Intelligence</span>
            <span className="opacity-30">/</span>
            <span className="text-text">Global Dashboard</span>
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider leading-none">Status</span>
            <span className="text-[11px] font-mono text-green-500 font-black">Connected</span>
          </div>
          
          <div className="w-px h-6 bg-border mx-1" />

          <button
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

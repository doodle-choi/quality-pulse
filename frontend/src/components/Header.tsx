"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import { NAV_ITEMS } from "@/config/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function Header() {
  const pathname = usePathname();
  const { toggleMobile } = useSidebar();

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
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 h-16 bg-surface/80 backdrop-blur-md border-b border-border-ghost/5">
      {/* Left: Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-muted hover:text-text p-1 -ml-1 rounded-md active:bg-surface-high"
          onClick={toggleMobile}
          aria-label="Toggle mobile menu"
        >
          <MaterialIcon name="menu" />
        </button>

        {/* Search Bar (Stitch Style) */}
        <div className="relative w-full max-w-md hidden md:block">
          <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/60 !text-lg" />
          <input
            className="w-full bg-surface-lowest border border-border-ghost/10 rounded-full py-2 pl-10 pr-4 text-sm text-text placeholder:text-text-muted/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            placeholder="Search analytics..."
            type="text"
          />
        </div>

        {/* Mobile breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted whitespace-nowrap md:hidden">
          <span className="opacity-50">{breadcrumb.group}</span>
          <span className="opacity-30">/</span>
          <span className="text-text">{breadcrumb.item}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        <button className="p-2 text-text-muted hover:text-text hover:bg-surface-high rounded-full transition-colors active:scale-95">
          <MaterialIcon name="notifications" />
        </button>
        <button className="p-2 text-text-muted hover:text-text hover:bg-surface-high rounded-full transition-colors active:scale-95 hidden sm:flex">
          <MaterialIcon name="help" />
        </button>

        <ThemeToggle />

        <div className="h-8 w-px bg-slate-200 dark:bg-outline-variant mx-1 hidden sm:block" />

        {/* Profile Section (Stitch Mock) */}
        <div className="flex items-center gap-3 pl-1 hidden sm:flex">
          <div className="text-right">
            <p className="text-xs font-bold text-text">Alex Sterling</p>
            <p className="text-[10px] text-text-muted font-medium">Lead Architect</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="User Profile Avatar"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-white dark:ring-outline-variant"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhHFCnDdNuHaJjgMpZv4BU7yc74sNg7WoA7cxs6Wj7nmETN0pi5KfgjzAdV5BseHqO21cGlPEl_czQJIZ6ST0dYDQcU7KTX4hysvv0i2_muwO_LeX_B8k0DXf79Cc1ZNW88lYckLQXl3lVw7eLwjItj1O6qffRU94BEv2mkoXIcVia8HsxMnK22bkOvtCB9_JeTvfHyWp0MUo-bV571_f5vgEF6WA-rkzjMVSMgyAuL5JufM3kC-lc86BhPO9KcHZPlOKEYHcDrzQ"
          />
        </div>
      </div>
    </header>
  );
}

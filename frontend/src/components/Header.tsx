"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import { NAV_ITEMS } from "@/config/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "react-i18next";
import { MaterialIcon } from "./ui/MaterialIcon";
import { useNotifications } from "@/contexts/NotificationContext";
import { useState, useRef, useEffect } from "react";

export function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { toggleMobile } = useSidebar();
  const { announcements, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine active breadcrumb based on pathname
  let breadcrumb = { group: t("header.System", "System"), item: t("navigation.Overview", "Overview") };
  for (const group of NAV_ITEMS) {
    for (const item of group.items) {
      if (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) {
        breadcrumb = { group: t(`navigation.${group.label}`, group.label), item: t(`navigation.${item.name}`, item.name) };
      }
    }
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleAnnouncementClick = (id: number) => {
    markAsRead(id);
  };

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
            placeholder={t("header.Search placeholder", "Search analytics...")}
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
        <div className="relative" ref={dropdownRef}>
          <button
            className="p-2 text-text-muted hover:text-text hover:bg-surface-high rounded-full transition-colors active:scale-95 relative"
            onClick={handleNotificationClick}
            aria-label="Notifications"
          >
            <MaterialIcon name="notifications" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-surface animate-pulse" />
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-border-ghost/10 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="p-4 border-b border-border-ghost/5 flex items-center justify-between">
                <h3 className="font-bold text-text">Announcements</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {announcements.length === 0 ? (
                  <div className="p-8 text-center text-text-muted text-sm">
                    No new announcements.
                  </div>
                ) : (
                  <div className="divide-y divide-border-ghost/5">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className={`p-4 hover:bg-surface-high/50 transition-colors cursor-pointer ${!(announcement as { isRead?: boolean }).isRead ? 'bg-primary/5' : ''}`}
                        onClick={() => handleAnnouncementClick(announcement.id)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm font-semibold ${!(announcement as { isRead?: boolean }).isRead ? 'text-primary' : 'text-text'}`}>
                            {announcement.title}
                          </h4>
                          {!(announcement as { isRead?: boolean }).isRead && (
                            <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-text-muted line-clamp-2">
                          {announcement.content}
                        </p>
                        <span className="text-[10px] text-text-muted/60 mt-2 block">
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button className="p-2 text-text-muted hover:text-text hover:bg-surface-high rounded-full transition-colors active:scale-95 hidden sm:flex">
          <MaterialIcon name="help" />
        </button>

        <LanguageToggle />
        <ThemeToggle />

        <div className="h-8 w-px bg-slate-200 dark:bg-outline-variant mx-1 hidden sm:block" />

        {/* Profile Section (Stitch Mock) */}
        <div className="flex items-center gap-3 pl-1 hidden sm:flex">
          <div className="text-right">
            <p className="text-xs font-bold text-text">Alex Sterling</p>
            <p className="text-[11px] text-text-muted font-medium">Lead Architect</p>
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

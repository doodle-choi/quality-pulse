"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface Announcement {
  id: number;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  isRead?: boolean;
}

interface NotificationContextType {
  announcements: Announcement[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  fetchAnnouncements: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [readIds, setReadIds] = useState<number[]>([]);

  // Load read notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("qp_read_announcements");
    if (stored) {
      try {
        setReadIds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse read announcements from localStorage", e);
      }
    }
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/announcements?published_only=true");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
    // Optional: Poll every 5 minutes
    const interval = setInterval(fetchAnnouncements, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAnnouncements]);

  const markAsRead = (id: number) => {
    if (!readIds.includes(id)) {
      const newReadIds = [...readIds, id];
      setReadIds(newReadIds);
      localStorage.setItem("qp_read_announcements", JSON.stringify(newReadIds));
    }
  };

  const markAllAsRead = () => {
    const allIds = announcements.map(a => a.id);
    setReadIds(allIds);
    localStorage.setItem("qp_read_announcements", JSON.stringify(allIds));
  };

  const unreadCount = announcements.filter((a) => !readIds.includes(a.id)).length;

  return (
    <NotificationContext.Provider
      value={{
        announcements: announcements.map(a => ({
          ...a,
          isRead: readIds.includes(a.id)
        })),
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchAnnouncements,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { Sidebar } from "./Sidebar";
import { Header } from "../Header";
import { clsx } from "clsx";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isDesktopOpen } = useSidebar();

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <Sidebar />
      <div
        className={clsx(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
          isDesktopOpen ? "md:ml-64" : "md:ml-16"
        )}
      >
        <Header />
        <main className="flex-1 px-5 py-6 md:px-8 md:py-12 w-full max-w-[1400px] mx-auto h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

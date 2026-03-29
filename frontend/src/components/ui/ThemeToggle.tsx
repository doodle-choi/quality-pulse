"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

/**
 * ThemeToggle Component
 * Allows users to transition the environment between:
 * - "The Analytical Architect" (Light Mode)
 * - "The Digital Command Center" (Dark Mode)
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(() => false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 text-slate-500 dark:text-primary hover:bg-slate-200/50 dark:hover:bg-surface-high rounded-full transition-colors active:scale-95"
      aria-label="Toggle Theme"
      title="Toggle Light/Dark Mode"
    >
      <MaterialIcon name={theme === "dark" ? "light_mode" : "dark_mode"} />
    </button>
  );
}

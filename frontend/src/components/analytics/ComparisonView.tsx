import { ReactNode } from "react";
import { cn } from "@/shared/utils";

interface ComparisonViewProps {
  children: ReactNode;
  splitMode: "single" | "split";
  className?: string;
}

export function ComparisonView({ children, splitMode, className }: ComparisonViewProps) {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col md:flex-row gap-6",
        splitMode === "split" && "overflow-x-auto snap-x",
        className
      )}
    >
      {/* If single, children take full width. If split, they divide the space evenly or scroll if too wide */}
      {children}
    </div>
  );
}

// A wrapper for each individual chart panel inside the comparison view
interface PanelProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  headerRight?: ReactNode;
  className?: string;
}

export function AnalyticalPanel({ title, subtitle, children, headerRight, className }: PanelProps) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-w-[320px] bg-surface rounded-xl p-5 shrink-0 snap-center transition-all duration-300 relative",
        // Enforcing Tonal Layering (No-Line Rule) 
        "border-0 shadow-sm shadow-black/5 dark:shadow-none",
        className
      )}
    >
      <div className="flex justify-between items-start mb-5 gap-4">
        <div>
          <h3 className="text-base font-semibold text-text tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
        </div>
        {headerRight && (
           <div className="flex items-center">
              {headerRight}
           </div>
        )}
      </div>
      <div className="flex-1 w-full relative min-h-[300px]">
        {children}
      </div>
    </div>
  );
}

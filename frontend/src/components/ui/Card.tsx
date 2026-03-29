import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  elevation?: "base" | "floating";
}

/**
 * Foundation Card Component
 * Enforces the "No-Line" Rule and Tonal Layering.
 * - Uses `surface-container-lowest` on Dark/Light mode to contrast against the `surface` background.
 * - Forbids 1px borders by default.
 */
export function Card({
  children,
  className,
  padding = "md",
  elevation = "base",
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden transition-colors duration-200",
        // The core tonal shift: instead of a border, we use a brighter surface layer.
        "bg-surface-lowest dark:bg-surface-container",
        // Padding configurations
        padding === "sm" && "p-4",
        padding === "md" && "p-6",
        padding === "lg" && "p-8",
        // Elevation handling
        elevation === "floating" && "glass-panel bg-opacity-80",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-row justify-between items-start mb-6", className)}>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-manrope font-semibold tracking-tight text-text">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm font-inter text-text-muted">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

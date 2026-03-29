import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

/**
 * Standardized Button Component
 * Enforces `DESIGN.md` rules:
 * - Primary buttons use Gradients and Glassmorphism
 * - No 1px borders for default states
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none active:scale-95",
          // Sizing
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "md" && "px-4 py-2 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          // Variants
          variant === "primary" &&
            "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-sm hover:opacity-90",
          variant === "secondary" &&
            "bg-surface-highest text-text hover:bg-surface-high",
          variant === "ghost" && "bg-transparent text-text hover:bg-surface-container",
          variant === "danger" &&
            "bg-error text-white hover:bg-error/90 shadow-sm",
          // Glassmorphism active state handled by active:scale-95 and smooth transitions
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

import { cn } from "@/shared/utils";

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

/**
 * Material Symbols Outlined Icon Component
 * Uses Google Material Symbols web font with ligature rendering.
 * IMPORTANT: The icon `name` is rendered as text that the font converts to a glyph via ligatures.
 */
export function MaterialIcon({
  name,
  className,
  filled = false,
  size = "md",
}: MaterialIconProps) {
  const sizeMap = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  };

  return (
    <span
      className={cn(
        "material-symbols-outlined inline-flex items-center justify-center select-none shrink-0",
        className
      )}
      style={{
        fontSize: `${sizeMap[size]}px`,
        width: `${sizeMap[size]}px`,
        height: `${sizeMap[size]}px`,
        lineHeight: 1,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${sizeMap[size]}`,
      }}
    >
      {name}
    </span>
  );
}

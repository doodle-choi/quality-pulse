import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/shared/utils";

interface ConfigSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function ConfigSidebar({ isOpen, onClose, className }: ConfigSidebarProps) {
  return (
    <div
      className={cn(
        "bg-surface border-r border-outline/10 flex flex-col transition-all duration-300 overflow-hidden shrink-0 h-full",
        isOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 pointer-events-none border-r-0",
        className
      )}
    >
      <div className="flex-1 w-[260px] p-5 flex flex-col gap-6 overflow-y-auto">
        {/* Header Close */}
        <div className="flex justify-between items-center pb-2 border-b border-outline/10">
           <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Configuration</h3>
           <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:bg-surface-high hover:text-text transition-colors">
              <MaterialIcon name="chevron_left" size="sm" />
           </button>
        </div>

        {/* Data Source Section */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-text-muted uppercase">Data Source</label>
          <div className="relative group cursor-pointer focus-within:ring-2 rounded-md ring-primary overflow-hidden border border-outline/20">
             <select className="w-full bg-surface-lowest outline-none text-sm text-text py-2 pl-3 pr-8 appearance-none cursor-pointer hover:bg-surface transition-colors" aria-label="Select Source">
               <option>Track A: Regulatory (CPSC)</option>
               <option>Track B: Global News (GDELT)</option>
               <option>Combined Meta-Feed</option>
             </select>
             <MaterialIcon name="expand_more" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* Primary Metrics Section */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-text-muted uppercase">Primary Axes (X, Y)</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 group cursor-pointer focus-within:ring-2 rounded-md ring-primary border border-outline/20">
               <select className="w-full bg-surface-lowest outline-none text-sm text-text py-2 pl-2 pr-6 appearance-none hover:bg-surface" aria-label="X Axis">
                 <option>Risk Impact</option>
                 <option>Frequency</option>
                 <option>Time (Date)</option>
               </select>
               <MaterialIcon name="arrow_drop_down" className="absolute right-1 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
            <span className="text-text-muted px-1 text-xs">vs</span>
            <div className="relative flex-1 group cursor-pointer focus-within:ring-2 rounded-md ring-primary border border-outline/20">
               <select className="w-full bg-surface-lowest outline-none text-sm text-text py-2 pl-2 pr-6 appearance-none hover:bg-surface" aria-label="Y Axis">
                 <option>Risk Level</option>
                 <option>Severity</option>
                 <option>Volume</option>
               </select>
               <MaterialIcon name="arrow_drop_down" className="absolute right-1 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Date Context Section */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-text-muted uppercase">Time Context</label>
          <div className="bg-surface-lowest border border-outline/20 rounded-md p-3 flex items-center justify-between text-sm cursor-pointer hover:bg-surface transition-colors">
            <div className="flex items-center gap-2 text-text">
               <MaterialIcon name="calendar_month" size="sm" className="text-text-muted" />
               <span>Last 30 Days</span>
            </div>
            <MaterialIcon name="chevron_right" size="sm" className="text-text-muted" />
          </div>
        </div>
        
        {/* Checkbox Toggles (e.g., Anomalies) */}
        <div className="flex flex-col gap-3 mt-4">
           <label className="flex items-center gap-3 cursor-pointer group">
             <div className="w-4 h-4 rounded border border-primary/50 bg-primary/20 flex items-center justify-center">
                <MaterialIcon name="check" className="text-primary text-[12px]" />
             </div>
             <span className="text-sm text-text-muted group-hover:text-text transition-colors">Highlight Anomalies</span>
           </label>
           <label className="flex items-center gap-3 cursor-pointer group rounded">
             <div className="w-4 h-4 rounded border border-outline/30 bg-surface flex items-center justify-center transition-colors">
                {/* Check icon disabled state */}
             </div>
             <span className="text-sm text-text-muted group-hover:text-text transition-colors">Show Baseline Trend</span>
           </label>
        </div>

        <div className="mt-auto pt-6">
           <button className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:opacity-90 shadow-sm shadow-primary/20 transition-all active:scale-[0.98]">
              Apply Filter State
           </button>
        </div>
      </div>
    </div>
  );
}

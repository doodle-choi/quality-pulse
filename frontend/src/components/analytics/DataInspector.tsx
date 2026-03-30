import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/shared/utils";

export interface InspectorPoint {
  id: string;
  name: string;
  date?: string;
  riskScore?: number;
  volume?: number;
  impact?: number;
  status: "critical" | "high" | "safe";
}

interface DataInspectorProps {
  point: InspectorPoint | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DataInspector({ point, isOpen, onClose }: DataInspectorProps) {
  if (!point && !isOpen) return null;

  return (
    <>
      {/* Backdrop (semi-transparent) only visible on mobile, or subtle on desktop */}
      <div
         className={cn(
            "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
         )}
         onClick={onClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[380px] bg-surface-lowest shadow-2xl z-50 transform transition-transform duration-500 flex flex-col border-l border-outline/10",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-outline/10">
          <div className="flex items-center gap-3">
             <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center bg-opacity-10",
                point?.status === "critical" ? "text-[rgb(220,38,38)] bg-[rgb(220,38,38)]" : 
                point?.status === "high" ? "text-amber-500 bg-amber-500" : 
                "text-emerald-500 bg-emerald-500"
             )}>
                <MaterialIcon name="troubleshoot" size="sm" />
             </div>
             <div>
                <h2 className="text-base font-bold text-text truncate w-48">{point?.name || "Incident Details"}</h2>
                <p className="text-xs font-mono text-text-muted">{point?.id || "N/A"}</p>
             </div>
          </div>
          <button 
             onClick={onClose} 
             className="text-text-muted hover:text-text hover:bg-surface-high p-2 rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
             aria-label="Close Inspector"
          >
            <MaterialIcon name="close" size="sm" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {/* Primary Metrics Row */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-4 rounded-xl flex flex-col gap-1">
                 <span className="text-xs text-text-muted font-medium">Risk Score</span>
                 <span className="text-2xl font-bold font-mono text-text">{point?.riskScore || "0"}</span>
              </div>
              <div className="bg-surface p-4 rounded-xl flex flex-col gap-1">
                 <span className="text-xs text-text-muted font-medium">Impact Level</span>
                 <span className="text-2xl font-bold font-mono text-text">{point?.impact || "0"}</span>
              </div>
           </div>

           {/* Metadata Context */}
           <div>
              <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                 <MaterialIcon name="tune" size="sm" className="text-text-muted" />
                 Contextual Data
              </h3>
              <div className="bg-surface-low rounded-lg p-4 space-y-3 text-sm">
                 <div className="flex justify-between border-b border-outline/5 pb-2">
                    <span className="text-text-muted">Detection Date</span>
                    <span className="font-mono text-text">{point?.date || "Unknown"}</span>
                 </div>
                 <div className="flex justify-between border-b border-outline/5 pb-2">
                    <span className="text-text-muted">Total Volume</span>
                    <span className="font-mono text-text">{point?.volume || "0"} items</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-text-muted">Status</span>
                    <span className="uppercase font-bold tracking-wider text-xs flex items-center">
                       {point?.status}
                    </span>
                 </div>
              </div>
           </div>

           {/* AI Diagnosis Simulation */}
           <div>
              <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                 <MaterialIcon name="smart_toy" size="sm" className="text-text-muted" />
                 AI Preliminary Triage
              </h3>
              <div className="p-4 bg-[var(--primary-container,rgba(123,208,255,0.1))] text-text rounded-lg border border-primary/20 leading-relaxed text-sm">
                 <p>This incident cluster shows a strong correlation with recent battery thermal events in the QA logs. AI consensus suggests high likelihood of hardware failure.</p>
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-outline/10 bg-surface-lowest flex gap-3">
           <button className="flex-1 px-4 py-2 text-sm font-medium border border-outline/20 rounded-md hover:bg-surface-high transition-colors text-text">
             View Full Report
           </button>
           <button className="flex-[0.5] px-4 py-2 text-sm font-medium bg-primary text-white rounded-md shadow-sm hover:opacity-90 transition-colors flex justify-center items-center">
             <MaterialIcon name="share" size="sm" />
           </button>
        </div>
      </div>
    </>
  );
}

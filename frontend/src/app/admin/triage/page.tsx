"use client";

import { MaterialIcon } from "../../../components/ui/MaterialIcon";

export default function PlaceholderPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center opacity-60 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-surface-low rounded-full flex items-center justify-center mb-6">
        <MaterialIcon name="troubleshoot" size="xl" className="text-secondary" />
      </div>
      <h3 className="text-xl font-black text-text font-headline mb-2 uppercase tracking-widest">
        Triage Agent Intelligence
      </h3>
      <p className="text-sm text-text-muted max-w-xs mx-auto leading-relaxed">
        Autonomous triage agents are fully functional. 
        Detailed audit UI scheduled for Phase 5.
      </p>
    </div>
  );
}

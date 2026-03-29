"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function PlaceholderPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center opacity-60 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-surface-low rounded-full flex items-center justify-center mb-6 text-tertiary">
        <MaterialIcon name="public" size="xl" />
      </div>
      <h3 className="text-xl font-black text-text font-headline mb-2 uppercase tracking-widest">
        Global Sentiment Map
      </h3>
      <p className="text-sm text-text-muted max-w-xs mx-auto leading-relaxed">
        Real-time media sentiment tracking is currently being calibrated. 
        Expected availability: Phase 5.
      </p>
    </div>
  );
}

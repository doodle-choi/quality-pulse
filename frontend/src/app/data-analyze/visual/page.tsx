"use client";

import { MaterialIcon } from "../../../components/ui/MaterialIcon";

export default function PlaceholderPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center opacity-60 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-surface-low rounded-full flex items-center justify-center mb-6">
        <MaterialIcon name="construction" size="xl" className="text-text-muted" />
      </div>
      <h3 className="text-xl font-black text-text font-headline mb-2 uppercase tracking-widest">
        Intel Module In Development
      </h3>
      <p className="text-sm text-text-muted max-w-xs mx-auto leading-relaxed">
        This analytical layer is currently being calibrated for enterprise standards. 
        Expected availability: Phase 5.
      </p>
    </div>
  );
}

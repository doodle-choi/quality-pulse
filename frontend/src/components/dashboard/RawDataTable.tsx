"use client";

import React from "react";
import { OperationEvent } from "@/types/operations";
import { clsx } from "clsx";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface RawDataTableProps {
  events: OperationEvent[];
  title: string;
}

export function RawDataTable({ events, title }: RawDataTableProps) {
  return (
    <div className="w-full h-full min-h-0 bg-surface-lowest dark:bg-surface-container rounded-2xl overflow-hidden flex flex-col border border-border/40 shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between bg-surface-lowest/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <MaterialIcon name="database" size="xs" className="text-primary opacity-70" />
          <h4 className="text-[11px] font-black uppercase tracking-widest text-text opacity-90">
            {title} Logs
          </h4>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">Live Feed</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/20 bg-surface-lowery/30">
              <th className="px-4 py-2.5 text-[9px] font-black text-text-muted uppercase tracking-widest">Time</th>
              <th className="px-4 py-2.5 text-[9px] font-black text-text-muted uppercase tracking-widest">Entity</th>
              <th className="px-4 py-2.5 text-[9px] font-black text-text-muted uppercase tracking-widest">Action</th>
              <th className="px-4 py-2.5 text-[9px] font-black text-text-muted uppercase tracking-widest text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-primary/5 transition-colors group/row">
                <td className="px-4 py-2 text-[10px] font-mono text-text-muted tabular-nums">
                  {event.timestamp.split(" ")[1] || event.timestamp}
                </td>
                <td className="px-4 py-2">
                  <span className="text-[10px] font-bold text-text truncate max-w-[80px] block">
                    {event.entityId.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text leading-tight">{event.action}</span>
                    <span className="text-[9px] text-text-muted truncate max-w-[120px]">{event.detail}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-right">
                  <span className={clsx(
                    "text-[10px] font-black tabular-nums",
                    event.status === "critical" ? "text-critical" : 
                    event.status === "warning" ? "text-high" : 
                    "text-primary"
                  )}>
                    {event.value}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border/30 bg-surface-alt/20 flex justify-center">
        <button className="text-[9px] font-bold text-primary hover:underline uppercase tracking-widest cursor-pointer">
          Download Raw Archive (CSV)
        </button>
      </div>
    </div>
  );
}

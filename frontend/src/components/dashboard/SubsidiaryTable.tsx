"use client";

import React from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { clsx } from "clsx";
import { MapDataPoint } from "@/types/dashboard";

interface SubsidiaryTableProps {
  data: MapDataPoint[];
  label: string;
}

export function SubsidiaryTable({ data, label }: SubsidiaryTableProps) {
  return (
    <div className="w-full h-[400px] bg-surface-lowest dark:bg-surface-container rounded-2xl p-6 flex flex-col gap-6 shadow-sm border border-border-ghost/5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">
          {label} Details
        </h3>
        <MaterialIcon name="sort" size="sm" className="text-text-muted opacity-50 cursor-pointer hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-surface-lowest dark:bg-surface-container z-10">
            <tr className="border-b border-border-ghost/10">
              <th className="pb-3 text-[11px] font-black text-text-muted uppercase tracking-wider">Entity</th>
              <th className="pb-3 text-[11px] font-black text-text-muted uppercase tracking-wider text-right">Value</th>
              <th className="pb-3 text-[11px] font-black text-text-muted uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-ghost/5">
            {data.map((item) => (
              <tr key={item.id} className="group hover:bg-surface-high/30 transition-colors">
                <td className="py-3.5 pr-2">
                  <div className="flex items-center gap-2">
                    <div className={clsx(
                      "w-1.5 h-1.5 rounded-full",
                      item.status === "critical" ? "bg-critical" : item.status === "warning" ? "bg-high" : "bg-primary"
                    )} />
                    <span className="text-[13px] font-bold text-text truncate max-w-[120px]">{item.name}</span>
                  </div>
                </td>
                <td className="py-3.5 text-right font-headline font-black text-[13px] text-text">
                  {item.value}
                  <span className="text-[10px] text-text-muted ml-0.5">{item.unit}</span>
                </td>
                <td className="py-3.5 text-right">
                  <span className={clsx(
                    "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
                    item.status === "critical" ? "bg-critical/10 text-critical" :
                    item.status === "warning" ? "bg-high/10 text-high" :
                    "bg-primary/5 text-text-muted"
                  )}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="w-full py-2.5 bg-surface-high hover:bg-surface-highest rounded-xl text-[11px] font-black uppercase tracking-wider text-text-muted transition-colors flex items-center justify-center gap-2">
        <MaterialIcon name="open_in_full" size="xs" />
        View All Entities
      </button>
    </div>
  );
}

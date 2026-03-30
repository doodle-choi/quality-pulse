"use client";

import { useState } from "react";
import { FolderTree, Search, LayoutGrid, ChevronRight, ChevronDown, Activity, AlertTriangle, MessageSquare } from "lucide-react";
import { cn } from "@/utils/cn";

export interface Dataset {
  id: string;
  title: string;
  type: "chart" | "map" | "table";
  description: string;
  icon: any;
  category: string;
}

const MOCK_DATASETS: Dataset[] = [
  { id: "ds-1", title: "Recalls Timeline", type: "chart", description: "Trends of product recalls over time.", icon: Activity, category: "Safety" },
  { id: "ds-2", title: "Global Incidents", type: "map", description: "Geographic distribution of safety events.", icon: AlertTriangle, category: "Quality" },
  { id: "ds-3", title: "Customer Complaints", type: "table", description: "Raw complaint reports from agencies.", icon: MessageSquare, category: "Feedback" },
];

export function DataExplorer({ onSelectDataset }: { onSelectDataset: (ds: Dataset) => void }) {
  const [viewMode, setViewMode] = useState<"tree" | "catalog">("tree");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "Safety": true, "Quality": true });

  const toggleCategory = (cat: string) => setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));

  const categories = Array.from(new Set(MOCK_DATASETS.map(d => d.category)));

  return (
    <div className="flex flex-col h-full bg-[var(--surface-alt)] border-r border-[var(--border)] w-64 flex-shrink-0 transition-all">
      <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-blue-500" /> Data Explorer
        </h2>
        <div className="flex bg-[var(--surface)] border border-[var(--border)] rounded overflow-hidden">
          <button
            className={cn("p-1", viewMode === "tree" && "bg-[var(--primary)] text-white")}
            onClick={() => setViewMode("tree")}
          >
            <FolderTree className="w-3.5 h-3.5" />
          </button>
          <button
            className={cn("p-1", viewMode === "catalog" && "bg-[var(--primary)] text-white")}
            onClick={() => setViewMode("catalog")}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-2 border-b border-[var(--border)]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2 top-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search datasets..."
            className="w-full bg-[var(--surface)] text-sm rounded border border-[var(--border)] pl-8 py-1.5 outline-none focus:border-[var(--primary)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {viewMode === "tree" ? (
          <div className="space-y-1 text-sm">
             {categories.map(cat => (
               <div key={cat} className="select-none">
                 <div
                   className="flex items-center gap-1 p-1 hover:bg-[var(--surface)] rounded cursor-pointer font-medium text-gray-700 dark:text-gray-300"
                   onClick={() => toggleCategory(cat)}
                 >
                   {expanded[cat] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                   {cat}
                 </div>
                 {expanded[cat] && (
                   <div className="ml-4 pl-2 border-l border-[var(--border)] space-y-0.5 mt-0.5">
                     {MOCK_DATASETS.filter(d => d.category === cat && d.title.toLowerCase().includes(search.toLowerCase())).map(ds => {
                       const Icon = ds.icon;
                       return (
                         <div
                           key={ds.id}
                           className="flex items-center gap-2 p-1.5 hover:bg-[var(--surface)] rounded cursor-pointer text-gray-600 dark:text-gray-400 hover:text-[var(--primary)] group"
                           onClick={() => onSelectDataset(ds)}
                         >
                           <Icon className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 text-blue-500" />
                           <span className="truncate">{ds.title}</span>
                         </div>
                       )
                     })}
                   </div>
                 )}
               </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {MOCK_DATASETS.filter(d => d.title.toLowerCase().includes(search.toLowerCase())).map(ds => {
               const Icon = ds.icon;
               return (
                 <div
                   key={ds.id}
                   className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-md hover:border-[var(--primary)] cursor-pointer hover:shadow-sm transition-all group"
                   onClick={() => onSelectDataset(ds)}
                 >
                   <div className="flex items-center gap-2 font-medium text-sm mb-1 group-hover:text-[var(--primary)]">
                     <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-md">
                       <Icon className="w-4 h-4" />
                     </div>
                     {ds.title}
                   </div>
                   <div className="text-xs text-gray-500 line-clamp-2">{ds.description}</div>
                   <div className="mt-2 text-[10px] uppercase font-semibold text-gray-400">{ds.category}</div>
                 </div>
               )
            })}
          </div>
        )}
      </div>
    </div>
  );
}

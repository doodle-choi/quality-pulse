"use client";

import { useState, useEffect } from "react";
// In v2.2.3 WidthProvider is a default export of react-grid-layout/WidthProvider
import ReactGridLayout from "react-grid-layout";


import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Plus, Maximize2, X, GripHorizontal, Save, Share2 } from "lucide-react";
import { DataExplorer, Dataset } from "@/components/analytics/DataExplorer";
import { cn } from "@/utils/cn";

interface Pane {
  id: string;
  dataset: Dataset | null;
  title: string;
}

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function AnalyticsPage() {
  const [isClient, setIsClient] = useState(false);
  const [layout, setLayout] = useState<LayoutItem[]>([
    { i: "view-1", x: 0, y: 0, w: 6, h: 6 },
    { i: "view-2", x: 6, y: 0, w: 6, h: 6 }
  ]);
  const [panes, setPanes] = useState<Pane[]>([
    { id: "view-1", title: "Empty View", dataset: null },
    { id: "view-2", title: "Empty View", dataset: null }
  ]);
  const [activePane, setActivePane] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onLayoutChange = (newLayout: LayoutItem[]) => {
    setLayout(newLayout);
  };

  const addPane = () => {
    const id = `view-${Date.now()}`;
    setPanes(prev => [...prev, { id, title: "New View", dataset: null }]);
    setLayout(prev => [...prev, { i: id, x: (prev.length * 4) % 12, y: Infinity, w: 6, h: 6 }]);
  };

  const removePane = (id: string) => {
    setPanes(prev => prev.filter(p => p.id !== id));
    setLayout(prev => prev.filter(l => l.i !== id));
    if (activePane === id) setActivePane(null);
  };

  const handleSelectDataset = (dataset: Dataset) => {
    if (!activePane) return alert("Please click on a view pane to select it first.");
    setPanes(prev => prev.map(pane =>
      pane.id === activePane
        ? { ...pane, dataset, title: dataset.title }
        : pane
    ));
  };

  if (!isClient) return null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[var(--background)]">
      {/* Top Toolbar */}
      <div className="flex-shrink-0 h-14 px-4 flex justify-between items-center border-b border-[var(--border)] bg-[var(--surface)]">
        <h1 className="text-xl font-bold flex items-center gap-2">
           <span className="text-blue-500">❖</span> Visual Analytics
        </h1>
        <div className="flex gap-2">
           <button onClick={addPane} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-alt)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-md transition-colors text-sm font-medium">
             <Plus className="w-4 h-4" /> Add View
           </button>
           <div className="w-px h-6 bg-[var(--border)] mx-1 self-center" />
           <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-alt)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-md transition-colors text-sm font-medium">
             <Share2 className="w-4 h-4" /> Share
           </button>
           <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors text-sm font-medium shadow-sm">
             <Save className="w-4 h-4" /> Save Workspace
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <DataExplorer onSelectDataset={handleSelectDataset} />

        <div className="flex-1 overflow-auto bg-gray-50/50 dark:bg-gray-900/50 p-2">
           {/* For POC we pass a static width. We will implement responsive width provider later. */}
           <ReactGridLayout width={1200}
              className="layout h-full min-h-[800px]"
              layout={layout as any}



              onLayoutChange={onLayoutChange as any}


            >
              {panes.map((pane) => (
                <div
                  key={pane.id}
                  className={cn(
                    "bg-[var(--surface)] border-2 rounded-lg shadow-sm flex flex-col overflow-hidden transition-all duration-200",
                    activePane === pane.id ? "border-blue-500 shadow-blue-500/20" : "border-[var(--border)] hover:border-blue-300"
                  )}
                  onClick={() => setActivePane(pane.id)}
                >
                  <div className={cn(
                    "drag-handle p-2 border-b cursor-move flex items-center justify-between group transition-colors",
                    activePane === pane.id ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" : "bg-[var(--surface-alt)] border-[var(--border)]"
                  )}>
                     <div className="flex items-center gap-2 text-sm font-medium">
                        <GripHorizontal className="w-4 h-4 text-gray-400 group-hover:text-gray-600 cursor-grab" />
                        <span className={activePane === pane.id ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}>
                          {pane.title}
                        </span>
                     </div>
                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Maximize">
                           <Maximize2 className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        <button
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500"
                          title="Close"
                          onClick={(e) => { e.stopPropagation(); removePane(pane.id); }}
                        >
                           <X className="w-3.5 h-3.5" />
                        </button>
                     </div>
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-center relative bg-[var(--surface)]">
                    {!pane.dataset ? (
                       <div className="text-center">
                         <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                            <Plus className="w-6 h-6 text-gray-400" />
                         </div>
                         <p className="text-sm text-gray-500 font-medium">Select a dataset from the explorer</p>
                         <p className="text-xs text-gray-400 mt-1">Make sure this pane is active (blue border)</p>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center gap-3">
                         <pane.dataset.icon className="w-12 h-12 text-blue-500 opacity-80" />
                         <div className="text-center">
                            <h3 className="font-semibold text-lg">{pane.dataset.title}</h3>
                            <p className="text-sm text-gray-500 max-w-xs mt-1">{pane.dataset.description}</p>
                         </div>
                         <div className="mt-4 px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold uppercase tracking-wider rounded-full border border-green-200 dark:border-green-800">
                           {pane.dataset.type} Component Placeholder
                         </div>
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </ReactGridLayout>
        </div>
      </div>
    </div>
  );
}

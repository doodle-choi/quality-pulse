"use client";

import { useState, useEffect } from "react";
import * as FlexLayout from "flexlayout-react";
import "flexlayout-react/style/light.css";

import { Plus, Save, Share2, Layers } from "lucide-react";
import { DataExplorer, Dataset } from "@/components/analytics/DataExplorer";

// Base FlexLayout layout structure
const INITIAL_LAYOUT = {
  global: {
    tabEnableClose: true,
    tabEnableRename: true,
    tabSetEnableMaximize: true,
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 50,
        children: [
          {
            type: "tab",
            name: "Empty View",
            component: "dataset",
            config: { id: "view-1", dataset: null }
          }
        ]
      },
      {
        type: "tabset",
        weight: 50,
        children: [
          {
            type: "tab",
            name: "Empty View 2",
            component: "dataset",
            config: { id: "view-2", dataset: null }
          }
        ]
      }
    ]
  }
};

export default function AnalyticsPage() {
  const [isClient, setIsClient] = useState(false);
  const [model, setModel] = useState<FlexLayout.Model | null>(null);

  useEffect(() => {
    // Must initialize model only on client-side
    setModel(FlexLayout.Model.fromJson(INITIAL_LAYOUT));
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const addView = () => {
    if (!model) return;
    model.doAction(FlexLayout.Actions.addNode({
      type: "tab",
      component: "dataset",
      name: "New View",
      config: { id: `view-${Date.now()}`, dataset: null }
    }, "root", FlexLayout.DockLocation.CENTER, -1));
  };

  const handleSelectDataset = (dataset: Dataset) => {
    if (!model) return;
    const activeTab = model.getActiveTabset()?.getSelectedNode() as FlexLayout.TabNode;

    if (!activeTab) {
      alert("Please select a tab first to load the dataset into.");
      return;
    }

    // Update the tab's name and config
    model.doAction(FlexLayout.Actions.updateNodeAttributes(activeTab.getId(), {
      name: dataset.title,
      config: { ...activeTab.getConfig(), dataset: dataset }
    }));
  };

  const factory = (node: FlexLayout.TabNode) => {
    const component = node.getComponent();
    if (component === "dataset") {
      const config = node.getConfig();
      const dataset: Dataset | null = config?.dataset;

      return (
        <div className="flex-1 w-full h-full p-6 flex flex-col items-center justify-center relative bg-[var(--surface)] text-[var(--foreground)] overflow-auto">
          {!dataset ? (
             <div className="text-center max-w-sm">
               <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-800">
                  <Layers className="w-8 h-8 text-blue-500" />
               </div>
               <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">Select a Dataset</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400">
                 Click on a dataset from the Data Explorer on the left to load it into this active tab.
               </p>
             </div>
          ) : (
             <div className="flex flex-col items-center gap-4 text-center max-w-md">
               <dataset.icon className="w-16 h-16 text-blue-500 opacity-90" />
               <div>
                  <h3 className="font-semibold text-2xl text-gray-800 dark:text-gray-200">{dataset.title}</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400 mt-2">{dataset.description}</p>
               </div>
               <div className="mt-4 px-4 py-1.5 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-semibold uppercase tracking-wider rounded-full border border-green-200 dark:border-green-800">
                 {dataset.type} Widget Loading...
               </div>
             </div>
          )}
        </div>
      );
    }
  };

  if (!isClient || !model) return null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[var(--background)]">
      {/* Top Toolbar */}
      <div className="flex-shrink-0 h-14 px-4 flex justify-between items-center border-b border-[var(--border)] bg-[var(--surface)] z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
           <span className="text-blue-500">❖</span> Visual Analytics
        </h1>
        <div className="flex gap-2">
           <button onClick={addView} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-alt)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-md transition-colors text-sm font-medium">
             <Plus className="w-4 h-4" /> Add Tab
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
        {/* Sidebar Data Explorer */}
        <DataExplorer onSelectDataset={handleSelectDataset} />

        {/* Docking Layout Container */}
        <div className="flex-1 relative bg-gray-50 dark:bg-gray-900">
          {/* Custom style overrides for FlexLayout to match our theme */}
          <style dangerouslySetInnerHTML={{__html: `
            .flexlayout__layout {
              background: transparent !important;
            }
            .flexlayout__tabset {
              background: var(--surface) !important;
              border: 1px solid var(--border) !important;
              border-radius: 6px !important;
              overflow: hidden !important;
              margin: 4px !important;
              box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            .flexlayout__tabset_header {
              background: var(--surface-alt) !important;
              border-bottom: 1px solid var(--border) !important;
            }
            .flexlayout__tab_button {
              background: transparent !important;
              color: var(--foreground) !important;
              border-right: 1px solid var(--border) !important;
            }
            .flexlayout__tab_button--selected {
              background: var(--surface) !important;
              color: var(--primary) !important;
              font-weight: 600 !important;
              border-bottom: 2px solid var(--primary) !important;
            }
            .flexlayout__splitter {
              background: transparent !important;
            }
            .flexlayout__splitter:hover {
              background: var(--primary) !important;
              opacity: 0.5;
            }
          `}} />
          <FlexLayout.Layout model={model} factory={factory} />
        </div>
      </div>
    </div>
  );
}

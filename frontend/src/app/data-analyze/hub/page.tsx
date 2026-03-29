"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useState } from "react";

export default function DataHubPage() {
  const [dragActive, setDragActive] = useState(false);

  const mockExports = [
    { id: 1, name: "Global_Quality_Report_Q1.csv", size: "2.4 MB", date: "2026-03-24", type: "CSV" },
    { id: 2, name: "Recall_Summary_Europe.json", size: "840 KB", date: "2026-03-22", type: "JSON" },
    { id: 3, name: "Safety_Audit_Log_Final.pdf", size: "12.1 MB", date: "2026-03-20", type: "PDF" },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-text font-headline">Intelligence Data Hub</h1>
        <p className="text-text-muted mt-1 font-medium">Central repository for data exchange and reporting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div 
            className={`relative group bg-surface-low/50 border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center ${
              dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-outline-variant hover:border-primary/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
          >
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MaterialIcon name="cloud_upload" size="xl" className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Drag and drop resource files</h3>
            <p className="text-sm text-text-muted max-w-xs mx-auto mb-6">
              Support for CSV, JSON, and PDF formats. Maximum upload size: 50MB.
            </p>
            <button className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold active:scale-95 transition-all shadow-lg shadow-primary/20">
              Browse Files
            </button>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>

          <div className="bg-surface-lowest border border-outline-variant/10 rounded-2xl p-6 shadow-sm overflow-hidden">
            <h3 className="text-sm font-black text-text uppercase tracking-widest mb-4">Recent Export History</h3>
            <div className="divide-y divide-outline-variant/5">
              {mockExports.map((file) => (
                <div key={file.id} className="py-4 flex items-center justify-between hover:bg-surface-low/30 transition-colors px-2 -mx-2 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface-low rounded-lg flex items-center justify-center">
                      <MaterialIcon name={file.type === "PDF" ? "picture_as_pdf" : "description"} size="md" className="text-text-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text">{file.name}</p>
                      <p className="text-[10px] text-text-muted">{file.size} • {file.date}</p>
                    </div>
                  </div>
                  <button className="p-2.5 hover:bg-primary/10 rounded-full transition-colors group">
                    <MaterialIcon name="download" size="sm" className="text-text-muted group-hover:text-primary" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions / Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-primary-container rounded-2xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Generate Report</h3>
              <p className="text-xs text-on-primary-container/80 mb-6 font-medium leading-relaxed">
                Create a customized quality digest including risk forecasting and regional performance.
              </p>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all">
                  <span className="text-xs font-bold">Standard PDF Digest</span>
                  <MaterialIcon name="arrow_forward" size="sm" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all">
                  <span className="text-xs font-bold">Raw SQL Export (Full)</span>
                  <MaterialIcon name="database" size="sm" />
                </button>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="bg-surface-lowest border border-outline-variant/10 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-text uppercase tracking-widest mb-4">Storage Usage</h3>
            <div className="w-full bg-surface-low h-2 rounded-full mb-2">
              <div className="h-full bg-tertiary rounded-full" style={{ width: "24%" }} />
            </div>
            <div className="flex justify-between text-[10px] uppercase font-black text-text-muted">
              <span>1.2 GB USED</span>
              <span>5.0 GB LIMIT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

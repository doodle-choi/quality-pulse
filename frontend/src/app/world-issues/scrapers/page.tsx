"use client";

import { MaterialIcon } from "../../../components/ui/MaterialIcon";

export default function ScraperHubPage() {
  const scrapers = [
    { name: "CPSC (Consumer Product Safety)", protocol: "Track A", status: "Active", health: 98, lastSync: "2 mins ago", count: 4210 },
    { name: "Global News API", protocol: "Track B", status: "Active", health: 100, lastSync: "15 mins ago", count: 18240 },
    { name: "GDELT Event Network", protocol: "Track B", status: "Standby", health: 74, lastSync: "1 hour ago", count: 94220 },
    { name: "Health Canada (Recall)", protocol: "Track A", status: "Maintenance", health: 0, lastSync: "1 day ago", count: 1205 },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-text font-headline tracking-tight">Source Scraper Hub</h1>
          <p className="text-text-muted mt-1 font-medium italic">Monitoring global intelligence ingestion health</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-surface-low hover:bg-surface-container border border-outline-variant/10 rounded-xl text-xs font-black transition-all group">
          <MaterialIcon name="refresh" size="sm" className="group-hover:rotate-180 transition-transform duration-500" />
          REFRESH INFRASTRUCTURE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
          <p className="text-[10px] uppercase font-black text-text-muted mb-1">Active Channels</p>
          <p className="text-2xl font-black text-text">14 / 16</p>
        </div>
        <div className="bg-surface-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
          <p className="text-[10px] uppercase font-black text-text-muted mb-1">Total Ingested (24h)</p>
          <p className="text-2xl font-black text-text">114.2 K</p>
        </div>
        <div className="bg-surface-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
          <p className="text-[10px] uppercase font-black text-text-muted mb-1">System Latency</p>
          <p className="text-2xl font-black text-tertiary">142 ms</p>
        </div>
        <div className="bg-surface-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
          <p className="text-[10px] uppercase font-black text-text-muted mb-1">Triage Success Rate</p>
          <p className="text-2xl font-black text-primary">99.2 %</p>
        </div>
      </div>

      <div className="bg-surface-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/5 flex justify-between items-center">
          <h3 className="text-sm font-black text-text uppercase tracking-widest">Global Data Sources</h3>
          <div className="flex items-center gap-4 text-[10px] uppercase font-medium text-text-muted">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-tertiary" /> Active</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-outline-variant" /> Standby</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-low/50 text-[10px] font-black uppercase text-text-muted">
                <th className="px-6 py-4">Source Name</th>
                <th className="px-6 py-4">Configuration</th>
                <th className="px-6 py-4">Sync Health</th>
                <th className="px-6 py-4">Last Cycle</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {scrapers.map((s, idx) => (
                <tr key={idx} className="hover:bg-surface-low/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-8 rounded-full ${
                        s.status === "Active" ? "bg-tertiary" : s.status === "Maintenance" ? "bg-error" : "bg-outline-variant"
                      }`} />
                      <div>
                        <p className="text-sm font-bold text-text">{s.name}</p>
                        <p className="text-[10px] text-text-muted">{s.count.toLocaleString()} Records</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 bg-surface-low rounded text-[10px] font-black text-text-muted">{s.protocol}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-surface-low rounded-full w-24 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${s.health > 80 ? "bg-tertiary" : "bg-error"}`} 
                          style={{ width: `${s.health}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-text">{s.health}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-text font-medium">{s.lastSync}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-surface-low rounded-lg transition-colors group-hover:text-primary">
                      <MaterialIcon name="visibility" size="sm" />
                    </button>
                    <button className="p-2 hover:bg-surface-low rounded-lg transition-colors group-hover:text-tertiary ml-2">
                      <MaterialIcon name="play_arrow" size="sm" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

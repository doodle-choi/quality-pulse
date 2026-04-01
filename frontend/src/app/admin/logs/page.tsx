import { Activity, Clock, CheckCircle2, XCircle, ChevronRight, BarChart2 } from "lucide-react";
import Link from "next/link";
import { INTERNAL_API_BASE_URL } from "@/config";

export interface CrawlLogAttr {
  id: number;
  status: "running" | "completed" | "failed";
  start_time: string;
  end_time?: string;
  total_scraped: number;
  total_saved: number;
  log_messages?: string;
  summary?: string;
  created_at: string;
}

async function getCrawlLogs(): Promise<CrawlLogAttr[]> {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/crawl-logs/`, { 
      cache: "no-store",
      headers: { 
        "Content-Type": "application/json",
        "X-API-Key": process.env.INTERNAL_API_KEY || ""
      }
    });
    
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return [];
  }
}

function StatusBadge({ status }: { status: string }) {
  if (status === "running") {
    return (
      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        Running
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">
        <CheckCircle2 size={12} />
        Success
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-critical/10 text-critical text-[10px] font-bold uppercase tracking-wider">
      <XCircle size={12} />
      Failed
    </span>
  );
}

export default async function CrawlerLogsPage() {
  const logs = await getCrawlLogs();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-[20px] font-black tracking-tight text-text">Crawler Execution Logs</h1>
        <p className="text-[13px] font-medium text-text-muted mt-1">
          Historical record of automated intelligence gathering runs
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {logs.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center">
            <Activity className="mx-auto text-text-muted mb-3 opacity-20" size={48} />
            <p className="text-text-secondary font-medium">No crawl logs found.</p>
            <p className="text-text-muted text-xs mt-1">Run the unified pipeline to see logs here.</p>
          </div>
        ) : (
          logs.map((log) => (
            <Link 
              key={log.id} 
              href={`/admin/logs/${log.id}`}
              className="group bg-surface border border-border rounded-xl p-5 hover:border-primary/30 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={log.status === "running" ? "text-primary" : "text-text-muted"}>
                    <Activity size={24} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-bold text-text truncate">Run #{log.id}</span>
                      <StatusBadge status={log.status} />
                    </div>
                    <div className="flex items-center gap-4 text-[12px] text-text-muted font-medium">
                      <div className="flex items-center gap-1 shrink-0" suppressHydrationWarning>
                        <Clock size={14} />
                        {new Date(log.start_time).toISOString().replace('T', ' ').split('.')[0]}
                      </div>
                      <div className="flex items-center gap-1 text-secondary">
                        <BarChart2 size={14} />
                        {log.total_saved} saved / {log.total_scraped} scraped
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  {log.summary && (
                    <div className="hidden lg:block max-w-[400px]">
                      <p className="text-[12px] text-text-secondary line-clamp-2 leading-relaxed italic">
                        "{log.summary}"
                      </p>
                    </div>
                  )}
                  <ChevronRight size={20} className="text-text-muted group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

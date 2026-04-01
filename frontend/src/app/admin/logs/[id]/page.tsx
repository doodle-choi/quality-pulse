import { Activity, Clock, CheckCircle2, XCircle, ArrowLeft, BarChart2 } from "lucide-react";
import Link from "next/link";
import { INTERNAL_API_BASE_URL } from "@/config";
import { CrawlLogAttr } from "../page";

async function getCrawlLog(id: string): Promise<CrawlLogAttr | null> {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/crawl-logs/${id}`, { 
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
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

export default async function LogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const log = await getCrawlLog(id);

  if (!log) {
    return (
      <div className="p-12 text-center bg-surface border border-border rounded-xl">
        <XCircle className="mx-auto text-critical mb-3 opacity-20" size={48} />
        <p className="text-text-secondary font-medium">Log detail not found.</p>
        <Link href="/admin/logs" className="text-primary text-sm font-bold mt-4 inline-block hover:underline">
          Return to Logs
        </Link>
      </div>
    );
  }

  const events = log.log_messages ? JSON.parse(log.log_messages) : [];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Link href="/admin/logs" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-bold w-fit">
        <ArrowLeft size={16} /> Back to Logs
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-black tracking-tight text-text truncate">Run #{log.id} Details</h1>
            <StatusBadge status={log.status} />
          </div>
          <p className="text-[13px] text-text-muted font-medium" suppressHydrationWarning>
            Execution started on {new Date(log.start_time).toISOString().replace('T', ' ').split('.')[0]}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Activity size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Total Scraped</p>
                <p className="text-[20px] font-black text-text">{log.total_scraped}</p>
            </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                <CheckCircle2 size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Saved to DB</p>
                <p className="text-[20px] font-black text-text">{log.total_saved}</p>
            </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <Clock size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Duration</p>
                <p className="text-[20px] font-black text-text">
                    {log.end_time ? `${Math.floor((new Date(log.end_time).getTime() - new Date(log.start_time).getTime()) / 1000)}s` : '--'}
                </p>
            </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="bg-surface-alt/50 px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-[12px] font-black text-text-muted uppercase tracking-widest">Execution Timeline</h3>
            <span className="text-[10px] font-bold text-text-muted opacity-60 font-mono">
                {events.length} Events Logged
            </span>
        </div>
        <div className="p-8">
            <div className="flex flex-col gap-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/50">
                {events.map((event: any, i: number) => (
                    <div key={i} className="flex gap-8 relative z-10 group">
                        <div className={`w-[16px] h-[16px] rounded-full mt-1 shrink-0 border-4 border-surface shadow-sm transition-transform group-hover:scale-125 ${
                            event.event.includes('❌') ? 'bg-critical' : 
                            event.event.includes('✅') || event.event.includes('✨') ? 'bg-green-500' : 
                            event.event.includes('🚀') ? 'bg-secondary' :
                            'bg-primary'
                        }`} />
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                            <span className="text-[14px] font-bold text-text leading-tight group-hover:text-primary transition-colors truncate">
                                {event.event}
                            </span>
                            <span className="text-[11px] font-mono text-text-muted bg-surface-alt w-fit px-1.5 py-0.5 rounded border border-border">
                                {new Date(event.time).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

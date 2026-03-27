"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  RefreshCw, Play, Clock, Settings2, CheckCircle2, 
  AlertTriangle, Loader2, Timer, Zap 
} from "lucide-react";
import { API_BASE_URL } from "@/config";
import { triggerPipelineAction, updateIntervalAction } from "./actions";

interface SchedulerStatus {
  is_running: boolean;
  interval_hours: number;
  next_run_time: string | null;
  job_count: number;
}

export default function SchedulerPage() {
  const [status, setStatus] = useState<SchedulerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [triggerMessage, setTriggerMessage] = useState("");
  const [newInterval, setNewInterval] = useState(6);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/scheduler/status`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        setNewInterval(data.interval_hours);
      }
    } catch (e) {
      console.error("Scheduler status fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleTrigger = async () => {
    setTriggering(true);
    setTriggerMessage("");
    try {
      const data = await triggerPipelineAction();
      setTriggerMessage(data.message);
    } catch (e: any) {
      setTriggerMessage(e.message || "Failed to trigger pipeline.");
    } finally {
      setTriggering(false);
      setTimeout(fetchStatus, 2000);
    }
  };

  const handleIntervalUpdate = async () => {
    try {
      await updateIntervalAction(newInterval);
      await fetchStatus();
      setTriggerMessage(`Interval updated to every ${newInterval} hours.`);
    } catch (e: any) {
      setTriggerMessage(e.message || "Failed to update interval.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-black tracking-tight text-text">Scheduler & Sync Control</h1>
        <p className="text-[13px] font-medium text-text-muted mt-1">
          Manage automated pipeline execution and manual data synchronization
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scheduler Status */}
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              status?.is_running ? 'bg-green-500/10 text-green-500' : 'bg-critical/10 text-critical'
            }`}>
              {status?.is_running ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Engine Status</p>
              <p className={`text-[16px] font-black ${status?.is_running ? 'text-green-500' : 'text-critical'}`}>
                {status?.is_running ? "Active" : "Stopped"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status?.is_running && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Auto-Running
              </span>
            )}
          </div>
        </div>

        {/* Next Run */}
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Timer size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Next Scheduled Run</p>
              <p className="text-[14px] font-black text-text">
                {status?.next_run_time 
                  ? new Date(status.next_run_time).toLocaleString().replace(',', '')
                  : "Not scheduled"}
              </p>
            </div>
          </div>
        </div>

        {/* Interval */}
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Repeat Interval</p>
              <p className="text-[20px] font-black text-text">
                {status?.interval_hours}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Trigger */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-surface-alt/50 px-5 py-3 border-b border-border">
            <h3 className="text-[12px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} /> Manual Sync
            </h3>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Immediately trigger the full intelligence pipeline. This will scrape all active targets, 
              run AI triage, and sync results to the database. Progress can be monitored in Crawler Logs.
            </p>
            <button 
              onClick={handleTrigger}
              disabled={triggering}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-white font-bold text-sm transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {triggering ? (
                <><Loader2 size={16} className="animate-spin" /> Running...</>
              ) : (
                <><Play size={16} /> Run Pipeline Now</>
              )}
            </button>
            {triggerMessage && (
              <div className="text-[12px] font-medium text-green-500 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20 animate-in fade-in">
                {triggerMessage}
              </div>
            )}
          </div>
        </div>

        {/* Schedule Config */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-surface-alt/50 px-5 py-3 border-b border-border">
            <h3 className="text-[12px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
              <Settings2 size={14} /> Schedule Configuration
            </h3>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Set how often the pipeline automatically runs. Changes take effect immediately.
            </p>
            <div className="flex items-center gap-3">
              <label className="text-[12px] font-bold text-text-muted uppercase tracking-wider shrink-0">
                Every
              </label>
              <input 
                type="number" 
                min={1} max={168} 
                value={newInterval}
                onChange={(e) => setNewInterval(Number(e.target.value))}
                className="w-20 px-3 py-2 bg-surface-alt border border-border rounded-lg text-text text-sm font-mono font-bold text-center focus:outline-none focus:border-primary transition-colors"
              />
              <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider">Hours</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[1, 3, 6, 12, 24].map(h => (
                <button 
                  key={h}
                  onClick={() => setNewInterval(h)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                    newInterval === h 
                      ? 'bg-primary/10 text-primary border-primary/30' 
                      : 'bg-surface-alt text-text-muted border-border hover:border-primary/20'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
            <button 
              onClick={handleIntervalUpdate}
              disabled={status?.interval_hours === newInterval}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-surface-alt border border-border text-text font-bold text-sm transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} /> Update Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

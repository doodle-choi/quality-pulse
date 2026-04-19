"use client";

import { useState, useEffect, useCallback } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { triggerPipelineAction, updateIntervalAction, fetchStatusAction } from "./actions";

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
      const data = await fetchStatusAction();
      setStatus(data);
      setNewInterval(data.interval_hours);
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
    } catch (e: unknown) {
      if (e instanceof Error) {
        setTriggerMessage(e.message || "Failed to trigger pipeline.");
      } else {
        setTriggerMessage("Failed to trigger pipeline.");
      }
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
    } catch (e: unknown) {
      if (e instanceof Error) {
        setTriggerMessage(e.message || "Failed to update interval.");
      } else {
        setTriggerMessage("Failed to update interval.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <MaterialIcon name="refresh" className="animate-spin text-primary !text-4xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-text font-headline">Scheduler & Sync Control</h1>
        <p className="text-sm font-medium text-text-muted mt-1">
          Manage automated pipeline execution and manual data synchronization
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scheduler Status */}
        <div className="bg-surface-lowest dark:bg-surface-container rounded-xl p-5 hover:bg-surface-high/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              status?.is_running ? 'bg-green-500/10 text-green-500' : 'bg-critical/10 text-critical'
            }`}>
              {status?.is_running ? <MaterialIcon name="check_circle" size="md" /> : <MaterialIcon name="warning" size="md" />}
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
        <div className="bg-surface-lowest dark:bg-surface-container rounded-xl p-5 hover:bg-surface-high/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <MaterialIcon name="timer" size="md" />
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
        <div className="bg-surface-lowest dark:bg-surface-container rounded-xl p-5 hover:bg-surface-high/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <MaterialIcon name="schedule" size="md" />
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
        <div className="bg-surface-lowest dark:bg-surface-container rounded-xl overflow-hidden">
          <div className="bg-surface-alt/50 px-5 py-3 border-b border-border-ghost/10">
            <h3 className="text-[12px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
              <MaterialIcon name="bolt" size="sm" /> Manual Sync
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
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-on-primary font-bold text-sm transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {triggering ? (
                <><MaterialIcon name="refresh" size="sm" className="animate-spin" /> Running...</>
              ) : (
                <><MaterialIcon name="play_arrow" size="sm" /> Run Pipeline Now</>
              )}
            </button>
            {triggerMessage && (
              <div className="text-[12px] font-medium text-green-500 bg-green-500/10 px-3 py-2 rounded-lg translate-y-2 animate-in fade-in">
                {triggerMessage}
              </div>
            )}
          </div>
        </div>

        {/* Schedule Config */}
        <div className="bg-surface-lowest dark:bg-surface-container rounded-xl overflow-hidden">
          <div className="bg-surface-alt/50 px-5 py-3 border-b border-border-ghost/10">
            <h3 className="text-[12px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
              <MaterialIcon name="settings" size="sm" /> Schedule Configuration
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
                className="w-20 px-3 py-2 bg-surface-alt border border-border-ghost/10 rounded-lg text-text text-sm font-mono font-bold text-center focus:outline-none focus:ring-1 focus:ring-primary transition-all"
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
                      : 'bg-surface-alt text-text-muted border-border-ghost/10 hover:border-primary/20'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
            <button 
              onClick={handleIntervalUpdate}
              disabled={status?.interval_hours === newInterval}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-surface-alt border border-border-ghost/10 text-text font-bold text-sm transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <MaterialIcon name="sync" size="sm" /> Update Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

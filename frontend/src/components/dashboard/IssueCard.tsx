"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { clsx } from "clsx";
import { sanitizeUrl } from "../../utils/security";

export interface IssueAttr {
  id: number;
  title: string;
  brand: string;
  product_category: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  issue_type: string;
  description: string;
  region: string;
  failed_component?: string;
  root_cause?: string;
  source_url: string;
  created_at: string;
  published_at?: string;
}

const severityBorderMap = {
  Critical: "border-l-4 border-l-critical",
  High: "border-l-4 border-l-high",
  Medium: "border-l-4 border-l-medium",
  Low: "border-l-4 border-l-low",
};

const severityBgMap = {
  Critical: "bg-critical text-white",
  High: "bg-high text-white",
  Medium: "bg-medium text-white",
  Low: "bg-low text-white",
};

export function IssueCard({ issue }: { issue: IssueAttr }) {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const brandLower = issue.brand?.toLowerCase() || "";
  let brandColorClass = "bg-surface-alt border border-border text-text-secondary";
  
  if (brandLower.includes("samsung")) brandColorClass = "bg-[#1428A0]/10 border-[#1428A0]/30 text-[#1428A0] dark:bg-[#4d6bff]/20 dark:text-[#7b93ff]";
  else if (brandLower.includes("lg")) brandColorClass = "bg-[#A50078]/10 border-[#A50078]/30 text-[#A50078] dark:bg-[#d070b0]/20 dark:text-[#e090c0]";
  else if (brandLower.includes("whirlpool")) brandColorClass = "bg-[#00629B]/10 border-[#00629B]/30 text-[#00629B] dark:bg-[#4da8d0]/20 dark:text-[#6bc0e8]";

  return (
    <div 
      className={clsx(
        "bg-surface border border-border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer",
        severityBorderMap[issue.severity] || "border-l-4 border-l-border"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={clsx("text-[11px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-wider", severityBgMap[issue.severity] || "bg-border text-text")}>
            {issue.severity}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px] bg-primary/10 text-primary dark:bg-primary/20">
            {issue.product_category}
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-[4px] bg-surface-alt border border-border-light text-text-secondary">
            {issue.issue_type}
          </span>
          <span className={clsx("text-[11px] font-bold px-2 py-0.5 rounded-[4px]", brandColorClass)}>
            {issue.brand}
          </span>
        </div>
        
        <h3 className="text-[15px] font-bold leading-[1.4] text-text">{issue.title}</h3>

        {/* Technical Data Tags (Phase 3) */}
        {(issue.failed_component || issue.root_cause) && (
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            {issue.failed_component && (
              <span className="text-[10px] font-mono text-purple-600 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                <span className="opacity-60 text-[9px]">CMP</span> {issue.failed_component}
              </span>
            )}
            {issue.root_cause && (
              <span className="text-[10px] font-mono text-rose-600 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                <span className="opacity-60 text-[9px]">CAUSE</span> {issue.root_cause}
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-3 text-[12px] text-text-muted mt-0.5">
          <span className="flex items-center gap-1">
            {mounted ? (
              <>
                {issue.published_at ? (
                  <span title={`Published: ${new Date(issue.published_at).toLocaleString()}`}>
                    📅 {new Date(issue.published_at).toLocaleDateString()}
                  </span>
                ) : (
                  <span title={`Found: ${new Date(issue.created_at).toLocaleString()}`}>
                    🕒 {new Date(issue.created_at).toLocaleDateString()}
                  </span>
                )}
              </>
            ) : ""}
          </span>
          <span>•</span>
          <span>{issue.region}</span>
          <ChevronDown 
            size={16} 
            className={clsx("ml-auto transition-transform duration-300", expanded && "rotate-180")} 
          />
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border-light bg-surface-alt/30">
          <p className="text-[13.5px] leading-relaxed text-text-secondary mb-3">
            {issue.description}
          </p>
          <a 
            href={sanitizeUrl(issue.source_url)}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12px] text-primary font-medium hover:underline bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} /> 원본 출처 확인 (Original Source)
          </a>
        </div>
      )}
    </div>
  );
}

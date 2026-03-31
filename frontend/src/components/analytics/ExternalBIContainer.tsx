"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface ExternalBIContainerProps {
  /** Display name of the external tool (e.g., "Metabase", "Apache Superset") */
  toolName: string;
  /** Short description of the tool's purpose */
  toolDescription: string;
  /** Material Symbols icon name for the tool */
  toolIcon: string;
  /** The URL to embed via iFrame once the service is live */
  embedUrl?: string;
  /** Whether the external service is currently available */
  isServiceReady?: boolean;
  /** Key features or capabilities to display in the placeholder */
  features?: { icon: string; title: string; description: string }[];
  /** Accent color class for branding differentiation */
  accentColorClass?: string;
}

export function ExternalBIContainer({
  toolName,
  toolDescription,
  toolIcon,
  embedUrl,
  isServiceReady = false,
  features = [],
  accentColorClass = "text-primary",
}: ExternalBIContainerProps) {
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  // If the service is ready and we have an embed URL, show the iFrame
  if (isServiceReady && embedUrl) {
    return (
      <div className="h-full w-full flex flex-col overflow-hidden bg-background">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-outline/10 bg-surface/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <MaterialIcon name={toolIcon} className={accentColorClass} />
            <h1 className="text-lg font-bold text-text font-headline">{toolName}</h1>
            <span className="text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
              Connected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-muted hover:text-text hover:bg-surface-high rounded-md transition-colors"
            >
              <MaterialIcon name="open_in_new" size="sm" />
              Open in New Tab
            </a>
          </div>
        </div>

        {/* iFrame Area */}
        <div className="flex-1 relative">
          {isIframeLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-lowest z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-sm text-text-muted">Loading {toolName}...</span>
              </div>
            </div>
          )}
          <iframe
            src={embedUrl}
            title={`${toolName} Embedded Dashboard`}
            className="w-full h-full border-0"
            onLoad={() => setIsIframeLoading(false)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    );
  }

  // Service Not Ready — Premium "Integration Pending" Placeholder
  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-background relative">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-[spin_60s_linear_infinite] opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-primary via-transparent to-tertiary blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-gradient-to-tl from-secondary via-transparent to-primary blur-3xl" />
        </div>
        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(128,128,128,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.3) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Status Badge */}
        <div className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Integration Pending
          </span>
        </div>

        {/* Tool Icon & Name */}
        <div className="mb-6 w-20 h-20 rounded-2xl bg-surface border border-outline/10 flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-none">
          <MaterialIcon name={toolIcon} className={`${accentColorClass} text-[40px]`} />
        </div>

        <h1 className="text-3xl font-bold text-text font-headline tracking-tight mb-2">
          {toolName}
        </h1>
        <p className="text-base text-text-muted max-w-md text-center leading-relaxed mb-10">
          {toolDescription}
        </p>

        {/* Feature Cards Grid */}
        {features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl w-full mb-10">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-surface/80 backdrop-blur-sm rounded-xl p-5 flex flex-col gap-3 border-0 shadow-sm shadow-black/5 dark:shadow-none hover:bg-surface-high transition-colors duration-200 group"
              >
                <div className={`w-10 h-10 rounded-lg bg-surface-lowest flex items-center justify-center ${accentColorClass} group-hover:scale-110 transition-transform duration-200`}>
                  <MaterialIcon name={feature.icon} size="sm" />
                </div>
                <h3 className="text-sm font-semibold text-text">{feature.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Connection Guide Box */}
        <div className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 max-w-lg w-full border border-outline/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MaterialIcon name="integration_instructions" size="sm" className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text mb-1">Ready to Connect</h3>
              <p className="text-xs text-text-muted leading-relaxed mb-4">
                This module is prepared for integration. Once the {toolName} service is deployed alongside
                the Quality Pulse infrastructure, it will be automatically embedded into this workspace.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-surface-lowest text-text-muted font-mono">
                  <MaterialIcon name="check_circle" className="text-emerald-500 text-[14px]" />
                  Frontend Ready
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-surface-lowest text-text-muted font-mono">
                  <MaterialIcon name="pending" className="text-amber-500 text-[14px]" />
                  Docker Pending
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-surface-lowest text-text-muted font-mono">
                  <MaterialIcon name="pending" className="text-amber-500 text-[14px]" />
                  Auth Bridge
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          className="mt-8 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 shadow-md shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-2"
          onClick={() => window.open(`https://${toolName.toLowerCase()}.io`, "_blank")}
        >
          <MaterialIcon name="open_in_new" size="sm" />
          Learn More About {toolName}
        </button>
      </div>
    </div>
  );
}

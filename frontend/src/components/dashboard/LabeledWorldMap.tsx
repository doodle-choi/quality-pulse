"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

import { MapDataPoint } from "@/types/dashboard";
import { clsx } from "clsx";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface LabeledWorldMapProps {
  data: MapDataPoint[];
  title: string;
  mainColor?: string;
}

export function LabeledWorldMap({ data, title, mainColor = "var(--primary)" }: LabeledWorldMapProps) {
  return (
    <div className="w-full h-[500px] bg-surface-lowest dark:bg-surface-container rounded-2xl overflow-hidden relative group border border-border/40 shadow-sm">
      {/* 2-Column Integrated Layout */}
      <div className="flex h-full">
        {/* Left: Map Area (70%) */}
        <div className="relative w-[70%] h-full flex flex-col p-4">
          {/* Overlay Title */}
          <div className="absolute top-6 left-8 z-10 pointer-events-none">
            <h3 className="text-xl font-headline font-black text-text tracking-tight uppercase">
              {title}
            </h3>
            <div className="w-12 h-1 bg-primary/20 mt-2 rounded-full" />
          </div>

          <div className="flex-1 w-full h-full pt-10">
            <ComposableMap
              projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 175 // Increased scale for a larger, more prominent map
              }}
              className="w-full h-full transition-transform duration-1000 group-hover:scale-105"
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="var(--surface-alt)"
                      stroke="var(--border)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "var(--surface-high)", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {data.map(({ id, name, value, unit, coordinates, status }) => (
                <Marker key={id} coordinates={coordinates}>
                  <g className="cursor-pointer group/marker">
                    <circle
                      r={value > 80 ? 16 : 12}
                      fill={status === "critical" ? "var(--critical)" : status === "warning" ? "var(--high)" : mainColor}
                      className={clsx(
                        "opacity-20 animate-pulse",
                        status === "critical" ? "shadow-[0_0_20px_var(--critical)]" : ""
                      )}
                    />
                    <circle
                      r={6}
                      fill={status === "critical" ? "var(--critical)" : status === "warning" ? "var(--high)" : mainColor}
                      className="shadow-sm"
                    />
                    
                    <rect
                      x={12}
                      y={-24}
                      width={60}
                      height={24}
                      rx={6}
                      fill="var(--surface-lowest)"
                      className="shadow-lg opacity-0 group-hover/marker:opacity-100 transition-opacity"
                    />
                    
                    <text
                      textAnchor="middle"
                      y={-20}
                      className="text-[12px] font-black fill-text font-headline drop-shadow-sm select-none"
                    >
                      {value}{unit}
                    </text>
                    
                    <text
                      x={42}
                      y={-8}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-text-muted opacity-0 group-hover/marker:opacity-100 transition-opacity"
                    >
                      {name}
                    </text>
                  </g>
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </div>

        {/* Right: Internal Details (30%) */}
        <div className="w-[30%] h-full min-h-0 bg-surface-alt/20 border-l border-border/30 flex flex-col p-5 overflow-hidden">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-text-muted">Entity Details</h4>
            <div className="w-8 h-px bg-border group-hover:w-12 transition-all"></div>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
            {data.sort((a,b) => b.value - a.value).map((item) => (
              <div key={item.id} className="flex items-center justify-between group/item">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-1.5 h-1.5 rounded-full",
                    item.status === 'critical' ? 'bg-critical' : item.status === 'warning' ? 'bg-high' : 'bg-primary'
                  )} />
                  <span className="text-[11px] font-extrabold text-text tracking-wide group-hover/item:text-primary transition-colors">
                    {item.name.split(' ')[0]}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[12px] font-black text-text tabular-nums">{item.value}{item.unit}</span>
                  <div className={clsx(
                    "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full mt-0.5",
                    item.status === 'critical' ? 'bg-critical/10 text-critical' : 'bg-surface-alt text-text-muted opacity-60'
                  )}>
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border/20">
            <button className="w-full py-2 bg-surface-lowest hover:bg-primary/10 border border-border/30 text-[10px] font-bold text-text-muted hover:text-primary rounded-lg transition-all flex items-center justify-center gap-2">
              Explore Analytics <span className="opacity-50">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

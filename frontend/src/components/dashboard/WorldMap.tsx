"use client";

import React, { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";
import { IssueAttr } from "@/components/dashboard/IssueCard";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const REGION_MAPPING: Record<string, string[]> = {
  "USA": ["United States of America"],
  "Korea": ["South Korea", "Dem. Rep. Korea"],
  "Japan": ["Japan"],
  "Canada": ["Canada"],
  "Oceania": ["Australia", "New Zealand"],
  "Europe": ["United Kingdom", "Germany", "France", "Italy", "Spain", "Poland", "Netherlands", "Sweden", "Norway"],
};

// ⚡ Bolt: Pre-calculate O(1) hash map lookup for regions instead of O(N) array scans
const COUNTRY_TO_REGION = Object.entries(REGION_MAPPING).reduce((acc, [region, countries]) => {
  countries.forEach(country => {
    acc[country] = region;
  });
  return acc;
}, {} as Record<string, string>);

// ⚡ Bolt: Pre-calculate O(1) severity weights instead of recreating arrays and using .indexOf() in loops
const SEVERITY_WEIGHT: Record<string, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  Critical: 3,
};

const COLORS = {
  critical: "var(--critical)",
  high: "var(--high)",
  medium: "var(--medium)",
  low: "var(--low)",
  default: "var(--surface-alt)",
  hover: "var(--primary)",
  border: "var(--border)",
  graticule: "var(--border-light)",
};

interface WorldMapProps {
  issues: IssueAttr[];
  selectedRegion: string;
  onRegionClick: (region: string) => void;
}

export function WorldMap({ issues, selectedRegion, onRegionClick }: WorldMapProps) {
  const regionStats = useMemo(() => {
    const stats: Record<string, { count: number, severity: string }> = {};

    issues.forEach(issue => {
      const region = issue.region || "Global";
      if (!stats[region]) {
        stats[region] = { count: 0, severity: "Low" };
      }
      stats[region].count += 1;

      // ⚡ Bolt: Replaced O(N) .indexOf() lookup with O(1) map
      if ((SEVERITY_WEIGHT[issue.severity] ?? -1) > (SEVERITY_WEIGHT[stats[region].severity] ?? -1)) {
        stats[region].severity = issue.severity;
      }
    });

    return stats;
  }, [issues]);

  const getRegionFromGeoName = (geoName: string) => {
    // ⚡ Bolt: Replaced O(N) loop with O(1) property lookup
    return COUNTRY_TO_REGION[geoName] || null;
  };

  return (
    <div className="w-full h-[350px] sm:h-[450px] bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col relative group">
      <div className="absolute top-5 left-6 z-10 pointer-events-none">
        <h3 className="text-[16px] font-bold text-text flex items-center gap-2">
          Global Risk Hotspots
          {selectedRegion && (
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest pointer-events-auto cursor-pointer" onClick={() => onRegionClick("")}>
              {selectedRegion} &times;
            </span>
          )}
        </h3>
        <p className="text-[11px] text-text-muted mt-1 max-w-[200px] leading-relaxed">
          Interactive intelligence board. Click a highlighted region to filter issues.
        </p>
      </div>

      <div className="flex-1 w-full h-full">
        <ComposableMap
          projectionConfig={{
            rotate: [-10, 0, 0],
            scale: 147
          }}
          className="w-full h-full outline-none"
        >
          <Sphere stroke={COLORS.border} strokeWidth={0.5} id="sphere" fill="transparent" />
          <Graticule stroke={COLORS.graticule} strokeWidth={0.5} />
          
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoName = geo.properties.name;
                const region = getRegionFromGeoName(geoName);
                const stats = region ? regionStats[region] : null;
                const isSelected = selectedRegion === region;

                const getFillColor = () => {
                  if (selectedRegion) {
                    return isSelected ? COLORS.hover : "var(--surface-alt)";
                  }
                  if (!stats) return COLORS.default;
                  if (stats.severity === "Critical") return COLORS.critical;
                  if (stats.severity === "High") return COLORS.high;
                  return COLORS.medium;
                };

                const fill = getFillColor();

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={COLORS.border}
                    strokeWidth={isSelected ? 1 : 0.5}
                    style={{
                      default: { outline: "none", transition: "all 0.2s ease" },
                      hover: { fill: COLORS.hover, opacity: 0.9, outline: "none", cursor: region ? "pointer" : "default" },
                      pressed: { outline: "none" },
                    }}
                    onClick={() => {
                      if (region) {
                        onRegionClick(selectedRegion === region ? "" : region);
                      }
                    }}
                  >
                    {stats && (stats.severity === "Critical" || stats.severity === "High") && (
                      <circle
                        cx={0}
                        cy={0}
                        r={stats.severity === "Critical" ? 3.5 : 2.5}
                        fill={stats.severity === "Critical" ? COLORS.critical : COLORS.high}
                        stroke={COLORS.default}
                        strokeWidth={0.5}
                        className="animate-pulse"
                        style={{ pointerEvents: "none", filter: "blur(0.5px)" }}
                      />
                    )}
                  </Geography>
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-5 left-6 z-10 flex items-center gap-4 bg-surface/80 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--critical)] shadow-[0_0_8px_var(--critical)]"></div>
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--high)] shadow-[0_0_8px_var(--high)]"></div>
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]"></div>
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Active</span>
        </div>
      </div>
    </div>
  );
}

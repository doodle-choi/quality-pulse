"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface ScatterPoint {
  id: string;
  x: number; // e.g. Impact
  y: number; // e.g. Risk
  size: number; // e.g. Volume
  name: string;
  isAnomaly?: boolean;
}

export function ScatterAnomalyChart({ data, onPointClick }: { data: ScatterPoint[], onPointClick?: (point: ScatterPoint) => void }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
     return <div className="h-full w-full bg-surface-lowest rounded-lg animate-pulse" />;
  }

  const isDark = theme === "dark";

  const textColor = isDark ? "#dae2fd" : "#45464d";
  const gridLineColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
  const normalColor = isDark ? "rgba(58, 74, 95, 0.6)" : "rgba(148, 163, 184, 0.6)"; // Muted blue/gray
  const anomalyColor = isDark ? "#ffafd3" : "#f43f5e"; // Tertiary pink/red
  const anomalyStroke = isDark ? "rgba(255, 175, 211, 0.3)" : "rgba(244, 63, 94, 0.3)";

  const option = {
    tooltip: {
      backgroundColor: isDark ? "#060e20" : "#ffffff", 
      borderColor: isDark ? "#2d3449" : "#e0e3e5", 
      textStyle: { color: isDark ? "#ffffff" : "#000000" },
      padding: [12, 16],
      borderRadius: 8,
      formatter: (params: any) => {
        const d = params.data.point as ScatterPoint;
        return `
          <div style="font-family: inherit; font-size: 13px;">
            <div style="margin-bottom: 8px; font-weight: 600; color: ${textColor}">${d.name} <span style="font-size:11px; font-weight:normal; opacity:0.7">(${d.id})</span></div>
            <div style="display: flex; flex-direction: column; gap: 4px; color:${textColor}; font-weight:500;">
              <div>Impact (X): <span style="font-weight: 700;">${d.x}</span></div>
              <div>Risk (Y): <span style="font-weight: 700;">${d.y}</span></div>
              <div>Volume: <span style="font-weight: 700;">${d.size}</span></div>
            </div>
            ${d.isAnomaly ? `<div style="margin-top: 8px; color: ${anomalyColor}; font-weight: bold; font-size: 11px; text-transform: uppercase;">⚠️ Critical Anomaly</div>` : ''}
          </div>
        `;
      }
    },
    grid: {
      left: '5%',
      right: '8%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: 'Impact Score',
      nameTextStyle: { color: textColor, fontFamily: 'Inter', fontSize: 11 },
      splitLine: { show: false },
      axisLine: { lineStyle: { color: gridLineColor } },
      axisLabel: { color: textColor, fontFamily: 'Inter' }
    },
    yAxis: {
      type: 'value',
      name: 'Risk Level',
      nameTextStyle: { color: textColor, fontFamily: 'Inter', fontSize: 11 },
      splitLine: { lineStyle: { color: gridLineColor, type: 'dashed' } },
      axisLine: { show: false },
      axisLabel: { color: textColor, fontFamily: 'Inter' }
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (dataItem: any) => {
           return Math.max(10, Math.min(dataItem.point.size / 2, 40)); // Scale size between 10 and 40
        },
        itemStyle: {
           color: (params: any) => params.data.point.isAnomaly ? anomalyColor : normalColor,
           borderColor: (params: any) => params.data.point.isAnomaly ? anomalyStroke : 'transparent',
           borderWidth: (params: any) => params.data.point.isAnomaly ? 6 : 0,
           shadowBlur: (params: any) => params.data.point.isAnomaly ? 10 : 0,
           shadowColor: (params: any) => params.data.point.isAnomaly ? anomalyColor : 'transparent',
        },
        data: data.map(p => ({
           value: [p.x, p.y],
           point: p
        }))
      }
    ]
  };

  const onEvents = {
    'click': (params: any) => {
       if (onPointClick && params.data && params.data.point) {
          onPointClick(params.data.point);
       }
    }
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      opts={{ renderer: "canvas" }}
      notMerge={true}
      onEvents={onEvents}
    />
  );
}

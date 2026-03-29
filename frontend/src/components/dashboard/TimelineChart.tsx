"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface TimelinePoint {
  date: string;
  count: number;
}

export function TimelineChart({ data }: { data: TimelinePoint[] }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full bg-surface-container rounded-lg animate-pulse" />;
  }

  const isDark = theme === "dark";

  // Dynamic Theme Colors
  const textColor = isDark ? "#dae2fd" : "#45464d"; // on-surface vs muted
  const gridLineColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
  const primaryLineColor = isDark ? "#7bd0ff" : "#0F172A"; // Primary
  const anomalyColor = isDark ? "#ffafd3" : "#10B981"; // Tertiary
  const areaGradientStart = isDark ? "rgba(123, 208, 255, 0.3)" : "rgba(15, 23, 42, 0.15)";
  const areaGradientEnd = "rgba(0, 0, 0, 0)";

  // Look for a spike to highlight as an anomaly (e.g., max value)
  const maxCount = Math.max(...data.map(d => d.count));
  const seriesData = data.map((d) => ({
    value: d.count,
    itemStyle: {
      color: d.count === maxCount ? anomalyColor : primaryLineColor,
      shadowBlur: d.count === maxCount ? 10 : 0,
      shadowColor: d.count === maxCount ? anomalyColor : "transparent",
    },
    symbolSize: d.count === maxCount ? 10 : 4,
  }));

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: isDark ? "#060e20" : "#ffffff", // surface-lowest
      borderColor: isDark ? "#2d3449" : "#e0e3e5", // outline-variant
      textStyle: { color: isDark ? "#ffffff" : "#000000" },
      padding: [8, 12],
      borderRadius: 8,
      formatter: (params: any) => {
        const item = params[0];
        const isAnomaly = item.value === maxCount;
        return `
          <div style="font-family: inherit; font-size: 13px;">
            <div style="margin-bottom: 4px; font-weight: bold; color: ${textColor}">${item.name}</div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${item.color}; box-shadow: 0 0 6px ${item.color}"></span>
              <span style="font-weight: 800; font-size: 15px;">${item.value} <span style="font-weight: normal; font-size: 12px; opacity: 0.7;">Incidents</span></span>
            </div>
            ${isAnomaly ? `<div style="margin-top: 6px; color: ${anomalyColor}; font-weight: bold; font-size: 11px; text-transform: uppercase;">⚠️ Volume Spike Detected</div>` : ''}
          </div>
        `;
      }
    },
    grid: {
      top: "15%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((d) => d.date),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: textColor,
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
        margin: 12,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: gridLineColor,
          type: "dashed",
        },
      },
      axisLabel: {
        color: textColor,
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
      },
    },
    series: [
      {
        name: "Incidents",
        type: "line",
        smooth: 0.4, // Create the elegant swooping line
        symbol: "circle",
        showSymbol: true,
        lineStyle: {
          color: primaryLineColor,
          width: 3,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: areaGradientStart },
              { offset: 1, color: areaGradientEnd },
            ],
          },
        },
        data: seriesData,
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      opts={{ renderer: "canvas" }}
      notMerge={true}
    />
  );
}

"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function SparklineChart({ data, color }: { data: number[], color: "positive" | "negative" | "neutral" }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !data || data.length === 0) {
    return <div className="h-full w-full bg-surface-high/50 rounded animate-pulse" />;
  }

  const isDark = theme === "dark";

  const getLineColor = () => {
    if (color === "positive") return isDark ? "#4ade80" : "#22c55e"; // green-400 / green-500
    if (color === "negative") return isDark ? "#f87171" : "#ef4444"; // red-400 / red-500
    return isDark ? "#60a5fa" : "#3b82f6"; // blue-400 / blue-500
  };

  const getAreaColor = () => {
    if (color === "positive") return isDark ? "rgba(74, 222, 128, 0.2)" : "rgba(34, 197, 94, 0.15)";
    if (color === "negative") return isDark ? "rgba(248, 113, 113, 0.2)" : "rgba(239, 68, 68, 0.15)";
    return isDark ? "rgba(96, 165, 250, 0.2)" : "rgba(59, 130, 246, 0.15)";
  };

  const lineColor = getLineColor();
  const areaColor = getAreaColor();

  const option = {
    grid: { left: 0, right: 0, top: 2, bottom: 2 },
    xAxis: {
      type: "category",
      show: false,
    },
    yAxis: {
      type: "value",
      show: false,
      scale: true,
    },
    series: [
      {
        data: data,
        type: "line",
        smooth: 0.4,
        symbol: "none",
        lineStyle: {
          width: 2,
          color: lineColor,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: areaColor },
              { offset: 1, color: "rgba(0,0,0,0)" }
            ]
          }
        },
        animationDuration: 1500,
        animationEasing: "cubicOut"
      }
    ],
    tooltip: { show: false }
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

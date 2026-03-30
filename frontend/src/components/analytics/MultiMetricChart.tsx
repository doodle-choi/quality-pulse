"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface MultiMetricPoint {
  date: string;
  volume: number;
  riskScore: number;
}

export function MultiMetricChart({ data }: { data: MultiMetricPoint[] }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
     return <div className="h-full w-full bg-surface-lowest rounded-lg animate-pulse" />;
  }

  const isDark = theme === "dark";

  // Dynamic Theme Colors
  const textColor = isDark ? "#dae2fd" : "#45464d"; // on-surface vs muted
  const gridLineColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
  const primaryColor = isDark ? "#7bd0ff" : "#0F172A"; // Primary for line
  const barColor = isDark ? "rgba(123, 208, 255, 0.2)" : "rgba(15, 23, 42, 0.1)"; // Muted primary for bar
  const hoverBarColor = isDark ? "rgba(123, 208, 255, 0.4)" : "rgba(15, 23, 42, 0.2)";

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: isDark ? "#060e20" : "#ffffff", // surface-lowest
      borderColor: isDark ? "#2d3449" : "#e0e3e5", // outline-variant
      textStyle: { color: isDark ? "#ffffff" : "#000000" },
      padding: [12, 16],
      borderRadius: 8,
      axisPointer: { type: "cross", crossStyle: { color: "#999" } },
      formatter: (params: any) => {
         let html = `<div style="font-family: inherit; font-size: 13px;">`;
         html += `<div style="margin-bottom: 8px; font-weight: 600; color: ${textColor}">${params[0].name}</div>`;
         params.forEach((param: any) => {
            const isVolume = param.seriesName === "Volume";
            html += `
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${param.color}"></span>
                <span style="color: ${textColor}; font-weight: 500">${param.seriesName}:</span>
                <span style="font-weight: 700;">${param.value} ${isVolume ? 'Incidents' : 'Pts'}</span>
              </div>
            `;
         });
         html += `</div>`;
         return html;
      }
    },
    legend: {
      data: ["Volume", "Risk Score"],
      textStyle: { color: textColor, fontFamily: "Inter, sans-serif" },
      top: 0
    },
    grid: {
      top: "15%",
      left: "2%",
      right: "2%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((d) => d.date),
      axisPointer: { type: "shadow" },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: textColor,
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
        margin: 12,
      },
    },
    yAxis: [
      {
        type: "value",
        name: "Volume",
        nameTextStyle: { color: textColor, fontFamily: "Inter", padding: [0, 0, 0, -20] },
        min: 0,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { color: textColor, fontFamily: "Inter" },
      },
      {
        type: "value",
        name: "Risk Score",
        nameTextStyle: { color: textColor, fontFamily: "Inter", padding: [0, -20, 0, 0] },
        min: 0,
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: gridLineColor, type: "dashed" },
        },
        axisLabel: { color: textColor, fontFamily: "Inter" },
      }
    ],
    series: [
      {
        name: "Volume",
        type: "bar",
        yAxisIndex: 0,
        itemStyle: { color: barColor, borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { color: hoverBarColor } },
        data: data.map((d) => d.volume),
      },
      {
        name: "Risk Score",
        type: "line",
        yAxisIndex: 1,
        smooth: 0.3,
        itemStyle: { color: primaryColor, shadowBlur: 4, shadowColor: primaryColor },
        lineStyle: { width: 3 },
        symbol: "circle",
        showSymbol: true,
        symbolSize: 6,
        data: data.map((d) => d.riskScore),
      }
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

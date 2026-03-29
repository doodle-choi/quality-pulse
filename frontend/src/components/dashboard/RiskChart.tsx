"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface RiskPoint {
  name: string;
  value: number;
  color?: string;
}

export function RiskChart({ data }: { data: RiskPoint[] }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full bg-surface-container rounded-lg animate-pulse" />;
  }

  const isDark = theme === "dark";

  // Using specific high/medium/low colors from standard CSS var convention if possible, 
  // but mapping them directly here for ECharts canvas API.
  const customPalette = isDark 
    ? ["#ffb4ab", "#f97316", "#facc15", "#60a5fa"] 
    : ["#ba1a1a", "#ea580c", "#ca8a04", "#3b82f6"];

  const option = {
    tooltip: {
      trigger: "item",
      backgroundColor: isDark ? "#060e20" : "#ffffff", 
      borderColor: isDark ? "#2d3449" : "#e0e3e5",
      textStyle: { color: isDark ? "#ffffff" : "#000000" },
      borderRadius: 8,
    },
    legend: {
      bottom: "0%",
      left: "center",
      textStyle: {
        color: isDark ? "#dae2fd" : "#45464d",
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
      },
      itemWidth: 12,
      itemHeight: 12,
      icon: "circle",
    },
    color: customPalette, // Explicit mapping 
    series: [
      {
        name: "Severity",
        type: "pie",
        radius: ["45%", "75%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: isDark ? "#0b1326" : "#f7f9fb", // surface base mapped as border to give the gap illusion
          borderWidth: 2,
        },
        label: { show: false, position: "center" },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: "bold",
            color: isDark ? "#ffffff" : "#000000",
            formatter: "{c}\n{b}",
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine: { show: false },
        data: data.map((d, i) => ({
          value: d.value,
          name: d.name,
          // Use provided color if strictly mapped, else fallback to semantic palette
          itemStyle: d.color ? { color: d.color } : undefined,
        })),
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
